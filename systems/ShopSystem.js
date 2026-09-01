// ============================================================================
// ShopSystem - Regional Town Specialty Merchants & Trial Tower Shop
// ============================================================================

class ShopSystem {
    constructor(game) {
        this.game = game;
        this.shopTab = 'buy';
        this.shopSelectedIndex = 0;
        this.shopSellSelectedIndex = 0;
        this.trialShopSelectedIndex = 0;

        // shopWares: toggleShop/updateShopUI에서 갱신됨
        this.shopWares = [];

        // trialShopWares: ShopSystem이 단독 소유
        this.trialShopWares = [
            { id: 'bow_wind_sniper', price: 45 },
            { id: 'staff_arcane_sage', price: 45 },
            { id: 'dagger_shadow_assassin', price: 45 },
            { id: 'bow_celestial_judgment', price: 90 },
            { id: 'staff_celestial_god', price: 90 },
            { id: 'dagger_void_reaper', price: 90 },
            { id: 'sword_dragon_overlord', price: 90 },
            { id: 'potion_trial_elixir', price: 15 },
            { id: 'potion_god_trial', price: 25 }
        ];
    }

    getShopWaresForCurrentZone() {
        const baseWares = [
            { id: 'scroll_town_return', price: 35 },
            { id: 'potion_hp', price: 20 },
            { id: 'potion_mp', price: 20 },
            { id: 'potion_buff', price: 40 },
            { id: 'potion_crit', price: 150 },
            { id: 'potion_elixir', price: 90 },
            { id: 'potion_god', price: 350 }
        ];

        let specialties = [];
        if (this.game.currentZone === 'village') {
            specialties = [
                { id: 'sword_iron', price: 100 },
                { id: 'bow_wooden', price: 90 },
                { id: 'staff_apprentice', price: 100 },
                { id: 'dagger_rusty', price: 85 },
                { id: 'potion_herb_tea', price: 35 },
                { id: 'armor_lazy_pajama', price: 180 },
                { id: 'sword_wooden_legend', price: 160 },
                { id: 'ring_clover', price: 200 },
                { id: 'armor_plate', price: 180 },
                { id: 'ring_mana', price: 240 }
            ];
        } else if (this.game.currentZone === 'oasis_town') {
            specialties = [
                { id: 'potion_cactus_juice', price: 75 },
                { id: 'sword_scimitar_gold', price: 580 },
                { id: 'armor_desert_cloak', price: 620 },
                { id: 'ring_mirage_amber', price: 680 },
                { id: 'sword_sand', price: 620 },
                { id: 'armor_pharaoh', price: 850 },
                { id: 'ring_sand', price: 800 }
            ];
        } else if (this.game.currentZone === 'frost_camp') {
            specialties = [
                { id: 'potion_hot_chocolate', price: 120 },
                { id: 'sword_frost_cleaver', price: 1450 },
                { id: 'armor_yeti_fur', price: 1550 },
                { id: 'ring_blizzard_gem', price: 1700 },
                { id: 'sword_frost', price: 1900 },
                { id: 'armor_frost', price: 1900 },
                { id: 'ring_freeze', price: 1800 }
            ];
        } else if (this.game.currentZone === 'citadel_sanctuary') {
            specialties = [
                { id: 'potion_holy_water', price: 200 },
                { id: 'sword_silver_crusader', price: 2900 },
                { id: 'armor_crusader_plate', price: 3100 },
                { id: 'ring_blood_vampire', price: 3300 },
                { id: 'sword_void', price: 5200 },
                { id: 'armor_void', price: 5800 },
                { id: 'ring_void', price: 6200 }
            ];
        } else if (this.game.currentZone === 'sky_haven') {
            specialties = [
                { id: 'potion_ambrosia', price: 500 },
                { id: 'sword_archangel_lance', price: 5600 },
                { id: 'armor_cloud_robe', price: 6200 },
                { id: 'ring_pillow_dream', price: 7800 },
                { id: 'sword_celestial', price: 7500 },
                { id: 'armor_celestial', price: 8200 },
                { id: 'ring_divine', price: 9500 }
            ];
        } else {
            specialties = [
                { id: 'sword_iron', price: 100 },
                { id: 'armor_plate', price: 180 },
                { id: 'ring_mana', price: 240 },
                { id: 'sword_dragon', price: 1350 },
                { id: 'armor_dragon', price: 1300 },
                { id: 'ring_berserk', price: 500 }
            ];
        }

        return [...specialties, ...baseWares];
    }

