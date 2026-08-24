// ============================================================================
// NetworkSystem (구역별 분산 방장 권한 및 몬스터 코옵 동기화 시스템)
// ============================================================================
class NetworkSystem {
    constructor(game) {
        this.game = game;
        this.socket = null;
        this.isConnected = false;
        this.myId = null;

        // 원격 플레이어 엔티티 맵 (id -> RemotePlayer)
        this.game.remotePlayers = {};

        // 패킷 전송 주기 제어
        this.syncTimer = 0;
        this.syncInterval = 0.033; // 30Hz

        this.monsterSyncTimer = 0;
        this.monsterSyncInterval = 0.05; // 20Hz
    }

    // 👑 현재 내가 위치한 맵(구역/Zone)의 몬스터 연산 권한자(Zone Host)인지 판정
    get isZoneHost() {
        if (!this.isConnected || !this.myId) return true; // 오프라인 모드는 항상 단독 호스트

        // 현재 맵(Zone)에 위치한 모든 유저 목록 (본인 포함)
        const playersInMyZone = [
            this.myId,
            ...Object.values(this.game.remotePlayers)
                .filter(rp => (rp.currentZone || 'village') === this.game.currentZone)
                .map(rp => rp.id)
        ];

        // 정렬하여 첫 번째 유저가 해당 맵의 연산 권한(Zone Host)을 가짐
        playersInMyZone.sort();
        return (playersInMyZone[0] === this.myId);
    }

    connect(serverUrl) {
        if (typeof io === 'undefined') {
            console.log('[NetworkSystem] 오프라인 모드로 실행 중 (Socket.io 미연결)');
            return;
        }

        if (this.socket) {
            try { this.socket.disconnect(); } catch (e) {}
            this.socket = null;
        }

        try {
            const opts = {
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            };
            const target = (serverUrl && serverUrl.trim().length > 0) ? serverUrl.trim() : undefined;
            this.socket = target ? io(target, opts) : io(opts);

            this.setupSocketEvents();
        } catch (err) {
            console.warn('[NetworkSystem] 서버 연결 실패 (오프라인 모드 유지):', err);
        }
    }

    disconnect() {
        if (this.socket) {
            try { this.socket.disconnect(); } catch (e) {}
            this.socket = null;
        }
        this.isConnected = false;
        this.myId = null;
        this.game.remotePlayers = {};
    }

