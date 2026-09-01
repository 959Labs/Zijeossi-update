// ============================================================================
// Sound & Music Synthesizer (Upgraded SFX Volume, Dash Swoosh, Sliders)
// ============================================================================

class SoundManager {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.bgmPlaying = false;
        this.bgmTimer = null;
        this.sfxVolume = 0.6; // 효과음 볼륨 기본값 상향
        this.bgmVolume = 0.25;
        this.bgmGainNode = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
            this.bgmGainNode = this.ctx.createGain();
            this.bgmGainNode.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
            this.bgmGainNode.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setBgmVolume(val) { // 0.0 ~ 1.0
        this.bgmVolume = val;
        if (this.bgmGainNode && this.ctx) {
            this.bgmGainNode.gain.setValueAtTime(this.muted ? 0 : this.bgmVolume, this.ctx.currentTime);
        }
    }

    setSfxVolume(val) { // 0.0 ~ 1.0
        this.sfxVolume = val;
    }

    // 959 Labs Studio AAA Cinematic Prestige Intro Jingle
    playStudioJingle() {
        this.init();
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;

            // 1. Cinematic Warm Sub-Bass Foundation (80Hz -> 55Hz low swell)
            const subOsc = this.ctx.createOscillator();
            const subGain = this.ctx.createGain();
            const subFilter = this.ctx.createBiquadFilter();

            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(82.4, now);
            subOsc.frequency.exponentialRampToValueAtTime(55.0, now + 2.2);

            subFilter.type = 'lowpass';
            subFilter.frequency.setValueAtTime(220, now);

            subGain.gain.setValueAtTime(0.001, now);
            subGain.gain.exponentialRampToValueAtTime(0.35 * this.sfxVolume, now + 0.35);
            subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

            subOsc.connect(subFilter);
            subFilter.connect(subGain);
            subGain.connect(this.ctx.destination);
            subOsc.start(now);
            subOsc.stop(now + 2.5);

            // 2. Prestigious Orchestral Warm Pad Chord (C Major 9th: C, G, C, E, G, B, D)
            const padChord = [130.81, 196.00, 261.63, 329.63, 392.00, 493.88];
            padChord.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const filter = this.ctx.createBiquadFilter();

                osc.type = idx < 2 ? 'triangle' : 'sine';
                osc.frequency.setValueAtTime(freq, now);

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(600 + idx * 150, now);
                filter.frequency.exponentialRampToValueAtTime(250, now + 2.2);

                gain.gain.setValueAtTime(0.0001, now);
                gain.gain.exponentialRampToValueAtTime((0.08 / Math.sqrt(idx + 1)) * this.sfxVolume, now + 0.45);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.3);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 2.4);
            });

            // 3. Ethereal Glass Shimmer Accent (Delicate & cinematic sparkle)
            const shimmerNotes = [523.25, 659.25, 783.99, 1046.50];
            shimmerNotes.forEach((freq, idx) => {
                const startTime = now + 0.25 + idx * 0.09;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0.0001, startTime);
                gain.gain.exponentialRampToValueAtTime(0.04 * this.sfxVolume, startTime + 0.08);
                gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(startTime);
                osc.stop(startTime + 1.3);
            });
        } catch (e) {
            console.warn("Studio jingle audio error:", e);
        }
    }

    // 기본 공격 (A)
    playSlash() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.13);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, now);
        filter.frequency.exponentialRampToValueAtTime(350, now + 0.13);

        gain.gain.setValueAtTime(this.sfxVolume * 0.85, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.14);
    }

    // ========================================================================
    // AAA Cinematic Intro SFX Synthesizers
    // ========================================================================
    // 1. 극저음 시네마틱 브람 (Hans Zimmer Style Inception Braam)
    playCinematicBraam() {
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc1.type = 'sawtooth';
            osc1.frequency.setValueAtTime(55, now);
            osc1.frequency.exponentialRampToValueAtTime(32, now + 2.2);

            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(110, now);
            osc2.frequency.exponentialRampToValueAtTime(65, now + 2.0);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, now);
            filter.frequency.exponentialRampToValueAtTime(120, now + 2.2);

            gain.gain.setValueAtTime(this.sfxVolume * 1.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 2.5);
            osc2.stop(now + 2.5);
        } catch (e) {
            console.warn("Audio braam error:", e);
        }
    }

    // 2. 묵직한 심장 박동음 (Heartbeat Thump)
    playHeartbeat() {
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            [0, 0.22].forEach((offset, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(idx === 0 ? 75 : 60, now + offset);
                osc.frequency.exponentialRampToValueAtTime(25, now + offset + 0.18);

                gain.gain.setValueAtTime(this.sfxVolume * (idx === 0 ? 1.4 : 1.1), now + offset);
                gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.2);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + offset);
                osc.stop(now + offset + 0.22);
            });
        } catch (e) {
            console.warn("Audio heartbeat error:", e);
        }
    }

    // 3. 천둥 번개 굉음 (Thunder Crash)
    playThunder() {
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const bufSize = Math.floor(this.ctx.sampleRate * 1.5);
            const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
            const data = buf.getChannelData(0);
            for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

            const noise = this.ctx.createBufferSource();
            noise.buffer = buf;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(900, now);
            filter.frequency.exponentialRampToValueAtTime(80, now + 1.4);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(this.sfxVolume * 1.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            noise.start(now);
        } catch (e) {
            console.warn("Audio thunder error:", e);
        }
    }

    // 4. 타이틀 한 글자 낙하 타격음 (Title Letter Stamp Impact)
    playTitleStamp(pitch = 1) {
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140 * pitch, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.45);

            gain.gain.setValueAtTime(this.sfxVolume * 1.5, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.52);

            this.playHit();
        } catch (e) {
            console.warn("Audio stamp error:", e);
        }
    }

    // 5. 거대한 불길 점화음 (Flame Whoosh)
    playFlameIgnite() {
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(80, now);
            osc.frequency.linearRampToValueAtTime(220, now + 0.35);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.9);

            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(350, now);

            gain.gain.setValueAtTime(this.sfxVolume * 1.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 1.0);
        } catch (e) {
            console.warn("Audio flame error:", e);
        }
    }

    // 피격 타격음
    playHit() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        if (this._lastHitTime && now - this._lastHitTime < 0.05) return;
        this._lastHitTime = now;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.1);

        gain.gain.setValueAtTime(this.sfxVolume * 1.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.11);
    }

    // [음량 및 타격감 강화] 회피 / 대시 (Space) - 묵직한 고속 바람 가르기 + 펄스 사운드
    playDash() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;

        // 1. 화이트 노이즈 윈드 버스트
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.2);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(250, now + 0.2);
        filter.Q.value = 4;

        const gainNoise = this.ctx.createGain();
        gainNoise.gain.setValueAtTime(this.sfxVolume * 1.2, now); // 볼륨 대폭 상향
        gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        noise.connect(filter);
        filter.connect(gainNoise);
        gainNoise.connect(this.ctx.destination);
        noise.start(now);

        // 2. 도플러 저음 펄스 (묵직한 이동감 추가)
        const osc = this.ctx.createOscillator();
        const gainOsc = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);

        gainOsc.gain.setValueAtTime(this.sfxVolume * 0.8, now);
        gainOsc.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gainOsc);
        gainOsc.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.19);
    }

    // 스킬 W (회오리)
    playWhirlwind() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(700, now + 0.18);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.4);

        gain.gain.setValueAtTime(this.sfxVolume * 1.0, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.41);
    }

    // 스킬 E (검기)
    playSwordBeam() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.32);

        gain.gain.setValueAtTime(this.sfxVolume * 0.9, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.33);
    }

    // 스킬 S (패링)
    playShield() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.setValueAtTime(880, now + 0.06);

        gain.gain.setValueAtTime(this.sfxVolume * 1.0, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.29);
    }

    // 스킬 D (강타)
    playSlam() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.45);

        gain.gain.setValueAtTime(this.sfxVolume * 1.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.46);
    }

    // 궁극기 Q (검 폭풍)
    playUltimate() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        [240, 360, 480, 720].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            osc.frequency.exponentialRampToValueAtTime(freq * 2.2, now + idx * 0.08 + 0.25);
            osc.frequency.exponentialRampToValueAtTime(60, now + 0.8);

            gain.gain.setValueAtTime(0, now);
            gain.gain.setValueAtTime(this.sfxVolume * 0.65, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + 0.9);
        });
    }

    // 물약
    playPotion() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.exponentialRampToValueAtTime(650, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.22);

        gain.gain.setValueAtTime(this.sfxVolume * 0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
    }

    playCoin() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.5, now); // C6
        osc.frequency.setValueAtTime(1396.9, now + 0.08); // F6

        gain.gain.setValueAtTime(this.sfxVolume * 0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
    }

    playLevelUp() {
        if (this.muted || !this.ctx) return;
        const notes = [440, 554.37, 659.25, 880, 1108.7];
        const now = this.ctx.currentTime;
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.09);
            gain.gain.setValueAtTime(this.sfxVolume * 0.7, now + idx * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.09);
            osc.stop(now + idx * 0.09 + 0.36);
        });
    }

    playInteract() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.setValueAtTime(740, now + 0.08);

        gain.gain.setValueAtTime(this.sfxVolume * 0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.21);
    }

    playGameOver() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [293.66, 277.18, 261.63, 246.94];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + idx * 0.15);
            gain.gain.setValueAtTime(this.sfxVolume * 0.6, now + idx * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.15);
            osc.stop(now + idx * 0.15 + 0.42);
        });
    }

    playMagic() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
        gain.gain.setValueAtTime(this.sfxVolume * 0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
    }

    playFire() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.3);
        gain.gain.setValueAtTime(this.sfxVolume * 0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.33);
    }

    playHeal() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(this.sfxVolume * 0.5, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.32);
        });
    }

    playEquip() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(880, now + 0.06);
        gain.gain.setValueAtTime(this.sfxVolume * 0.65, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
    }

    playTrash() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.12);
        gain.gain.setValueAtTime(this.sfxVolume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }

    playSkillReady() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
    }

    playBow() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.14);
        gain.gain.setValueAtTime(this.sfxVolume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
    }

    playBlessing() {
        this.playHeal();
    }

    playDodge() {
        this.playDash();
    }

    // ========================================================================
    // AAA Hard Rock / Heavy Metal Intro BGM Synthesizer
    // Overdrive Power Chords + Heavy Double-Kick Drums + Bass Groove
    // ========================================================================
    startIntroMetalBGM() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
        if (this.metalPlaying || !this.ctx) return;
        this.metalPlaying = true;
        this.scheduleIntroMetalLoop();
    }

    stopIntroMetalBGM() {
        this.metalPlaying = false;
        if (this.metalTimer) {
            clearTimeout(this.metalTimer);
            this.metalTimer = null;
        }
    }

    makeDistortionCurve(amount = 40) {
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        for (let i = 0; i < n_samples; ++i) {
            const x = (i * 2) / n_samples - 1;
            curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
        }
        return curve;
    }

    scheduleIntroMetalLoop() {
        if (!this.metalPlaying || this.muted || !this.ctx) return;

        // Power Chords: [Root, Fifth, Octave]
        // E5: 82.4, 123.47, 164.81 | G5: 98.0, 146.83, 196.0 | A5: 110.0, 164.81, 220.0 | D5: 73.42, 110.0, 146.83
        const riffs = [
            [82.41, 123.47, 164.81],  // E5
            [82.41, 123.47, 164.81],  // E5
            [98.00, 146.83, 196.00],  // G5
            [110.0, 164.81, 220.00],  // A5
            [82.41, 123.47, 164.81],  // E5
            [73.42, 110.00, 146.83],  // D5
            [82.41, 123.47, 164.81],  // E5
            [98.00, 146.83, 196.00]   // G5
        ];

        let step = 0;
        const tempo = 138;
        const stepTime = 60 / tempo / 2; // 16th/8th note feel

        const playMetalStep = () => {
            if (!this.metalPlaying || this.muted || !this.ctx) return;
            try {
                const now = this.ctx.currentTime;
                const chordIdx = Math.floor((step / 4) % riffs.length);
                const chord = riffs[chordIdx];

                // 1. Distorted Heavy Metal Guitar Power Chord
                const dist = this.ctx.createWaveShaper();
                dist.curve = this.makeDistortionCurve(65);
                dist.oversample = '4x';

                const cabFilter = this.ctx.createBiquadFilter();
                cabFilter.type = 'bandpass';
                cabFilter.frequency.setValueAtTime(1400, now);
                cabFilter.Q.setValueAtTime(1.8, now);

                const guitarGain = this.ctx.createGain();
                const isAccent = step % 4 === 0;
                guitarGain.gain.setValueAtTime(this.bgmVolume * (isAccent ? 0.45 : 0.28), now);
                guitarGain.gain.exponentialRampToValueAtTime(0.001, now + stepTime * (isAccent ? 1.6 : 0.85));

                chord.forEach((freq) => {
                    const osc = this.ctx.createOscillator();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(freq, now);
                    osc.connect(dist);
                    osc.start(now);
                    osc.stop(now + stepTime * 1.8);
                });

                dist.connect(cabFilter);
                cabFilter.connect(guitarGain);
                guitarGain.connect(this.ctx.destination);

                // 2. Heavy Metal Kick Drum (Punchy 65Hz -> 25Hz)
                if (step % 4 === 0 || step % 4 === 3) {
                    const kickOsc = this.ctx.createOscillator();
                    const kickGain = this.ctx.createGain();
                    kickOsc.type = 'sine';
                    kickOsc.frequency.setValueAtTime(95, now);
                    kickOsc.frequency.exponentialRampToValueAtTime(28, now + 0.12);

                    kickGain.gain.setValueAtTime(this.sfxVolume * 1.1, now);
                    kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

                    kickOsc.connect(kickGain);
                    kickGain.connect(this.ctx.destination);
                    kickOsc.start(now);
                    kickOsc.stop(now + 0.18);
                }

                // 3. Heavy Snare Drum (Crack Noise + 200Hz punch on beats 2 and 6)
                if (step % 8 === 4) {
                    const snNoise = this.ctx.createBufferSource();
                    const snBuf = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.15), this.ctx.sampleRate);
                    const snData = snBuf.getChannelData(0);
                    for (let i = 0; i < snBuf.length; i++) snData[i] = Math.random() * 2 - 1;
                    snNoise.buffer = snBuf;

                    const snFilter = this.ctx.createBiquadFilter();
                    snFilter.type = 'bandpass';
                    snFilter.frequency.setValueAtTime(2400, now);

                    const snGain = this.ctx.createGain();
                    snGain.gain.setValueAtTime(this.sfxVolume * 0.9, now);
                    snGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

                    snNoise.connect(snFilter);
                    snFilter.connect(snGain);
                    snGain.connect(this.ctx.destination);
                    snNoise.start(now);
                }

                // 4. Hi-Hat / Crash Cymbal sizzle
                const hhNoise = this.ctx.createBufferSource();
                const hhBuf = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.05), this.ctx.sampleRate);
                const hhData = hhBuf.getChannelData(0);
                for (let i = 0; i < hhBuf.length; i++) hhData[i] = Math.random() * 2 - 1;
                hhNoise.buffer = hhBuf;

                const hhFilter = this.ctx.createBiquadFilter();
                hhFilter.type = 'highpass';
                hhFilter.frequency.setValueAtTime(7000, now);

                const hhGain = this.ctx.createGain();
                hhGain.gain.setValueAtTime(this.bgmVolume * 0.18, now);
                hhGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

                hhNoise.connect(hhFilter);
                hhFilter.connect(hhGain);
                hhGain.connect(this.ctx.destination);
                hhNoise.start(now);

                step = (step + 1) % 32;
                this.metalTimer = setTimeout(playMetalStep, stepTime * 1000);
            } catch (e) {
                console.warn("Metal BGM error:", e);
            }
        };

        playMetalStep();
    }

    startBGM() {
        if (window.game && window.game.isIntroOpen) return; // Do not start regular RPG BGM during title screen / intro
        this.stopIntroMetalBGM();
        if (this.bgmPlaying || !this.ctx) return;
        this.bgmPlaying = true;
        this.scheduleBgmLoop();
    }

    scheduleBgmLoop() {
        if (!this.bgmPlaying || this.muted) return;
        const chords = [
            [220, 261.63, 329.63], // Am
            [174.61, 220, 261.63], // F
            [261.63, 329.63, 392], // C
            [196, 246.94, 293.66]  // G
        ];

        let beat = 0;
        const tempo = 120;
        const stepTime = (60 / tempo) / 2;

        const playPattern = () => {
            if (!this.bgmPlaying || this.muted || !this.ctx) return;
            const now = this.ctx.currentTime;
            const chordIndex = Math.floor((beat / 8) % chords.length);
            const chord = chords[chordIndex];
            const noteFreq = chord[beat % chord.length];

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(noteFreq * 1.5, now);
            gain.gain.setValueAtTime(this.bgmVolume * 0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + stepTime * 0.9);

            osc.connect(gain);
            if (this.bgmGainNode) {
                gain.connect(this.bgmGainNode);
            } else {
                gain.connect(this.ctx.destination);
            }
            osc.start(now);
            osc.stop(now + stepTime);

            if (beat % 2 === 0) {
                const bassOsc = this.ctx.createOscillator();
                const bassGain = this.ctx.createGain();
                bassOsc.type = 'sine';
                bassOsc.frequency.setValueAtTime(chord[0] * 0.5, now);
                bassGain.gain.setValueAtTime(this.bgmVolume * 0.35, now);
                bassGain.gain.exponentialRampToValueAtTime(0.001, now + stepTime * 1.8);

                bassOsc.connect(bassGain);
                if (this.bgmGainNode) {
                    bassGain.connect(this.bgmGainNode);
                } else {
                    bassGain.connect(this.ctx.destination);
                }
                bassOsc.start(now);
                bassOsc.stop(now + stepTime * 2);
            }

            beat = (beat + 1) % 32;
            this.bgmTimer = setTimeout(playPattern, stepTime * 1000);
        };

        playPattern();
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
        this.stopIntroMetalBGM();
    }

    // 🎲 주사위 롤링 효과음 (Rattling Wooden Dice)
    playDiceRoll() {
        this.init();
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            for (let i = 0; i < 6; i++) {
                const t = now + i * 0.06;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(320 + Math.random() * 280, t);
                osc.frequency.exponentialRampToValueAtTime(120, t + 0.05);
                gain.gain.setValueAtTime(this.sfxVolume * 0.5, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(t);
                osc.stop(t + 0.06);
            }
        } catch(e) {}
    }

    // 🎰 슬롯머신 릴 회전 틱 (Slot Tick)
    playSlotTick() {
        this.init();
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(800 + Math.random() * 200, now);
            gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.04);
        } catch(e) {}
    }

    // 🏆 카지노 잭팟 승리 팡파레 (Jackpot Win Fanfare)
    playJackpot() {
        this.init();
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
            notes.forEach((freq, idx) => {
                const t = now + idx * 0.08;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, t);
                gain.gain.setValueAtTime(this.sfxVolume * 0.8, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(t);
                osc.stop(t + 0.4);
            });
        } catch(e) {}
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.bgmGainNode && this.ctx) {
            this.bgmGainNode.gain.setValueAtTime(this.muted ? 0 : this.bgmVolume, this.ctx.currentTime);
        }
        return this.muted;
    }
}

const sounds = new SoundManager();