    toggleShop() {
        this.game.isShopOpen = !this.game.isShopOpen;
        const modal = document.getElementById('shopModal');
        if (modal) {
            if (this.game.isShopOpen) {
                this.shopTab = 'buy';
                this.shopSelectedIndex = 0;
                this.shopSellSelectedIndex = 0;
                const buyList = document.getElementById('shopItemList');
                if (buyList) buyList.scrollTop = 0;
                const sellList = document.getElementById('shopSellList');
                if (sellList) sellList.scrollTop = 0;
                this.updateShopUI();
                modal.classList.remove('hidden');
            } else {
                modal.classList.add('hidden');
            }
        }
    }

    closeShop() {
        this.game.isShopOpen = false;
        const modal = document.getElementById('shopModal');
        if (modal) modal.classList.add('hidden');
    }

    switchShopTab(tab) {
        this.shopTab = tab;
        this.shopSelectedIndex = 0;
        this.shopSellSelectedIndex = 0;
        const buyList = document.getElementById('shopItemList');
        if (buyList) buyList.scrollTop = 0;
        const sellList = document.getElementById('shopSellList');
        if (sellList) sellList.scrollTop = 0;
        sounds.playInteract();
        this.updateShopUI();
    }

    updateShopSelectionHighlight(isBuy) {
        const list = document.getElementById(isBuy ? 'shopItemList' : 'shopSellList');
        if (!list) return;
        const cards = list.querySelectorAll('.shop-item-card');
        const selectedIdx = isBuy ? this.shopSelectedIndex : this.shopSellSelectedIndex;
        let focusedEl = null;

        cards.forEach((card, i) => {
            const isFocused = (i === selectedIdx);
            const arrow = card.querySelector('.focus-arrow');
            if (isFocused) {
                card.classList.add('keyboard-focused');
                if (arrow) {
                    arrow.classList.add('active');
                    arrow.innerHTML = '▶';
                }
                focusedEl = card;
            } else {
                card.classList.remove('keyboard-focused');
                if (arrow) {
                    arrow.classList.remove('active');
                    arrow.innerHTML = '&nbsp;';
                }
            }
        });

        if (focusedEl && typeof scrollElementIntoContainerView === 'function') {
            scrollElementIntoContainerView(list, focusedEl);
        }
    }

