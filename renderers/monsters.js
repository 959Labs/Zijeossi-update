// ============================================================================
// Monster High-Fidelity Custom Rendering Engine (21 Standard Mob Archetypes)
// ============================================================================

function renderMonsterGraphic(ctx, enemy) {
    const t = enemy.animTimer || 0;
    const r = enemy.radius || 16;
    const col = enemy.color || '#ef4444';
    const type = enemy.type;

    if (enemy.isBoss) {
        renderBossGraphic(ctx, enemy, t, r, col, type);
        return;
    }

    switch(type) {
        case 'slime':
            renderSlime(ctx, t, r, col);
            break;
        case 'forest_goblin':
            renderGoblin(ctx, t, r, col);
            break;
        case 'ent':
            renderEnt(ctx, t, r, col);
            break;
        case 'zombie':
            renderZombie(ctx, t, r, col);
            break;
        case 'scorpion':
            renderScorpion(ctx, t, r, col);
            break;
        case 'mummy':
            renderMummy(ctx, t, r, col);
            break;
        case 'drake':
            renderDrake(ctx, t, r, col);
            break;
        case 'frost_wolf':
            renderFrostWolf(ctx, t, r, col);
            break;
        case 'abyss_angler':
            renderAbyssAngler(ctx, t, r, col);
            break;
        case 'poison_spider':
            renderSpider(ctx, t, r, col);
            break;
        case 'void_walker':
            renderVoidWalker(ctx, t, r, col);
            break;
        case 'celestial_avatar':
            renderCelestialAvatar(ctx, t, r, col);
            break;
        case 'skeleton':
            renderSkeleton(ctx, t, r, col);
            break;
        case 'archer':
            renderArcher(ctx, t, r, col);
            break;
        case 'bat':
            renderBat(ctx, t, r, col);
            break;
        case 'golem':
            renderGolem(ctx, t, r, col);
            break;
        case 'wraith':
            renderWraith(ctx, t, r, col);
            break;
        case 'frost_wraith':
            renderFrostWraith(ctx, t, r, col);
            break;
        case 'frost_golem':
            renderFrostGolem(ctx, t, r, col);
            break;
        case 'sentinel':
            renderSentinel(ctx, t, r, col);
            break;
        case 'valkyrie':
            renderValkyrie(ctx, t, r, col);
            break;
        default:
            renderSlime(ctx, t, r, col);
            break;
    }
}

