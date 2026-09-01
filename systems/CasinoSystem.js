// ============================================================================
// CasinoSystem - High-Low Dice & 3-Reel Slot Machine Minigames
// ============================================================================

class CasinoSystem {
    constructor(game) {
        this.game = game;
        this.casinoBet = 20;
        this.casinoTab = 'dice';
        this.casinoRolling = false;
    }

    toggleCasino() {
        this.game.ensureV210UI();
        this.game.isCasinoOpen = !this.game.isCasinoOpen;
        const modal = document.getElementById('casinoModal');
        if (modal) {
            if (this.game.isCasinoOpen) {
                this.casinoBet = this.casinoBet || 20;
                this.casinoTab = this.casinoTab || 'dice';
                this.updateCasinoUI();
                modal.classList.remove('hidden');
                sounds.playInteract();
            } else {
                modal.classList.add('hidden');
            }
        }
    }

    openCasino() {
        this.game.isCasinoOpen = false;
        this.toggleCasino();
    }

    closeCasino() {
        this.game.isCasinoOpen = false;
        const modal = document.getElementById('casinoModal');
        if (modal) modal.classList.add('hidden');
    }

    switchCasinoTab(tab) {
        this.casinoTab = tab;
        const diceTabBtn = document.getElementById('casinoTabDice');
        const slotTabBtn = document.getElementById('casinoTabSlot');
        const dicePanel = document.getElementById('casinoDicePanel');
        const slotPanel = document.getElementById('casinoSlotPanel');

        if (tab === 'dice') {
            diceTabBtn?.classList.add('active');
            slotTabBtn?.classList.remove('active');
            dicePanel?.classList.remove('hidden');
            slotPanel?.classList.add('hidden');
        } else {
            slotTabBtn?.classList.add('active');
            diceTabBtn?.classList.remove('active');
            slotPanel?.classList.remove('hidden');
            dicePanel?.classList.add('hidden');
        }
        sounds.playInteract();
    }

    setCasinoBet(amount) {
        this.casinoBet = amount;
        const btns = document.querySelectorAll('.bet-selector-row .bet-btn');
        btns.forEach(b => {
            if (b.innerText.includes(`${amount} G`)) b.classList.add('active');
            else b.classList.remove('active');
        });
        const betDisp = document.getElementById('casinoBetAmount');
        if (betDisp) betDisp.innerText = `${amount} G`;
        sounds.playInteract();
    }

    updateCasinoUI() {
        const isEn = (typeof getLanguage === 'function' && getLanguage() === 'en');
        const goldEl = document.getElementById('casinoGold');
        if (goldEl) goldEl.innerText = `${this.game.player.gold.toLocaleString()} G`;
        const betDisp = document.getElementById('casinoBetAmount');
        if (betDisp) betDisp.innerText = `${this.casinoBet || 20} G`;
        const sumText = document.getElementById('diceSumText');
        if (sumText) {
            if (this.lastSum) {
                sumText.innerText = isEn ? `Dice Sum: ${this.lastSum} (${this.lastD1} + ${this.lastD2})` : `주사위 합: ${this.lastSum} (${this.lastD1} + ${this.lastD2})`;
            } else {
                sumText.innerText = isEn ? 'Dice Sum: 12' : '주사위 합: 12';
            }
        }
    }