    updateShopUI() {
        const sg = document.getElementById('shopGold');
        if (sg) sg.innerText = `${this.game.player.gold} G`;

        const isEn = (typeof getLanguage === 'function' && getLanguage() === 'en');
        const titleEl = document.getElementById('shopModalTitle');
        if (titleEl) {
            if (this.game.currentZone === 'village') titleEl.innerText = isEn ? '🌲 [Starting Village] Herbs & Sloth Wear' : '🌲 [시작의 마을 상점] 약초 & 나태 잠옷';
            else if (this.game.currentZone === 'oasis_town') titleEl.innerText = isEn ? '🏜️ [Oasis Outpost] Scimitars & Cactus Juice' : '🏜️ [사막 오아시스 상점] 모래바람 시미터 & 선인장 즙';
            else if (this.game.currentZone === 'frost_camp') titleEl.innerText = isEn ? '❄️ [Glacial Tavern] Parkas & Hot Cocoa' : '❄️ [설원 전진기지 주막] 방한 장비 & 특제 핫초코';
            else if (this.game.currentZone === 'citadel_sanctuary') titleEl.innerText = isEn ? '🏰 [Crusader Sanctuary] Holy Blades & Water' : '🏰 [기사단 비밀 은신처] 은빛 성검 & 성수 엘릭서';
            else if (this.game.currentZone === 'sky_haven') titleEl.innerText = isEn ? '⚡ [Celestial Haven] Archangel Lance & Pillow' : '⚡ [천공의 구름 안식처] 대천사 광휘창 & 베개 반지';
            else titleEl.innerText = isEn ? "🛒 Traveling Merchant's Outpost" : '🛒 방랑 상인의 만물상';
        }

        const bagSpaceEl = document.getElementById('shopBagSpace');
        const currentCount = this.game.player.inventory.length;

        if (bagSpaceEl) {
            if (currentCount >= 20) {
                bagSpaceEl.classList.add('full');
                bagSpaceEl.innerHTML = isEn ? `⚠️ Bag Full (20 / 20)` : `⚠️ 가방 가득 참 (20 / 20)`;
            } else {
                bagSpaceEl.classList.remove('full');
                bagSpaceEl.innerHTML = isEn ? `🎒 Bag: <strong id="shopBagCount">${currentCount} / 20</strong>` : `🎒 가방: <strong id="shopBagCount">${currentCount} / 20</strong>`;
            }
        }

        const tabBuyBtn = document.getElementById('shopTabBuy');
        const tabSellBtn = document.getElementById('shopTabSell');
        const buyList = document.getElementById('shopItemList');
        const sellList = document.getElementById('shopSellList');

        const activeWares = this.getShopWaresForCurrentZone();
        this.shopWares = activeWares; // ShopSystem이 단독 소유

        if (this.shopTab === 'buy') {
            if (tabBuyBtn) tabBuyBtn.classList.add('active');
            if (tabSellBtn) tabSellBtn.classList.remove('active');
            if (buyList) buyList.classList.remove('hidden');
            if (sellList) sellList.classList.add('hidden');

            if (buyList) {
                const savedScroll = buyList.scrollTop;
                buyList.innerHTML = '';
                let focusedElement = null;

                activeWares.forEach((w, index) => {
                    const item = ITEM_DB[w.id];
                    if (!item) return;
                    const isFocused = index === this.shopSelectedIndex;
                    const iName = typeof tData === 'function' ? tData(item, 'name') : item.name;
                    const iDesc = typeof tData === 'function' ? tData(item, 'desc') : item.desc;
                    const buyBtnText = isEn ? `Buy (${w.price} G)` : `${w.price} G 구매`;

                    const div = document.createElement('div');
                    div.className = `shop-item-card ${item.rarity} ${isFocused ? 'keyboard-focused' : ''}`;
                    div.innerHTML = `
                        <div class="shop-item-info">
                            <span class="focus-arrow ${isFocused ? 'active' : ''}">${isFocused ? '▶' : '&nbsp;'}</span>
                            <span class="shop-icon">${item.icon}</span>
                            <div>
                                <div class="shop-name">${iName}</div>
                                <div class="shop-desc">${iDesc}</div>
                            </div>
                        </div>
                        <button class="shop-buy-btn" onclick="game.buyItem('${w.id}', ${w.price})">${buyBtnText}</button>
                    `;
                    buyList.appendChild(div);

                    if (isFocused) {
                        focusedElement = div;
                    }
                });

                buyList.scrollTop = savedScroll;
                if (focusedElement && typeof scrollElementIntoContainerView === 'function') {
                    scrollElementIntoContainerView(buyList, focusedElement);
                }
            }
        } else {
            if (tabSellBtn) tabSellBtn.classList.add('active');
            if (tabBuyBtn) tabBuyBtn.classList.remove('active');
            if (sellList) sellList.classList.remove('hidden');
            if (buyList) buyList.classList.add('hidden');

            if (sellList) {
                const savedScroll = sellList.scrollTop;
                sellList.innerHTML = '';
                if (this.game.player.inventory.length === 0) {
                    sellList.innerHTML = `<div style="color:#64748b; font-size:13px; text-align:center; padding: 40px 0;">${isEn ? 'No items in backpack to sell.' : '판매할 소지품이 없습니다.'}</div>`;
                    return;
                }

                let focusedElement = null;

                this.game.player.inventory.forEach((slotItem, index) => {
                    const itemId = typeof slotItem === 'object' ? slotItem.id : slotItem;
                    const count = typeof slotItem === 'object' ? slotItem.count : 1;
                    const item = ITEM_DB[itemId];
                    if (!item) return;
                    const isFocused = index === this.shopSellSelectedIndex;
                    const sellVal = item.sellPrice || 10;
                    const iName = typeof tData === 'function' ? tData(item, 'name') : item.name;
                    const iDesc = typeof tData === 'function' ? tData(item, 'desc') : item.desc;
                    const sellBtnText = isEn ? `Sell (+${sellVal} G)` : `+${sellVal} G 판매`;

                    const div = document.createElement('div');
                    div.className = `shop-item-card ${item.rarity} ${isFocused ? 'keyboard-focused' : ''}`;
                    div.innerHTML = `
                        <div class="shop-item-info">
                            <span class="focus-arrow ${isFocused ? 'active' : ''}">${isFocused ? '▶' : '&nbsp;'}</span>
                            <span class="shop-icon">${item.icon}</span>
                            <div>
                                <div class="shop-name">${iName} ${count > 1 ? `<span style="background:#22c55e; color:#0f172a; font-size:11px; font-weight:800; padding:2px 6px; border-radius:10px; margin-left:6px;">x${count}</span>` : ''}</div>
                                <div class="shop-desc">${iDesc}</div>
                            </div>
                        </div>
                        <button class="shop-sell-btn" onclick="game.sellItem(${index})">${sellBtnText}</button>
                    `;
                    sellList.appendChild(div);

                    if (isFocused) {
                        focusedElement = div;
                    }
                });

                sellList.scrollTop = savedScroll;
                if (focusedElement && typeof scrollElementIntoContainerView === 'function') {
                    scrollElementIntoContainerView(sellList, focusedElement);
                }
            }
        }
    }