// --- 1. Slime ---
function renderSlime(ctx, t, r, col) {
    const sqX = Math.sin(t * 3.5) * (r * 0.15);
    const sqY = -sqX * 0.8;
    const g = ctx.createRadialGradient(-r * 0.25, -r * 0.3, 2, 0, 0, r + 4);
    g.addColorStop(0, '#86efac');
    g.addColorStop(0.5, col || '#22c55e');
    g.addColorStop(1, '#14532d');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, r + sqX, r + sqY, 0, 0, Math.PI * 2);
    ctx.fill();

    // Inner Core
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.ellipse(-r * 0.25, -r * 0.3, r * 0.35, r * 0.2, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Cute Anime Eyes
    const eyeY = -r * 0.05 + sqY * 0.5;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(-r * 0.35, eyeY, r * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.35, eyeY, r * 0.18, 0, Math.PI * 2); ctx.fill();
    // Specular shine
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(-r * 0.38, eyeY - 1.5, r * 0.08, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.32, eyeY - 1.5, r * 0.08, 0, Math.PI * 2); ctx.fill();

    // Blush
    ctx.fillStyle = 'rgba(244, 114, 182, 0.55)';
    ctx.beginPath(); ctx.ellipse(-r * 0.45, eyeY + 3.5, r * 0.12, r * 0.07, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(r * 0.45, eyeY + 3.5, r * 0.12, r * 0.07, 0, 0, Math.PI * 2); ctx.fill();
}

// --- 2. Forest Goblin ---
function renderGoblin(ctx, t, r, col) {
    const bob = Math.sin(t * 4) * 2;
    // Goblin Body & Leather Tunic
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(-r * 0.6, -r * 0.1 + bob, r * 1.2, r * 0.9, 4);
    ctx.fill();

    // Head
    ctx.fillStyle = '#65a30d';
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.45 + bob, r * 0.65, r * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pointy Goblin Ears
    ctx.fillStyle = '#65a30d';
    ctx.beginPath();
    ctx.moveTo(-r * 0.4, -r * 0.5 + bob);
    ctx.lineTo(-r * 1.35, -r * 0.75 + bob);
    ctx.lineTo(-r * 0.3, -r * 0.15 + bob);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(r * 0.4, -r * 0.5 + bob);
    ctx.lineTo(r * 1.35, -r * 0.75 + bob);
    ctx.lineTo(r * 0.3, -r * 0.15 + bob);
    ctx.closePath();
    ctx.fill();

    // Inner ear
    ctx.fillStyle = '#84cc16';
    ctx.beginPath();
    ctx.moveTo(-r * 0.4, -r * 0.45 + bob);
    ctx.lineTo(-r * 1.1, -r * 0.65 + bob);
    ctx.lineTo(-r * 0.35, -r * 0.25 + bob);
    ctx.closePath();
    ctx.fill();

    // Headband
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-r * 0.65, -r * 0.75 + bob, r * 1.3, r * 0.22);

    // Glowing Yellow Eyes
    ctx.fillStyle = '#facc15';
    ctx.beginPath(); ctx.ellipse(-r * 0.25, -r * 0.45 + bob, r * 0.14, r * 0.18, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(r * 0.25, -r * 0.45 + bob, r * 0.14, r * 0.18, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-r * 0.27, -r * 0.52 + bob, 2.5, r * 0.26);
    ctx.fillRect(r * 0.23, -r * 0.52 + bob, 2.5, r * 0.26);

    // Bottom Fangs
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-r * 0.2, -r * 0.15 + bob); ctx.lineTo(-r * 0.13, -r * 0.3 + bob); ctx.lineTo(-r * 0.06, -r * 0.15 + bob);
    ctx.moveTo(r * 0.06, -r * 0.15 + bob); ctx.lineTo(r * 0.13, -r * 0.3 + bob); ctx.lineTo(r * 0.2, -r * 0.15 + bob);
    ctx.fill();

    // Jagged Cleaver Weapon in Hand
    ctx.save();
    ctx.translate(r * 0.7, -r * 0.1 + bob);
    ctx.rotate(0.3 + Math.sin(t * 4) * 0.2);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-2, -r * 0.8, 6, r * 0.9);
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(4, -r * 0.8); ctx.lineTo(10, -r * 0.9); ctx.lineTo(8, 0); ctx.lineTo(4, 0);
    ctx.fill();
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-2, 0, 4, 6);
    ctx.restore();
}