    playHighLowDice(choice) {
        if (this.casinoRolling) return;
        const isEn = (typeof getLanguage === 'function' && getLanguage() === 'en');
        const bet = this.casinoBet || 20;
        if (this.game.player.gold < bet) {
            sounds.playHit();
            this.game.showNotification(isEn ? '⚠️ Not enough gold to place bet!' : '골드가 부족합니다!');
            return;
        }

        this.game.player.gold -= bet;
        this.casinoRolling = true;
        sounds.playDiceRoll();
        this.updateCasinoUI();
        this.game.updateHUD();

        const cube1 = document.getElementById('diceCube1');
        const cube2 = document.getElementById('diceCube2');
        const sumText = document.getElementById('diceSumText');
        const banner = document.getElementById('casinoResultBanner');

        if (cube1) cube1.classList.add('rolling');
        if (cube2) cube2.classList.add('rolling');
        if (banner) banner.innerText = isEn ? '🎲 Rolling the lucky dice...!' : '🎲 주사위를 힘차게 굴리는 중...!';

        const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

        setTimeout(() => {
            if (cube1) cube1.classList.remove('rolling');
            if (cube2) cube2.classList.remove('rolling');
            this.casinoRolling = false;

            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            const sum = d1 + d2;
            this.lastSum = sum;
            this.lastD1 = d1;
            this.lastD2 = d2;

            if (cube1) cube1.innerText = diceFaces[d1 - 1];
            if (cube2) cube2.innerText = diceFaces[d2 - 1];
            if (sumText) sumText.innerText = isEn ? `Dice Sum: ${sum} (${d1} + ${d2})` : `주사위 합: ${sum} (${d1} + ${d2})`;

            let won = false;
            let mult = 0;

            if (choice === 'low' && sum <= 6) {
                won = true; mult = 2.0;
            } else if (choice === 'high' && sum >= 8) {
                won = true; mult = 2.0;
            } else if (choice === 'seven' && sum === 7) {
                won = true; mult = 5.0;
            }

            if (won) {
                const prize = Math.round(bet * mult);
                this.game.player.gold += prize;
                sounds.playJackpot();
                this.game.particles.spawn(this.game.player.x, this.game.player.y, '#facc15', 30, 140, 0.8, 6);
                if (banner) banner.innerHTML = isEn ? `🎉 <strong style="color:#4ade80;">Congratulations! ${mult}x Payout!</strong> (+${prize} G)` : `🎉 <strong style="color:#4ade80;">축하합니다! ${mult}배 당첨!</strong> (+${prize} G 획득)`;
                this.game.showNotification(isEn ? `🎲 [Dice Win] Sum ${sum}! +${prize} G!` : `🎲 [도박 당첨] 주사위 합 ${sum}! +${prize} G 획득!`);
            } else {
                sounds.playHit();
                if (banner) banner.innerHTML = isEn ? `💀 <strong style="color:#ef4444;">Unlucky!</strong> Dice sum was [${sum}].` : `💀 <strong style="color:#ef4444;">아쉽군요!</strong> 주사위 합은 [${sum}]였습니다.`;
            }

            this.updateCasinoUI();
            this.game.updateHUD();
            this.game.saveGame(true);
        }, 750);
    }