    buyItem(itemId, price) {
        const isEn = (typeof getLanguage === 'function' && getLanguage() === 'en');
        if (this.game.player.gold < price) {
            sounds.playHit();
            this.game.showNotification(isEn ? '⚠️ Not enough gold!' : '⚠️ 골드가 부족합니다!');
            return;
        }

        const added = this.game.player.addItemToInventory(itemId, 1);
        if (!added) {
            sounds.playHit();
            this.game.showNotification(isEn ? '⚠️ Backpack is full! (Max 20 slots)' : '⚠️ 가방이 가득 찼습니다! (최대 20칸)');
            this.updateShopUI();
            return;
        }

        this.game.player.gold -= price;
        sounds.playCoin();
        this.updateShopUI();
        this.game.updateInventoryUI();
        const it = ITEM_DB[itemId];
        const itName = it ? (typeof tData === 'function' ? tData(it, 'name') : it.name) : itemId;
        this.game.showNotification(isEn ? `🎉 Purchased [${itName}]! (-${price} G)` : `🎉 ${itName}을(를) 구매했습니다! (-${price} G)`);
    }

    sellItem(inventoryIndex) {
        const isEn = (typeof getLanguage === 'function' && getLanguage() === 'en');
        const slotItem = this.game.player.inventory[inventoryIndex];
        if (!slotItem) return;

        const itemId = typeof slotItem === 'object' ? slotItem.id : slotItem;
        const item = ITEM_DB[itemId];
        if (!item) return;

        const sellVal = item.sellPrice || 10;
        this.game.player.gold += sellVal;
        this.game.player.removeItemFromInventory(itemId, 1);
        sounds.playCoin();
        this.game.particles.spawn(this.game.player.x, this.game.player.y, '#facc15', 14, 90, 0.4, 4);

        if (this.shopSellSelectedIndex >= this.game.player.inventory.length) {
            this.shopSellSelectedIndex = Math.max(0, this.game.player.inventory.length - 1);
        }

        this.updateShopUI();
        this.game.updateInventoryUI();
        const itName = typeof tData === 'function' ? tData(item, 'name') : item.name;
        this.game.showNotification(isEn ? `💰 Sold [${itName}] for +${sellVal} G!` : `[판매 완료] ${itName}을(를) 판매하여 +${sellVal} G를 획득했습니다!`);
    }

