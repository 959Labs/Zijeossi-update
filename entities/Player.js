// ============================================================================
// 4K High-Fidelity Player with Physics Cape, Helm Ornaments & Weapon Trails
// ============================================================================
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 16;
        this.baseSpeed = 180;
        this.speed = 180;
        this.facing = 'down';
        this.facingAngle = Math.PI / 2;

        this.level = 1;
        this.nickname = (typeof localStorage !== 'undefined' && localStorage.getItem('zijeossi_nickname')) || '지저씨';
        this.chatBubble = { text: '', timer: 0 };
        this.exp = 0;
        this.maxExp = 120;
        this.gold = 100;

        this.baseHp = 160;
        this.maxHp = 160;
        this.hp = 160;

        this.baseMp = 140;
        this.maxMp = 140;
        this.mp = 140;

        this.baseAttack = 38;
        this.attackPower = 38;

        this.upgradeLevels = { weapon: 0, armor: 0, accessory: 0 };
        this.inventory = [
            { id: 'sword_iron', count: 1 },
            { id: 'bow_wooden', count: 1 },
            { id: 'staff_apprentice', count: 1 },
            { id: 'dagger_rusty', count: 1 },
            { id: 'potion_hp', count: 5 },
            { id: 'potion_mp', count: 3 }
        ];
        this.equipment = { weapon: 'sword_iron', armor: null, accessory: null };
        this.potions = { hp: 5, mp: 3, buff: 2 };

        this.buffTimer = 0;
        this.shrineBuffTimer = 0;
        this.critPotionTimer = 0;

        this.state = 'idle';
        this.invulnerableTimer = 0;
        this.knockback = { vx: 0, vy: 0 };

        this.attackTimer = 0;
        this.attackDuration = 0.24;
        this.attackCooldown = 0;
        this.attackCombo = 0;
        this.comboResetTimer = 0;
        this.hitbox = null;

        this.dodgeTimer = 0;
        this.dodgeDuration = 0.24;
        this.dodgeSpeed = 400;
        this.dodgeDir = { x: 0, y: 1 };
        this.dodgeCooldown = 0;

        this.equippedSkills = {
            Q: 'skill_ultimate',
            W: 'skill_whirlwind',
            E: 'skill_sword_beam',
            A: 'skill_basic',
            S: 'skill_parry',
            D: 'skill_smash',
            Z: 'skill_frost_nova',
            X: 'skill_fireball',
            C: 'skill_blessing'
        };
        this.skillCooldowns = { Q: 0, W: 0, E: 0, A: 0, S: 0, D: 0, Z: 0, X: 0, C: 0 };
        this.parryActiveTimer = 0;
        this.timeStopTimer = 0;
        this.selectedSkillSlotTarget = null;
        this.stealthTimer = 0;
        this.manaShieldTimer = 0;
        this.cycloneTimer = 0;
        this.speedBoostTimer = 0;

        this.walkAnimTimer = 0;
        this.capeWave = 0;
        this.targetedEnemy = null;
        this.dustTimer = 0;

        this.recalculateStats();
    }

    recalculateStats() {
        let extraAtk = (this.upgradeLevels.weapon || 0) * 8;
        let extraHp = (this.upgradeLevels.armor || 0) * 35;
        let extraMp = (this.upgradeLevels.accessory || 0) * 20;
        let extraSpd = 0;

        if (this.equipment.weapon && ITEM_DB[this.equipment.weapon]) {
            extraAtk += ITEM_DB[this.equipment.weapon].atk || 0;
        }
        if (this.equipment.armor && ITEM_DB[this.equipment.armor]) {
            extraHp += ITEM_DB[this.equipment.armor].hp || 0;
        }
        if (this.equipment.accessory && ITEM_DB[this.equipment.accessory]) {
            extraMp += ITEM_DB[this.equipment.accessory].mp || 0;
            extraSpd += ITEM_DB[this.equipment.accessory].spd || 0;
            extraAtk += ITEM_DB[this.equipment.accessory].atk || 0;
        }

        this.attackPower = this.baseAttack + extraAtk;
        this.maxHp = this.baseHp + extraHp;
        this.maxMp = this.baseMp + extraMp;
        this.speed = this.baseSpeed + extraSpd;

        this.hp = Math.min(this.hp, this.maxHp);
        this.mp = Math.min(this.mp, this.maxMp);
    }

    equipItem(itemId, game) {
        const item = ITEM_DB[itemId];
        if (!item || !item.slot) return;

        const currentEquip = this.equipment[item.slot];
        if (currentEquip) {
            this.addItemToInventory(currentEquip, 1);
        }

        this.equipment[item.slot] = itemId;
        this.removeItemFromInventory(itemId, 1);

        sounds.playInteract();
        this.recalculateStats();
        game.updateInventoryUI();
        game.showNotification(`${item.name}을(를) 장착했습니다!`);
    }


    // Helper: Add item to stackable inventory (max 20 slots)
    addItemToInventory(itemId, count = 1) {
        if (!itemId || !ITEM_DB[itemId]) return false;
        const item = ITEM_DB[itemId];
        const isStackable = item.slot === 'consumable'; // only consumables stack

        if (isStackable) {
            const existing = this.inventory.find(s => s.id === itemId);
            if (existing) {
                existing.count += count;
                return true;
            }
        }
        if (this.inventory.length >= 20) return false;
        this.inventory.push({id: itemId, count: count});
        return true;
    }

    // Helper: Remove item from stackable inventory
    removeItemFromInventory(itemId, count = 1) {
        const idx = this.inventory.findIndex(s => s.id === itemId);
        if (idx === -1) return false;
        this.inventory[idx].count -= count;
        if (this.inventory[idx].count <= 0) {
            this.inventory.splice(idx, 1);
        }
        return true;
    }

    // Helper: Count items in inventory
    countItemInInventory(itemId) {
        const slot = this.inventory.find(s => s.id === itemId);
        return slot ? slot.count : 0;
    }

    hasInventorySpace() {
        return this.inventory.length < 20;
    }

    getInventoryCount() {
        return this.inventory.length;
    }


    usePotion(type, game) {
        const itemId = type === 'hp' ? 'potion_hp' : (type === 'mp' ? 'potion_mp' : 'potion_buff');
        return this.usePotionFromInventory(itemId, game);
    }

    usePotionFromInventory(itemId, game) {
        if (!itemId) return false;
        const count = this.countItemInInventory(itemId);
        if (count <= 0) {
            game.showNotification('물약이 부족합니다!');
            return false;
        }

        if (itemId === 'potion_hp') {
            if (this.hp >= this.maxHp) {
                game.showNotification('체력이 이미 가득 찼습니다!');
                return false;
            }
            this.removeItemFromInventory('potion_hp', 1);
            const heal = Math.round(this.maxHp * 0.45);
            this.hp = Math.min(this.maxHp, this.hp + heal);
            sounds.playPotion();
            game.particles.spawn(this.x, this.y, '#ef4444', 15, 60, 0.4, 4);
            game.particles.spawnDamageNumber(this.x, this.y, `+${heal} HP`, '#4ade80', true);
            game.showNotification(`💖 [체력 물약] 체력 +${heal} 회복!`);
        } else if (itemId === 'potion_mp') {
            if (this.mp >= this.maxMp) {
                game.showNotification('마나가 이미 가득 찼습니다!');
                return false;
            }
            this.removeItemFromInventory('potion_mp', 1);
            const mana = Math.round(this.maxMp * 0.55);
            this.mp = Math.min(this.maxMp, this.mp + mana);
            sounds.playPotion();
            game.particles.spawn(this.x, this.y, '#3b82f6', 15, 60, 0.4, 4);
            game.particles.spawnDamageNumber(this.x, this.y, `+${mana} MP`, '#60a5fa', true);
            game.showNotification(`💧 [마나 물약] 마나 +${mana} 회복!`);
        } else if (itemId === 'potion_buff') {
            this.removeItemFromInventory('potion_buff', 1);
            this.buffTimer = 15.0;
            this.critPotionTimer = 15.0;
            sounds.playPotion();
            game.particles.spawn(this.x, this.y, '#f59e0b', 20, 80, 0.5, 4.5);
            game.showNotification('⚡ [공격력 버프 물약] 15초간 공격력/이속 대폭 강화!');
        } else if (itemId === 'scroll_town_return') {
            if (game.currentZone === 'village') {
                game.showNotification('이미 평화로운 [시작의 마을]에 위치하고 있습니다.');
                return false;
            }
            this.removeItemFromInventory('scroll_town_return', 1);
            sounds.playLevelUp();
            game.camera.shake(0.4, 12);
            for (let i = 0; i < 35; i++) {
                const a = (i / 35) * Math.PI * 2;
                game.particles.spawn(this.x + Math.cos(a) * 40, this.y + Math.sin(a) * 40, '#38bdf8', 1, 80, 0.6, 5);
            }
            game.showNotification('📜 [마을 귀환] 시작의 마을로 순간이동합니다!');
            game.switchZone('village', true, 2100, 2100);
        }

        this.potions.hp = this.countItemInInventory('potion_hp');
        this.potions.mp = this.countItemInInventory('potion_mp');
        this.potions.buff = this.countItemInInventory('potion_buff');

        game.updateInventoryUI();
        game.updateHUD();
        return true;
    }

    useTownReturnScroll(game) {
        if (this.countItemInInventory('scroll_town_return') <= 0) {
            game.showNotification('마을 귀환 주문서가 없습니다!');
            return false;
        }
        if (game.currentZone === 'village') {
            game.showNotification('이미 시작의 마을 안전지대에 머물고 있습니다!');
            return false;
        }
        this.removeItemFromInventory('scroll_town_return', 1);
        sounds.playMagic();
        game.particles.spawn(this.x, this.y, '#38bdf8', 35, 140, 1.2, 6);
        game.showNotification('🌀 [마을 귀환 주문서] 고대 공간 전이 마법을 시전합니다...!');
        if (game.isInventoryOpen) game.toggleInventory();

        setTimeout(() => {
            game.switchZone('village', true, 2100, 2100);
            sounds.playLevelUp();
            game.showNotification('✨ 시작의 마을(2100, 2100)로 안전하게 귀환했습니다!');
        }, 400);
        return true;
    }

    unequipItem(slotName, game) {
        const itemId = this.equipment[slotName];
        if (!itemId) return;

        if (!this.hasInventorySpace()) {
            game.showNotification('가방이 가득 찼습니다!');
            return;
        }

        this.addItemToInventory(itemId, 1);
        this.equipment[slotName] = null;
        sounds.playInteract();
        this.recalculateStats();
        game.updateInventoryUI();
        game.showNotification('장비를 해제했습니다.');
    }

    update(dt, input, game) {
        if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;
        if (this.dodgeCooldown > 0) this.dodgeCooldown -= dt;
        if (this.attackCooldown > 0) this.attackCooldown -= dt;
        if (this.comboResetTimer > 0) {
            this.comboResetTimer -= dt;
            if (this.comboResetTimer <= 0) this.attackCombo = 0;
        }

        for (const slotKey in this.skillCooldowns) {
            if (this.skillCooldowns[slotKey] > 0) {
                const prev = this.skillCooldowns[slotKey];
                this.skillCooldowns[slotKey] = Math.max(0, this.skillCooldowns[slotKey] - dt);
                if (prev > 0 && this.skillCooldowns[slotKey] === 0) {
                    game.triggerSkillFlash(slotKey);
                    sounds.playSkillReady();
                }
            }
        }
        if (this.parryActiveTimer > 0) this.parryActiveTimer -= dt;
        if (this.timeStopTimer > 0) this.timeStopTimer -= dt;
        if (this.stealthTimer > 0) this.stealthTimer -= dt;
        if (this.manaShieldTimer > 0) this.manaShieldTimer -= dt;
        if (this.speedBoostTimer > 0) this.speedBoostTimer -= dt;

        if (this.cycloneTimer > 0) {
            this.cycloneTimer -= dt;
            if (Math.random() < 0.3) {
                const dmg = Math.round(this.attackPower * 0.7);
                game.enemies.forEach(e => {
                    if (e.active && Math.hypot(e.x - this.x, e.y - this.y) <= 100) {
                        e.takeDamage(dmg, (e.x - this.x) * 2, (e.y - this.y) * 2, game, false);
                    }
                });
            }
        }

        if (this.buffTimer > 0) this.buffTimer -= dt;
        if (this.shrineBuffTimer > 0) this.shrineBuffTimer -= dt;
        if (this.critPotionTimer > 0) this.critPotionTimer -= dt;

        // 🪄 Mage [무한의 마력로] (Lv 50+): +100% MP natural regen
        const isMage = (this.getWeaponType() === 'staff');
        const isMageAwakened = isMage && (this.level >= 50);
        const mpRegenRate = isMageAwakened ? 24 : 12;
        if (this.mp < this.maxMp) {
            this.mp = Math.min(this.maxMp, this.mp + mpRegenRate * dt);
        }

        // 🛵 배달앱 자동 물약 결제 시스템 (Auto-Potion)
        if (game.autoPotionThreshold > 0 && this.hp > 0 && (this.hp / this.maxHp) <= game.autoPotionThreshold) {
            if (game.autoPotionCooldown <= 0) {
                let usedItem = null;
                for (const itemId of ['potion_hp', 'potion_herb_tea', 'potion_dragon_elixir']) {
                    if (this.countItemInInventory(itemId) > 0) {
                        usedItem = itemId;
                        break;
                    }
                }
                if (usedItem) {
                    this.removeItemFromInventory(usedItem, 1);
                    const healAmt = (usedItem === 'potion_dragon_elixir') ? Math.floor(this.maxHp * 0.75) : 75;
                    this.hp = Math.min(this.maxHp, this.hp + healAmt);
                    game.autoPotionCooldown = 2.0;
                    sounds.playPotion();
                    game.particles.spawn(this.x, this.y, 'rgba(52, 211, 153, 0.95)', 20, 70, 1.2, 5);
                    game.particles.spawnDamageNumber(this.x, this.y - 24, `+${healAmt} HP (🛵 배달 완료!)`, '#4ade80', true);
                    game.updateInventoryUI();
                    game.updateHUD();
                }
            }
        }
        if (game.autoPotionCooldown > 0) {
            game.autoPotionCooldown -= dt;
        }

        if (this.equipment.accessory === 'ring_pillow_dream') {
            if (this.hp < this.maxHp) this.hp = Math.min(this.maxHp, this.hp + this.maxHp * 0.04 * dt);
            if (this.mp < this.maxMp) this.mp = Math.min(this.maxMp, this.mp + this.maxMp * 0.06 * dt);
            if (Math.random() < 0.1) {
                game.particles.spawn(this.x, this.y - 12, '#fbcfe8', 1, 15, 0.3, 2);
            }
        }

        this.x += this.knockback.vx * dt;
        this.y += this.knockback.vy * dt;
        this.knockback.vx *= 0.85;
        this.knockback.vy *= 0.85;

        this.capeWave += dt * 8;

        const minX = 64;
        const maxX = game.mapWidth - 64;
        const minY = 64;
        const maxY = game.mapHeight - 64;
        this.x = Math.max(minX, Math.min(maxX, this.x));
        this.y = Math.max(minY, Math.min(maxY, this.y));

        for (const prop of game.props) {
            if (prop.active && prop.solid) {
                const dist = Math.hypot(this.x - prop.x, this.y - prop.y);
                const minDist = this.radius + prop.radius;
                if (dist < minDist) {
                    const push = (minDist - dist) + 1;
                    const angle = dist > 0.001 ? Math.atan2(this.y - prop.y, this.x - prop.x) : Math.random() * Math.PI * 2;
                    this.x += Math.cos(angle) * push;
                    this.y += Math.sin(angle) * push;
                }
            }
        }

        if (game.settings.autoAim) {
            this.targetedEnemy = game.findClosestEnemy(this.x, this.y, 320);
        } else {
            this.targetedEnemy = null;
        }

        if (this.state === 'dodge') {
            this.dodgeTimer -= dt;
            this.x += this.dodgeDir.x * this.dodgeSpeed * dt;
            this.y += this.dodgeDir.y * this.dodgeSpeed * dt;

            if (Math.random() < 0.9) {
                game.particles.spawn(this.x, this.y, '#93c5fd', 1, 10, 0.25, 5);
            }

            if (this.dodgeTimer <= 0) this.state = 'idle';
            return;
        }

        if (this.state === 'attack') {
            this.attackTimer -= dt;
            if (this.attackTimer <= 0) {
                this.state = 'idle';
                this.hitbox = null;
            }
        }

        if (this.parryActiveTimer > 0) {
            game.particles.spawn(this.x, this.y, '#60a5fa', 1, 30, 0.15, 3);
        }

        if (this.chatBubble && this.chatBubble.timer > 0) {
            this.chatBubble.timer -= dt;
        }

        const isModalOpen = game.isAnyModalOpen() || (game.chatSystem && game.chatSystem.isOpen);
        const move = input.getMovementVector(isModalOpen);

        if (move.dx !== 0 || move.dy !== 0) {
            if (!this.targetedEnemy || this.state !== 'attack') {
                this.facingAngle = Math.atan2(move.dy, move.dx);
                if (Math.abs(move.dx) > Math.abs(move.dy)) {
                    this.facing = move.dx > 0 ? 'right' : 'left';
                } else {
                    this.facing = move.dy > 0 ? 'down' : 'up';
                }
            }
            this.walkAnimTimer += dt * 10;

            this.dustTimer += dt;
            if (this.dustTimer > 0.16) {
                this.dustTimer = 0;
                game.particles.spawn(this.x, this.y + 10, '#8d6e63', 2, 20, 0.2, 2.5);
            }
        }

        // Allow moving while performing normal attack!
        if (!isModalOpen && this.state !== 'dodge') {
            const buffMult = (this.buffTimer > 0 ? 1.3 : 1.0) * (this.shrineBuffTimer > 0 ? 1.3 : 1.0);
            const speedMult = this.state === 'attack' ? 0.95 : 1.0;
            const currentSpeed = this.speed * buffMult * speedMult;
            const nextX = this.x + move.dx * currentSpeed * dt;
            const nextY = this.y + move.dy * currentSpeed * dt;

            if (!game.checkCollision(nextX, this.y, this.radius)) this.x = nextX;
            if (!game.checkCollision(this.x, nextY, this.radius)) this.y = nextY;

            if (this.state !== 'attack') {
                this.state = (move.dx !== 0 || move.dy !== 0) ? 'move' : 'idle';
            }
        } else if (isModalOpen) {
            this.state = 'idle';
        }

        if (!isModalOpen && !game.modalJustClosedThisFrame) {
            // Dodge Mode (Space or Double-Tap Arrow Keys)
            const dodgeMode = (game.settings && game.settings.dodgeMode) || 'both';
            let wantsDodge = false;
            let doubleTapVec = null;

            if ((dodgeMode === 'both' || dodgeMode === 'space_only') && input.isDodgePressed()) {
                wantsDodge = true;
            }
            if ((dodgeMode === 'both' || dodgeMode === 'double_tap') && input.getDoubleTapDodgeVector()) {
                wantsDodge = true;
                doubleTapVec = input.getDoubleTapDodgeVector();
            }

            if (wantsDodge && this.dodgeCooldown <= 0) {
                this.state = 'dodge';
                this.attackTimer = 0; // Dash Cancel cancels attack recovery!
                this.dodgeTimer = this.dodgeDuration;
                this.dodgeCooldown = 0.45;
                this.invulnerableTimer = this.dodgeDuration + 0.1;

                if (doubleTapVec) {
                    this.dodgeDir = { x: doubleTapVec.dx, y: doubleTapVec.dy };
                } else if (move.dx !== 0 || move.dy !== 0) {
                    this.dodgeDir = { x: move.dx, y: move.dy };
                } else {
                    this.dodgeDir = { x: Math.cos(this.facingAngle), y: Math.sin(this.facingAngle) };
                }
                sounds.playDash();
                game.particles.spawn(this.x, this.y, '#60a5fa', 10, 100, 0.3, 4);
            }

            // 9 Skill Slots (Q, W, E, A, S, D, Z, X, C)
            if (input.isSkillQPressed()) this.executeSkillSlot('Q', game);
            if (input.isSkillWPressed()) this.executeSkillSlot('W', game);
            if (input.isSkillEPressed()) this.executeSkillSlot('E', game);
            if (input.isSkillAPressed()) this.executeSkillSlot('A', game);
            if (input.isSkillSPressed()) this.executeSkillSlot('S', game);
            if (input.isSkillDPressed()) this.executeSkillSlot('D', game);
            if (input.isSkillZPressed()) this.executeSkillSlot('Z', game);
            if (input.isSkillXPressed()) this.executeSkillSlot('X', game);
            if (input.isSkillCPressed()) this.executeSkillSlot('C', game);

            if (input.isPotion1Pressed()) this.usePotionFromInventory('potion_hp', game);
            if (input.isPotion2Pressed()) this.usePotionFromInventory('potion_mp', game);
            if (input.isPotion3Pressed()) this.usePotionFromInventory('potion_buff', game);

            if (input.isInteractPressed()) {
                game.interactWithWorld(this);
            }

            if (input.isWorldMapPressed()) game.toggleWorldMap();
            if (input.isSkillBookPressed()) game.toggleSkillBook();
            if (input.isInventoryPressed()) game.toggleInventory();
            if (input.isSettingsPressed()) game.toggleSettings();
            if (input.isTabPressed()) game.toggleTabRadar();
        }
    }

    getWeaponType() {
        if (this.equipment && this.equipment.weapon) {
            const item = ITEM_DB[this.equipment.weapon];
            if (item && item.weaponType) return item.weaponType;
        }
        return 'sword';
    }

    getClassInfo() {
        const isEn = (typeof getLanguage === 'function' && getLanguage() === 'en');
        const wt = this.getWeaponType();
        if (wt === 'bow') return { id: 'archer', name: isEn ? '🏹 Homebody Archer' : '🏹 방구석 궁수', css: 'class-archer', desc: isEn ? 'Rapid 3-arrow long-range barrage' : '초장거리 관통 화살 연사' };
        if (wt === 'staff') return { id: 'mage', name: isEn ? '🪄 Bedridden Archmage' : '🪄 누워있는 대마법사', css: 'class-mage', desc: isEn ? '3-way homing arcane missile storm' : '3갈래 유도 비전 탄환 폭격' };
        if (wt === 'dagger') return { id: 'rogue', name: isEn ? '🗡️ Slothful Rogue' : '🗡️ 드러누운 암살자', css: 'class-rogue', desc: isEn ? 'Ultra-fast 5-hit phantom dual daggers' : '초고속 5연타 단검 난무' };
        return { id: 'warrior', name: isEn ? "⚔️ Lazy Warrior (Uncle Bob)" : '⚔️ 게으른 검사', css: 'class-warrior', desc: isEn ? 'Heavy 3-hit melee sword slash combo' : '묵직한 3단 베기 콤보' };
    }

    performNormalAttack(game) {
        if (game && game.network && this === game.player) game.network.sendAction('attack');

        if (this.targetedEnemy) {
            this.facingAngle = Math.atan2(this.targetedEnemy.y - this.y, this.targetedEnemy.x - this.x);
            if (Math.abs(Math.cos(this.facingAngle)) > Math.abs(Math.sin(this.facingAngle))) {
                this.facing = Math.cos(this.facingAngle) > 0 ? 'right' : 'left';
            } else {
                this.facing = Math.sin(this.facingAngle) > 0 ? 'down' : 'up';
            }
        }

        const weaponType = this.getWeaponType();
        const buffMult = (this.buffTimer > 0 ? 1.4 : 1.0) * (this.shrineBuffTimer > 0 ? 1.4 : 1.0) * (this.critPotionTimer > 0 ? 2.0 : 1.0);
        const baseAtk = this.attackPower * buffMult;
        const weaponId = this.equipment.weapon;

        // 🏹 ARCHER NORMAL ATTACK (Bow)
        if (weaponType === 'bow') {
            this.state = 'attack';
            this.attackDuration = 0.20;
            this.attackTimer = this.attackDuration;
            this.attackCooldown = 0.26; // High firing rate!

            sounds.playSwordBeam();
            const dmg = Math.round(baseAtk * 1.15);
            const speed = 720;
            const vx = Math.cos(this.facingAngle) * speed;
            const vy = Math.sin(this.facingAngle) * speed;
            game.projectiles.push(new Projectile(this.x, this.y, vx, vy, dmg, 500, 'player_arrow', true));
            game.particles.spawn(this.x + Math.cos(this.facingAngle) * 20, this.y + Math.sin(this.facingAngle) * 20, '#38bdf8', 6, 60, 0.2, 3);
            return;
        }

        // 🪄 MAGE NORMAL ATTACK (Staff)
        if (weaponType === 'staff') {
            this.state = 'attack';
            this.attackDuration = 0.26;
            this.attackTimer = this.attackDuration;
            this.attackCooldown = 0.36;

            sounds.playMagic();
            const orbDmg = Math.round(baseAtk * 0.55);
            const speed = 440;
            const angles = [this.facingAngle - 0.26, this.facingAngle, this.facingAngle + 0.26];
            angles.forEach(ang => {
                const vx = Math.cos(ang) * speed;
                const vy = Math.sin(ang) * speed;
                game.projectiles.push(new Projectile(this.x, this.y, vx, vy, orbDmg, 450, 'arcane_orb', true));
            });
            game.particles.spawn(this.x, this.y, '#c084fc', 8, 80, 0.3, 4);
            return;
        }

        // 🗡️ ROGUE NORMAL ATTACK (Dagger)
        if (weaponType === 'dagger') {
            this.state = 'attack';
            this.attackDuration = 0.14;
            this.attackTimer = this.attackDuration;
            this.attackCooldown = 0.18; // Lightning-fast 5-hit combo!
            this.comboResetTimer = 0.8;
            this.attackCombo = (this.attackCombo % 5) + 1;

            sounds.playSlash();
            const multipliers = [0.75, 0.85, 0.95, 1.15, 1.85];
            const comboMult = multipliers[this.attackCombo - 1] || 1.0;
            const isCrit = (this.attackCombo === 5) || (Math.random() < 0.35);
            const dmg = Math.round(baseAtk * comboMult * (isCrit ? 1.5 : 1.0));
            const reach = this.attackCombo === 5 ? 60 : 48;
            const arc = this.attackCombo === 5 ? Math.PI : Math.PI * 0.65;

            this.hitbox = {
                x: this.x,
                y: this.y,
                angle: this.facingAngle,
                radius: reach,
                arc: arc,
                damage: dmg,
                isCrit: isCrit,
                combo: this.attackCombo
            };

            const startA = this.facingAngle - arc / 2;
            const endA = this.facingAngle + arc / 2;
            game.particles.spawnSlashArc(this.x, this.y, reach, startA, endA, isCrit ? '#facc15' : '#eab308');
            game.checkPlayerAttackHits(this.hitbox);
            return;
        }

        // ⚔️ WARRIOR NORMAL ATTACK (Sword - Default)
        this.state = 'attack';
        this.attackDuration = 0.28;
        this.attackTimer = this.attackDuration;
        this.attackCooldown = 0.38; // 묵직하고 전략적인 타격 템포 (기존 0.12s -> 0.38s)
        this.comboResetTimer = 0.9;
        this.attackCombo = (this.attackCombo % 3) + 1;

        sounds.playSlash();

        const comboMultiplier = this.attackCombo === 3 ? 1.65 : (this.attackCombo === 2 ? 1.25 : 1.0);
        const dmg = Math.round(baseAtk * comboMultiplier);
        const reach = this.attackCombo === 3 ? 68 : 54;
        const arc = this.attackCombo === 3 ? Math.PI : Math.PI * 0.75;

        this.hitbox = {
            x: this.x,
            y: this.y,
            angle: this.facingAngle,
            radius: reach,
            arc: arc,
            damage: dmg,
            isCrit: this.attackCombo === 3,
            combo: this.attackCombo
        };

        const startA = this.facingAngle - arc / 2;
        const endA = this.facingAngle + arc / 2;
        let slashColor = '#38bdf8';

        if (weaponId === 'sword_celestial') slashColor = '#fde047';
        else if (weaponId === 'sword_frost' || weaponId === 'sword_frost_cleaver') slashColor = '#7dd3fc';
        else if (weaponId === 'sword_dragon') slashColor = '#fbbf24';
        else if (weaponId === 'sword_flame') slashColor = '#ef4444';
        else if (weaponId === 'sword_scimitar_gold') slashColor = '#eab308';
        else if (weaponId === 'sword_silver_crusader') slashColor = '#f1f5f9';
        else if (weaponId === 'sword_archangel_lance') slashColor = '#fef08a';
        else if (weaponId === 'sword_wooden_legend') slashColor = '#84cc16';
        else if (weaponId === 'sword_lazy_god') slashColor = '#f472b6';

        game.particles.spawnSlashArc(this.x, this.y, reach, startA, endA, slashColor);
        game.checkPlayerAttackHits(this.hitbox);

        // Unique Special Weapon Projectile Triggers
        if (weaponId === 'sword_scimitar_gold' && this.attackCombo === 3) {
            const vx = Math.cos(this.facingAngle) * 450;
            const vy = Math.sin(this.facingAngle) * 450;
            game.projectiles.push(new Projectile(this.x, this.y, vx, vy, Math.round(dmg * 0.8), 420, 'sand_ball', true));
        } else if (weaponId === 'sword_frost_cleaver') {
            const vx = Math.cos(this.facingAngle) * 480;
            const vy = Math.sin(this.facingAngle) * 480;
            game.projectiles.push(new Projectile(this.x, this.y, vx, vy, Math.round(dmg * 0.6), 380, 'frost_shard', true));
        } else if (weaponId === 'sword_silver_crusader') {
            const vx = Math.cos(this.facingAngle) * 520;
            const vy = Math.sin(this.facingAngle) * 520;
            game.projectiles.push(new Projectile(this.x, this.y, vx, vy, Math.round(dmg * 0.75), 450, 'holy_beam', true));
        } else if (weaponId === 'sword_archangel_lance') {
            for (let off = -0.22; off <= 0.22; off += 0.22) {
                const a = this.facingAngle + off;
                const vx = Math.cos(a) * 550;
                const vy = Math.sin(a) * 550;
                game.projectiles.push(new Projectile(this.x, this.y, vx, vy, Math.round(dmg * 0.7), 500, 'holy_beam', true));
            }
        } else if (weaponId === 'sword_lazy_god') {
            const vx = Math.cos(this.facingAngle) * 500;
            const vy = Math.sin(this.facingAngle) * 500;
            game.projectiles.push(new Projectile(this.x, this.y, vx, vy, Math.round(dmg * 1.0), 550, 'galaxy_star', true));
        }
    }

    executeSkillSlot(slotKey, game) {
        const skillId = this.equippedSkills[slotKey];
        if (!skillId) return;
        const skill = SKILL_DB[skillId];
        if (!skill) return;

        // 1. ⚔️ 직업 전용 스킬 무기 일치 검사 (Class Weapon Requirement)
        const curWeaponType = this.getWeaponType();
        if (skill.classId && skill.classId !== 'all') {
            if (skill.classId === 'warrior' && curWeaponType !== 'sword') {
                sounds.playTrash();
                game.showNotification('⚔️ [직업 제한] 검(Sword)을 장착해야 검사 스킬을 시전할 수 있습니다!');
                return;
            }
            if (skill.classId === 'archer' && curWeaponType !== 'bow') {
                sounds.playTrash();
                game.showNotification('🏹 [직업 제한] 활(Bow)을 장착해야 궁수 스킬을 시전할 수 있습니다!');
                return;
            }
            if (skill.classId === 'mage' && curWeaponType !== 'staff') {
                sounds.playTrash();
                game.showNotification('🪄 [직업 제한] 지팡이(Staff)를 장착해야 마법사 스킬을 시전할 수 있습니다!');
                return;
            }
            if (skill.classId === 'rogue' && curWeaponType !== 'dagger') {
                sounds.playTrash();
                game.showNotification('🗡️ [직업 제한] 단검(Dagger)을 장착해야 암살자 스킬을 시전할 수 있습니다!');
                return;
            }
        }

        // 2. 👑 Lv 50 2차 각성 궁극기 해금 검사 ("그 레벨에 잠이 오늬?")
        if (skill.type === 'ultimate' && skill.id !== 'skill_time_stop' && this.level < 50) {
            sounds.playTrash();
            game.showNotification(`💤 [2차 각성 필요] 그 레벨에 잠이 오늬? (현재 Lv ${this.level} / 필요 Lv 50)`);
            return;
        }

        if (skillId === 'skill_basic' && this.attackCooldown > 0) return;
        if (this.skillCooldowns[slotKey] > 0) return;
        if (this.mp < skill.mpCost) {
            game.showNotification('💧 마나가 부족합니다!');
            return;
        }

        // Deduct MP & Set Cooldown
        this.mp -= skill.mpCost;
        if (skillId === 'skill_basic') {
            this.skillCooldowns[slotKey] = 0;
        } else {
            this.skillCooldowns[slotKey] = skill.cd || 0;
        }

        // 🪄 Mage [무한의 마력로] (Lv 50+): 20% 확률로 스킬 쿨다운 즉시 초기화
        if (this.level >= 50 && this.getWeaponType() === 'staff' && skillId !== 'skill_basic' && Math.random() < 0.20) {
            this.skillCooldowns[slotKey] = 0;
            sounds.playLevelUp();
            game.particles.spawn(this.x, this.y, '#c084fc', 20, 100, 0.5, 5);
            game.showNotification('✨ [무한의 마력로] 20% 확률로 쿨다운이 즉시 초기화되었습니다!');
        }

        // Auto Aim if targeted enemy exists
        if (this.targetedEnemy && (skill.type === 'melee' || skill.type === 'ranged' || skill.type === 'magic')) {
            this.facingAngle = Math.atan2(this.targetedEnemy.y - this.y, this.targetedEnemy.x - this.x);
            if (Math.abs(Math.cos(this.facingAngle)) > Math.abs(Math.sin(this.facingAngle))) {
                this.facing = Math.cos(this.facingAngle) > 0 ? 'right' : 'left';
            } else {
                this.facing = Math.sin(this.facingAngle) > 0 ? 'down' : 'up';
            }
        }

        if (game && game.network && this === game.player) game.network.sendAction('skill', { skillId });

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

    // ========================================================================
    // ⚔️ WARRIOR CASTING IMPLEMENTATIONS
    // ========================================================================
    castCrossSlash(game) {
        sounds.playSlash();
        game.camera.shake(0.25, 8);
        const buffMult = (this.buffTimer > 0 ? 1.4 : 1.0) * (this.critPotionTimer > 0 ? 2.0 : 1.0);
        const dmg = Math.round(this.attackPower * 3.4 * buffMult);

        const angles = [this.facingAngle - 0.25, this.facingAngle + 0.25];
        angles.forEach(a => {
            const vx = Math.cos(a) * 580;
            const vy = Math.sin(a) * 580;
            game.projectiles.push(new Projectile(this.x, this.y, vx, vy, dmg, 420, 'sword_beam', true));
        });
        game.particles.spawn(this.x, this.y, '#f59e0b', 20, 120, 0.4, 5);
        game.showNotification('⚔️ [십자 참격] 전방으로 2연속 X자 거대 검기를 날렸습니다!');
    }

    castShieldCharge(game) {
        sounds.playShield();
        this.invulnerableTimer = 0.45;
        const chargeDist = 220;
        const targetX = this.x + Math.cos(this.facingAngle) * chargeDist;
        const targetY = this.y + Math.sin(this.facingAngle) * chargeDist;

        const dmg = Math.round(this.attackPower * 3.0);
        game.enemies.forEach(e => {
            if (e.active && Math.hypot(e.x - this.x, e.y - this.y) <= chargeDist + 30) {
                e.takeDamage(dmg, Math.cos(this.facingAngle) * 350, Math.sin(this.facingAngle) * 350, game, true);
                e.stunTimer = 2.0;
            }
        });

        this.x = Math.max(64, Math.min(game.mapWidth - 64, targetX));
        this.y = Math.max(64, Math.min(game.mapHeight - 64, targetY));
        game.camera.shake(0.3, 10);
        game.particles.spawn(this.x, this.y, '#38bdf8', 25, 140, 0.5, 6);
        game.showNotification('🛡️ [방패 돌진] 초고속 돌진으로 적을 튕겨내고 2초간 기절시켰습니다!');
    }

    castWhirlwind(game) {
        sounds.playWhirlwind();
        game.camera.shake(0.25, 7);
        this.cycloneTimer = 2.0;
        const buffMult = (this.buffTimer > 0 ? 1.4 : 1.0) * (this.critPotionTimer > 0 ? 2.0 : 1.0);
        const dmg = Math.round(this.attackPower * 4.2 * buffMult);
        const radius = 100;

        for (let i = 0; i < 30; i++) {
            const a = (i / 30) * Math.PI * 2;
            game.particles.spawn(this.x + Math.cos(a) * radius, this.y + Math.sin(a) * radius, '#38bdf8', 1, 50, 0.35, 4);
        }

        game.enemies.forEach(e => {
            if (e.active && Math.hypot(e.x - this.x, e.y - this.y) <= radius + e.radius) {
                const angle = Math.atan2(this.y - e.y, this.x - e.x);
                e.takeDamage(dmg, -Math.cos(angle) * 140, -Math.sin(angle) * 140, game, true);
            }
        });
        game.showNotification('🌪️ [선풍 대검풍] 2초간 회전하며 주변 적들을 분쇄합니다!');
    }

    castEarthShatter(game) {
        sounds.playSlam();
        game.camera.shake(0.35, 12);
        const buffMult = (this.buffTimer > 0 ? 1.4 : 1.0) * (this.critPotionTimer > 0 ? 2.0 : 1.0);
        const dmg = Math.round(this.attackPower * 4.6 * buffMult);

        const angles = [this.facingAngle - 0.3, this.facingAngle, this.facingAngle + 0.3];
        angles.forEach(a => {
            for (let d = 40; d <= 220; d += 40) {
                const fx = this.x + Math.cos(a) * d;
                const fy = this.y + Math.sin(a) * d;
                game.particles.spawn(fx, fy, '#d97706', 6, 80, 0.5, 5);
                game.enemies.forEach(e => {
                    if (e.active && Math.hypot(e.x - fx, e.y - fy) <= 45) {
                        e.takeDamage(dmg, Math.cos(a) * 200, Math.sin(a) * 200, game, true);
                        e.stunTimer = 2.5;
                    }
                });
            }
        });
        game.showNotification('💥 [대지 파쇄격] 3갈래 지진파로 적들을 2.5초간 기절시켰습니다!');
    }

    castHeavenSplitter(game) {
        sounds.playUltimate();
        game.camera.shake(0.45, 16);
        const dmg = Math.round(this.attackPower * 2.0);

        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                if (!game || !game.player) return;
                const angle = (i / 10) * Math.PI * 2;
                const vx = Math.cos(angle) * 600;
                const vy = Math.sin(angle) * 600;
                game.projectiles.push(new Projectile(this.x, this.y, vx, vy, dmg, 600, 'sword_beam', true));
                game.particles.spawn(this.x, this.y, '#facc15', 15, 200, 0.6, 6);
            }, i * 120);
        }
        game.showNotification('👑 [천지개벽 참격폭풍] 10연타 황금 검기 폭풍이 화면을 가릅니다!');
    }

    // ========================================================================
    // 🏹 ARCHER CASTING IMPLEMENTATIONS
    // ========================================================================
    castRapidStrafe(game) {
        sounds.playBow();
        const baseDmg = Math.round(this.attackPower * 0.9);
        for (let i = 0; i < 7; i++) {
            const spread = (i - 3) * 0.08;
            const a = this.facingAngle + spread;
            const vx = Math.cos(a) * 680;
            const vy = Math.sin(a) * 680;
            game.projectiles.push(new Projectile(this.x, this.y, vx, vy, baseDmg, 500, 'rapid_arrow', true));
        }
        game.particles.spawn(this.x, this.y, '#38bdf8', 15, 100, 0.3, 4);
        game.showNotification('🎯 [속사 난사] 전방으로 7연속 관통 화살을 난사했습니다!');
    }

    castWindPiercer(game) {
        sounds.playSwordBeam();
        game.camera.shake(0.25, 8);
        const dmg = Math.round(this.attackPower * 4.5);
        const vx = Math.cos(this.facingAngle) * 750;
        const vy = Math.sin(this.facingAngle) * 750;
        game.projectiles.push(new Projectile(this.x, this.y, vx, vy, dmg, 650, 'wind_piercer', true));
        game.showNotification('🌪️ [바람의 관통 저격] 650px 초장거리 거대 바람 화살을 발사했습니다!');
    }

    castGlacialArrow(game) {
        sounds.playBow();
        const dmg = Math.round(this.attackPower * 3.2);
        const vx = Math.cos(this.facingAngle) * 560;
        const vy = Math.sin(this.facingAngle) * 560;

        const proj = new Projectile(this.x, this.y, vx, vy, dmg, 480, 'glacial_arrow', true);
        game.projectiles.push(proj);

        game.enemies.forEach(e => {
            if (e.active && Math.hypot(e.x - this.x, e.y - this.y) <= 480) {
                e.freezeTimer = 3.0;
            }
        });
        game.showNotification('❄️ [서리 빙결 화살] 적중 지점 주변 적들을 3초간 완전 빙결시켰습니다!');
    }

    castExplosiveTrap(game) {
        sounds.playEquip();
        if (!game.traps) game.traps = [];
        const dmg = Math.round(this.attackPower * 4.0);
        game.traps.push({
            x: this.x,
            y: this.y,
            timer: 30.0,
            triggerRadius: 35,
            blastRadius: 110,
            damage: dmg
        });
        game.particles.spawn(this.x, this.y, '#f59e0b', 12, 60, 0.4, 4);
        game.showNotification('💣 [폭발 지뢰 덫] 발밑에 지뢰를 설치했습니다! (적 접근 시 400% 폭발)');
    }

    castMeteorArrowRain(game) {
        sounds.playUltimate();
        game.camera.shake(0.4, 14);
        const dmg = Math.round(this.attackPower * 1.1);

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                if (!game) return;
                const rx = game.player.x + (Math.random() - 0.5) * 600;
                const ry = game.player.y + (Math.random() - 0.5) * 450;
                game.projectiles.push(new Projectile(rx, ry - 300, 0, 700, dmg, 320, 'meteor_arrow', true));
                game.particles.spawn(rx, ry, '#facc15', 8, 80, 0.3, 4);
            }, i * 80);
        }
        game.showNotification('🌟 [유성우 폭격 화살비] 하늘에서 20발의 유성 화살이 쏟아집니다!');
    }

    // ========================================================================
    // 🪄 MAGE CASTING IMPLEMENTATIONS
    // ========================================================================
    castChainLightning(game) {
        sounds.playSlash();
        const dmg = Math.round(this.attackPower * 2.4);
        const vx = Math.cos(this.facingAngle) * 800;
        const vy = Math.sin(this.facingAngle) * 800;
        game.projectiles.push(new Projectile(this.x, this.y, vx, vy, dmg, 450, 'chain_lightning', true));

        // Chain to up to 5 nearby enemies
        const hitEnemies = [];
        let curTarget = this.targetedEnemy || game.enemies.find(e => e.active && Math.hypot(e.x - this.x, e.y - this.y) <= 300);
        if (curTarget) {
            hitEnemies.push(curTarget);
            for (let step = 0; step < 4; step++) {
                let next = game.enemies.find(e => e.active && !hitEnemies.includes(e) && Math.hypot(e.x - curTarget.x, e.y - curTarget.y) <= 220);
                if (next) {
                    hitEnemies.push(next);
                    curTarget = next;
                } else break;
            }
        }

        hitEnemies.forEach(e => {
            e.takeDamage(dmg, 0, 0, game, true);
            e.stunTimer = 1.0;
            game.particles.spawn(e.x, e.y, '#60a5fa', 12, 90, 0.4, 4);
        });
        game.showNotification(`⚡ [체인 라이트닝] ${Math.max(1, hitEnemies.length)}마리의 적에게 연쇄 전격을 튕겼습니다!`);
    }

    castArcaneSingularity(game) {
        sounds.playSwordBeam();
        const dmg = Math.round(this.attackPower * 3.6);
        const vx = Math.cos(this.facingAngle) * 250;
        const vy = Math.sin(this.facingAngle) * 250;
        game.projectiles.push(new Projectile(this.x, this.y, vx, vy, dmg, 180, 'singularity_orb', true));
        game.showNotification('🌀 [비전 특이점] 3.5초간 적들을 한 점으로 빨아들이는 중력장을 생성했습니다!');
    }

    castMeteorStrike(game) {
        sounds.playSlam();
        game.camera.shake(0.4, 14);
        const dmg = Math.round(this.attackPower * 5.2);
        const tx = this.x + Math.cos(this.facingAngle) * 180;
        const ty = this.y + Math.sin(this.facingAngle) * 180;

        game.projectiles.push(new Projectile(tx - 120, ty - 180, 400, 600, dmg, 250, 'meteor_fireball', true));

        // Ground fire zone
        if (!game.groundZones) game.groundZones = [];
        game.groundZones.push({
            x: tx,
            y: ty,
            radius: 120,
            duration: 3.5,
            dps: Math.round(this.attackPower * 1.2),
            type: 'lava'
        });

        game.particles.spawn(tx, ty, '#ea580c', 35, 180, 0.7, 7);
        game.showNotification('☄️ [메테오 스트라이크] 거대 운석이 낙하하여 520% 폭발 및 불바다를 일으켰습니다!');
    }

    castManaShield(game) {
        sounds.playShield();
        this.manaShieldTimer = 6.0;
        game.particles.spawn(this.x, this.y, '#38bdf8', 25, 120, 0.6, 6);
        game.showNotification('🛡️ [마나 실드] 6초간 받는 피해를 70% 흡수하고 마나로 환원합니다!');
    }

    castSpaceCollapseBlackHole(game) {
        sounds.playUltimate();
        game.camera.shake(0.5, 18);
        const dmg = Math.round(this.attackPower * 2.4);

        game.enemies.forEach(e => {
            if (e.active) {
                const a = Math.atan2(this.y - e.y, this.x - e.x);
                e.x += Math.cos(a) * 200;
                e.y += Math.sin(a) * 200;
                e.takeDamage(dmg, 0, 0, game, true);
                e.stunTimer = 3.0;
            }
        });
        game.particles.spawn(this.x, this.y, '#9333ea', 50, 260, 1.0, 8);
        game.showNotification('🪐 [시공간 붕괴 블랙홀] 전 맵의 적을 빨아들여 압축 폭발시켰습니다! (총 2,400% 피해)');
    }

    // ========================================================================
    // 🗡️ ROGUE CASTING IMPLEMENTATIONS
    // ========================================================================
    castShadowStealth(game) {
        sounds.playDodge();
        this.stealthTimer = 3.0;
        this.speedBoostTimer = 3.0;
        game.particles.spawn(this.x, this.y, '#0f172a', 20, 80, 0.5, 5);
        game.showNotification('💨 [그림자 은신] 3초간 완전 은신! (다음 공격 100% 치명타 2.8배)');
    }

    castShurikenDance(game) {
        sounds.playSlash();
        const dmg = Math.round(this.attackPower * 0.6);
        for (let i = 0; i < 5; i++) {
            const spread = (i - 2) * 0.15;
            const a = this.facingAngle + spread;
            const vx = Math.cos(a) * 580;
            const vy = Math.sin(a) * 580;
            game.projectiles.push(new Projectile(this.x, this.y, vx, vy, dmg, 260, 'shuriken_boomerang', true));
        }
        game.showNotification('🥷 [표창 부메랑] 5개의 독 표창이 궤도를 돌며 왕복 2회 타격합니다!');
    }

    castFatalBleed(game) {
        sounds.playSlash();
        const target = this.targetedEnemy || game.enemies.find(e => e.active && Math.hypot(e.x - this.x, e.y - this.y) <= 350);
        if (target) {
            this.x = target.x - Math.cos(this.facingAngle) * 30;
            this.y = target.y - Math.sin(this.facingAngle) * 30;
            const dmg = Math.round(this.attackPower * 3.8);
            target.takeDamage(dmg, Math.cos(this.facingAngle) * 200, Math.sin(this.facingAngle) * 200, game, true);
            target.stunTimer = 1.0;
            game.particles.spawn(target.x, target.y, '#ef4444', 25, 120, 0.5, 6);
            game.showNotification('🩸 [출혈 급소 찌르기] 적 배후로 순간이동하여 급소 암습을 꽂았습니다!');
        } else {
            this.castSwordBeam(game);
        }
    }

    castFanOfKnives(game) {
        sounds.playSlash();
        game.camera.shake(0.25, 7);
        const dmg = Math.round(this.attackPower * 3.6);
        for (let i = 0; i < 16; i++) {
            const a = (i / 16) * Math.PI * 2;
            const vx = Math.cos(a) * 600;
            const vy = Math.sin(a) * 600;
            game.projectiles.push(new Projectile(this.x, this.y, vx, vy, dmg, 160, 'blade_fan_dagger', true));
        }
        game.showNotification('🌪️ [칼날 폭풍 춤] 360도 전방위로 16개의 단검을 고속 난사했습니다!');
    }

    castShadowClonePhantomStrike(game) {
        sounds.playUltimate();
        game.camera.shake(0.45, 15);
        this.invulnerableTimer = 1.5;
        const dmg = Math.round(this.attackPower * 2.1);

        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                if (!game) return;
                const active = game.enemies.filter(e => e.active);
                if (active.length > 0) {
                    const e = active[Math.floor(Math.random() * active.length)];
                    e.takeDamage(Math.round(dmg / 3), 0, 0, game, true);
                    game.particles.spawn(e.x, e.y, '#c084fc', 8, 90, 0.3, 4);
                }
            }, i * 70);
        }
        game.showNotification('🌑 [그림자 분신 환영살] 3개의 잔영 분신이 사방에서 적들을 난도질합니다!');
    }

    // ========================================================================
    // ✨ UNIVERSAL CASTING IMPLEMENTATIONS
    // ========================================================================
    castSwordBeam(game) {
        sounds.playSwordBeam();
        const buffMult = (this.buffTimer > 0 ? 1.4 : 1.0) * (this.critPotionTimer > 0 ? 2.0 : 1.0);
        const dmg = Math.round(this.attackPower * 2.8 * buffMult);
        const vx = Math.cos(this.facingAngle) * 540;
        const vy = Math.sin(this.facingAngle) * 540;
        game.projectiles.push(new Projectile(this.x, this.y, vx, vy, dmg, 520, 'sword_beam', true));
    }

    castParry(game) {
        this.parryActiveTimer = 1.0;
        sounds.playShield();
        game.particles.spawn(this.x, this.y, '#60a5fa', 16, 110, 0.35, 5);
        game.showNotification('🛡️ 신성 방패 전개! (1.0초간 반격 대기)');
    }

    castSmash(game) {
        sounds.playSlam();
        game.camera.shake(0.35, 12);
        const buffMult = (this.buffTimer > 0 ? 1.4 : 1.0) * (this.critPotionTimer > 0 ? 2.0 : 1.0);
        const dmg = Math.round(this.attackPower * 4.2 * buffMult);
        const slamX = this.x + Math.cos(this.facingAngle) * 45;
        const slamY = this.y + Math.sin(this.facingAngle) * 45;

        game.particles.spawn(slamX, slamY, '#f59e0b', 24, 140, 0.45, 6);
        game.enemies.forEach(e => {
            if (e.active && Math.hypot(e.x - slamX, e.y - slamY) <= 75) {
                e.takeDamage(dmg, Math.cos(this.facingAngle) * 180, Math.sin(this.facingAngle) * 180, game, true);
                e.stunTimer = 2.0;
            }
        });
    }

    castUltimate(game) {
        this.castHeavenSplitter(game);
    }

    castFrostNova(game) {
        this.castGlacialArrow(game);
    }

    castFireball(game) {
        this.castMeteorStrike(game);
    }

    castBlessing(game) {
        sounds.playBlessing();
        this.buffTimer = 10.0;
        game.particles.spawn(this.x, this.y, '#facc15', 20, 100, 0.6, 5);
        game.showNotification('✨ [나태의 가호] 10초간 이동속도 +30%, 치명타율 +30% 버프 부여!');
    }

    castPrayer(game) {
        sounds.playHeal();
        const healAmt = Math.round(this.maxHp * 0.35);
        this.hp = Math.min(this.maxHp, this.hp + healAmt);
        game.particles.spawn(this.x, this.y, '#4ade80', 25, 120, 0.7, 5);
        game.particles.spawnDamageNumber(this.x, this.y, `+${healAmt} HP`, '#4ade80', true);
        game.showNotification('💖 [안식의 기도] 체력 35% 즉시 회복!');
    }

    castShadowStep(game) {
        this.castFatalBleed(game);
    }

    castTimeStop(game) {
        sounds.playUltimate();
        this.timeStopTimer = 3.5;
        game.particles.spawn(this.x, this.y, '#a855f7', 30, 200, 0.8, 6);
        game.camera.shake(0.3, 10);
        game.showNotification('⏳ [시간 감속] 3.5초간 모든 몬스터의 시간이 80% 느려집니다!');
    }

    takeDamage(amount, kx, ky, game) {
        if (this.invulnerableTimer > 0) return;

        // 🪄 Mage [마나 실드] 70% 피해 흡수 & 30% 마나 변환 환원
        if (this.manaShieldTimer > 0) {
            const absorbed = Math.round(amount * 0.70);
            amount -= absorbed;
            this.mp = Math.min(this.maxMp, this.mp + Math.round(absorbed * 0.30));
            game.particles.spawnDamageNumber(this.x, this.y - 18, `🛡️ -${absorbed} (마나 실드)`, '#38bdf8', true);
            sounds.playShield();
        }

        // ⚔️ Warrior [불굴의 백수 투기] (Lv 50+): HP 30% 이하 시 받는 피해 25% 감소
        if (this.level >= 50 && this.getWeaponType() === 'sword' && this.hp <= this.maxHp * 0.30) {
            amount = Math.round(amount * 0.75);
        }

        if (this.parryActiveTimer > 0) {
            sounds.playShield();
            game.camera.shake(0.2, 9);
            game.particles.spawnDamageNumber(this.x, this.y, 'PARRY!', '#38bdf8', true);
            this.invulnerableTimer = 0.5;

            game.enemies.forEach(e => {
                if (e.active && Math.hypot(e.x - this.x, e.y - this.y) <= 90) {
                    e.takeDamage(this.attackPower * 2.0, (e.x - this.x) * 4, (e.y - this.y) * 4, game, true);
                    e.stunTimer = 2.0;
                }
            });
            return;
        }

        this.hp -= amount;
        this.invulnerableTimer = 0.45;
        this.knockback.vx = kx;
        this.knockback.vy = ky;

        sounds.playHit();
        game.camera.shake(0.2, 7);
        game.particles.spawn(this.x, this.y, '#ef4444', 9, 85, 0.3, 4);
        game.particles.spawnDamageNumber(this.x, this.y, `-${amount}`, '#f87171');

        if (this.hp <= 0) {
            this.hp = 160;
            game.onPlayerDeath();
        }
    }

    gainExp(amount, game) {
        this.exp += amount;
        game.particles.spawnDamageNumber(this.x, this.y, `+${amount} EXP`, '#c084fc');

        if (this.exp >= this.maxExp) {
            this.exp -= this.maxExp;
            this.level++;
            this.maxExp = Math.round(this.maxExp * 1.55);
            this.baseHp += 35;
            this.baseMp += 25;
            this.baseAttack += 8;
            this.recalculateStats();
            this.hp = this.maxHp;
            this.mp = this.maxMp;

            sounds.playLevelUp();
            game.camera.shake(0.3, 10);
            game.particles.spawn(this.x, this.y, '#fbbf24', 28, 150, 0.8, 6);
            game.particles.spawnDamageNumber(this.x, this.y, 'LEVEL UP!', '#facc15', true);
        }
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.stealthTimer > 0) {
            ctx.globalAlpha = 0.35;
        } else if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 60) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        // Mana shield bubble
        if (this.manaShieldTimer > 0) {
            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(0, 0, 24, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
            ctx.fill();
            ctx.restore();
        }

        // 부드러운 접촉 그림자
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(3, 14, 17, 7, Math.PI / 8, 0, Math.PI * 2);
        ctx.fill();

        // 후광 오라
        const auraGrad = ctx.createRadialGradient(0, 0, 6, 0, 0, 80);
        auraGrad.addColorStop(0, 'rgba(254, 240, 138, 0.32)');
        auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 80, 0, Math.PI * 2);
        ctx.fill();

        // 1. 역동적인 물리 망토 (Dynamic Flowing Cape)
        ctx.save();
        const capeSway = Math.sin(this.capeWave) * 4;
        const capeAngle = this.facingAngle + Math.PI;
        ctx.rotate(capeAngle);
        const isCelestial = this.equipment.armor === 'armor_celestial';
        const isFrost = this.equipment.armor === 'armor_frost';
        const isDragon = this.equipment.armor === 'armor_dragon';
        const isAbyss = this.equipment.armor === 'armor_abyss';

        ctx.fillStyle = isCelestial ? '#fef08a' : (isFrost ? '#38bdf8' : (isDragon ? '#ef4444' : (isAbyss ? '#581c87' : '#991b1b')));
        ctx.beginPath();
        ctx.moveTo(-7, 2);
        ctx.lineTo(-12 + capeSway, 18);
        ctx.lineTo(12 + capeSway, 18);
        ctx.lineTo(7, 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        const bounce = (this.state === 'move') ? Math.sin(this.walkAnimTimer) * 2.5 : 0;

        // 2. 갑옷 본체 (4K Plate Armor Body)
        ctx.fillStyle = isCelestial ? '#e0e7ff' : (isFrost ? '#0284c7' : (isAbyss ? '#0f172a' : (isDragon ? '#701a75' : '#475569')));
        ctx.fillRect(-9, -4 + bounce, 18, 16);

        ctx.fillStyle = isCelestial ? '#facc15' : (isFrost ? '#7dd3fc' : (isAbyss ? '#38bdf8' : (isDragon ? '#f43f5e' : '#94a3b8')));
        ctx.fillRect(-7, -2 + bounce, 14, 12);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-3, -4 + bounce, 6, 6);

        // 견갑
        ctx.fillStyle = isCelestial ? '#facc15' : '#cbd5e1';
        ctx.fillRect(-12, -7 + bounce, 4, 8);
        ctx.fillRect(8, -7 + bounce, 4, 8);

        // 3. 투구 & 머리 장식 (Helmet & Visor Glint)
        ctx.fillStyle = isCelestial ? '#f8fafc' : '#334155';
        ctx.beginPath();
        ctx.arc(0, -12 + bounce, 10, 0, Math.PI * 2);
        ctx.fill();

        // 투구 뿔 / 깃털 / 왕관
        if (isCelestial) {
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, -22 + bounce, 6, 0, Math.PI * 2); ctx.stroke();
        } else if (isDragon) {
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(-6, -16 + bounce); ctx.lineTo(-12, -26 + bounce); ctx.lineTo(-3, -16 + bounce);
            ctx.moveTo(6, -16 + bounce); ctx.lineTo(12, -26 + bounce); ctx.lineTo(3, -16 + bounce);
            ctx.fill();
        } else if (isFrost) {
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.moveTo(0, -16 + bounce); ctx.lineTo(0, -26 + bounce); ctx.lineTo(4, -18 + bounce);
            ctx.fill();
        } else {
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.ellipse(0, -21 + bounce, 3, 6, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // 바이저 안광
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-6, -14 + bounce, 12, 4);
        ctx.fillStyle = isCelestial ? '#facc15' : (isFrost ? '#7dd3fc' : '#38bdf8');
        if (this.facing === 'down') ctx.fillRect(-4, -13 + bounce, 8, 2);
        else if (this.facing === 'left') ctx.fillRect(-5, -13 + bounce, 4, 2);
        else if (this.facing === 'right') ctx.fillRect(1, -13 + bounce, 4, 2);

        // 4. 무기 렌더링 & 이펙트 (4대 백수 직업 고유 무기 동적 비주얼 렌더링)
        ctx.save();
        const wType = this.getWeaponType();
        const wId = this.equipment ? this.equipment.weapon : 'sword_iron';
        const isAttacking = (this.state === 'attack');

        if (wType === 'bow') {
            // 🏹 ARCHER: Compact sleek bow with curved limbs, bowstring, and glowing nocked arrow
            const bowAngle = this.facingAngle + (isAttacking && this.attackDuration > 0 ? (this.attackTimer / this.attackDuration - 0.5) * 0.4 : 0);
            const bowDist = 11;
            const bx = Math.cos(bowAngle) * bowDist;
            const by = Math.sin(bowAngle) * bowDist + bounce;

            ctx.translate(bx, by);
            ctx.rotate(bowAngle);

            let limbColor = '#854d0e';
            let trimColor = '#d97706';
            let glowColor = '#fde047';
            if (wId === 'bow_wind_sniper') {
                limbColor = '#059669'; trimColor = '#34d399'; glowColor = '#6ee7b7';
            } else if (wId === 'bow_celestial_judgment') {
                limbColor = '#eab308'; trimColor = '#ffffff'; glowColor = '#38bdf8';
            } else if (wId === 'bow_magma_flare') {
                limbColor = '#dc2626'; trimColor = '#f97316'; glowColor = '#fef08a';
            } else if (wId === 'bow_elven_wind') {
                limbColor = '#16a34a'; trimColor = '#86efac'; glowColor = '#bbf7d0';
            }

            // Sleek Arched Bow Limbs (Proportional to character)
            ctx.strokeStyle = limbColor;
            ctx.lineWidth = 2.2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(0, 0, 9.5, -Math.PI / 2.2, Math.PI / 2.2);
            ctx.stroke();

            // Decorative Trim
            ctx.strokeStyle = trimColor;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(0, 0, 9.5, -Math.PI / 3, Math.PI / 3);
            ctx.stroke();

            // Dynamic Bowstring
            const stringPull = isAttacking ? -5 : 0;
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(Math.cos(-Math.PI / 2.2) * 9.5, Math.sin(-Math.PI / 2.2) * 9.5);
            ctx.lineTo(stringPull, 0);
            ctx.lineTo(Math.cos(Math.PI / 2.2) * 9.5, Math.sin(Math.PI / 2.2) * 9.5);
            ctx.stroke();

            // Nocked Arrow Shaft
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(stringPull, -0.75, 11, 1.5);
            // Arrow Head
            ctx.fillStyle = glowColor;
            ctx.beginPath();
            ctx.moveTo(stringPull + 11, -2);
            ctx.lineTo(stringPull + 14, 0);
            ctx.lineTo(stringPull + 11, 2);
            ctx.closePath();
            ctx.fill();

            // Bow Handle
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(8.5, -1.5, 2, 3);

        } else if (wType === 'staff') {
            // 🪄 MAGE: Mystical Staff with Pulsating Radiant Crystal Orb
            const staffAngle = this.facingAngle + (isAttacking && this.attackDuration > 0 ? (this.attackTimer / this.attackDuration - 0.5) * 1.8 : 0);
            const staffDist = 13;
            const sx = Math.cos(staffAngle) * staffDist;
            const sy = Math.sin(staffAngle) * staffDist + bounce;

            ctx.translate(sx, sy);
            ctx.rotate(staffAngle + Math.PI / 4);

            let shaftColor = '#78350f';
            let orbColor = '#38bdf8';
            let headTrim = '#facc15';
            if (wId === 'staff_arcane_sage') {
                shaftColor = '#4c1d95'; orbColor = '#c084fc'; headTrim = '#e879f9';
            } else if (wId === 'staff_celestial_god') {
                shaftColor = '#facc15'; orbColor = '#ffffff'; headTrim = '#38bdf8';
            } else if (wId === 'staff_frost_orb') {
                shaftColor = '#0369a1'; orbColor = '#7dd3fc'; headTrim = '#e0f2fe';
            } else if (wId === 'staff_abyss_caller') {
                shaftColor = '#0f766e'; orbColor = '#2dd4bf'; headTrim = '#99f6e4';
            }

            // Staff Shaft
            ctx.fillStyle = shaftColor;
            ctx.fillRect(-1.5, -12, 3, 20);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-1, 3, 2, 4);

            // Gilded Ring Head
            ctx.strokeStyle = headTrim;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(0, -13, 4.5, 0, Math.PI * 2);
            ctx.stroke();

            // Pulsating Magic Crystal Orb
            const orbPulse = Math.sin(Date.now() / 150) * 0.8;
            ctx.fillStyle = orbColor;
            ctx.beginPath();
            ctx.arc(0, -13, 3.5 + orbPulse, 0, Math.PI * 2);
            ctx.fill();

            // Core Glint
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-0.8, -13.8, 1.2, 0, Math.PI * 2);
            ctx.fill();

            if (isAttacking) {
                ctx.strokeStyle = orbColor;
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.arc(0, -13, 7, 0, Math.PI * 2);
                ctx.stroke();
            }

        } else if (wType === 'dagger') {
            // 🗡️ ROGUE: Dual Reverse-Grip Assassination Daggers
            const daggerAngle = this.facingAngle + (isAttacking && this.attackDuration > 0 ? (this.attackTimer / this.attackDuration - 0.5) * 3.5 : 0);
            const daggerDist = 12;
            const dx = Math.cos(daggerAngle) * daggerDist;
            const dy = Math.sin(daggerAngle) * daggerDist + bounce;

            ctx.translate(dx, dy);
            ctx.rotate(daggerAngle + Math.PI / 4);

            let bladeColor = '#cbd5e1';
            let edgeColor = '#f8fafc';
            let handleColor = '#78350f';
            if (wId === 'dagger_shadow_assassin') {
                bladeColor = '#0f172a'; edgeColor = '#ef4444'; handleColor = '#334155';
            } else if (wId === 'dagger_void_reaper') {
                bladeColor = '#3b0764'; edgeColor = '#38bdf8'; handleColor = '#581c87';
            } else if (wId === 'dagger_venom_viper') {
                bladeColor = '#14532d'; edgeColor = '#4ade80'; handleColor = '#15803d';
            } else if (wId === 'dagger_emerald_fang') {
                bladeColor = '#065f46'; edgeColor = '#6ee7b7'; handleColor = '#047857';
            }

            // Main Blade
            ctx.fillStyle = bladeColor;
            ctx.beginPath();
            ctx.moveTo(-1.5, 0);
            ctx.lineTo(1.5, 0);
            ctx.lineTo(2, -10);
            ctx.lineTo(0, -13);
            ctx.lineTo(-2, -10);
            ctx.closePath();
            ctx.fill();

            // Razor Edge
            ctx.fillStyle = edgeColor;
            ctx.beginPath();
            ctx.moveTo(0, -13);
            ctx.lineTo(1.5, -10);
            ctx.lineTo(0, 0);
            ctx.closePath();
            ctx.fill();

            // Guard & Grip
            ctx.fillStyle = '#facc15';
            ctx.fillRect(-3.5, 0, 7, 1.5);
            ctx.fillStyle = handleColor;
            ctx.fillRect(-1, 1.5, 2, 3.5);

            // Off-hand Secondary Dagger
            ctx.save();
            ctx.translate(-7, 6);
            ctx.rotate(Math.PI / 2.3);
            ctx.fillStyle = bladeColor;
            ctx.beginPath();
            ctx.moveTo(-1, 0);
            ctx.lineTo(1, 0);
            ctx.lineTo(1.5, -7);
            ctx.lineTo(0, -9);
            ctx.lineTo(-1.5, -7);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = edgeColor;
            ctx.fillRect(0, -7, 1, 7);
            ctx.fillStyle = '#facc15';
            ctx.fillRect(-2.5, 0, 5, 1);
            ctx.fillStyle = handleColor;
            ctx.fillRect(-0.75, 1, 1.5, 3);
            ctx.restore();

        } else {
            // ⚔️ WARRIOR: Greatsword & Broadsword with Elemental Hues
            const swordAngle = this.facingAngle + (isAttacking && this.attackDuration > 0 ? (this.attackTimer / this.attackDuration - 0.5) * 2.8 : 0);
            const swordDist = 13;
            const sx = Math.cos(swordAngle) * swordDist;
            const sy = Math.sin(swordAngle) * swordDist + bounce;

            ctx.translate(sx, sy);
            ctx.rotate(swordAngle + Math.PI / 4);

            let bladeColor = '#f8fafc';
            let coreColor = '#cbd5e1';
            let guardColor = '#78350f';
            let pommelColor = '#facc15';

            if (wId === 'sword_dragon_overlord' || wId === 'sword_dragon') {
                bladeColor = '#ef4444'; coreColor = '#fbbf24'; guardColor = '#7f1d1d'; pommelColor = '#f59e0b';
            } else if (wId === 'sword_celestial') {
                bladeColor = '#facc15'; coreColor = '#ffffff'; guardColor = '#fef08a'; pommelColor = '#38bdf8';
            } else if (wId === 'sword_frost') {
                bladeColor = '#38bdf8'; coreColor = '#e0f2fe'; guardColor = '#0284c7'; pommelColor = '#7dd3fc';
            } else if (wId === 'sword_flame') {
                bladeColor = '#f97316'; coreColor = '#fef08a'; guardColor = '#9a3412'; pommelColor = '#dc2626';
            } else if (wId === 'sword_shadow' || wId === 'sword_void') {
                bladeColor = '#581c87'; coreColor = '#c084fc'; guardColor = '#1e1b4b'; pommelColor = '#a855f7';
            } else if (wId === 'sword_emerald') {
                bladeColor = '#10b981'; coreColor = '#a7f3d0'; guardColor = '#047857'; pommelColor = '#34d399';
            } else if (wId === 'sword_lazy_god') {
                bladeColor = '#ec4899'; coreColor = '#fdf2f8'; guardColor = '#be185d'; pommelColor = '#f472b6';
            }

            // Blade body
            ctx.fillStyle = bladeColor;
            ctx.beginPath();
            ctx.moveTo(-2, 0);
            ctx.lineTo(2, 0);
            ctx.lineTo(2, -13);
            ctx.lineTo(0, -16);
            ctx.lineTo(-2, -13);
            ctx.closePath();
            ctx.fill();

            // Fuller / Inner Blade Glow
            ctx.fillStyle = coreColor;
            ctx.beginPath();
            ctx.moveTo(-1, 0);
            ctx.lineTo(1, 0);
            ctx.lineTo(1, -12);
            ctx.lineTo(0, -14.5);
            ctx.lineTo(-1, -12);
            ctx.closePath();
            ctx.fill();

            // Crossguard & Hilt
            ctx.fillStyle = guardColor;
            ctx.fillRect(-5, 0, 10, 2);
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-1, 2, 2, 4);
            ctx.fillStyle = pommelColor;
            ctx.beginPath();
            ctx.arc(0, 7, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();

        ctx.restore();

        // 5. 머리 위 실시간 말풍선 렌더링
        this.renderChatBubble(ctx);
    }

    setChatBubble(text) {
        if (!text) return;
        this.chatBubble = {
            text: String(text).slice(0, 60),
            timer: 4.5
        };
    }

    renderChatBubble(ctx) {
        if (!this.chatBubble || this.chatBubble.timer <= 0 || !this.chatBubble.text) return;

        ctx.save();
        ctx.translate(this.x, this.y);

        const bounce = (this.state === 'move') ? Math.sin(this.walkAnimTimer) * 2.5 : 0;
        const bubbleY = -56 + bounce;

        // Fading out in the last 0.8 seconds
        const alpha = Math.min(1, this.chatBubble.timer / 0.8);
        ctx.globalAlpha = alpha;

        ctx.font = 'bold 12px Pretendard, -apple-system, sans-serif';
        const tw = Math.min(220, ctx.measureText(this.chatBubble.text).width);
        const bw = tw + 18;
        const bh = 22;

        // Bubble Body (Glassmorphism rounded rectangle)
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.roundRect(-bw / 2, bubbleY - bh, bw, bh, 6);
        ctx.fill();
        ctx.stroke();

        // Bubble Pointer Arrow (Bottom Tail)
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.beginPath();
        ctx.moveTo(-4, bubbleY);
        ctx.lineTo(0, bubbleY + 6);
        ctx.lineTo(4, bubbleY);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.stroke();

        // Chat Text
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.fillText(this.chatBubble.text, 0, bubbleY - 7);

        ctx.restore();
    }
}
