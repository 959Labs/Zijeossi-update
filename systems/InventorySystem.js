// ============================================================================
// InventorySystem - Equipment, 20-Slot Bag, Consumables & Blacksmith Forge (Bilingual)
// ============================================================================

class InventorySystem {
    constructor(game) {
        this.game = game;
        this.bagSelectedIndex = 0;
        this.forgeSelectedIndex = 0;
    }

    toggleInventory() {
        this.game.isInventoryOpen = !this.game.isInventoryOpen;
        const modal = document.getElementById('inventoryModal');
        if (modal) {
            if (this.game.isInventoryOpen) {
                this.bagSelectedIndex = 0;
                this.updateInventoryUI();
                modal.classList.remove('hidden');
            } else {
                modal.classList.add('hidden');
            }
        }
    }

    closeInventory() {
        this.game.isInventoryOpen = false;
        const modal = document.getElementById('inventoryModal');
        if (modal) modal.classList.add('hidden');
    }

    updateInventoryUI() {
        const isEn = (typeof getLanguage === 'function' && getLanguage() === 'en');

        ['weapon', 'armor', 'accessory'].forEach(slot => {
            const el = document.getElementById(`slotEquip_${slot}`);
            if (!el) return;
            const itemId = this.game.player.equipment[slot];
            const upLevel = this.game.player.upgradeLevels[slot] || 0;
            if (itemId && ITEM_DB[itemId]) {
                const item = ITEM_DB[itemId];
                const iName = typeof tData === 'function' ? tData(item, 'name') : item.name;
                el.innerHTML = `
                    <div class="item-card ${item.rarity}" onclick="game.player.unequipItem('${slot}', game)">
                        <span class="item-icon">${item.icon}</span>
                        <span class="item-name">${iName} ${upLevel > 0 ? `<strong style="color:#facc15;">+${upLevel}</strong>` : ''}</span>
                    </div>
                `;
            } else {
                let slotLabel = slot === 'weapon' ? '무기' : (slot === 'armor' ? '갑옷' : '장신구');
                if (isEn) slotLabel = slot === 'weapon' ? 'Weapon' : (slot === 'armor' ? 'Armor' : 'Accessory');
                el.innerHTML = `<span class="empty-slot-label">${slotLabel}</span>`;
            }
        });

        const bagContainer = document.getElementById('bagGrid');
        if (bagContainer) {
            bagContainer.innerHTML = '';
            for (let i = 0; i < 20; i++) {
                const slotDiv = document.createElement('div');
                slotDiv.className = `bag-slot ${i === this.bagSelectedIndex && this.game.isInventoryOpen ? 'keyboard-focused' : ''}`;

                const slot = this.game.player.inventory[i];
                const itemId = slot ? slot.id : null;
                if (itemId && ITEM_DB[itemId]) {
                    const item = ITEM_DB[itemId];
                    const count = slot.count || 1;
                    slotDiv.className = `bag-slot has-item ${item.rarity} ${i === this.bagSelectedIndex && this.game.isInventoryOpen ? 'keyboard-focused' : ''}`;
                    slotDiv.innerHTML = `<span class="item-icon">${item.icon}</span>${count > 1 ? `<span class="item-count">${count}</span>` : ''}`;
                    slotDiv.onclick = () => {
                        this.bagSelectedIndex = i;
                        this.updateInventoryUI();
                        this.useOrEquipBagItem(i);
                    };
                } else {
                    slotDiv.onclick = () => {
                        this.bagSelectedIndex = i;
                        this.updateInventoryUI();
                    };
                }
                bagContainer.appendChild(slotDiv);
            }
        }

        const detailCard = document.getElementById('itemDetailCard');
        if (detailCard) {
            const focusedSlot = this.game.player.inventory[this.bagSelectedIndex];
            const focusedItemKey = focusedSlot ? focusedSlot.id : null;
            if (focusedItemKey && ITEM_DB[focusedItemKey]) {
                const item = ITEM_DB[focusedItemKey];
                let statText = '';
                if (item.atk) statText += isEn ? `⚔️ Attack +${item.atk} ` : `⚔️ 공격력 +${item.atk} `;
                if (item.hp) statText += isEn ? `❤️ Max HP +${item.hp} ` : `❤️ 최대 체력 +${item.hp} `;
                if (item.mp) statText += isEn ? `💧 Max MP +${item.mp} ` : `💧 최대 마나 +${item.mp} `;
                if (item.spd) statText += isEn ? `💨 Speed +${item.spd} ` : `💨 이동속도 +${item.spd} `;
                if (!statText) statText = isEn ? 'Consumable Item' : '소비 아이템';

                const iName = typeof tData === 'function' ? tData(item, 'name') : item.name;
                const iDesc = typeof tData === 'function' ? tData(item, 'desc') : item.desc;
                const actionLabel = item.slot === 'consumable' ? (isEn ? 'Use' : '사용') : (isEn ? 'Equip' : '장착');
                const priceLabel = isEn ? 'Sell Price' : '판매가';

                detailCard.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <div class="detail-header-row">
                            <span class="detail-large-icon">${item.icon}</span>
                            <div class="detail-title-col">
                                <div class="detail-name">${iName}</div>
                                <span class="detail-rarity-tag ${item.rarity}">${item.rarity.toUpperCase()}</span>
                            </div>
                        </div>
                        <div class="detail-stats-list">${statText}</div>
                        <div class="detail-desc-text">${iDesc}</div>
                    </div>
                    <div class="detail-footer-actions">
                        <span>${priceLabel}: <strong style="color: #facc15;">${item.sellPrice || 10} G</strong></span>
                        <span>[ENTER] <strong>${actionLabel}</strong></span>
                    </div>
                `;
            } else {
                detailCard.innerHTML = `<div class="detail-empty-state">${isEn ? 'Selected slot is empty.' : '선택된 슬롯이 비어 있습니다.'}</div>`;
            }
        }

        const sAtk = document.getElementById('statSummaryAtk');
        if (sAtk) sAtk.innerText = this.game.player.attackPower;
        const sHp = document.getElementById('statSummaryHp');
        if (sHp) sHp.innerText = this.game.player.maxHp;
        const sMp = document.getElementById('statSummaryMp');
        if (sMp) sMp.innerText = this.game.player.maxMp;
        const sSpd = document.getElementById('statSummarySpd');
        if (sSpd) sSpd.innerText = this.game.player.speed;
        const sGold = document.getElementById('invGold');
        if (sGold) sGold.innerText = `${this.game.player.gold} G`;

        const classBadgeEl = document.getElementById('playerClassBadge');
        const classDescEl = document.getElementById('playerClassDesc');
        if (classBadgeEl) {
            const cInfo = this.game.player.getClassInfo();
            classBadgeEl.className = `player-class-badge ${cInfo.css}`;
            classBadgeEl.innerText = `${cInfo.name}`;
            if (classDescEl) classDescEl.innerText = `• ${cInfo.desc}`;
        }
        const trialCoinsEl = document.getElementById('invTrialCoins');
        if (trialCoinsEl) {
            trialCoinsEl.innerText = `${this.game.trialCoins || 0} 🪙`;
        }
    }

    useOrEquipBagItem(index) {
        const isEn = (typeof getLanguage === 'function' && getLanguage() === 'en');
        const slot = this.game.player.inventory[index];
        if (!slot) return;
        const itemId = slot.id;
        if (!itemId || !ITEM_DB[itemId]) return;

        const item = ITEM_DB[itemId];
        if (item.slot === 'consumable') {
            if (itemId === 'potion_hp') this.game.player.usePotion('hp', this.game);
            else if (itemId === 'potion_mp') this.game.player.usePotion('mp', this.game);
            else if (itemId === 'potion_buff') this.game.player.usePotion('buff', this.game);
            else if (itemId === 'potion_herb_tea') {
                this.game.player.hp = Math.min(this.game.player.maxHp, this.game.player.hp + 120);
                this.game.player.mp = Math.min(this.game.player.maxMp, this.game.player.mp + 120);
                this.game.player.buffTimer = Math.max(this.game.player.buffTimer, 30);
                sounds.playPotion();
                this.game.particles.spawn(this.game.player.x, this.game.player.y, '#22c55e', 20, 100, 0.6, 5);
                this.game.showNotification(isEn ? '🍵 [Specialty] Jade Herbal Brew restored 120 HP/MP and boosted Speed!' : '🍵 [특산] 비취 약초 달인 물로 HP/MP 120 회복 및 이속 강화!');
            } else if (itemId === 'potion_cactus_juice') {
                this.game.player.shrineBuffTimer = Math.max(this.game.player.shrineBuffTimer, 60);
                this.game.player.buffTimer = Math.max(this.game.player.buffTimer, 60);
                sounds.playPotion();
                this.game.particles.spawn(this.game.player.x, this.game.player.y, '#eab308', 20, 100, 0.6, 5);
                this.game.showNotification(isEn ? '🌵 [Specialty] Oasis Cactus Juice granted Fire Resistance for 60s!' : '🌵 [특산] 오아시스 선인장 즙으로 60초간 화염 저항력 대폭 상승!');
            } else if (itemId === 'potion_hot_chocolate') {
                this.game.player.critPotionTimer = Math.max(this.game.player.critPotionTimer, 90);
                sounds.playPotion();
                this.game.particles.spawn(this.game.player.x, this.game.player.y, '#38bdf8', 20, 100, 0.6, 5);
                this.game.showNotification(isEn ? '☕ [Specialty] Hearthfire Hot Cocoa granted Freeze Immunity for 90s!' : '☕ [특산] 온돌 핫초코로 90초간 빙결 면역 및 공격력 25% 상승!');
            } else if (itemId === 'potion_holy_water') {
                this.game.player.hp = Math.min(this.game.player.maxHp, Math.round(this.game.player.hp + this.game.player.maxHp * 0.8));
                this.game.player.buffTimer = Math.max(this.game.player.buffTimer, 45);
                sounds.playPotion();
                this.game.particles.spawn(this.game.player.x, this.game.player.y, '#fbbf24', 25, 120, 0.8, 6);
                this.game.showNotification(isEn ? '🧪 [Specialty] Crusader Holy Water restored 80% HP and smites demons!' : '🧪 [특산] 성수 엘릭서로 체력 80% 회복 및 마족/언데드 특공 버프 부여!');
            } else if (itemId === 'potion_ambrosia') {
                this.game.player.hp = this.game.player.maxHp;
                this.game.player.mp = this.game.player.maxMp;
                this.game.player.invulnerableTimer = Math.max(this.game.player.invulnerableTimer, 45);
                sounds.playJackpot();
                this.game.particles.spawn(this.game.player.x, this.game.player.y, '#f472b6', 35, 160, 1.0, 7);
                this.game.showNotification(isEn ? '🍷 [Specialty] Celestial Ambrosia fully refilled HP/MP with 45s Aegis!' : '🍷 [특산] 천상의 암브로시아로 HP/MP 100% 충전 및 45초간 무적 보호막 발동!');
            } else if (itemId === 'potion_trial_elixir') {
                this.game.player.buffTimer = Math.max(this.game.player.buffTimer, 60);
                this.game.player.speedBoostTimer = Math.max(this.game.player.speedBoostTimer, 60);
                sounds.playJackpot();
                this.game.particles.spawn(this.game.player.x, this.game.player.y, '#38bdf8', 30, 140, 0.8, 6);
                this.game.showNotification(isEn ? '🧪 [Trial Elixir] +100% Attack & Cooldown Reduction for 60s!' : '🧪 [시련의 초월 영약] 60초간 공격력 2배 및 쿨다운 대폭 단축 발동!');
            } else if (itemId === 'potion_god_trial') {
                this.game.player.hp = this.game.player.maxHp;
                this.game.player.mp = this.game.player.maxMp;
                this.game.player.invulnerableTimer = Math.max(this.game.player.invulnerableTimer, 45);
                sounds.playUltimate();
                this.game.particles.spawn(this.game.player.x, this.game.player.y, '#facc15', 40, 180, 1.2, 8);
                this.game.showNotification(isEn ? '🌟 [Omnipotent Nectar] 100% Full Refill & 45s Immortality!' : '🌟 [시련의 전지전능 영약] 완충 및 45초간 불사 상태 돌입!');
            } else if (itemId === 'scroll_town_return') {
                if (this.game.currentZone === 'village') {
                    this.game.showNotification(isEn ? 'Already in Peaceful Starting Village!' : '이미 시작의 마을 안전지대에 머물고 있습니다!');
                    return;
                }
                sounds.playMagic();
                this.game.particles.spawn(this.game.player.x, this.game.player.y, '#38bdf8', 35, 140, 1.2, 6);
                this.game.showNotification(isEn ? '🌀 [Town Return Scroll] Casting teleportation spell...!' : '🌀 [마을 귀환 주문서] 고대 공간 전이 마법을 시전합니다...!');
                if (this.game.isInventoryOpen) this.toggleInventory();

                setTimeout(() => {
                    this.game.switchZone('village', true, 2100, 2100);
                    sounds.playLevelUp();
                    this.game.showNotification(isEn ? '✨ Teleported safely to Starting Village!' : '✨ 시작의 마을(2100, 2100)로 안전하게 귀환했습니다!');
                }, 400);
            }
            this.game.player.removeItemFromInventory(itemId, 1);
            this.updateInventoryUI();
        } else {
            this.game.player.equipItem(itemId, this.game);
        }
    }

    toggleForge() {
        this.game.isForgeOpen = !this.game.isForgeOpen;
        const modal = document.getElementById('forgeModal');
        if (modal) {
            if (this.game.isForgeOpen) {
                this.forgeSelectedIndex = 0;
                this.updateForgeUI();
                modal.classList.remove('hidden');
            } else {
                modal.classList.add('hidden');
            }
        }
    }

    closeForge() {
        this.game.isForgeOpen = false;
        const modal = document.getElementById('forgeModal');
        if (modal) modal.classList.add('hidden');
    }

    updateForgeUI() {
        const isEn = (typeof getLanguage === 'function' && getLanguage() === 'en');
        const fg = document.getElementById('forgeGold');
        if (fg) fg.innerText = `${this.game.player.gold} G`;
        const forgeList = document.getElementById('forgeItemList');
        if (!forgeList) return;

        forgeList.innerHTML = '';
        const equipSlots = [
            {
                key: 'weapon',
                slotTitle: isEn ? '⚔️ Weapon Slot Inheritance Forge' : '⚔️ 무기 슬롯 계승 강화',
                statDesc: isEn ? 'Base Attack +8 permanent' : '기본 공격력 +8 증가'
            },
            {
                key: 'armor',
                slotTitle: isEn ? '🛡️ Armor Slot Inheritance Forge' : '🛡️ 갑옷 슬롯 계승 강화',
                statDesc: isEn ? 'Max HP +35 permanent' : '최대 체력 +35 증가'
            },
            {
                key: 'accessory',
                slotTitle: isEn ? '💍 Accessory Slot Inheritance Forge' : '💍 장신구 슬롯 계승 강화',
                statDesc: isEn ? 'Max MP +20 permanent' : '최대 마나 +20 증가'
            }
        ];

        let focusedElement = null;
        equipSlots.forEach((slot, index) => {
            const itemId = this.game.player.equipment[slot.key];
            const currentLevel = this.game.player.upgradeLevels[slot.key] || 0;
            const cost = (currentLevel + 1) * 80 + 40;
            const isFocused = index === this.forgeSelectedIndex;

            const div = document.createElement('div');
            div.className = `forge-item-card ${currentLevel > 0 ? 'has-level' : ''} ${isFocused ? 'keyboard-focused' : ''}`;

            const upgradeBtnHtml = currentLevel < 10
                ? `<button class="forge-upgrade-btn" onclick="game.upgradeEquipment('${slot.key}', ${cost})">${cost} G ${isEn ? 'Upgrade' : '강화'}</button>`
                : `<span style="color:#facc15; font-weight:800; font-size:11px;">${isEn ? 'MAX REACHED' : 'MAX 달성'}</span>`;

            if (itemId && ITEM_DB[itemId]) {
                const item = ITEM_DB[itemId];
                const iName = typeof tData === 'function' ? tData(item, 'name') : item.name;
                div.innerHTML = `
                    <div class="shop-item-info">
                        <span class="focus-arrow ${isFocused ? 'active' : ''}">${isFocused ? '▶' : '&nbsp;'}</span>
                        <span class="shop-icon">${item.icon}</span>
                        <div>
                            <div class="shop-name">${slot.slotTitle} <strong style="color: #facc15;">+${currentLevel}</strong></div>
                            <div class="shop-desc">${isEn ? 'Equipped' : '착용 중'}: [${iName}] &nbsp;•&nbsp; ${slot.statDesc}</div>
                        </div>
                    </div>
                    ${upgradeBtnHtml}
                `;
            } else {
                div.innerHTML = `
                    <div class="shop-item-info">
                        <span class="focus-arrow ${isFocused ? 'active' : ''}">${isFocused ? '▶' : '&nbsp;'}</span>
                        <span class="shop-icon">✨</span>
                        <div>
                            <div class="shop-name">${slot.slotTitle} <strong style="color: #facc15;">+${currentLevel}</strong></div>
                            <div class="shop-desc">${isEn ? 'Permanent effect even when unequipped' : '미착용 상태에서도 영구 적용'} &nbsp;•&nbsp; ${slot.statDesc}</div>
                        </div>
                    </div>
                    ${upgradeBtnHtml}
                `;
            }
            if (isFocused) {
                focusedElement = div;
            }
            forgeList.appendChild(div);
        });

        if (focusedElement && typeof scrollElementIntoContainerView === 'function') {
            scrollElementIntoContainerView(forgeList, focusedElement);
        }
    }

    upgradeEquipment(slotKey, cost) {
        const isEn = (typeof getLanguage === 'function' && getLanguage() === 'en');
        if (this.game.player.gold < cost) {
            this.game.showNotification(isEn ? '⚠️ Not enough gold to forge!' : '골드가 부족합니다!');
            return;
        }

        this.game.player.gold -= cost;
        this.game.player.upgradeLevels[slotKey] = (this.game.player.upgradeLevels[slotKey] || 0) + 1;
        const newLvl = this.game.player.upgradeLevels[slotKey];

        sounds.playSlam();
        this.game.camera.shake(0.3, 10);
        this.game.particles.spawn(this.game.player.x, this.game.player.y, '#f59e0b', 30, 160, 0.7, 6);
        this.game.particles.spawnDamageNumber(this.game.player.x, this.game.player.y, `+${newLvl} ${isEn ? 'Upgrade Success!' : '강화 성공!'}`, '#facc15', true);

        this.game.player.recalculateStats();
        this.updateForgeUI();
        this.updateInventoryUI();
        this.game.showNotification(isEn ? `✨ Upgrade Successful! (+${newLvl})` : `장비 강화 성공! (+${newLvl} 단계)`);
    }

    handleInput(inp) {
        if (this.game.isInventoryOpen) {
            if (inp.isInventoryPressed() || inp.isInteractPressed()) {
                this.toggleInventory();
                this.game.modalJustClosedThisFrame = true;
                inp.justPressed['KeyI'] = false;
                inp.justPressed['KeyF'] = false;
                sounds.playInteract();
                return;
            }
            if (inp.isJustPressed('ArrowRight')) {
                this.bagSelectedIndex = (this.bagSelectedIndex + 1) % 12;
                this.updateInventoryUI();
                sounds.playInteract();
            }
            if (inp.isJustPressed('ArrowLeft')) {
                this.bagSelectedIndex = (this.bagSelectedIndex - 1 + 12) % 12;
                this.updateInventoryUI();
                sounds.playInteract();
            }
            if (inp.isJustPressed('ArrowDown')) {
                this.bagSelectedIndex = (this.bagSelectedIndex + 4) % 12;
                this.updateInventoryUI();
                sounds.playInteract();
            }
            if (inp.isJustPressed('ArrowUp')) {
                this.bagSelectedIndex = (this.bagSelectedIndex - 4 + 12) % 12;
                this.updateInventoryUI();
                sounds.playInteract();
            }
            if (inp.isEnterPressed()) {
                inp.justPressed['Enter'] = false;
                this.useOrEquipBagItem(this.bagSelectedIndex);
            }
            return;
        }

        if (this.game.isForgeOpen) {
            if (inp.isInteractPressed()) {
                this.toggleForge();
                this.game.modalJustClosedThisFrame = true;
                inp.justPressed['KeyF'] = false;
                sounds.playInteract();
                return;
            }
            if (inp.isJustPressed('ArrowUp')) {
                this.forgeSelectedIndex = Math.max(0, this.forgeSelectedIndex - 1);
                this.updateForgeUI();
                sounds.playInteract();
            }
            if (inp.isJustPressed('ArrowDown')) {
                this.forgeSelectedIndex = Math.min(2, this.forgeSelectedIndex + 1);
                this.updateForgeUI();
                sounds.playInteract();
            }
            if (inp.isEnterPressed()) {
                inp.justPressed['Enter'] = false;
                const slotKeys = ['weapon', 'armor', 'accessory'];
                const slotKey = slotKeys[this.forgeSelectedIndex];
                const currentLevel = this.game.player.upgradeLevels[slotKey] || 0;
                const cost = (currentLevel + 1) * 80 + 40;
                if (this.game.player.equipment[slotKey] && currentLevel < 10) {
                    this.upgradeEquipment(slotKey, cost);
                } else if (!this.game.player.equipment[slotKey]) {
                    this.game.showNotification((typeof getLanguage === 'function' && getLanguage() === 'en') ? 'No equipment equipped in this slot!' : '장착 중인 장비가 없습니다!');
                }
            }
            return;
        }
    }
}