    toggleTrialShop() {
        this.game.isTrialShopOpen = !this.game.isTrialShopOpen;
        const modal = document.getElementById('trialShopModal');
        if (modal) {
            if (this.game.isTrialShopOpen) {
                this.trialShopSelectedIndex = 0;
                this.updateTrialShopUI();
                modal.classList.remove('hidden');
            } else {
                modal.classList.add('hidden');
            }
        }
    }

    updateTrialShopUI() {
        const isEn = (typeof getLanguage === 'function' && getLanguage() === 'en');
        const modal = document.getElementById('trialShopModal');
        if (modal) {
            const h2 = modal.querySelector('h2');
            if (h2) h2.innerText = isEn ? '✨ Trial Treasure Merchant Astel' : '✨ 시련의 보물상인 아스텔 (Tower Shop)';
            const closeBtn = modal.querySelector('#trialShopCloseBtn');
            if (closeBtn) closeBtn.innerText = isEn ? 'Close [F/ESC]' : '닫기 [F/ESC]';
        }
        const coinsEl = document.getElementById('trialShopCoins');
        const bagCountEl = document.getElementById('trialShopBagCount');
        if (coinsEl) coinsEl.innerText = `${this.game.trialCoins || 0} ${isEn ? 'Badges' : '개'}`;
        if (bagCountEl) bagCountEl.innerText = `${this.game.player.getInventoryCount()} / 20`;

        const list = document.getElementById('trialShopItemList');
        if (!list) return;
        list.innerHTML = '';

        this.trialShopWares.forEach((ware, idx) => {
            const item = ITEM_DB[ware.id];
            if (!item) return;
            const canAfford = (this.game.trialCoins || 0) >= ware.price;
            const isFocused = (idx === (this.trialShopSelectedIndex || 0));
            const iName = typeof tData === 'function' ? tData(item, 'name') : item.name;
            const iDesc = typeof tData === 'function' ? tData(item, 'desc') : item.desc;
            const btnText = isEn ? `🪙 Exchange (${ware.price})` : `🪙 ${ware.price}개 교환`;

            const card = document.createElement('div');
            card.className = `shop-item-card ${item.rarity} ${isFocused ? 'keyboard-focused' : ''}`;
            card.innerHTML = `
                <div class="shop-card-left">
                    <span class="focus-arrow ${isFocused ? 'active' : ''}">${isFocused ? '▶' : '&nbsp;'}</span>
                    <span class="shop-item-icon">${item.icon}</span>
                    <div class="shop-item-info">
                        <div class="shop-item-name">${iName}</div>
                        <div class="shop-item-desc">${iDesc}</div>
                    </div>
                </div>
                <div class="shop-card-right">
                    <button class="shop-buy-btn ${canAfford ? '' : 'disabled'}" style="background: linear-gradient(135deg, #0284c7, #0369a1); border-color: #38bdf8; box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);">
                        ${btnText}
                    </button>
                </div>
            `;

            card.onclick = () => {
                this.trialShopSelectedIndex = idx;
                this.buyTrialItem(ware.id, ware.price);
            };

            list.appendChild(card);
        });
    }

    buyTrialItem(itemId, price) {
        const isEn = (typeof getLanguage === 'function' && getLanguage() === 'en');
        if ((this.game.trialCoins || 0) < price) {
            this.game.showNotification(isEn ? '⚠️ Not enough Trial Badges! Climb the Tower of Trial for more.' : '⚠️ 시련의 증표가 부족합니다! 시련의 탑을 더 등반하세요.');
            return;
        }
        if (!this.game.player.hasInventorySpace()) {
            this.game.showNotification(isEn ? '⚠️ Backpack is full! (Max 20 slots)' : '⚠️ 가방(인벤토리)이 가득 찼습니다!');
            return;
        }

        this.game.trialCoins -= price;
        this.game.player.addItemToInventory(itemId, 1);
        sounds.playLevelUp();
        this.game.particles.spawn(this.game.player.x, this.game.player.y, '#38bdf8', 25, 120, 0.6, 5);
        this.updateTrialShopUI();
        this.game.updateInventoryUI();
        const it = ITEM_DB[itemId];
        const itName = it ? (typeof tData === 'function' ? tData(it, 'name') : it.name) : itemId;
        this.game.showNotification(isEn ? `✨ Successfully exchanged [${itName}]! (-${price} Trial Badges)` : `✨ [시련 보물 교환 완료] ${itName}을(를) 획득했습니다!`);
    }