// --- 3. Ancient Ent ---
function renderEnt(ctx, t, r, col) {
    const sway = Math.sin(t * 2) * 2.5;
    // Bark Trunk
    ctx.fillStyle = '#3f2010';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.1, r * 0.75, r * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bark Grain
    ctx.strokeStyle = '#271206';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, r * 0.1, r * 0.5, -Math.PI * 0.3, Math.PI * 0.3); ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, r * 0.1, r * 0.3, Math.PI * 0.7, Math.PI * 1.3); ctx.stroke();

    // Branch Antlers Left & Right
    ctx.fillStyle = '#522b15';
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, -r * 0.4);
    ctx.quadraticCurveTo(-r * 1.2 + sway, -r * 0.9, -r * 1.4 + sway, -r * 1.2);
    ctx.lineTo(-r * 1.1 + sway, -r * 1.1);
    ctx.quadraticCurveTo(-r * 0.8, -r * 0.7, -r * 0.3, -r * 0.6);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(r * 0.5, -r * 0.4);
    ctx.quadraticCurveTo(r * 1.2 - sway, -r * 0.9, r * 1.4 - sway, -r * 1.2);
    ctx.lineTo(r * 1.1 - sway, -r * 1.1);
    ctx.quadraticCurveTo(r * 0.8, -r * 0.7, r * 0.3, -r * 0.6);
    ctx.fill();

    // Lush Leaf Canopy (Foliage)
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(0, -r * 0.85, r * 0.55, 0, Math.PI * 2);
    ctx.arc(-r * 0.6 + sway * 0.5, -r * 0.75, r * 0.45, 0, Math.PI * 2);
    ctx.arc(r * 0.6 - sway * 0.5, -r * 0.75, r * 0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(-r * 0.2, -r * 0.95, r * 0.35, 0, Math.PI * 2);
    ctx.arc(r * 0.3, -r * 0.85, r * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Emerald Runic Eyes
    ctx.fillStyle = '#4ade80';
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.arc(-r * 0.28, -r * 0.15, r * 0.14, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.28, -r * 0.15, r * 0.14, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Beard of Root Tendrils
    ctx.strokeStyle = '#3f2010';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-r * 0.3, r * 0.4); ctx.lineTo(-r * 0.2, r * 0.9 + sway);
    ctx.moveTo(0, r * 0.4); ctx.lineTo(0, r * 1.05);
    ctx.moveTo(r * 0.3, r * 0.4); ctx.lineTo(r * 0.2, r * 0.9 - sway);
    ctx.stroke();
}

// --- 4. Zombie ---
function renderZombie(ctx, t, r, col) {
    const lurch = Math.sin(t * 3) * 3;
    // Tattered Shroud
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(-r * 0.6, -r * 0.1);
    ctx.lineTo(r * 0.6, -r * 0.1);
    ctx.lineTo(r * 0.8, r * 0.8);
    ctx.lineTo(r * 0.4, r * 0.6);
    ctx.lineTo(0, r * 0.85);
    ctx.lineTo(-r * 0.4, r * 0.6);
    ctx.lineTo(-r * 0.8, r * 0.8);
    ctx.closePath();
    ctx.fill();

    // Decayed Head
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.5 + lurch * 0.5, r * 0.55, r * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Reaching Claw Arms
    ctx.fillStyle = '#334155';
    ctx.fillRect(-r * 1.05, -r * 0.2 + lurch, r * 0.5, r * 0.25);
    ctx.fillRect(r * 0.55, -r * 0.4 - lurch, r * 0.55, r * 0.25);
    // Dark Claw nails
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-r * 1.15, -r * 0.22 + lurch, 3, 5);
    ctx.fillRect(r * 1.1, -r * 0.42 - lurch, 3, 5);

    // Stitched Scars
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-r * 0.3, -r * 0.65 + lurch * 0.5); ctx.lineTo(-r * 0.1, -r * 0.35 + lurch * 0.5);
    ctx.stroke();

    // Glowing Cyan Hollow Dead Eyes
    ctx.fillStyle = '#67e8f9';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 5;
    ctx.beginPath(); ctx.arc(-r * 0.22, -r * 0.5 + lurch * 0.5, r * 0.14, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.22, -r * 0.5 + lurch * 0.5, r * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
}

// --- 5. Desert Scorpion ---
function renderScorpion(ctx, t, r, col) {
    const tailWiggle = Math.sin(t * 5) * 3;
    const legWalk = Math.sin(t * 6) * 2.5;

    // 6 Legs
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i++) {
        const offset = i * r * 0.35;
        // Left
        ctx.beginPath();
        ctx.moveTo(-r * 0.4, offset);
        ctx.lineTo(-r * 0.9, offset - r * 0.2 + legWalk * i);
        ctx.lineTo(-r * 1.2, offset + r * 0.2 + legWalk * i);
        ctx.stroke();
        // Right
        ctx.beginPath();
        ctx.moveTo(r * 0.4, offset);
        ctx.lineTo(r * 0.9, offset - r * 0.2 - legWalk * i);
        ctx.lineTo(r * 1.2, offset + r * 0.2 - legWalk * i);
        ctx.stroke();
    }

    // Carapace Body
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.55, r * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Segment Plates
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-r * 0.4, -r * 0.4, r * 0.8, r * 0.18);
    ctx.fillRect(-r * 0.45, -r * 0.1, r * 0.9, r * 0.18);
    ctx.fillRect(-r * 0.4, r * 0.2, r * 0.8, r * 0.18);

    // Front Claws / Pincers
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-r * 0.7, -r * 0.8, r * 0.3, r * 0.5);
    ctx.fillRect(r * 0.4, -r * 0.8, r * 0.3, r * 0.5);

    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(-r * 0.65, -r * 0.9, r * 0.28, 0, Math.PI * 2);
    ctx.arc(r * 0.65, -r * 0.9, r * 0.28, 0, Math.PI * 2);
    ctx.fill();

    // Arched Overhead Stinger Tail
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.6);
    ctx.quadraticCurveTo(tailWiggle, r * 1.2, tailWiggle * 1.5, r * 0.2);
    ctx.quadraticCurveTo(tailWiggle * 2, -r * 0.6, tailWiggle, -r * 1.1);
    ctx.stroke();

    // Stinger Barb with Poison
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(tailWiggle - 3, -r * 1.05);
    ctx.lineTo(tailWiggle + 5, -r * 1.3);
    ctx.lineTo(tailWiggle + 3, -r * 0.95);
    ctx.fill();

    // Glowing Poison Droplet
    ctx.fillStyle = '#22c55e';
    ctx.shadowColor = '#4ade80';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(tailWiggle + 6, -r * 1.35, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Glowing Red Eyes
    ctx.fillStyle = '#f87171';
    ctx.fillRect(-r * 0.2, -r * 0.55, 3, 3);
    ctx.fillRect(r * 0.1, -r * 0.55, 3, 3);
}

