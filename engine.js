// ============================================================================
// 2D RPG Engine Core - Input, Camera, Particles & Canvas Polyfills
// ============================================================================

if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r = 0) {
        if (typeof r === 'number') r = [r, r, r, r];
        const [tl, tr, br, bl] = r;
        this.moveTo(x + tl, y);
        this.lineTo(x + w - tr, y);
        this.quadraticCurveTo(x + w, y, x + w, y + tr);
        this.lineTo(x + w, y + h - br);
        this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
        this.lineTo(x + bl, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - bl);
        this.lineTo(x, y + tl);
        this.quadraticCurveTo(x, y, x + tl, y);
        return this;
    };
}

class InputHandler {
    constructor() {
        this.keys = {};
        this.justPressed = {};
        this.lastPressTime = {};
        this.doubleTapDirection = null;
        this.mouse = { x: 0, y: 0, down: false, click: false };
        this.joystick = { active: false, x: 0, y: 0, dx: 0, dy: 0, originX: 0, originY: 0, touchId: null };

        const isTextInputFocused = () => {
            const el = document.activeElement;
            if (!el) return false;
            const tag = el.tagName;
            if (tag === 'TEXTAREA') return true;
            if (tag === 'INPUT') {
                const type = (el.type || 'text').toLowerCase();
                const textTypes = ['text', 'password', 'search', 'email', 'url', 'number', 'tel'];
                if (textTypes.includes(type)) {
                    return !el.disabled && el.offsetParent !== null && !el.closest('.hidden');
                }
            }
            return false;
        };

        // Keyboard support
        window.addEventListener('keydown', (e) => {
            if (isTextInputFocused()) {
                if (e.code === 'Escape') {
                    if (document.activeElement && typeof document.activeElement.blur === 'function') {
                        document.activeElement.blur();
                    }
                    if (window.game && window.game.chatSystem && window.game.chatSystem.isOpen) {
                        window.game.chatSystem.closeChat();
                    }
                }
                return;
            }

            // If activeElement is a non-text element (like button, slider, checkbox, select), blur it so game keys work cleanly
            if (document.activeElement && document.activeElement !== document.body) {
                if (typeof document.activeElement.blur === 'function') {
                    document.activeElement.blur();
                }
            }

            // In-game Chat Trigger (Enter Key)
            if (e.code === 'Enter' && window.game && !window.game.isIntroOpen && window.game.chatSystem && !window.game.isAnyModalOpen()) {
                e.preventDefault();
                window.game.chatSystem.openChat();
                return;
            }

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Tab'].includes(e.code)) {
                e.preventDefault();
            }

            if (!this.keys[e.code]) {
                this.justPressed[e.code] = true;

                // Double-tap arrow key detection for Dash (within 260ms)
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                    const now = performance.now();
                    const prevTime = this.lastPressTime[e.code] || 0;
                    if (now - prevTime < 260 && now - prevTime > 40) {
                        if (e.code === 'ArrowUp') this.doubleTapDirection = { dx: 0, dy: -1 };
                        else if (e.code === 'ArrowDown') this.doubleTapDirection = { dx: 0, dy: 1 };
                        else if (e.code === 'ArrowLeft') this.doubleTapDirection = { dx: -1, dy: 0 };
                        else if (e.code === 'ArrowRight') this.doubleTapDirection = { dx: 1, dy: 0 };
                    }
                    this.lastPressTime[e.code] = now;
                }
            }
            this.keys[e.code] = true;

            sounds.init();
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Mouse support
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mousedown', () => {
            this.mouse.down = true;
            this.mouse.click = true;
            if (!isTextInputFocused() && document.activeElement && document.activeElement !== document.body) {
                if (typeof document.activeElement.blur === 'function') {
                    document.activeElement.blur();
                }
            }
            sounds.init();
            if (window.game && !window.game.isIntroOpen) {
                sounds.startBGM();
            }
        });

        window.addEventListener('mouseup', () => {
            this.mouse.down = false;
        });

        this.initDynamicTouchJoystick();
    }

    initDynamicTouchJoystick() {
        const joyBase = document.getElementById('joystickBase');
        const joyStick = document.getElementById('joystickStick');
        if (!joyBase || !joyStick) return;

        const maxRadius = 48;

        window.addEventListener('touchstart', (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const t = e.changedTouches[i];
                if (t.clientX < window.innerWidth * 0.45 && this.joystick.touchId === null) {
                    const targetEl = document.elementFromPoint(t.clientX, t.clientY);
                    if (targetEl && (targetEl.closest('.hud-btn') || targetEl.closest('.quest-tracker-box') || targetEl.closest('.modal-backdrop'))) {
                        continue;
                    }

                    this.joystick.touchId = t.identifier;
                    this.joystick.originX = t.clientX;
                    this.joystick.originY = t.clientY;
                    this.joystick.active = true;

                    joyBase.style.left = `${t.clientX}px`;
                    joyBase.style.top = `${t.clientY}px`;
                    joyBase.style.display = 'flex';
                    joyStick.style.transform = 'translate(0px, 0px)';

                    sounds.init();
                    if (window.game && !window.game.isIntroOpen) {
                        sounds.startBGM();
                    }
                    break;
                }
            }
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const t = e.changedTouches[i];
                if (t.identifier === this.joystick.touchId) {
                    let dx = t.clientX - this.joystick.originX;
                    let dy = t.clientY - this.joystick.originY;
                    const dist = Math.hypot(dx, dy);

                    if (dist > maxRadius) {
                        dx = (dx / dist) * maxRadius;
                        dy = (dy / dist) * maxRadius;
                    }

                    joyStick.style.transform = `translate(${dx}px, ${dy}px)`;
                    this.joystick.dx = dx / maxRadius;
                    this.joystick.dy = dy / maxRadius;
                    break;
                }
            }
        }, { passive: false });

        const endTouch = (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === this.joystick.touchId) {
                    this.joystick.touchId = null;
                    this.joystick.active = false;
                    this.joystick.dx = 0;
                    this.joystick.dy = 0;
                    joyBase.style.display = 'none';
                    break;
                }
            }
        };

        window.addEventListener('touchend', endTouch);
        window.addEventListener('touchcancel', endTouch);
    }

    update() {
        this.justPressed = {};
        this.doubleTapDirection = null;
        this.mouse.click = false;
    }

    isDown(code) { return !!this.keys[code]; }
    isJustPressed(code) { return !!this.justPressed[code]; }

    getMovementVector(disableMovement = false) {
        if (disableMovement) {
            return { dx: 0, dy: 0 };
        }

        let dx = 0;
        let dy = 0;

        if (this.isDown('ArrowUp')) dy -= 1;
        if (this.isDown('ArrowDown')) dy += 1;
        if (this.isDown('ArrowLeft')) dx -= 1;
        if (this.isDown('ArrowRight')) dx += 1;

        if (this.joystick.active && (this.joystick.dx !== 0 || this.joystick.dy !== 0)) {
            dx = this.joystick.dx;
            dy = this.joystick.dy;
        } else if (dx !== 0 && dy !== 0) {
            const len = Math.hypot(dx, dy);
            dx /= len;
            dy /= len;
        }

        return { dx, dy };
    }

    // 9 Skill Slots (Q, W, E, A, S, D, Z, X, C)
    isSkillQPressed() { return this.isJustPressed('KeyQ'); }
    isSkillWPressed() { return this.isJustPressed('KeyW'); }
    isSkillEPressed() { return this.isJustPressed('KeyE'); }
    isSkillAPressed() { return this.isJustPressed('KeyA'); }
    isSkillSPressed() { return this.isJustPressed('KeyS'); }
    isSkillDPressed() { return this.isJustPressed('KeyD'); }
    isSkillZPressed() { return this.isJustPressed('KeyZ'); }
    isSkillXPressed() { return this.isJustPressed('KeyX'); }
    isSkillCPressed() { return this.isJustPressed('KeyC'); }

    // Quick Action Shortcuts
    isDodgePressed() { return this.isJustPressed('Space'); }
    getDoubleTapDodgeVector() { return this.doubleTapDirection; }
    isPotion1Pressed() { return this.isJustPressed('Digit1') || this.isJustPressed('Numpad1'); }
    isPotion2Pressed() { return this.isJustPressed('Digit2') || this.isJustPressed('Numpad2'); }
    isPotion3Pressed() { return this.isJustPressed('Digit3') || this.isJustPressed('Numpad3'); }
    isAttackPressed() { return this.isJustPressed('Enter') || this.isJustPressed('NumpadEnter') || this.isJustPressed('KeyJ'); }
    isInteractPressed() { return this.isJustPressed('KeyF'); }
    isEnterPressed() { return this.isJustPressed('Enter') || this.isJustPressed('NumpadEnter'); }
    isSettingsPressed() { return this.isJustPressed('KeyP'); }
    isSkillBookPressed() { return this.isJustPressed('KeyK'); }
    isInventoryPressed() { return this.isJustPressed('KeyI'); }
    isWorldMapPressed() { return this.isJustPressed('KeyM'); }
    isTabPressed() { return this.isJustPressed('Tab'); }
}

