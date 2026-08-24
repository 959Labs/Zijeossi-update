// ============================================================================
// Props
// ============================================================================
class Prop {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.active = true;
        this.opened = false;
        this.fireAnim = Math.random() * 10;

        if (type === 'tree') { this.radius = 22; this.solid = true; }
        else if (type === 'bush') { this.radius = 16; this.solid = true; }
        else if (type === 'rock') { this.radius = 16; this.solid = true; }
        else if (type === 'chest') { this.radius = 16; this.solid = true; }
        else if (type === 'pot') { this.radius = 12; this.solid = true; }
        else if (type === 'npc' || type === 'merchant' || type === 'blacksmith' || type === 'gambler' || type === 'trial_merchant') { this.radius = 16; this.solid = true; }
        else if (type.startsWith('portal_')) { this.radius = 28; this.solid = false; }
        else if (type === 'trap') { this.radius = 18; this.solid = false; }
        else if (type === 'campfire') { this.radius = 16; this.solid = true; }
        else if (type === 'bed') { this.radius = 20; this.solid = true; }
        else if (type === 'shrine') { this.radius = 20; this.solid = true; }
        else if (type === 'fountain') { this.radius = 24; this.solid = true; }
        else if (type === 'crystal') { this.radius = 16; this.solid = true; }
    }

    interact(player, game) {
        if (this.type === 'chest' && !this.opened) {
            this.opened = true;
            sounds.playInteract();
            sounds.playCoin();
            player.gold += 60;
            player.addItemToInventory('potion_hp', 2);
            player.addItemToInventory('potion_buff', 1);
            game.updateInventoryUI();
            game.particles.spawn(this.x, this.y, '#fbbf24', 22, 110, 0.6, 5);
            game.showNotification('보물상자를 열었습니다! (골드 +120, 물약 획득)');
        } else if (this.type === 'npc') {
            sounds.playInteract();
            game.interactWithElder();
        } else if (this.type === 'merchant') {
            sounds.playInteract();
            game.toggleShop();
        } else if (this.type === 'blacksmith') {
            sounds.playInteract();
            game.toggleForge();
        } else if (this.type === 'gambler') {
            sounds.playInteract();
            game.toggleCasino();
        } else if (this.type === 'trial_merchant') {
            sounds.playInteract();
            game.toggleTrialShop();
        } else if (this.type === 'portal_trial_tower_next') {
            sounds.playLevelUp();
            game.advanceTrialTowerFloor();
        } else if (this.type.startsWith('portal_')) {
            sounds.playInteract();
            const targetZone = this.type.replace('portal_', '');
            game.switchZone(targetZone);
        } else if (this.type === 'shrine') {
            sounds.playInteract();
            player.shrineBuffTimer = 35;
            sounds.playLevelUp();
            game.particles.spawn(player.x, player.y, '#facc15', 24, 120, 0.6, 5);
            game.showNotification('고대 힘의 제단을 경배하여 35초간 공격력 & 이속 대폭 증가 버프를 획득했습니다!');
        } else if (this.type === 'fountain') {
            sounds.playInteract();
            player.hp = player.maxHp;
            player.mp = player.maxMp;
            sounds.playPotion();
            game.particles.spawn(player.x, player.y, '#38bdf8', 24, 100, 0.6, 5);
            game.showNotification('생명의 샘물로 체력과 마나가 완전히 회복되었습니다!');
        } else if (this.type === 'campfire') {
            sounds.playInteract();
            player.hp = player.maxHp;
            player.mp = player.maxMp;
            game.particles.spawn(player.x, player.y, '#4ade80', 16, 80, 0.6, 4);
            game.showNotification('따뜻한 모닥불에서 휴식하여 체력과 마나가 모두 회복되었습니다!');
        } else if (this.type === 'bed') {
            sounds.playPotion();
            player.hp = player.maxHp;
            player.mp = player.maxMp;
            game.camera.shake(0.3, 8);
            game.particles.spawn(player.x, player.y, '#f472b6', 25, 90, 0.7, 4.5);
            game.showNotification('💤 [완벽한 수면] 따뜻하고 푹신한 침대에서 꿀잠을 자 체력/마나가 100% 충전되었습니다!');
        }
    }

    takeDamage(game) {
        if (this.type === 'crystal' && this.active) {
            this.active = false;
            sounds.playHit();
            sounds.playCoin();
            game.particles.spawn(this.x, this.y, '#38bdf8', 24, 130, 0.5, 5);
            game.player.gold += 40;
            game.player.gainExp(35, game);
            game.showNotification('희귀 마력 수정을 채굴했습니다! (+80 골드, +120 EXP)');
        } else if (this.type === 'bush' && this.active) {
            this.active = false;
            sounds.playSlash();
            sounds.playCoin();
            game.particles.spawn(this.x, this.y, '#4ade80', 16, 80, 0.4, 4);
            if (Math.random() < 0.5) {
                game.player.gold += 4;
                game.particles.spawnDamageNumber(this.x, this.y, '+8 G', '#facc15');
            }
        } else if (this.type === 'pot' && this.active) {
            this.active = false;
            sounds.playHit();
            sounds.playCoin();
            game.particles.spawn(this.x, this.y, '#8d6e63', 14, 85, 0.4, 4);
            game.player.gold += 10;
            game.particles.spawnDamageNumber(this.x, this.y, '+20 G', '#facc15');
        }
    }

    render(ctx, windTime = 0) {
        if (!this.active) return;
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.type.startsWith('portal_')) {
            const targetZoneKey = this.type.replace('portal_', '');
            const theme = getZoneTheme(targetZoneKey);
            const pCol = (theme && theme.color) ? theme.color : '#c084fc';

            this.fireAnim += 0.05;
            ctx.save();
            ctx.rotate(this.fireAnim);

            // Swirling Outer Ring & Portal Vortex with exact matching theme color
            const pGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 36);
            pGrad.addColorStop(0, '#ffffff');
            pGrad.addColorStop(0.35, pCol);
            pGrad.addColorStop(0.8, pCol);
            pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = pGrad;
            ctx.beginPath(); ctx.arc(0, 0, 36, 0, Math.PI * 2); ctx.fill();

            // 6 Orbiting Magical Energy Sparks
            for (let i = 0; i < 6; i++) {
                const a = this.fireAnim * 2.5 + (i * Math.PI / 3);
                const rx = Math.cos(a) * 24;
                const ry = Math.sin(a) * 24;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath(); ctx.arc(rx, ry, 2.5, 0, Math.PI * 2); ctx.fill();
            }

            ctx.restore();

            // Floating Target Zone Badge with matching theme stroke and glow
            ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
            ctx.strokeStyle = pCol;
            ctx.lineWidth = 2;
            ctx.shadowColor = pCol;
            ctx.shadowBlur = 12;
            ctx.beginPath(); ctx.roundRect(-75, -52, 150, 26, 13); ctx.fill(); ctx.stroke();
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(theme.name || "🌀 미지의 포탈", 0, -35);
            ctx.restore();
            return;
        }

        if (this.type === 'bed') {
            // Drop Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.beginPath(); ctx.roundRect(-22, -16, 44, 34, 8); ctx.fill();

            // Carved Mahogany Bed Frame
            ctx.fillStyle = '#5c2c16';
            ctx.beginPath(); ctx.roundRect(-20, -15, 40, 30, 6); ctx.fill();
            ctx.fillStyle = '#3d1c0e';
            ctx.fillRect(-20, -15, 40, 6); // Headboard

            // Soft Silk Mattress
            ctx.fillStyle = '#fce7f3';
            ctx.beginPath(); ctx.roundRect(-17, -11, 34, 23, 4); ctx.fill();

            // Fluffy White Pillow
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.roundRect(-15, -9, 12, 10, 3); ctx.fill();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.fillRect(-13, -7, 8, 2);

            // Cozy Pink Quilt Blanket
            ctx.fillStyle = '#f472b6';
            ctx.beginPath(); ctx.roundRect(-4, -11, 21, 23, 4); ctx.fill();
            ctx.fillStyle = '#ec4899';
            ctx.fillRect(-4, -11, 4, 23); // Quilt Fold

            // Sleeping Zzz Bubble
            this.fireAnim += 0.04;
            const zFloat = (Math.sin(this.fireAnim * 3) * 3) - 22;
            ctx.fillStyle = '#fbcfe8';
            ctx.font = 'bold 10px sans-serif';
            ctx.fillText('💤 Zzz...', 6, zFloat);

            ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
            ctx.strokeStyle = '#f472b6';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.roundRect(-38, -44, 76, 18, 8); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('🛏️ 푹신한 침대', 0, -31);
            ctx.restore();
            return;
        }

        if (this.type === 'shrine') {
            this.fireAnim += 0.05;
            // Stone Base
            ctx.fillStyle = '#1e293b';
            ctx.beginPath(); ctx.roundRect(-16, -12, 32, 28, 4); ctx.fill();
            ctx.fillStyle = '#334155';
            ctx.beginPath(); ctx.roundRect(-14, -22, 28, 16, 4); ctx.fill();

            // Gold Runic Trim
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(-12, -20, 24, 12);

            // Shimmering Divine Core
            const coreGlow = Math.sin(this.fireAnim * 4) * 3;
            ctx.fillStyle = '#fde047';
            ctx.shadowColor = '#eab308';
            ctx.shadowBlur = 14 + coreGlow;
            ctx.beginPath(); ctx.arc(0, -28, 8, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(0, -28, 4, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.roundRect(-42, -50, 84, 18, 8); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('✨ 고대 힘의 제단', 0, -37);
            ctx.restore();
            return;
        }

        if (this.type === 'fountain') {
            this.fireAnim += 0.04;
            // 3D Carved Granite Pool Basin
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath(); ctx.ellipse(0, 10, 36, 18, 0, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = '#475569';
            ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#64748b';
            ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI * 2); ctx.fill();

            // Crystal Clear Blue Water
            const waterGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 24);
            waterGrad.addColorStop(0, '#7dd3fc');
            waterGrad.addColorStop(0.6, '#0284c7');
            waterGrad.addColorStop(1, '#0369a1');
            ctx.fillStyle = waterGrad;
            ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI * 2); ctx.fill();

            // Animated Concentric Water Ripple Waves
            for (let i = 0; i < 3; i++) {
                const rPhase = ((this.fireAnim * 1.5 + i * 0.8) % 2.4);
                const rRad = rPhase * 9 + 4;
                const rAlpha = Math.max(0, 1 - (rRad / 24));
                ctx.strokeStyle = `rgba(255, 255, 255, ${rAlpha * 0.7})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.arc(0, 0, rRad, 0, Math.PI * 2); ctx.stroke();
            }

            // Center Marble Spout & Sparkling Jet
            ctx.fillStyle = '#cbd5e1';
            ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(0, -3 + Math.sin(this.fireAnim * 6) * 1.5, 3, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.roundRect(-42, -44, 84, 18, 8); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('⛲ 생명의 분수대', 0, -31);
            ctx.restore();
            return;
        }

        if (this.type === 'crystal') {
            this.fireAnim += 0.05;
            const cGlow = Math.sin(this.fireAnim * 3) * 4;
            // Ambient Drop Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.beginPath(); ctx.ellipse(0, 10, 14, 7, 0, 0, Math.PI * 2); ctx.fill();

            // Multi-faceted Gemstone Cluster
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 10 + cGlow;
            
            // Facet 1 (Left shade)
            ctx.fillStyle = '#0284c7';
            ctx.beginPath();
            ctx.moveTo(0, -22); ctx.lineTo(-11, 2); ctx.lineTo(0, 12);
            ctx.fill();

            // Facet 2 (Right mid)
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.moveTo(0, -22); ctx.lineTo(11, 2); ctx.lineTo(0, 12);
            ctx.fill();

            // Facet 3 (Top-center specular glint)
            ctx.fillStyle = '#bae6fd';
            ctx.beginPath();
            ctx.moveTo(0, -22); ctx.lineTo(4, -4); ctx.lineTo(0, 12);
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.restore();
            return;
        }

        if (this.type === 'trap') {
            // Iron Grating Frame
            ctx.fillStyle = '#1e293b';
            ctx.beginPath(); ctx.roundRect(-18, -18, 36, 36, 4); ctx.fill();
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-15, -15, 30, 30);

            // Razor-sharp Polished Steel Spikes
            ctx.fillStyle = '#cbd5e1';
            for (let r = -10; r <= 10; r += 10) {
                for (let c = -10; c <= 10; c += 10) {
                    ctx.beginPath();
                    ctx.moveTo(c, r - 6); ctx.lineTo(c + 4, r + 3); ctx.lineTo(c - 4, r + 3);
                    ctx.closePath(); ctx.fill();
                    // Red Poison / Blood Tip
                    ctx.fillStyle = '#ef4444';
                    ctx.fillRect(c - 1, r - 6, 2, 3);
                    ctx.fillStyle = '#cbd5e1';
                }
            }
            ctx.restore();
            return;
        }

        // Ambient Prop Contact Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(4, 12, this.radius * 1.3, this.radius * 0.65, Math.PI / 8, 0, Math.PI * 2);
        ctx.fill();

        if (this.type === 'tree') {
            // Textured Bark Trunk with base root flair
            ctx.fillStyle = '#382011';
            ctx.beginPath();
            ctx.moveTo(-11, 14); ctx.lineTo(-7, -8); ctx.lineTo(7, -8); ctx.lineTo(11, 14);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#5c3820';
            ctx.fillRect(-4, -6, 8, 18);

            ctx.save();
            const sway = Math.sin(windTime * 2.2 + this.x * 0.04) * 0.07;
            ctx.rotate(sway);

            // Tier 1: Deep Base Canopy
            ctx.fillStyle = '#0f2c0f';
            ctx.beginPath();
            ctx.arc(0, -20, 32, 0, Math.PI * 2);
            ctx.fill();

            // Tier 2: Lush Middle Foliage Clusters
            ctx.fillStyle = '#165516';
            ctx.beginPath();
            ctx.arc(-12, -26, 22, 0, Math.PI * 2);
            ctx.arc(12, -26, 22, 0, Math.PI * 2);
            ctx.arc(0, -32, 24, 0, Math.PI * 2);
            ctx.fill();

            // Tier 3: Vibrant Sunlit Highlights
            ctx.fillStyle = '#2d7c2d';
            ctx.beginPath();
            ctx.arc(-6, -34, 18, 0, Math.PI * 2);
            ctx.arc(6, -32, 16, 0, Math.PI * 2);
            ctx.fill();

            // Tier 4: Golden Sun Speckles
            ctx.fillStyle = '#4ade80';
            ctx.beginPath();
            ctx.arc(-4, -38, 8, 0, Math.PI * 2);
            ctx.arc(8, -34, 7, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        } else if (this.type === 'bush') {
            // Multi-circle organic volume
            ctx.fillStyle = '#0f330f';
            ctx.beginPath(); ctx.arc(0, 2, 17, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = '#166534';
            ctx.beginPath();
            ctx.arc(-5, -2, 14, 0, Math.PI * 2);
            ctx.arc(5, -1, 13, 0, Math.PI * 2);
            ctx.arc(0, -5, 12, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.arc(-3, -6, 9, 0, Math.PI * 2);
            ctx.arc(3, -5, 8, 0, Math.PI * 2);
            ctx.fill();

            // Sweet Red Berries with specular shine
            const berries = [{ x: -6, y: -4 }, { x: 5, y: -6 }, { x: 0, y: 1 }, { x: -8, y: 4 }, { x: 7, y: 3 }];
            for (const b of berries) {
                ctx.fillStyle = '#ef4444';
                ctx.beginPath(); ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(b.x - 0.5, b.y - 1, 1, 1);
            }
        } else if (this.type === 'rock') {
            // 3D Faceted Boulder
            ctx.fillStyle = '#1e293b';
            ctx.beginPath(); ctx.roundRect(-16, -14, 32, 28, 8); ctx.fill();
            ctx.fillStyle = '#334155';
            ctx.beginPath(); ctx.roundRect(-14, -12, 28, 24, 6); ctx.fill();
            ctx.fillStyle = '#64748b';
            ctx.beginPath(); ctx.roundRect(-11, -10, 16, 14, 4); ctx.fill();

            // Green Moss Patch on boulder
            ctx.fillStyle = '#15803d';
            ctx.beginPath(); ctx.arc(-7, -4, 4, 0, Math.PI * 2); ctx.fill();
        } else if (this.type === 'chest') {
            // 3D Wood Grain Chest
            ctx.fillStyle = this.opened ? '#5c2c16' : '#854d0e';
            ctx.beginPath(); ctx.roundRect(-14, -10, 28, 20, 4); ctx.fill();

            // Golden Filigree Straps
            ctx.fillStyle = '#eab308';
            ctx.fillRect(-14, -6, 28, 3);
            ctx.fillRect(-14, 2, 28, 3);

            // Heavy Lock & Gem
            ctx.fillStyle = '#ca8a04';
            ctx.beginPath(); ctx.roundRect(-4, -3, 8, 8, 2); ctx.fill();
            ctx.fillStyle = this.opened ? '#64748b' : '#38bdf8';
            ctx.beginPath(); ctx.arc(0, 1, 2, 0, Math.PI * 2); ctx.fill();
        } else if (this.type === 'npc' || this.type === 'merchant' || this.type === 'blacksmith' || this.type === 'gambler') {
            if (this.type === 'npc') {
                // Elder Mage Robes & Wizard Hat
                ctx.fillStyle = '#1e3a8a';
                ctx.beginPath(); ctx.roundRect(-9, -7, 18, 20, 4); ctx.fill();
                ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(0, -14, 8, 0, Math.PI * 2); ctx.fill();
                // Long White Beard
                ctx.fillStyle = '#f8fafc';
                ctx.beginPath(); ctx.moveTo(-6, -11); ctx.lineTo(0, -1); ctx.lineTo(6, -11); ctx.closePath(); ctx.fill();
                // Magic Staff with glowing blue orb
                ctx.fillStyle = '#78350f'; ctx.fillRect(11, -22, 3.5, 30);
                ctx.fillStyle = '#38bdf8'; ctx.shadowColor = '#0284c7'; ctx.shadowBlur = 8;
                ctx.beginPath(); ctx.arc(12.5, -24, 6, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;
            } else if (this.type === 'merchant') {
                // Traveling Merchant Coat & Huge Backpack
                ctx.fillStyle = '#78350f'; ctx.beginPath(); ctx.roundRect(-16, -10, 9, 20, 3); ctx.fill();
                ctx.fillStyle = '#065f46'; ctx.beginPath(); ctx.roundRect(-8, -7, 17, 20, 4); ctx.fill();
                ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(0, -14, 8, 0, Math.PI * 2); ctx.fill();
                // Feathered Hat
                ctx.fillStyle = '#d97706'; ctx.fillRect(-10, -20, 20, 4);
                ctx.fillStyle = '#ef4444'; ctx.fillRect(4, -26, 3, 7);
            } else if (this.type === 'blacksmith') {
                // Muscle Blacksmith with Leather Apron & Heavy Steel Anvil
                ctx.fillStyle = '#7c2d12'; ctx.beginPath(); ctx.roundRect(-10, -7, 20, 20, 4); ctx.fill();
                ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(0, -14, 8.5, 0, Math.PI * 2); ctx.fill();
                // Steel Anvil
                ctx.fillStyle = '#475569';
                ctx.beginPath(); ctx.roundRect(10, -4, 15, 14, 2); ctx.fill();
                ctx.fillStyle = '#94a3b8';
                ctx.fillRect(8, -8, 19, 4);
            } else if (this.type === 'gambler') {
                // Stylish Gambler Jack with Emerald Fedora & Golden Dice Cup
                ctx.fillStyle = '#064e3b'; ctx.beginPath(); ctx.roundRect(-9, -7, 18, 20, 4); ctx.fill();
                ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(0, -14, 8, 0, Math.PI * 2); ctx.fill();
                // Emerald Fedora
                ctx.fillStyle = '#047857'; ctx.fillRect(-12, -20, 24, 4);
                ctx.fillStyle = '#065f46'; ctx.fillRect(-7, -26, 14, 7);
                ctx.fillStyle = '#facc15'; ctx.fillRect(-7, -20, 14, 2); // Gold Ribbon
                // Golden Dice Cup & Dice
                ctx.fillStyle = '#d97706'; ctx.beginPath(); ctx.roundRect(8, -6, 10, 14, 2); ctx.fill();
                ctx.fillStyle = '#ffffff'; ctx.fillRect(10, -10, 6, 6);
                ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(13, -7, 1.2, 0, Math.PI * 2); ctx.fill();
            } else if (this.type === 'trial_merchant') {
                // Astel: Celestial Trial Keeper with Blue Robe & Glowing Star Staff
                ctx.fillStyle = '#0369a1'; ctx.beginPath(); ctx.roundRect(-9, -7, 18, 20, 4); ctx.fill();
                ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(0, -14, 8, 0, Math.PI * 2); ctx.fill();
                // Celestial Hood
                ctx.fillStyle = '#0284c7'; ctx.fillRect(-11, -21, 22, 5);
                ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(0, -20, 4, 0, Math.PI * 2); ctx.fill();
                // Star Staff
                ctx.fillStyle = '#cbd5e1'; ctx.fillRect(9, -24, 3, 30);
                ctx.fillStyle = '#38bdf8'; ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 10;
                ctx.beginPath(); ctx.arc(10.5, -24, 5, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;
            }

            const labelText = this.type === 'npc' ? '📜 장로 (퀘스트)' : (this.type === 'merchant' ? '🛒 만물 상인' : (this.type === 'blacksmith' ? '⚒️ 대장장이' : (this.type === 'gambler' ? '🎲 도박사 잭' : (this.type === 'trial_merchant' ? '✨ 아스텔 (시련 보물)' : ''))));
            const borderColor = this.type === 'npc' ? '#f59e0b' : (this.type === 'merchant' ? '#34d399' : (this.type === 'blacksmith' ? '#ef4444' : (this.type === 'trial_merchant' ? '#38bdf8' : '#f59e0b')));

            ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.roundRect(-38, -46, 76, 20, 10); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11.5px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(labelText, 0, -32);
        } else if (this.type === 'campfire') {
            this.fireAnim += 0.12;
            const flicker = Math.sin(this.fireAnim * 4.5) * 3;

            // Stone Hearth Ring
            const hearthStones = 8;
            for (let i = 0; i < hearthStones; i++) {
                const a = (i / hearthStones) * Math.PI * 2;
                ctx.fillStyle = '#475569';
                ctx.beginPath(); ctx.arc(Math.cos(a) * 12, Math.sin(a) * 6 + 6, 3.5, 0, Math.PI * 2); ctx.fill();
            }

            // Glowing Charcoal Coal
            ctx.fillStyle = '#7f1d1d';
            ctx.beginPath(); ctx.ellipse(0, 5, 9, 4, 0, 0, Math.PI * 2); ctx.fill();

            // Layer 1: Dark Ruby Outer Flame
            ctx.fillStyle = '#dc2626';
            ctx.shadowColor = '#ea580c';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.moveTo(-9, 4); ctx.quadraticCurveTo(-4, -10 + flicker, 0, -22 + flicker);
            ctx.quadraticCurveTo(4, -10 + flicker, 9, 4);
            ctx.closePath(); ctx.fill();

            // Layer 2: Radiant Orange Mid Flame
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.moveTo(-6, 4); ctx.quadraticCurveTo(-2, -7 + flicker, 0, -16 + flicker * 0.8);
            ctx.quadraticCurveTo(2, -7 + flicker, 6, 4);
            ctx.closePath(); ctx.fill();

            // Layer 3: Blazing White/Yellow Core
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.moveTo(-3, 4); ctx.lineTo(0, -9 + flicker * 0.5); ctx.lineTo(3, 4);
            ctx.closePath(); ctx.fill();
            ctx.shadowBlur = 0;
        }

        ctx.restore();
    }
}
