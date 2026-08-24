// ============================================================================
// RemotePlayer (Player를 상속받아 100% 동일한 4K 그래픽/무기/스킬 비주얼 지원)
// ============================================================================
class RemotePlayer extends Player {
    constructor(id, data = {}) {
        super(data.x || 2100, data.y || 2100);
        this.id = id;
        this.nickname = data.nickname || `지저씨_${id.slice(0, 4)}`;
        this.targetX = this.x;
        this.targetY = this.y;
        this.currentZone = data.currentZone || 'village';

        this.sync(data);
    }

    // 서버로부터 최신 네트워크 패킷 수신 시 상태 동기화
    sync(data) {
        if (data.x !== undefined && data.y !== undefined) {
            this.targetX = data.x;
            this.targetY = data.y;
        }
        if (data.facing !== undefined) this.facing = data.facing;
        if (data.facingAngle !== undefined) this.facingAngle = data.facingAngle;
        if (data.state !== undefined) this.state = data.state;
        if (data.hp !== undefined) this.hp = data.hp;
        if (data.maxHp !== undefined) this.maxHp = data.maxHp;
        if (data.level !== undefined) this.level = data.level;
        if (data.job !== undefined) this.job = data.job;
        if (data.equipment !== undefined) this.equipment = data.equipment;
        if (data.nickname !== undefined) this.nickname = data.nickname;
        if (data.currentZone !== undefined) this.currentZone = data.currentZone;
    }

    update(dt, game) {
        // 1. 네트워크 지연 보정을 위한 부드러운 위치 보간 (Lerp)
        const lerpFactor = Math.min(1, dt * 18);
        this.x += (this.targetX - this.x) * lerpFactor;
        this.y += (this.targetY - this.y) * lerpFactor;

        // 2. 이동 애니메이션 업데이트
        const isMoving = (this.state === 'move' || Math.hypot(this.targetX - this.x, this.targetY - this.y) > 2);
        if (isMoving) {
            this.walkAnimTimer += dt * 12;
            this.capeWave += dt * 14;
        } else {
            this.walkAnimTimer = 0;
            this.capeWave += dt * 3;
        }

        // 3. 공격 애니메이션 타이머
        if (this.attackTimer > 0) {
            this.attackTimer -= dt;
            if (this.attackTimer <= 0) {
                this.state = 'idle';
            }
        }

        // 4. 버프/상태/말풍선 타이머
        if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;
        if (this.stealthTimer > 0) this.stealthTimer -= dt;
        if (this.manaShieldTimer > 0) this.manaShieldTimer -= dt;
        if (this.chatBubble && this.chatBubble.timer > 0) this.chatBubble.timer -= dt;
    }