    setupSocketEvents() {
        const socket = this.socket;
        if (!socket) return;

        // 1. 서버 연결 성공
        socket.on('connect', () => {
            this.isConnected = true;
            this.myId = socket.id;
            console.log(`[NetworkSystem] 멀티플레이 서버 연결 완료! (ID: ${this.myId})`);
            
            // 내 초기 캐릭터 정보 즉시 전송
            this.sendPlayerState(true);
            this.game.showNotification('🌐 [멀티플레이] 서버에 연결되었습니다!');
        });

        // 2. 서버 연결 끊김
        socket.on('disconnect', () => {
            this.isConnected = false;
            this.game.remotePlayers = {};
            console.log('[NetworkSystem] 서버 연결 해제');
            this.game.showNotification('⚠️ [멀티플레이] 서버 연결이 종료되었습니다.');
        });

        // 3. 기존 플레이어 전체 목록 수신
        socket.on('currentPlayers', (serverPlayers) => {
            for (const id in serverPlayers) {
                if (id !== this.myId) {
                    this.game.remotePlayers[id] = new RemotePlayer(id, serverPlayers[id]);
                }
            }
        });

        // 4. 새로운 플레이어 입장
        socket.on('newPlayer', (playerInfo) => {
            if (playerInfo.id !== this.myId) {
                this.game.remotePlayers[playerInfo.id] = new RemotePlayer(playerInfo.id, playerInfo);
                const nick = playerInfo.nickname || `유저_${playerInfo.id.slice(0, 4)}`;
                this.game.showNotification(`🎮 파티원 [${nick}] 님이 입장했습니다!`);
                sounds.playCoin();
            }
        });

        // 5. 원격 플레이어 상태/위치/존 이동 동기화 수신
        socket.on('playerMoved', (playerInfo) => {
            if (playerInfo.id === this.myId) return;

            if (this.game.remotePlayers[playerInfo.id]) {
                this.game.remotePlayers[playerInfo.id].sync(playerInfo);
            } else {
                this.game.remotePlayers[playerInfo.id] = new RemotePlayer(playerInfo.id, playerInfo);
            }
        });

        // 6. 원격 플레이어 공격 및 스킬 시전 이펙트 수신
        socket.on('playerAction', (actionData) => {
            if (actionData.id === this.myId) return;
            const rp = this.game.remotePlayers[actionData.id];
            if (!rp) return;

            if (actionData.x !== undefined && actionData.y !== undefined) {
                rp.x = actionData.x;
                rp.y = actionData.y;
                rp.targetX = actionData.x;
                rp.targetY = actionData.y;
            }
            if (actionData.facingAngle !== undefined) rp.facingAngle = actionData.facingAngle;
            if (actionData.facing !== undefined) rp.facing = actionData.facing;
            if (actionData.equipment !== undefined) rp.equipment = actionData.equipment;

            if (actionData.action === 'attack') {
                rp.performNormalAttack(this.game);
            } else if (actionData.action === 'skill') {
                rp.executeSkill(actionData.skillId, this.game);
            }
        });

        // 7. [구역 게스트] 해당 맵 구역 호스트의 몬스터 상태 패킷 수신 및 동기화
        socket.on('guestMonsterSync', (syncData) => {
            if (this.isZoneHost) return; // 내가 이 맵의 호스트라면 게스트 동기화 무시
            if (!syncData || syncData.zone !== this.game.currentZone) return;

            const hostMobs = syncData.enemies || [];
            const hostMobMap = new Map();

            hostMobs.forEach(m => hostMobMap.set(m.id, m));

            // 기존 로컬 몬스터 동기화 및 갱신
            this.game.enemies.forEach(e => {
                if (hostMobMap.has(e.id)) {
                    const m = hostMobMap.get(e.id);
                    e.x += (m.x - e.x) * 0.45;
                    e.y += (m.y - e.y) * 0.45;
                    e.hp = m.hp;
                    e.maxHp = m.maxHp;
                    e.phase = m.phase;
                    e.active = true;
                    hostMobMap.delete(e.id);
                } else {
                    e.active = false;
                }
            });

            // 호스트에 새로 스폰된 몬스터 로컬 생성
            hostMobMap.forEach((m) => {
                const newMob = new Enemy(m.x, m.y, m.type, m.id);
                newMob.hp = m.hp;
                newMob.maxHp = m.maxHp;
                newMob.phase = m.phase;
                this.game.enemies.push(newMob);
            });
        });

        // 8. [구역 호스트] 게스트의 몬스터 타격 적용
        socket.on('applyMonsterDamage', (hitData) => {
            if (!this.isZoneHost) return; // 내가 이 구역의 호스트일 때만 처리
            const target = this.game.enemies.find(e => e.id === hitData.enemyId && e.active);
            if (target) {
                target.takeDamage(hitData.damage, hitData.kx, hitData.ky, this.game, hitData.isCrit);
            }
        });

        // 9. [전체] 몬스터 처치 및 코옵 보상(골드/경험치/퀘스트) 획득
        socket.on('monsterKilled', (killData) => {
            if (killData.killerId !== this.myId) {
                // 같은 구역에 있었던 파티원에게 보상 지급
                if (killData.zone === this.game.currentZone) {
                    this.game.player.gainExp(killData.exp, this.game);
                    this.game.player.gold += killData.gold;

                    const target = this.game.enemies.find(e => e.id === killData.enemyId);
                    if (target) target.active = false;

                    this.game.questSystem.onEnemyKilled({
                        type: killData.type,
                        expReward: 0,
                        goldReward: 0,
                        isBoss: !!killData.bossName,
                        bossName: killData.bossName,
                        dropItem: killData.dropItem
                    });

                    this.game.particles.spawnDamageNumber(killData.x, killData.y, `+${killData.exp} EXP / +${killData.gold} G`, '#fde047', true);
                    sounds.playCoin();
                    this.game.updateHUD();
                }
            }
        });

        // 10. 실시간 파티 채팅 수신
        socket.on('playerChat', (chatData) => {
            if (this.game.chatSystem) {
                this.game.chatSystem.onReceiveChat(chatData);
            }
        });

        // 11. 플레이어 퇴장
        socket.on('playerDisconnected', (id) => {
            if (this.game.remotePlayers[id]) {
                const nick = this.game.remotePlayers[id].nickname;
                delete this.game.remotePlayers[id];
                this.game.showNotification(`👋 파티원 [${nick}] 님이 퇴장했습니다.`);
                if (this.game.chatSystem) {
                    this.game.chatSystem.addSystemMessage(`파티원 [${nick}] 님이 퇴장했습니다.`);
                }
            }
        });
    }