// --- 6. Mummy ---
function renderMummy(ctx, t, r, col) {
    const floatWrap = Math.sin(t * 3.5) * 4;
    // Wrapped Body
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.65, r * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bandage Stripes (Crisscrossing)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-r * 0.6, -r * 0.5); ctx.lineTo(r * 0.6, -r * 0.2);
    ctx.moveTo(-r * 0.65, -r * 0.1); ctx.lineTo(r * 0.65, 0.2);
    ctx.moveTo(-r * 0.6, 0.3); ctx.lineTo(r * 0.6, 0.6);
    ctx.moveTo(r * 0.6, -r * 0.5); ctx.lineTo(-r * 0.6, -r * 0.2);
    ctx.moveTo(r * 0.65, -r * 0.1); ctx.lineTo(-r * 0.65, 0.2);
    ctx.stroke();

    // Loose Trailing Wraps
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(-r * 0.6, 0);
    ctx.quadraticCurveTo(-r * 1.2, floatWrap, -r * 1.4, floatWrap * 1.5);
    ctx.lineTo(-r * 0.5, 0.2);
    ctx.fill();

    // Golden Pharaoh Collar
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(0, -r * 0.1, r * 0.45, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-r * 0.15, -r * 0.05, r * 0.3, r * 0.15);

    // Dark Shadowy Eye Slit & Glowing Crimson Curse Eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-r * 0.45, -r * 0.55, r * 0.9, r * 0.25);

    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#f87171';
    ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.arc(-r * 0.22, -r * 0.43, r * 0.12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.22, -r * 0.43, r * 0.12, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
}

// --- 7. Drake (Lesser Dragon) ---
function renderDrake(ctx, t, r, col) {
    const flap = Math.sin(t * 6) * (r * 0.4);
    // Dragon Wings Left & Right
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.moveTo(-r * 0.3, -r * 0.2);
    ctx.lineTo(-r * 1.4, -r * 0.8 + flap);
    ctx.lineTo(-r * 1.1, 0 + flap);
    ctx.lineTo(-r * 0.6, -r * 0.1);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(r * 0.3, -r * 0.2);
    ctx.lineTo(r * 1.4, -r * 0.8 + flap);
    ctx.lineTo(r * 1.1, 0 + flap);
    ctx.lineTo(r * 0.6, -r * 0.1);
    ctx.closePath();
    ctx.fill();

    // Dragon Torso
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.6, r * 0.75, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pale Underbelly Plates
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.1, r * 0.35, r * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Horned Dragon Head
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.6, r * 0.5, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Back-Swept Horns
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.moveTo(-r * 0.3, -r * 0.8); ctx.lineTo(-r * 0.7, -r * 1.3); ctx.lineTo(-r * 0.15, -r * 0.9);
    ctx.moveTo(r * 0.3, -r * 0.8); ctx.lineTo(r * 0.7, -r * 1.3); ctx.lineTo(r * 0.15, -r * 0.9);
    ctx.fill();

    // Glowing Fiery Eyes & Mouth Glow
    ctx.fillStyle = '#f97316';
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.arc(-r * 0.2, -r * 0.6, r * 0.12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.2, -r * 0.6, r * 0.12, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Spiked Tail
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.6);
    ctx.quadraticCurveTo(-r * 0.5, r * 1.1, -r * 0.8, r * 1.2);
    ctx.stroke();
}

