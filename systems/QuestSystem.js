// ============================================================================
// QuestSystem - 20-Chapter Storyline Progression & Quest Tracker HUD (Bilingual)
// ============================================================================

class QuestSystem {
    constructor(game) {
        this.game = game;
    }

    updateQuestHUD() {
        const questEl = document.getElementById('hudQuestTracker');
        if (!questEl) return;

        const isEn = (typeof getLanguage === 'function' && getLanguage() === 'en');
        const cur = this.game.quests.find(q => q.status === 'active' || q.status === 'completed');

        if (cur) {
            const isDone = cur.status === 'completed';
            const qTitle = typeof tData === 'function' ? tData(cur, 'title') : cur.title;
            const qDesc = typeof tData === 'function' ? tData(cur, 'desc') : cur.desc;
            const qZone = typeof tData === 'function' ? tData(cur, 'zoneName') : (cur.zoneName || '');

            const statusText = isDone
                ? (isEn ? '✨ Complete! Report to Elder for rewards [F]' : '✨ 완료! 장로에게 보고하고 꿀잠 자기 [F]')
                : `📍 [${qZone || (isEn ? 'Target' : '목표')}] ${qDesc} (${cur.currentCount}/${cur.targetCount})`;

            questEl.innerHTML = `
                <div class="quest-title">📜 ${qTitle}</div>
                <div class="quest-status ${isDone ? 'done' : ''}">${statusText}</div>
            `;
            questEl.classList.remove('hidden');
        } else {
            const ready = this.game.quests.find(q => q.status === 'ready');
            if (ready) {
                const promptText = isEn
                    ? '📜 Talk to Elder in Village to accept quest [F]'
                    : '📜 장로와 대화하여 귀찮은 일 받기 [F]';
                questEl.innerHTML = `<div class="quest-title">${promptText}</div>`;
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

        const isEn = (typeof getLanguage === 'function' && getLanguage() === 'en');

        if (enemy.isBoss) {
            sounds.playUltimate();
            this.game.camera.shake(1.2, 25);
            const bName = enemy.bossName_en && isEn ? enemy.bossName_en : enemy.bossName;
            const bossVictoryMsg = isEn
                ? `🏆 [Raid Boss Cleared] '${bName}' conquered! (+${goldReward}G, +${enemy.expReward}EXP)`
                : `🏆 [보스 토벌 성공] '${enemy.bossName}' 정복! (+${goldReward}G, +${enemy.expReward}EXP)`;
            this.game.showNotification(bossVictoryMsg);

            if (enemy.dropItem && this.game.player.hasInventorySpace()) {
                this.game.player.addItemToInventory(enemy.dropItem, 1);
                this.game.updateInventoryUI();
                const itObj = ITEM_DB[enemy.dropItem];
                const itName = itObj ? (typeof tData === 'function' ? tData(itObj, 'name') : itObj.name) : enemy.dropItem;
                const lootMsg = isEn
                    ? `🎁 Legendary Boss Loot Claimed: [${itName}]`
                    : `🎁 전설의 보스 전리품 획득: [${itName}]`;
                this.game.showNotification(lootMsg);
            }
        }

        this.game.quests.forEach(q => {
            if (q.status === 'active' && q.targetType === enemy.type) {
                q.currentCount++;
                if (q.currentCount >= q.targetCount) {
                    q.status = 'completed';
                    sounds.playLevelUp();
                    const qTitle = typeof tData === 'function' ? tData(q, 'title') : q.title;
                    const completeMsg = isEn
                        ? `🎉 [Quest Complete!] '${qTitle}' - Report to Elder for rewards!`
                        : `[퀘스트 완료!] '${q.title}' - 장로에게 보상을 받으세요!`;
                    this.game.showNotification(completeMsg);
                }
            }
        });
        this.updateQuestHUD();

        if (Math.random() < 0.08 && this.game.player.hasInventorySpace()) {
            this.game.player.addItemToInventory('potion_hp', 1);
            this.game.updateInventoryUI();
            this.game.showNotification(isEn ? 'Obtained a Health Potion (HP)!' : '체력 물약을 획득했습니다!');
        }
    }
}