    handleInput(inp) {
        if (this.game.isShopOpen) {
            if (inp.isInteractPressed()) {
                this.toggleShop();
                this.game.modalJustClosedThisFrame = true;
                inp.justPressed['KeyF'] = false;
                sounds.playInteract();
                return;
            }

            if (inp.isJustPressed('Tab') || inp.isJustPressed('ArrowLeft') || inp.isJustPressed('ArrowRight')) {
                inp.justPressed['Tab'] = false;
                inp.justPressed['ArrowLeft'] = false;
                inp.justPressed['ArrowRight'] = false;
                this.switchShopTab(this.shopTab === 'buy' ? 'sell' : 'buy');
                return;
            }

            if (this.shopTab === 'buy') {
                if (inp.isJustPressed('ArrowUp')) {
                    inp.justPressed['ArrowUp'] = false;
                    if (this.shopSelectedIndex > 0) {
                        this.shopSelectedIndex--;
                        this.updateShopSelectionHighlight(true);
                        sounds.playInteract();
                    }
                } else if (inp.isJustPressed('ArrowDown')) {
                    inp.justPressed['ArrowDown'] = false;
                    if (this.shopSelectedIndex < (this.game.shopWares ? this.game.shopWares.length - 1 : 0)) {
                        this.shopSelectedIndex++;
                        this.updateShopSelectionHighlight(true);
                        sounds.playInteract();
                    }
                } else if (inp.isEnterPressed()) {
                    inp.justPressed['Enter'] = false;
                    const target = this.game.shopWares ? this.game.shopWares[this.shopSelectedIndex] : null;
                    if (target) this.buyItem(target.id, target.price);
                }
            } else {
                if (inp.isJustPressed('ArrowUp')) {
                    inp.justPressed['ArrowUp'] = false;
                    if (this.shopSellSelectedIndex > 0) {
                        this.shopSellSelectedIndex--;
                        this.updateShopSelectionHighlight(false);
                        sounds.playInteract();
                    }
                } else if (inp.isJustPressed('ArrowDown')) {
                    inp.justPressed['ArrowDown'] = false;
                    if (this.shopSellSelectedIndex < this.game.player.inventory.length - 1) {
                        this.shopSellSelectedIndex++;
                        this.updateShopSelectionHighlight(false);
                        sounds.playInteract();
                    }
                } else if (inp.isEnterPressed()) {
                    inp.justPressed['Enter'] = false;
                    this.sellItem(this.shopSellSelectedIndex);
                }
            }
            return;
        }

        if (this.game.isTrialShopOpen) {
            if (inp.isInteractPressed() || inp.isJustPressed('Escape')) {
                inp.justPressed['KeyF'] = false;
                inp.justPressed['Escape'] = false;
                this.toggleTrialShop();
                this.game.modalJustClosedThisFrame = true;
                sounds.playInteract();
                return;
            }
            if (inp.isJustPressed('ArrowUp')) {
                inp.justPressed['ArrowUp'] = false;
                if (this.trialShopSelectedIndex > 0) {
                    this.trialShopSelectedIndex--;
                    sounds.playInteract();
                    this.updateTrialShopUI();
                }
            } else if (inp.isJustPressed('ArrowDown')) {
                inp.justPressed['ArrowDown'] = false;
                if (this.trialShopSelectedIndex < (this.game.trialShopWares ? this.game.trialShopWares.length - 1 : 0)) {
                    this.trialShopSelectedIndex++;
                    sounds.playInteract();
                    this.updateTrialShopUI();
                }
            } else if (inp.isEnterPressed()) {
                inp.justPressed['Enter'] = false;
                const ware = this.game.trialShopWares ? this.game.trialShopWares[this.trialShopSelectedIndex] : null;
                if (ware) this.buyTrialItem(ware.id, ware.price);
            }
            return;
        }
    }
}