    playSlotMachine() {
        if (this.casinoRolling) return;
        const isEn = (typeof getLanguage === 'function' && getLanguage() === 'en');
        const bet = this.casinoBet || 20;
        if (this.game.player.gold < bet) {
            sounds.playHit();
            this.game.showNotification(isEn ? '⚠️ Not enough gold to place bet!' : '골드가 부족합니다!');
            return;
        }

        this.game.player.gold -= bet;
        this.casinoRolling = true;
        this.updateCasinoUI();
        this.game.updateHUD();

        const reel1 = document.getElementById('slotReel1');
        const reel2 = document.getElementById('slotReel2');
        const reel3 = document.getElementById('slotReel3');
        const banner = document.getElementById('casinoResultBanner');

        if (reel1) reel1.classList.add('spinning');
        if (reel2) reel2.classList.add('spinning');
        if (reel3) reel3.classList.add('spinning');
        if (banner) banner.innerText = isEn ? '🎰 Spinning the reels... Good luck!' : '🎰 슬롯 릴이 회전합니다...! 두근두근!';

        sounds.playSlotTick();

        const symbols = ['🍒', '🍒', '🔔', '🔔', '💎', '7️⃣', '👑'];

        setTimeout(() => {
            if (reel1) reel1.classList.remove('spinning');
            if (reel2) reel2.classList.remove('spinning');
            if (reel3) reel3.classList.remove('spinning');
            this.casinoRolling = false;

            const s1 = symbols[Math.floor(Math.random() * symbols.length)];
            const s2 = symbols[Math.floor(Math.random() * symbols.length)];
            const s3 = symbols[Math.floor(Math.random() * symbols.length)];

            if (reel1) reel1.innerText = s1;
            if (reel2) reel2.innerText = s2;
            if (reel3) reel3.innerText = s3;

            let prize = 0;
            let desc = '';

            if (s1 === s2 && s2 === s3) {
                if (s1 === '👑') { prize = bet * 50; desc = isEn ? '👑 [GRAND JACKPOT] 50x Payout + Elixir Bonus!' : '👑 [초대박 잭팟] 50배 당첨 + 엘릭서 보너스!'; this.game.player.addItemToInventory('potion_elixir', 1); }
                else if (s1 === '7️⃣') { prize = bet * 25; desc = isEn ? '7️⃣ [LUCKY 7 JACKPOT] 25x Payout!' : '7️⃣ [럭키 세븐 잭팟] 25배 당첨!'; }
                else if (s1 === '💎') { prize = bet * 10; desc = isEn ? '💎 [TRIPLE DIAMONDS] 10x Payout!' : '💎 [보석 트리플] 10배 당첨!'; }
                else if (s1 === '🔔') { prize = bet * 5; desc = isEn ? '🔔 [TRIPLE BELLS] 5x Payout!' : '🔔 [황금 종 트리플] 5배 당첨!'; }
                else if (s1 === '🍒') { prize = bet * 3; desc = isEn ? '🍒 [TRIPLE CHERRIES] 3x Payout!' : '🍒 [체리 트리플] 3배 당첨!'; }
            } else if (s1 === s2 || s2 === s3 || s1 === s3) {
                prize = Math.round(bet * 1.0);
                desc = isEn ? '✨ [2 MATCHES] Push Bonus (1.0x Refund)!' : '✨ [2개 일치] 본전 보너스 (1.0배 환급)!';
            }

            if (prize > 0) {
                this.game.player.gold += prize;
                sounds.playJackpot();
                this.game.particles.spawn(this.game.player.x, this.game.player.y, '#facc15', 25, 120, 0.7, 5);
                if (banner) banner.innerHTML = `🎉 <strong style="color:#4ade80;">${desc}</strong> (+${prize} G)`;
                this.game.showNotification(isEn ? `🎰 [Slot Win] ${desc} (+${prize} G)` : `🎰 [슬롯 당첨] ${desc} (+${prize} G)`);
            } else {
                sounds.playHit();
                if (banner) banner.innerHTML = isEn ? `💀 <strong style="color:#94a3b8;">No win! Better luck next spin...</strong>` : `💀 <strong style="color:#94a3b8;">꽝! 다음 기회에...</strong>`;
            }

            this.updateCasinoUI();
            this.game.updateHUD();
            this.game.saveGame(true);
        }, 850);
    }

    handleInput(inp) {
        if (!this.game.isCasinoOpen) return;

        if (inp.isInteractPressed() || inp.isJustPressed('Escape')) {
            this.toggleCasino();
            this.game.modalJustClosedThisFrame = true;
            inp.justPressed['KeyF'] = false;
            inp.justPressed['Escape'] = false;
            sounds.playInteract();
            return;
        }
        if (inp.isJustPressed('Tab')) {
            inp.justPressed['Tab'] = false;
            this.switchCasinoTab(this.casinoTab === 'dice' ? 'slot' : 'dice');
            return;
        }
        if (this.casinoTab === 'dice') {
            if (inp.isJustPressed('Digit1') || inp.isJustPressed('Numpad1')) {
                inp.justPressed['Digit1'] = false;
                this.playHighLowDice('low');
            } else if (inp.isJustPressed('Digit2') || inp.isJustPressed('Numpad2')) {
                inp.justPressed['Digit2'] = false;
                this.playHighLowDice('seven');
            } else if (inp.isJustPressed('Digit3') || inp.isJustPressed('Numpad3')) {
                inp.justPressed['Digit3'] = false;
                this.playHighLowDice('high');
            }
        } else {
            if (inp.isEnterPressed() || inp.isDown('Space')) {
                inp.justPressed['Enter'] = false;
                inp.justPressed['Space'] = false;
                this.playSlotMachine();
            }
        }
    }
}