    // 내 캐릭터 상태를 서버로 송출
    sendPlayerState(force = false) {
        if (!this.isConnected || !this.socket || !this.game.player) return;

        const p = this.game.player;
        const packet = {
            x: Math.round(p.x),
            y: Math.round(p.y),
            facing: p.facing,
            facingAngle: Number(p.facingAngle.toFixed(3)),
            state: p.state,
            hp: p.hp,
            maxHp: p.maxHp,
            level: p.level,
            job: p.job || 'warrior',
            equipment: p.equipment,
            currentZone: this.game.currentZone,
            nickname: p.nickname || '지저씨'
        };

        this.socket.emit('playerMovement', packet);
    }

    // 공격 및 스킬 발동 액션 전송
    sendAction(action, extraData = {}) {
        if (!this.isConnected || !this.socket || !this.game.player) return;
        const p = this.game.player;
        this.socket.emit('playerAction', {
            action,
            x: Math.round(p.x),
            y: Math.round(p.y),
            facing: p.facing,
            facingAngle: Number(p.facingAngle.toFixed(3)),
            equipment: p.equipment,
            currentZone: this.game.currentZone,
            ...extraData
        });
    }

    // [게스트] 몬스터 타격 패킷을 구역 호스트로 전송
    sendHitMonster(enemyId, damage, kx, ky, isCrit = false) {
        if (!this.isConnected || !this.socket) return;
        this.socket.emit('guestHitMonster', {
            enemyId,
            damage,
            kx,
            ky,
            isCrit
        });
    }

    // [구역 호스트] 몬스터 처치 완료 브로드캐스트
    sendMonsterKilled(enemy) {
        if (!this.isConnected || !this.socket || !this.isZoneHost) return;
        this.socket.emit('monsterKilled', {
            killerId: this.myId,
            zone: this.game.currentZone,
            enemyId: enemy.id,
            type: enemy.type,
            exp: enemy.expReward,
            gold: enemy.goldReward,
            bossName: enemy.bossName || null,
            dropItem: enemy.dropItem || null,
            x: Math.round(enemy.x),
            y: Math.round(enemy.y)
        });
    }

    // 실시간 채팅 메시지 송출
    sendChat(message) {
        if (!this.isConnected || !this.socket) return;
        this.socket.emit('playerChat', { message });
    }

    update(dt) {
        // 1. 모든 원격 플레이어 위치 보간 및 애니메이션 갱신
        for (const id in this.game.remotePlayers) {
            this.game.remotePlayers[id].update(dt, this.game);
        }

        if (this.isConnected) {
            // 2. 내 캐릭터 상태 주기적 송출 (30Hz)
            this.syncTimer += dt;
            if (this.syncTimer >= this.syncInterval) {
                this.syncTimer = 0;
                this.sendPlayerState();
            }

            // 3. [구역 호스트] 내가 이 맵의 방장이라면 몬스터 상태 동기화 송출 (20Hz)
            if (this.isZoneHost) {
                this.monsterSyncTimer += dt;
                if (this.monsterSyncTimer >= this.monsterSyncInterval) {
                    this.monsterSyncTimer = 0;
                    const activeMobs = this.game.enemies.filter(e => e.active).map(e => ({
                        id: e.id,
                        type: e.type,
                        x: Math.round(e.x),
                        y: Math.round(e.y),
                        hp: e.hp,
                        maxHp: e.maxHp,
                        phase: e.phase,
                        isBoss: !!e.isBoss
                    }));

                    this.socket.emit('hostMonsterSync', {
                        zone: this.game.currentZone,
                        enemies: activeMobs
                    });
                }
            }
        }
    }

    render(ctx) {
        // 같은 존(맵)에 있는 원격 플레이어들만 캔버스에 렌더링
        for (const id in this.game.remotePlayers) {
            const rp = this.game.remotePlayers[id];
            if (!rp.currentZone || rp.currentZone === this.game.currentZone) {
                rp.render(ctx);
            }
        }
    }
}