// --- 8. Frost Wolf ---
function renderFrostWolf(ctx, t, r, col) {
    const tailWag = Math.sin(t * 6) * 4;
    // Bushy Ice Tail
    ctx.fillStyle = '#7dd3fc';
    ctx.beginPath();
    ctx.moveTo(0, r * 0.5);
    ctx.quadraticCurveTo(-r * 0.8 + tailWag, r * 0.9, -r * 1.1 + tailWag, r * 1.2);
    ctx.lineTo(-r * 0.4, r * 0.7);
    ctx.fill();

    // Wolf Body & Spiky Frost Mane
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.65, r * 0.75, 0, 0, Math.PI * 2);
    ctx.fill();

    // Icicle Mane Spikes
    ctx.fillStyle = '#e0f2fe';
    for (let i = -2; i <= 2; i++) {
        const a = (i / 3) * Math.PI * 0.6 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a - 0.2) * r * 0.6, Math.sin(a - 0.2) * r * 0.6);
        ctx.lineTo(Math.cos(a) * r * 1.15, Math.sin(a) * r * 1.15);
        ctx.lineTo(Math.cos(a + 0.2) * r * 0.6, Math.sin(a + 0.2) * r * 0.6);
        ctx.fill();
    }

    // Wolf Head & Snout
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.45, r * 0.5, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pointed Wolf Ears
    ctx.fillStyle = '#0369a1';
    ctx.beginPath();
    ctx.moveTo(-r * 0.4, -r * 0.6); ctx.lineTo(-r * 0.6, -r * 1.1); ctx.lineTo(-r * 0.15, -r * 0.75);
    ctx.moveTo(r * 0.4, -r * 0.6); ctx.lineTo(r * 0.6, -r * 1.1); ctx.lineTo(r * 0.15, -r * 0.75);
    ctx.fill();

    // Piercing Ice-Blue Eyes & Fangs
    ctx.fillStyle = '#f0fdf4';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.ellipse(-r * 0.2, -r * 0.5, r * 0.12, r * 0.08, -0.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(r * 0.2, -r * 0.5, r * 0.12, r * 0.08, 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
}

// --- 9. Abyss Angler (Deep-Sea Fish) ---
function renderAbyssAngler(ctx, t, r, col) {
    const finWiggle = Math.sin(t * 5) * 3;
    // Deep Sea Fish Body
    const g = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
    g.addColorStop(0, '#14b8a6');
    g.addColorStop(0.7, '#0f766e');
    g.addColorStop(1, '#042f2e');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.8, r * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();

    // Translucent Fins
    ctx.fillStyle = 'rgba(45, 212, 191, 0.45)';
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.6); ctx.lineTo(r * 0.4, -r * 1.0 + finWiggle); ctx.lineTo(r * 0.6, -r * 0.5);
    ctx.fill();

    // Curved Angler Lure Stalk
    ctx.strokeStyle = '#2dd4bf';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-r * 0.2, -r * 0.6);
    ctx.quadraticCurveTo(-r * 0.8, -r * 1.3, -r * 1.1, -r * 0.9);
    ctx.stroke();

    // Glowing Bioluminescent Lure Bulb
    const pulse = Math.sin(t * 6) * 2;
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 10 + pulse;
    ctx.beginPath();
    ctx.arc(-r * 1.1, -r * 0.9, 4.5 + pulse * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Gaping Needle-Toothed Mouth
    ctx.fillStyle = '#042f2e';
    ctx.beginPath();
    ctx.arc(-r * 0.35, r * 0.1, r * 0.35, 0, Math.PI);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    for (let i = -2; i <= 2; i++) {
        ctx.fillRect(-r * 0.35 + i * 4, r * 0.1, 2, 5);
    }
}

