const express = require('express');
const http = require('http');
const path = require('path');
const os = require('os');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = 3000;

function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

const localIp = getLocalIp();

// 정적 파일 제공 (HTML, JS, CSS, Asset 등)
app.use(express.static(path.join(__dirname)));

// 서버 및 LAN 초대 주소 정보 API
app.get('/api/server-info', (req, res) => {
    res.json({
        localIp: getLocalIp(),
        port: PORT,
        inviteUrl: `http://${getLocalIp()}:${PORT}`
    });
});

// 접속한 플레이어들의 상태를 메모리에 저장
const players = {};
let hostId = null;

// Socket.io 실시간 통신 이벤트 처리
io.on('connection', (socket) => {
    console.log(`[접속] 새 플레이어 연결됨: ${socket.id}`);

    // 1. 방장(Host) 선출: 첫 번째 접속자가 기본 방장이 됨
    if (!hostId || !players[hostId]) {
        hostId = socket.id;
        console.log(`👑 [방장 선출] ${socket.id} 님이 기본 호스트(방장)가 되었습니다.`);
    }

    // 2. 신규 플레이어 기본 초기 데이터 생성
    players[socket.id] = {
        id: socket.id,
        nickname: `지저씨_${socket.id.slice(0, 4)}`,
        x: 2100,
        y: 2100,
        facing: 'down',
        facingAngle: Math.PI / 2,
        state: 'idle',
        hp: 160,
        maxHp: 160,
        level: 1,
        job: 'warrior',
        equipment: { weapon: 'sword_iron', armor: null, accessory: null },
        currentZone: 'village'
    };

    // 3. 방장 여부 및 초대 URL 전달
    socket.emit('hostStatus', { isHost: (socket.id === hostId), hostId, inviteUrl: `http://${localIp}:${PORT}` });

    // 4. 방금 접속한 플레이어에게 기존 전체 플레이어 목록 전송
    socket.emit('currentPlayers', players);

    // 5. 다른 모든 플레이어들에게 새 플레이어가 들어왔음을 알림
    socket.broadcast.emit('newPlayer', players[socket.id]);

    // 6. 플레이어 상태 및 위치/존 변경 패킷 수신 및 중계
    socket.on('playerMovement', (movementData) => {
        if (players[socket.id]) {
            Object.assign(players[socket.id], movementData);
            players[socket.id].id = socket.id;
            socket.broadcast.emit('playerMoved', players[socket.id]);
        }
    });

    // 7. 플레이어 액션(공격/스킬 시전 등) 중계
    socket.on('playerAction', (actionData) => {
        actionData.id = socket.id;
        socket.broadcast.emit('playerAction', actionData);
    });

    // 8. 몬스터 & 보스 구역별 동기화 패킷 중계
    socket.on('hostMonsterSync', (syncData) => {
        socket.broadcast.emit('guestMonsterSync', syncData);
    });

    // 9. [게스트 -> 구역 호스트] 몬스터 피격 전달
    socket.on('guestHitMonster', (hitData) => {
        socket.broadcast.emit('applyMonsterDamage', {
            ...hitData,
            attackerId: socket.id
        });
    });

    // 10. 몬스터 처치 및 보상/경험치 분배 중계
    socket.on('monsterKilled', (killData) => {
        socket.broadcast.emit('monsterKilled', killData);
    });

    // 11. 실시간 파티 채팅 메시지 중계
    socket.on('playerChat', (chatData) => {
        const sender = players[socket.id];
        const nick = (sender && sender.nickname) ? sender.nickname : `유저_${socket.id.slice(0, 4)}`;
        const msg = String(chatData.message || '').trim().slice(0, 100);
        if (msg.length > 0) {
            io.emit('playerChat', {
                id: socket.id,
                nickname: nick,
                message: msg,
                timestamp: Date.now()
            });
        }
    });

    // 12. 플레이어 접속 종료 처리 및 방장 자동 인계
    socket.on('disconnect', () => {
        console.log(`[퇴장] 플레이어 연결 해제: ${socket.id}`);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);

        if (socket.id === hostId) {
            const remaining = Object.keys(players);
            if (remaining.length > 0) {
                hostId = remaining[0];
                console.log(`👑 [방장 인계] 이전 방장 퇴장으로 ${hostId} 님이 새 방장이 되었습니다.`);
                io.to(hostId).emit('hostStatus', { isHost: true, hostId });
                io.emit('hostMigrated', { hostId });
            } else {
                hostId = null;
            }
        }
    });
});

// 서버 실행 (0.0.0.0 바인딩으로 외부 LAN 접속 완벽 지원)
server.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🎮 《지저씨》 4인 코옵 멀티플레이 서버 가동 중!`);
    console.log(`💻 [내 컴퓨터 접속 주소]: http://localhost:${PORT}`);
    console.log(`📱 [같은 와이파이 친구 초대 주소]: http://${localIp}:${PORT}`);
    console.log(`=======================================================`);
});
