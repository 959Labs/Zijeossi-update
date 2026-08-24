// ============================================================================
// UISystem - Dialogue, Notifications, NPC Interactions & Screen UI
// ============================================================================

class UISystem {
    constructor(game) {
        this.game = game;
    }

    showNotification(text) {
        const el = document.getElementById('gameNotification');
        if (el) {
            el.innerText = text;
            el.classList.remove('hidden');
            el.classList.add('show');
            setTimeout(() => {
                el.classList.remove('show');
                el.classList.add('hidden');
            }, 3200);
        }
    }

    interactWithElder() {
        let speakerName = '마을 장로';
        let greetingPrefix = '';
        if (this.game.currentZone === 'village') {
            speakerName = '📜 장로 할아범';
            greetingPrefix = '지저씨! 언제까지 침대에서 뒹굴거릴 텐가? 바깥 몬스터들이 시끄러워서 낮잠을 잘 수가 없네!\n\n';
        } else if (this.game.currentZone === 'oasis_town') {
            speakerName = '📜 오아시스 촌장 아민';
            greetingPrefix = '어이쿠, 각성한 지저씨 오셨소? 모래바람 때문에 텐트가 흔들려 꿀잠을 못 자겠소!\n\n';
        } else if (this.game.currentZone === 'frost_camp') {
            speakerName = '📜 설원 주모 바르샤';
            greetingPrefix = '지저씨 총각! 바깥 예티 놈들이 에어컨을 강풍으로 틀어놔서 온돌 모닥불이 다 식겠어요!\n\n';
        } else if (this.game.currentZone === 'citadel_sanctuary') {
            speakerName = '📜 성기사단 보급단장 로베르트';
            greetingPrefix = '지저씨 각성자님! 피비린내 나는 흡혈귀 놈들 때문에 성채에서 쉴 수가 없습니다!\n\n';
        } else if (this.game.currentZone === 'sky_haven') {
            speakerName = '📜 천공 안식처 대천사 루미엘';
            greetingPrefix = '위대한 지저씨여! 신역의 관문 앞 보스들이 너무 눈부셔서 잠을 잘 수 없습니다!\n\n';
        }

        const activeQ = this.game.quests.find(q => q.status === 'active');
        const compQ = this.game.quests.find(q => q.status === 'completed');
        const readyQ = this.game.quests.find(q => q.status === 'ready');

        if (compQ) {
            compQ.status = 'claimed';
            this.game.player.gold += compQ.rewardGold;
            this.game.player.gainExp(compQ.rewardExp, this.game);
            if (compQ.rewardItem) {
                this.game.player.addItemToInventory(compQ.rewardItem, 1);
                this.game.updateInventoryUI();
            }
            sounds.playLevelUp();

            const nextIdx = this.game.quests.indexOf(compQ) + 1;
            if (nextIdx < this.game.quests.length) {
                this.game.quests[nextIdx].status = 'ready';
            }

            const itemName = ITEM_DB[compQ.rewardItem] ? ITEM_DB[compQ.rewardItem].name : compQ.rewardItem;
            this.showDialogue(speakerName, greetingPrefix + '오오! 귀찮음을 이겨내고 벌써 다 해치우고 왔군! 역시 각성한 지저씨일세!\n\n🎁 [보상 지급] +' + compQ.rewardGold + ' 골드, 경험치 +' + compQ.rewardExp + ', [' + itemName + ']\n\n얼른 침대 가서 한숨 자고 오시게나!');
        } else if (activeQ) {
            this.showDialogue(speakerName, greetingPrefix + '현재 부탁한 일:\n📜 [' + activeQ.title + ']\n📍 목표: [' + (activeQ.zoneName || '목표 위치') + '] ' + activeQ.desc + '\n진행 상황: (' + activeQ.currentCount + '/' + activeQ.targetCount + ')\n\n귀찮겠지만 얼른 후딱 해치우고 와야 맘 편히 꿀잠 잘 수 있네!');
        } else if (readyQ) {
            readyQ.status = 'active';
            sounds.playInteract();
            this.showDialogue(speakerName, greetingPrefix + '새로운 귀찮은 일이 생겼네!\n\n📜 [' + readyQ.title + ']\n📍 [' + (readyQ.zoneName || '목표 위치') + '] ' + readyQ.desc + '\n\n얼른 손봐주고 다시 침대로 들어가게! 보상은 두둑이 챙겨주겠네!');
        } else {
            this.showDialogue(speakerName, greetingPrefix + '대륙의 모든 시끄러운 보스들을 참교육했네! 이제 누구의 방해도 받지 않고 평생 푹신한 침대에서 꿀잠을 잘 수 있는 진정한 나태의 신이 되었군! 축하하네! 🛏️✨');
        }
        this.game.updateQuestHUD();
    }

    showDialogue(speaker, message) {
        const box = document.getElementById('dialogueBox');
        if (box) {
            const spk = document.getElementById('dialogueSpeaker');
            if (spk) spk.innerText = speaker;
            const txt = document.getElementById('dialogueText');
            if (txt) txt.innerText = message;
            box.classList.remove('hidden');
            this.game.isDialogueOpen = true;
        }
    }

    closeDialogue() {
        const box = document.getElementById('dialogueBox');
        if (box) {
            box.classList.add('hidden');
            this.game.isDialogueOpen = false;
        }
    }

    handleInput(inp) {
        if (this.game.isDialogueOpen) {
            if (inp.isInteractPressed() || inp.isEnterPressed() || inp.isDown('Space')) {
                this.closeDialogue();
                this.game.modalJustClosedThisFrame = true;
                inp.justPressed['KeyF'] = false;
                inp.justPressed['Enter'] = false;
                inp.justPressed['Space'] = false;
                sounds.playInteract();
            }
            return;
        }
    }
}
