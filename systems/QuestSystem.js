// ============================================================================
// QuestSystem - 20-Chapter Storyline Progression & Quest Tracker HUD
// ============================================================================

class QuestSystem {
    constructor(game) {
        this.game = game;
    }

    updateQuestHUD() {
        const questEl = document.getElementById('hudQuestTracker');
        if (!questEl) return;

        const cur = this.game.quests.find(q => q.status === 'active' || q.status === 'completed');
        if (cur) {
            const isDone = cur.status === 'completed';
            questEl.innerHTML = `
                <div class="quest-title">📜 ${cur.title}</div>
                <div class="quest-status ${isDone ? 'done' : ''}">${isDone ? '✨ 완료! 장로에게 보고하고 꿀잠 자기 [F]' : `📍 [${cur.zoneName || '목표'}] ${cur.desc} (${cur.currentCount}/${cur.targetCount})`}</div>
            `;
            questEl.classList.remove('hidden');
        } else {
            const ready = this.game.quests.find(q => q.status === 'ready');
            if (ready) {
                questEl.innerHTML = `<div class="quest-title">📜 장로와 대화하여 귀찮은 일 받기 [F]</div>`;
                questEl.classList.remove('hidden');
            } else {
                questEl.classList.add('hidden');
            }
        }
    }

    onEnemyKilled(enemy) {
        if (this.game.network && this.game.network.isZoneHost && enemy.id) {
            this.game.network.sendMonsterKilled(enemy);
        }

        this.game.player.gainExp(enemy.expReward, this.game);

        let goldReward = enemy.goldReward;
        if (this.game.player.equipment.accessory === 'ring_clover') {
            goldReward = Math.round(goldReward * 1.35);
            this.game.particles.spawn(this.game.player.x, this.game.player.y, '#22c55e', 8, 60, 0.4, 4);
        }
        this.game.player.gold += goldReward;

        if (enemy.isBoss) {
            sounds.playUltimate();
            this.game.camera.shake(1.2, 25);
            this.game.showNotification(`🏆 [보스 토벌 성공] '${enemy.bossName}' 정복! (+${goldReward}G, +${enemy.expReward}EXP)`);
            if (enemy.dropItem && this.game.player.hasInventorySpace()) {
                this.game.player.addItemToInventory(enemy.dropItem, 1);
                this.game.updateInventoryUI();
                const itName = ITEM_DB[enemy.dropItem] ? ITEM_DB[enemy.dropItem].name : enemy.dropItem;
                this.game.showNotification(`🎁 전설의 보스 전리품 획득: [${itName}]`);
            }
        }

        this.game.quests.forEach(q => {
            if (q.status === 'active' && q.targetType === enemy.type) {
                q.currentCount++;
                if (q.currentCount >= q.targetCount) {
                    q.status = 'completed';
                    sounds.playLevelUp();
                    this.game.showNotification(`[퀘스트 완료!] '${q.title}' - 장로에게 보상을 받으세요!`);
                }
            }
        });
        this.updateQuestHUD();

        if (Math.random() < 0.08 && this.game.player.hasInventorySpace()) {
            this.game.player.addItemToInventory('potion_hp', 1);
            this.game.updateInventoryUI();
            this.game.showNotification('체력 물약을 획득했습니다!');
        }
    }
}