    // 원격 유저 스킬 시전 디스패처 (로컬과 동일한 투사체, 파티클, 사운드 발동)
    executeSkill(skillId, game) {
        if (!skillId) return;

        // 공격 애니메이션 시작
        this.state = 'attack';
        this.attackDuration = 0.28;
        this.attackTimer = this.attackDuration;

        // ====================================================================
        // ⚔️ 1. WARRIOR SKILLS
        // ====================================================================
        if (skillId === 'skill_warrior_slash') {
            this.castCrossSlash(game);
        } else if (skillId === 'skill_warrior_shield_charge') {
            this.castShieldCharge(game);
        } else if (skillId === 'skill_warrior_whirlwind' || skillId === 'skill_whirlwind') {
            this.castWhirlwind(game);
        } else if (skillId === 'skill_warrior_earth_slam' || skillId === 'skill_smash') {
            this.castEarthShatter(game);
        } else if (skillId === 'skill_warrior_ultimate' || skillId === 'skill_ultimate') {
            this.castHeavenSplitter(game);
        } else if (skillId === 'skill_sword_beam') {
            this.castSwordBeam(game);
        } else if (skillId === 'skill_parry') {
            this.castParry(game);
        }

        // ====================================================================
        // 🏹 2. ARCHER SKILLS
        // ====================================================================
        else if (skillId === 'skill_archer_rapid_fire') {
            this.castRapidStrafe(game);
        } else if (skillId === 'skill_archer_wind_piercer') {
            this.castWindPiercer(game);
        } else if (skillId === 'skill_archer_frost_arrow') {
            this.castGlacialArrow(game);
        } else if (skillId === 'skill_archer_explosive_trap') {
            this.castExplosiveTrap(game);
        } else if (skillId === 'skill_archer_ultimate') {
            this.castMeteorArrowRain(game);
        }

        // ====================================================================
        // 🪄 3. MAGE SKILLS
        // ====================================================================
        else if (skillId === 'skill_mage_chain_lightning') {
            this.castChainLightning(game);
        } else if (skillId === 'skill_mage_arcane_singularity') {
            this.castArcaneSingularity(game);
        } else if (skillId === 'skill_mage_meteor' || skillId === 'skill_fireball') {
            this.castMeteorStrike(game);
        } else if (skillId === 'skill_mage_mana_shield') {
            this.castManaShield(game);
        } else if (skillId === 'skill_mage_ultimate') {
            this.castSpaceCollapseBlackHole(game);
        } else if (skillId === 'skill_frost_nova') {
            this.castFrostNova(game);
        }

        // ====================================================================
        // 🗡️ 4. ROGUE SKILLS
        // ====================================================================
        else if (skillId === 'skill_rogue_shadow_stealth') {
            this.castShadowStealth(game);
        } else if (skillId === 'skill_rogue_shuriken_fan') {
            this.castShurikenDance(game);
        } else if (skillId === 'skill_rogue_fatal_strike' || skillId === 'skill_shadow_step') {
            this.castFatalBleed(game);
        } else if (skillId === 'skill_rogue_blade_fan') {
            this.castFanOfKnives(game);
        } else if (skillId === 'skill_rogue_ultimate') {
            this.castShadowClonePhantomStrike(game);
        }

        // ====================================================================
        // ✨ 5. UNIVERSAL SKILLS
        // ====================================================================
        else if (skillId === 'skill_basic') {
            this.performNormalAttack(game);
        } else if (skillId === 'skill_blessing') {
            this.castBlessing(game);
        } else if (skillId === 'skill_prayer') {
            this.castPrayer(game);
        } else if (skillId === 'skill_time_stop') {
            this.castTimeStop(game);
        }
    }

    render(ctx) {
        // 1. Player 부모 클래스의 4K 캐릭터 렌더링 호출
        super.render(ctx);

        // 2. 머리 위 닉네임 및 HP 게이지 바 렌더링
        ctx.save();
        ctx.translate(this.x, this.y);
        this.renderOverheadHUD(ctx);
        ctx.restore();
    }

    renderOverheadHUD(ctx) {
        const bounce = (this.state === 'move') ? Math.sin(this.walkAnimTimer) * 2.5 : 0;
        const hudY = -34 + bounce;

        // 닉네임 및 레벨 뱃지
        ctx.font = 'bold 11px Pretendard, sans-serif';
        ctx.textAlign = 'center';

        const nameText = `Lv.${this.level} ${this.nickname}`;
        const tw = ctx.measureText(nameText).width;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(-tw / 2 - 6, hudY - 12, tw + 12, 14, 4);
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.fillText(nameText, 0, hudY - 2);

        // 체력(HP) 미니 바
        const barWidth = 32;
        const barHeight = 4;
        const barY = hudY + 4;
        const hpPercent = this.maxHp > 0 ? Math.max(0, Math.min(1, this.hp / this.maxHp)) : 0;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(-barWidth / 2, barY, barWidth, barHeight);

        ctx.fillStyle = hpPercent > 0.5 ? '#22c55e' : (hpPercent > 0.25 ? '#f59e0b' : '#ef4444');
        ctx.fillRect(-barWidth / 2, barY, barWidth * hpPercent, barHeight);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 0.8;
        ctx.strokeRect(-barWidth / 2, barY, barWidth, barHeight);
    }
}