// --- 10. Poison Spider ---
function renderSpider(ctx, t, r, col) {
    const legCycle = Math.sin(t * 7);
    // 8 Articulated Legs
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 4; i++) {
        const offY = (i - 1.5) * r * 0.35;
        const dir = (i % 2 === 0 ? 1 : -1) * legCycle * 4;
        // Left Legs
        ctx.beginPath();
        ctx.moveTo(-r * 0.3, offY);
        ctx.lineTo(-r * 0.9, offY - r * 0.4 + dir);
        ctx.lineTo(-r * 1.3, offY + r * 0.3 + dir);
        ctx.stroke();
        // Right Legs
        ctx.beginPath();
        ctx.moveTo(r * 0.3, offY);
        ctx.lineTo(r * 0.9, offY - r * 0.4 - dir);
        ctx.lineTo(r * 1.3, offY + r * 0.3 - dir);
        ctx.stroke();
    }

    // Bulbous Abdomen
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.25, r * 0.6, r * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Toxic Skull/Cross Marking
    ctx.fillStyle = '#a3e635';
    ctx.shadowColor = '#84cc16';
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(0, r * 0.2, r * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-r * 0.22, r * 0.35, r * 0.44, 3);
    ctx.shadowBlur = 0;

    // Cephalothorax Head
    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.35, r * 0.45, r * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cluster of 6 Red Eyes
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-r * 0.2, -r * 0.42, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.arc(0, -r * 0.45, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.arc(r * 0.2, -r * 0.42, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.arc(-r * 0.1, -r * 0.32, 2, 0, Math.PI * 2); ctx.fill();
    ctx.arc(r * 0.1, -r * 0.32, 2, 0, Math.PI * 2); ctx.fill();

    // Fangs with Venom
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-r * 0.15, -r * 0.1); ctx.lineTo(-r * 0.1, 0); ctx.lineTo(-r * 0.05, -r * 0.1);
    ctx.moveTo(r * 0.05, -r * 0.1); ctx.lineTo(r * 0.1, 0); ctx.lineTo(r * 0.15, -r * 0.1);
    ctx.fill();
}