class Camera {
    constructor(viewWidth, viewHeight) {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
        this.shakeTimer = 0;
        this.shakeIntensity = 0;
        this.shakeEnabled = true;
    }

    resize(w, h) {
        this.viewWidth = w;
        this.viewHeight = h;
    }

    shake(duration, intensity) {
        if (!this.shakeEnabled) return;
        this.shakeTimer = duration;
        this.shakeIntensity = intensity;
    }

    follow(targetX, targetY, mapWidth, mapHeight) {
        this.targetX = targetX - this.viewWidth / 2;
        this.targetY = targetY - this.viewHeight / 2;

        const maxCameraX = Math.max(0, mapWidth - this.viewWidth);
        const maxCameraY = Math.max(0, mapHeight - this.viewHeight);

        this.targetX = Math.max(0, Math.min(maxCameraX, this.targetX));
        this.targetY = Math.max(0, Math.min(maxCameraY, this.targetY));

        this.x += (this.targetX - this.x) * 0.14;
        this.y += (this.targetY - this.y) * 0.14;
    }

    update(dt) {
        if (this.shakeTimer > 0) {
            this.shakeTimer -= dt;
            if (this.shakeTimer <= 0) {
                this.shakeIntensity = 0;
            }
        }
    }

    applyTransform(ctx) {
        ctx.save();
        let ox = 0;
        let oy = 0;
        if (this.shakeTimer > 0) {
            ox = (Math.random() * 2 - 1) * this.shakeIntensity;
            oy = (Math.random() * 2 - 1) * this.shakeIntensity;
        }
        ctx.translate(-Math.round(this.x + ox), -Math.round(this.y + oy));
    }

