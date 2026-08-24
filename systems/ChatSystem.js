// ============================================================================
// ChatSystem - 실시간 파티 엔터 채팅, 머리 위 말풍선 & 시스템 알림 시스템
// ============================================================================

class ChatSystem {
    constructor(game) {
        this.game = game;
        this.isOpen = false;
        this.chatLogs = [];
        this.maxLogs = 60;
        this.hideTimer = 0;

        this.chatContainer = null;
        this.chatLogsEl = null;
        this.chatInputContainer = null;
        this.chatInput = null;

        this.initDOM();
    }

    initDOM() {
        this.chatContainer = document.getElementById('hudChatContainer');
        this.chatLogsEl = document.getElementById('hudChatLogs');
        this.chatInputContainer = document.getElementById('hudChatInputContainer');
        this.chatInput = document.getElementById('hudChatInput');

        if (this.chatInput) {
            this.chatInput.addEventListener('keydown', (e) => {
                e.stopPropagation(); // 게임 조작 키 입력 차단
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendChatMessage();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    this.closeChat();
                }
            });
        }
    }

    handleKeyDown(e) {
        if (e.key === 'Enter') {
            // 모달이나 인벤토리가 열려있지 않을 때만 엔터 채팅 열기/닫기
            if (this.game.isAnyModalOpen && !this.isOpen) return;

            if (!this.isOpen) {
                this.openChat();
            } else {
                this.sendChatMessage();
            }
            return true;
        } else if (e.key === 'Escape' && this.isOpen) {
            this.closeChat();
            return true;
        }
        return false;
    }

    openChat() {
        this.isOpen = true;
        if (this.chatContainer) this.chatContainer.classList.add('active');
        if (this.chatInputContainer) this.chatInputContainer.classList.remove('hidden');
        if (this.chatInput) {
            this.chatInput.value = '';
            this.chatInput.focus();
        }
    }

    closeChat() {
        this.isOpen = false;
        if (this.chatInputContainer) this.chatInputContainer.classList.add('hidden');
        if (this.chatInput) {
            this.chatInput.value = '';
            this.chatInput.blur();
        }
        if (this.chatContainer) {
            this.hideTimer = 5.0; // 5초 후 서서히 페이드
        }
    }

    sendChatMessage() {
        if (!this.chatInput) return;
        const msg = this.chatInput.value.trim();

        if (msg.length > 0) {
            if (this.game.network && this.game.network.isConnected) {
                this.game.network.sendChat(msg);
            } else {
                // 오프라인 모드 단독 채팅
                this.onReceiveChat({
                    id: 'local',
                    nickname: this.game.player.nickname || '지저씨',
                    message: msg,
                    timestamp: Date.now()
                });
            }
        }
        this.closeChat();
    }

    onReceiveChat(data) {
        this.chatLogs.push(data);
        if (this.chatLogs.length > this.maxLogs) {
            this.chatLogs.shift();
        }

        // 1. 머리 위 말풍선 등록 (로컬 플레이어 또는 원격 플레이어)
        if (data.id === 'local' || (this.game.network && data.id === this.game.network.myId)) {
            if (this.game.player) this.game.player.setChatBubble(data.message);
        } else if (this.game.remotePlayers && this.game.remotePlayers[data.id]) {
            this.game.remotePlayers[data.id].setChatBubble(data.message);
        }

        // 2. 사운드 재생
        if (typeof sounds !== 'undefined' && sounds.playCoin) {
            sounds.playPop ? sounds.playPop() : sounds.playCoin();
        }

        // 3. UI 렌더링
        this.renderLogs();
    }

    addSystemMessage(msg) {
        this.chatLogs.push({
            isSystem: true,
            message: msg,
            timestamp: Date.now()
        });
        if (this.chatLogs.length > this.maxLogs) {
            this.chatLogs.shift();
        }
        this.renderLogs();
    }

    renderLogs() {
        if (!this.chatLogsEl || !this.chatContainer) return;

        this.chatContainer.classList.add('active');
        this.hideTimer = 6.0;

        let html = '';
        this.chatLogs.slice(-15).forEach(log => {
            if (log.isSystem) {
                html += `<div class="chat-row system"><span class="chat-badge">[시스템]</span> <span class="chat-msg">${log.message}</span></div>`;
            } else {
                const isMe = (this.game.network && log.id === this.game.network.myId) || log.id === 'local';
                const nickClass = isMe ? 'chat-nick-me' : 'chat-nick-party';
                html += `<div class="chat-row"><span class="${nickClass}">${log.nickname}</span>: <span class="chat-msg">${this.escapeHTML(log.message)}</span></div>`;
            }
        });

        this.chatLogsEl.innerHTML = html;
        this.chatLogsEl.scrollTop = this.chatLogsEl.scrollHeight;
    }

    update(dt) {
        if (this.hideTimer > 0 && !this.isOpen) {
            this.hideTimer -= dt;
            if (this.hideTimer <= 0) {
                if (this.chatContainer) this.chatContainer.classList.remove('active');
            }
        }
    }

    escapeHTML(str) {
        return String(str).replace(/[&<>'"]/g, tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag));
    }
}
