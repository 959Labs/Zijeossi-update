// ============================================================================
// Projectile
// ============================================================================
class Projectile {
    constructor(x, y, vx, vy, damage, range = 380, type = 'sword_beam', isPlayer = true) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.initVx = vx;
        this.initVy = vy;
        this.startX = x;
        this.startY = y;
        this.damage = damage;
        this.range = range;
        this.traveled = 0;
        this.type = type;
        this.isPlayer = isPlayer;
        this.active = true;
        this.pierced = new Set();
        this.lifeTimer = 0;
        this.isReturning = false;

        // Radii by type
        if (type === 'wind_piercer') this.radius = 24;
        else if (type === 'glacial_arrow') this.radius = 16;
        else if (type === 'singularity_orb') this.radius = 28;
        else if (type === 'meteor_fireball') this.radius = 32;
        else if (type === 'shuriken_boomerang') this.radius = 16;
        else if (type === 'blade_fan_dagger') this.radius = 14;
        else if (type === 'sword_beam' || type === 'dagger_slash') this.radius = 20;
        else if (type === 'arrow' || type === 'player_arrow' || type === 'rapid_arrow' || type === 'meteor_arrow') this.radius = 9;
        else if (type === 'arcane_orb' || type === 'chain_lightning') this.radius = 15;
        else if (type === 'dragon_breath') this.radius = 24;
        else if (type === 'holy_beam') this.radius = 22;
        else this.radius = 16;
    }

    update(dt, particles, game = null) {
        this.lifeTimer += dt;

        // 1. Homing for Mage Arcane Orbs
        if (this.type === 'arcane_orb' && this.isPlayer && game && game.enemies) {
            let nearestEnemy = null;
            let nearestDist = 420;
            for (let i = 0; i < game.enemies.length; i++) {
                const e = game.enemies[i];
                if (e.active && !this.pierced.has(e)) {
                    const d = Math.hypot(e.x - this.x, e.y - this.y);
                    if (d < nearestDist) {
                        nearestDist = d;
                        nearestEnemy = e;
                    }
                }
            }
            if (nearestEnemy) {
                const targetAngle = Math.atan2(nearestEnemy.y - this.y, nearestEnemy.x - this.x);
                const curSpeed = Math.hypot(this.vx, this.vy) || 420;
                this.vx += Math.cos(targetAngle) * 900 * dt;
                this.vy += Math.sin(targetAngle) * 900 * dt;
                const newSpeed = Math.hypot(this.vx, this.vy);
                if (newSpeed > 0) {
                    this.vx = (this.vx / newSpeed) * curSpeed;
                    this.vy = (this.vy / newSpeed) * curSpeed;
                }
            }
        }

        // 2. Arcane Singularity Gravitational Pull
        if (this.type === 'singularity_orb' && game && game.enemies) {
            // Decelerate and stay in place
            this.vx *= 0.88;
            this.vy *= 0.88;

            // Pull active enemies towards center
            game.enemies.forEach(e => {
                if (e.active) {
                    const d = Math.hypot(e.x - this.x, e.y - this.y);
                    if (d <= 140) {
                        const a = Math.atan2(this.y - e.y, this.x - e.x);
                        e.x += Math.cos(a) * 220 * dt;
                        e.y += Math.sin(a) * 220 * dt;
                        // Tick damage
                        if (Math.random() < 0.25) {
                            e.takeDamage(Math.round(this.damage * 0.1), 0, 0, game, false);
                        }
                    }
                }
            });

            // Detonate on expiry
            if (this.lifeTimer >= 3.2) {
                this.active = false;
                sounds.playSlam();
                game.camera.shake(0.35, 10);
                particles.spawn(this.x, this.y, '#c084fc', 35, 160, 0.7, 6);
                game.enemies.forEach(e => {
                    if (e.active && Math.hypot(e.x - this.x, e.y - this.y) <= 140) {
                        const a = Math.atan2(e.y - this.y, e.x - this.x);
                        e.takeDamage(this.damage, Math.cos(a) * 250, Math.sin(a) * 250, game, true);
                    }
                });
            }
        }

        // 3. Shuriken Boomerang Returning Curve
        if (this.type === 'shuriken_boomerang' && game && game.player) {
            if (!this.isReturning && this.traveled >= 220) {
                this.isReturning = true;
                this.pierced.clear(); // Can hit enemies again on return!
            }
            if (this.isReturning) {
                const targetAngle = Math.atan2(game.player.y - this.y, game.player.x - this.x);
                const curSpeed = 500;
                this.vx = Math.cos(targetAngle) * curSpeed;
                this.vy = Math.sin(targetAngle) * curSpeed;
                if (Math.hypot(game.player.x - this.x, game.player.y - this.y) <= 25) {
                    this.active = false; // Caught by player
                }
            }
        }

        const dist = Math.hypot(this.vx, this.vy) * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.traveled += dist;

        if (this.type !== 'singularity_orb' && this.traveled >= this.range && !this.isReturning) {
            this.active = false;
        }

        // Particles
        if (Math.random() < 0.75) {
            let color = '#34d399';
            if (this.type === 'wind_piercer') color = '#10b981';
            else if (this.type === 'glacial_arrow') color = '#38bdf8';
            else if (this.type === 'chain_lightning') color = '#60a5fa';
            else if (this.type === 'singularity_orb') color = '#c084fc';
            else if (this.type === 'meteor_fireball' || this.type === 'dragon_breath') color = '#f97316';
            else if (this.type === 'shuriken_boomerang' || this.type === 'dagger_slash' || this.type === 'blade_fan_dagger') color = '#facc15';
            else if (this.type === 'meteor_arrow') color = '#fef08a';
            else if (this.type === 'arrow' || this.type === 'player_arrow' || this.type === 'rapid_arrow') color = '#38bdf8';
            else if (this.type === 'arcane_orb') color = '#c084fc';
            particles.spawn(this.x, this.y, color, 1, 20, 0.2, 3);
        }
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        const angle = Math.atan2(this.vy, this.vx);
        ctx.rotate(angle);

        if (this.type === 'player_arrow' || this.type === 'arrow' || this.type === 'rapid_arrow' || this.type === 'meteor_arrow') {
            ctx.shadowColor = (this.type === 'meteor_arrow') ? '#facc15' : '#38bdf8';
            ctx.shadowBlur = 12;
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(12, 0); ctx.stroke();
            ctx.fillStyle = (this.type === 'meteor_arrow') ? '#facc15' : '#38bdf8';
            ctx.beginPath(); ctx.moveTo(15, 0); ctx.lineTo(7, -4); ctx.lineTo(9, 0); ctx.lineTo(7, 4); ctx.closePath(); ctx.fill();
        } else if (this.type === 'wind_piercer') {
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 22;
            ctx.fillStyle = '#34d399';
            ctx.beginPath(); ctx.moveTo(28, 0); ctx.lineTo(-18, -9); ctx.lineTo(-10, 0); ctx.lineTo(-18, 9); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.moveTo(24, 0); ctx.lineTo(-10, -4); ctx.lineTo(-4, 0); ctx.lineTo(-10, 4); ctx.closePath(); ctx.fill();
            // Air Shockwave rings
            ctx.strokeStyle = '#6ee7b7';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, 0, 16, -Math.PI / 2, Math.PI / 2); ctx.stroke();
        } else if (this.type === 'glacial_arrow') {
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 18;
            ctx.fillStyle = '#7dd3fc';
            ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(-14, -7); ctx.lineTo(-6, 0); ctx.lineTo(-14, 7); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(4, 0, 5, 0, Math.PI * 2); ctx.fill();
        } else if (this.type === 'chain_lightning') {
            ctx.shadowColor = '#60a5fa';
            ctx.shadowBlur = 18;
            ctx.strokeStyle = '#93c5fd';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-15, 0); ctx.lineTo(-5, -6); ctx.lineTo(5, 6); ctx.lineTo(18, 0);
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(18, 0, 4, 0, Math.PI * 2); ctx.fill();
        } else if (this.type === 'singularity_orb') {
            ctx.shadowColor = '#a855f7';
            ctx.shadowBlur = 25;
            ctx.fillStyle = '#3b0764';
            ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#9333ea';
            ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#c084fc';
            ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
        } else if (this.type === 'meteor_fireball') {
            ctx.shadowColor = '#ea580c';
            ctx.shadowBlur = 25;
            ctx.fillStyle = '#dc2626';
            ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#f97316';
            ctx.beginPath(); ctx.arc(2, 0, 15, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fef08a';
            ctx.beginPath(); ctx.arc(4, 0, 8, 0, Math.PI * 2); ctx.fill();
        } else if (this.type === 'shuriken_boomerang') {
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 14;
            const spin = Date.now() / 40;
            ctx.rotate(spin);
            ctx.fillStyle = '#ca8a04';
            for (let i = 0; i < 4; i++) {
                ctx.rotate(Math.PI / 2);
                ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-3, 6); ctx.lineTo(0, 16); ctx.lineTo(3, 6); ctx.closePath(); ctx.fill();
            }
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI * 2); ctx.fill();
        } else if (this.type === 'blade_fan_dagger') {
            ctx.shadowColor = '#fde047';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#eab308';
            ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(-6, -4); ctx.lineTo(-2, 0); ctx.lineTo(-6, 4); ctx.closePath(); ctx.fill();
        } else if (this.type === 'arcane_orb') {
            ctx.shadowColor = '#c084fc';
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#9333ea';
            ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath(); ctx.arc(2, -2, 7, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
        } else if (this.type === 'dagger_slash') {
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 14;
            ctx.fillStyle = '#eab308';
            ctx.beginPath(); ctx.moveTo(16, 0); ctx.lineTo(-8, -8); ctx.lineTo(-2, 0); ctx.lineTo(-8, 8); ctx.closePath(); ctx.fill();
        } else if (this.type === 'sword_beam') {
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 14;
            ctx.strokeStyle = '#a7f3d0';
            ctx.lineWidth = 4;
            ctx.beginPath(); ctx.arc(0, 0, 20, -Math.PI / 2.8, Math.PI / 2.8, false); ctx.stroke();
            ctx.fillStyle = '#34d399';
            ctx.beginPath(); ctx.arc(0, 0, 15, -Math.PI / 3, Math.PI / 3, false); ctx.fill();
        } else {
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI * 2); ctx.fill();
        }

        ctx.restore();
    }
}