// --- 11. Void Walker ---
function renderVoidWalker(ctx, t, r, col) {
    const rot = t * 2;
    // Swirling Cosmic Void Core
    const g = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
    g.addColorStop(0, '#c084fc');
    g.addColorStop(0.5, '#7e22ce');
    g.addColorStop(1, '#090514');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Floating Obsidian Shards
    ctx.fillStyle = '#1e1b4b';
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 4; i++) {
        const a = rot + (i * Math.PI / 2);
        const dist = r * 0.95;
        const sx = Math.cos(a) * dist;
        const sy = Math.sin(a) * dist;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(a + Math.PI / 4);
        ctx.beginPath();
        ctx.moveTo(0, -6); ctx.lineTo(4, 0); ctx.lineTo(0, 6); ctx.lineTo(-4, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    // Singularity Purple Eye
    ctx.fillStyle = '#f3e8ff';
    ctx.shadowColor = '#d8b4fe';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.28, r * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

// --- 12. Celestial Avatar ---
function renderCelestialAvatar(ctx, t, r, col) {
    const wingWave = Math.sin(t * 4) * 0.2;
    // Golden Sacred Halo
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, -r * 0.5, r * 0.7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Luminous Wings of Light
    ctx.fillStyle = 'rgba(254, 240, 138, 0.75)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-r * 1.5, -r * 1.2 + wingWave * 20, -r * 1.6, -r * 0.3);
    ctx.quadraticCurveTo(-r * 1.1, 0.2, 0, r * 0.2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(r * 1.5, -r * 1.2 - wingWave * 20, r * 1.6, -r * 0.3);
    ctx.quadraticCurveTo(r * 1.1, 0.2, 0, r * 0.2);
    ctx.fill();

    // Sacred Diamond Body
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.7); ctx.lineTo(r * 0.5, 0); ctx.lineTo(0, r * 0.8); ctx.lineTo(-r * 0.5, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
    ctx.fill();
}

// --- 13. Skeleton Warrior ---
function renderSkeleton(ctx, t, r, col) {
    const rattle = Math.sin(t * 5) * 1.5;
    // Bone Ribcage
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2.2;
    for (let i = -1; i <= 2; i++) {
        ctx.beginPath();
        ctx.arc(0, i * 4 + rattle, r * 0.45, Math.PI * 0.15, Math.PI * 0.85);
        ctx.stroke();
    }
    // Spine
    ctx.fillRect(-1.5, -r * 0.1 + rattle, 3, r * 0.7);

    // Bone Skull
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.5 + rattle, r * 0.55, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    // Jaw
    ctx.fillRect(-r * 0.25, -r * 0.25 + rattle, r * 0.5, r * 0.2);

    // Hollow Sockets with Soul Flames
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-r * 0.2, -r * 0.5 + rattle, r * 0.15, 0, Math.PI * 2);
    ctx.arc(r * 0.2, -r * 0.5 + rattle, r * 0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(-r * 0.2, -r * 0.5 + rattle, 2, 0, Math.PI * 2);
    ctx.arc(r * 0.2, -r * 0.5 + rattle, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Bone Sword in Hand
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(r * 0.6, -r * 0.8 + rattle, 3, r * 1.1);
    ctx.fillRect(r * 0.45, -r * 0.1 + rattle, r * 0.35, 3);
}

// --- 14. Skeleton Archer ---
function renderArcher(ctx, t, r, col) {
    const aim = Math.sin(t * 3) * 0.1;
    // Hooded Ranger Cowl
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.95);
    ctx.lineTo(r * 0.65, -r * 0.3);
    ctx.lineTo(r * 0.5, r * 0.5);
    ctx.lineTo(-r * 0.5, r * 0.5);
    ctx.lineTo(-r * 0.65, -r * 0.3);
    ctx.closePath();
    ctx.fill();

    // Shadow face with glowing yellow eyes
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, -r * 0.4, r * 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(-r * 0.18, -r * 0.4, 2.5, 0, Math.PI * 2);
    ctx.arc(r * 0.18, -r * 0.4, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Drawn Curved Longbow
    ctx.save();
    ctx.rotate(aim);
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(r * 0.7, 0, r * 0.65, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();

    // Bowstring & Arrow
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(r * 0.9, -r * 0.55); ctx.lineTo(r * 0.3, 0); ctx.lineTo(r * 0.9, r * 0.55);
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(r * 0.3, -1.5, r * 0.8, 3);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(r * 1.1, -3); ctx.lineTo(r * 1.3, 0); ctx.lineTo(r * 1.1, 3); ctx.fill();
    ctx.restore();
}

// --- 15. Vampire Bat ---
function renderBat(ctx, t, r, col) {
    const flap = Math.sin(t * 8) * (r * 0.6);
    // Leathery Flapping Wings
    ctx.fillStyle = '#3b0764';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-r * 0.8, -r * 1.2 + flap, -r * 1.5, -r * 0.3 + flap);
    ctx.lineTo(-r * 1.1, r * 0.4 + flap * 0.5);
    ctx.lineTo(-r * 0.6, 0.1);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(r * 0.8, -r * 1.2 + flap, r * 1.5, -r * 0.3 + flap);
    ctx.lineTo(r * 1.1, r * 0.4 + flap * 0.5);
    ctx.lineTo(r * 0.6, 0.1);
    ctx.closePath();
    ctx.fill();

    // Furry Bat Body
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.45, r * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pointed Bat Ears
    ctx.fillStyle = '#581c87';
    ctx.beginPath();
    ctx.moveTo(-r * 0.3, -r * 0.4); ctx.lineTo(-r * 0.45, -r * 0.95); ctx.lineTo(-r * 0.1, -r * 0.6);
    ctx.moveTo(r * 0.3, -r * 0.4); ctx.lineTo(r * 0.45, -r * 0.95); ctx.lineTo(r * 0.1, -r * 0.6);
    ctx.fill();

    // Red Eyes & Fangs
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-r * 0.18, -r * 0.2, 2.5, 0, Math.PI * 2);
    ctx.arc(r * 0.18, -r * 0.2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-r * 0.12, 0, 2, 4);
    ctx.fillRect(r * 0.08, 0, 2, 4);
}

// --- 16. Stone Golem ---
function renderGolem(ctx, t, r, col) {
    const pulse = Math.sin(t * 3) * 0.3;
    // Heavy Boulder Body
    ctx.fillStyle = '#57534e';
    ctx.beginPath();
    ctx.roundRect(-r * 0.7, -r * 0.7, r * 1.4, r * 1.4, 8);
    ctx.fill();

    // Molten Orange Runic Cracks
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, -r * 0.3); ctx.lineTo(0, 0); ctx.lineTo(-r * 0.3, r * 0.5);
    ctx.moveTo(0, 0); ctx.lineTo(r * 0.4, -r * 0.2); ctx.lineTo(r * 0.5, r * 0.4);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Heavy Boulder Fists Left & Right
    ctx.fillStyle = '#44403c';
    ctx.beginPath();
    ctx.roundRect(-r * 1.3, -r * 0.2 + pulse * 4, r * 0.5, r * 0.6, 4);
    ctx.roundRect(r * 0.8, -r * 0.2 - pulse * 4, r * 0.5, r * 0.6, 4);
    ctx.fill();

    // Glowing Visor
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-r * 0.35, -r * 0.5, r * 0.7, 4);
}

// --- 17. Wraith ---
function renderWraith(ctx, t, r, col) {
    const floatMist = Math.sin(t * 4) * 4;
    // Ethereal Flowing Ghost Shroud
    ctx.fillStyle = 'rgba(76, 29, 149, 0.85)';
    ctx.beginPath();
    ctx.moveTo(-r * 0.6, -r * 0.6);
    ctx.lineTo(r * 0.6, -r * 0.6);
    ctx.quadraticCurveTo(r * 0.8, 0, r * 0.5 + floatMist, r * 1.2);
    ctx.lineTo(0, r * 0.8);
    ctx.quadraticCurveTo(-r * 0.8, 0, -r * 0.5 - floatMist, r * 1.2);
    ctx.closePath();
    ctx.fill();

    // Floating Hooded Skull
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, -r * 0.4, r * 0.45, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Soul Flames
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#60a5fa';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(-r * 0.18, -r * 0.45, 3.5, 0, Math.PI * 2);
    ctx.arc(r * 0.18, -r * 0.45, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

// --- 18. Frost Wraith ---
function renderFrostWraith(ctx, t, r, col) {
    const rot = t * 3;
    // Swirling Blizzard Mist
    ctx.fillStyle = 'rgba(125, 211, 252, 0.6)';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.85, r * 0.7, rot * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Floating Sharp Ice Crystals
    ctx.fillStyle = '#e0f2fe';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
        const a = rot + (i * Math.PI * 2 / 3);
        const ix = Math.cos(a) * (r * 0.95);
        const iy = Math.sin(a) * (r * 0.95);
        ctx.beginPath();
        ctx.moveTo(ix, iy - 6); ctx.lineTo(ix + 4, iy); ctx.lineTo(ix, iy + 6); ctx.lineTo(ix - 4, iy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    // Sapphire Core Eyes
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(-r * 0.2, -r * 0.2, 4, 0, Math.PI * 2);
    ctx.arc(r * 0.2, -r * 0.2, 4, 0, Math.PI * 2);
    ctx.fill();
}

// --- 19. Frost Golem ---
function renderFrostGolem(ctx, t, r, col) {
    // Glacial Ice Blocks
    ctx.fillStyle = 'rgba(186, 230, 253, 0.9)';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-r * 0.7, -r * 0.6);
    ctx.lineTo(0, -r * 1.0);
    ctx.lineTo(r * 0.7, -r * 0.6);
    ctx.lineTo(r * 0.8, r * 0.6);
    ctx.lineTo(0, r * 0.9);
    ctx.lineTo(-r * 0.8, r * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Inner Glowing Core
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

// --- 20. Sentinel Construct ---
function renderSentinel(ctx, t, r, col) {
    const rot = t * 2;
    // Orbiting Golden Gear Rings
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.0, r * 0.45, rot, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.0, r * 0.45, -rot, 0, Math.PI * 2);
    ctx.stroke();

    // Central Sphere & Laser Lens
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#f87171';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

// --- 21. Valkyrie ---
function renderValkyrie(ctx, t, r, col) {
    const wingFlap = Math.sin(t * 5) * 0.15;
    // Golden Feathered Wings
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-r * 1.4, -r * 1.2 + wingFlap * 15, -r * 1.6, -r * 0.2);
    ctx.lineTo(0, r * 0.2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(r * 1.4, -r * 1.2 - wingFlap * 15, r * 1.6, -r * 0.2);
    ctx.lineTo(0, r * 0.2);
    ctx.fill();

    // Winged Helm & Armored Body
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.5, r * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Winged Helmet Crest
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(-r * 0.35, -r * 0.7); ctx.lineTo(-r * 0.7, -r * 1.1); ctx.lineTo(-r * 0.15, -r * 0.85);
    ctx.moveTo(r * 0.35, -r * 0.7); ctx.lineTo(r * 0.7, -r * 1.1); ctx.lineTo(r * 0.15, -r * 0.85);
    ctx.fill();

    // Holy Spear
    ctx.fillStyle = '#fde047';
    ctx.fillRect(r * 0.6, -r * 1.2, 3, r * 1.8);
    ctx.beginPath();
    ctx.moveTo(r * 0.6 + 1.5, -r * 1.5); ctx.lineTo(r * 0.6 + 6, -r * 1.2); ctx.lineTo(r * 0.6 - 3, -r * 1.2);
    ctx.fill();
}