    restoreTransform(ctx) {
        ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.damageNumbers = [];
        this.slashArcs = [];
        this.MAX_PARTICLES = 400;
        this.MAX_DAMAGE_NUMBERS = 60;
    }

    spawn(x, y, color, count = 6, speed = 80, life = 0.35, size = 4) {
        if (this.particles.length >= this.MAX_PARTICLES) return;
        const spawnCount = Math.min(count, this.MAX_PARTICLES - this.particles.length);
        for (let i = 0; i < spawnCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = (Math.random() * 0.7 + 0.3) * speed;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                color,
                life,
                maxLife: life,
                size: (Math.random() * 0.5 + 0.5) * size
            });
        }
    }

    spawnSlashSparks(x, y, angle, color = '#ffffff', count = 8) {
        if (this.particles.length >= this.MAX_PARTICLES) return;
        const spawnCount = Math.min(count, this.MAX_PARTICLES - this.particles.length);
        for (let i = 0; i < spawnCount; i++) {
            const spread = (Math.random() - 0.5) * 1.4;
            const a = angle + spread + Math.PI;
            const spd = Math.random() * 160 + 80;
            this.particles.push({
                x,
                y,
                vx: Math.cos(a) * spd,
                vy: Math.sin(a) * spd,
                color,
                life: 0.22,
                maxLife: 0.22,
                size: Math.random() * 3 + 2,
                spark: true
            });
        }
    }

    spawnSlashArc(x, y, radius, startAngle, endAngle, color = '#38bdf8') {
        this.slashArcs.push({
            x,
            y,
            radius,
            startAngle,
            endAngle,
            color,
            life: 0.14,
            maxLife: 0.14
        });
    }

    spawnDamageNumber(x, y, text, color = '#ffffff', isCrit = false) {
        if (this.damageNumbers.length >= this.MAX_DAMAGE_NUMBERS) return;
        this.damageNumbers.push({
            x: x + (Math.random() * 16 - 8),
            y: y - 8,
            text: isCrit ? `💥 ${text}!` : text,
            color: isCrit ? '#fde047' : color,
            life: isCrit ? 0.95 : 0.75,
            maxLife: isCrit ? 0.95 : 0.75,
            vy: isCrit ? -55 : -42,
            isCrit,
            scale: isCrit ? 1.5 : 1.15
        });
    }

    update(dt) {
        // 🚀 swap-and-pop deletion: O(1) instead of O(n) splice
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;
            if (p.life <= 0) {
                this.particles[i] = this.particles[this.particles.length - 1];
                this.particles.length--;
            }
        }

        for (let i = this.slashArcs.length - 1; i >= 0; i--) {
            const a = this.slashArcs[i];
            a.life -= dt;
            if (a.life <= 0) {
                this.slashArcs[i] = this.slashArcs[this.slashArcs.length - 1];
                this.slashArcs.length--;
            }
        }

        for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
            const d = this.damageNumbers[i];
            d.y += d.vy * dt;
            d.life -= dt;
            if (d.life <= 0) {
                this.damageNumbers[i] = this.damageNumbers[this.damageNumbers.length - 1];
                this.damageNumbers.length--;
            }
        }
    }

    render(ctx) {
        // ── 1. Normal particles ─────────────────────────────────────────
        // 🚀 Group by type (spark vs normal) to minimize state changes.
        // One save/restore around the whole batch instead of per-particle.
        ctx.save();
        ctx.shadowBlur = 0;

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            if (p.spark) continue; // sparks rendered in second pass
            ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size);
        }

        ctx.restore();

        // ── 2. Spark particles (need shadowBlur) ────────────────────────
        // Set shadowBlur ONCE for the entire spark batch
        let hasSparks = false;
        for (let i = 0; i < this.particles.length; i++) {
            if (this.particles[i].spark) { hasSparks = true; break; }
        }

        if (hasSparks) {
            ctx.save();
            ctx.shadowBlur = 6;
            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];
                if (!p.spark) continue;
                ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
                ctx.strokeStyle = p.color;
                ctx.shadowColor = p.color;
                ctx.lineWidth = p.size;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x - p.vx * 0.035, p.y - p.vy * 0.035);
                ctx.stroke();
            }
            ctx.restore();
        }

        // ── 3. Slash arcs ───────────────────────────────────────────────
        if (this.slashArcs.length > 0) {
            ctx.save();
            ctx.lineWidth = 4.5;
            ctx.shadowBlur = 10;
            for (let i = 0; i < this.slashArcs.length; i++) {
                const a = this.slashArcs[i];
                ctx.globalAlpha = Math.max(0, a.life / a.maxLife);
                ctx.strokeStyle = a.color;
                ctx.shadowColor = a.color;
                ctx.beginPath();
                ctx.arc(a.x, a.y, a.radius, a.startAngle, a.endAngle);
                ctx.stroke();
            }
            ctx.restore();
        }

        // ── 4. Damage numbers ───────────────────────────────────────────
        if (this.damageNumbers.length > 0) {
            ctx.save();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#000000';
            for (let i = 0; i < this.damageNumbers.length; i++) {
                const d = this.damageNumbers[i];
                const progress = 1 - (d.life / d.maxLife);
                let curScale = d.scale;
                if (progress < 0.22) {
                    curScale = d.scale * (1 + (0.22 - progress) * 2.2);
                } else {
                    curScale = d.scale * Math.max(0.85, (1 - (progress - 0.22) * 0.25));
                }
                ctx.save();
                ctx.globalAlpha = Math.min(1, d.life * 2.4);
                ctx.translate(d.x, d.y);
                ctx.scale(curScale, curScale);
                if (d.isCrit) {
                    ctx.font = '900 16px sans-serif';
                    ctx.lineWidth = 4.5;
                    ctx.shadowColor = '#facc15';
                    ctx.shadowBlur = 10;
                } else {
                    ctx.font = 'bold 12px sans-serif';
                    ctx.lineWidth = 3;
                    ctx.shadowBlur = 0;
                }
                ctx.fillStyle = d.color;
                ctx.strokeText(d.text, 0, 0);
                ctx.fillText(d.text, 0, 0);
                ctx.restore();
            }
            ctx.restore();
        }
    }
}

