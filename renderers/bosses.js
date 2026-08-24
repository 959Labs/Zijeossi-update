// ============================================================================
// Boss High-Tier Visual Rendering (Archetypes, Auras & Special Boss Visuals)
// ============================================================================

function renderBossGraphic(ctx, enemy, t, r, col, type) {
    const pulse = Math.sin(t * 3) * 3;
    const isEnraged = enemy.phase === 2;

    // 1. Boss Radiant Elemental Aura
    const auraGrad = ctx.createRadialGradient(0, 0, r * 0.4, 0, 0, r * 1.35 + pulse);
    auraGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    auraGrad.addColorStop(0.5, col || '#ef4444');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.35 + pulse, 0, Math.PI * 2);
    ctx.fill();

    // 2. Specific Boss Rendering
    if (type === 'boss_slime_king') {
        renderSlime(ctx, t, r * 0.9, col);
        renderRoyalCrown(ctx, r, '#facc15', ['#ef4444', '#38bdf8', '#ef4444']);
    } else if (type === 'boss_mushroom_emperor') {
        // Mushroom Spore Emperor
        ctx.fillStyle = '#581c87';
        ctx.beginPath();
        ctx.arc(0, -r * 0.2, r * 0.95, Math.PI, 0);
        ctx.fill();
        // Spore spots
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(-r * 0.4, -r * 0.5, r * 0.18, 0, Math.PI * 2);
        ctx.arc(r * 0.35, -r * 0.6, r * 0.22, 0, Math.PI * 2);
        ctx.arc(0, -r * 0.8, r * 0.14, 0, Math.PI * 2);
        ctx.fill();
        // Stalk
        ctx.fillStyle = '#f3e8ff';
        ctx.fillRect(-r * 0.4, -r * 0.2, r * 0.8, r * 0.8);
        renderRoyalCrown(ctx, r * 0.95, '#a855f7', ['#facc15', '#facc15']);
    } else if (type === 'boss_goblin_warlord') {
        renderGoblin(ctx, t, r * 0.85, col);
        // Dual Giant Battleaxes
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(-r * 0.9, -r * 0.7, r * 0.45, 0, Math.PI * 2);
        ctx.arc(r * 0.9, -r * 0.7, r * 0.45, 0, Math.PI * 2);
        ctx.fill();
        renderRoyalCrown(ctx, r * 0.85, '#991b1b', ['#facc15', '#000000']);
    } else if (type === 'boss_shadow_panther') {
        renderFrostWolf(ctx, t, r * 0.85, '#1e1b4b');
        // Purple shadow flames
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 10;
        ctx.strokeRect(-r * 0.7, -r * 0.7, r * 1.4, r * 1.4);
        ctx.shadowBlur = 0;
    } else if (type === 'boss_treant_ancient') {
        renderEnt(ctx, t, r * 0.85, col);
        renderRoyalCrown(ctx, r * 0.85, '#15803d', ['#facc15', '#4ade80']);
    } else if (type.includes('dragon') || type.includes('wyrm')) {
        renderDragonBoss(ctx, t, r, col);
    } else if (type.includes('knight') || type.includes('general')) {
        renderKnightBoss(ctx, t, r, col);
    } else if (type.includes('reaper') || type.includes('lich') || type.includes('banshee')) {
        renderWraith(ctx, t, r * 0.85, col);
        renderRoyalCrown(ctx, r * 0.85, '#7c3aed', ['#38bdf8', '#f43f5e']);
    } else if (type.includes('anubis') || type.includes('pharaoh') || type.includes('sphinx')) {
        renderMummy(ctx, t, r * 0.85, col);
        renderRoyalCrown(ctx, r * 0.85, '#facc15', ['#0284c7', '#dc2626']);
    } else if (type.includes('valkyrie') || type.includes('archangel') || type.includes('seraph')) {
        renderCelestialAvatar(ctx, t, r * 0.85, col);
        renderRoyalCrown(ctx, r * 0.85, '#fde047', ['#ffffff', '#ffffff']);
    } else if (type.includes('gargoyle') || type.includes('demon') || type.includes('inferno') || type.includes('lucifer')) {
        renderDemonBoss(ctx, t, r, col);
    } else if (type.includes('behemoth') || type.includes('colossus') || type.includes('golem')) {
        renderGolem(ctx, t, r * 0.85, col);
        renderRoyalCrown(ctx, r * 0.85, '#f59e0b', ['#ef4444']);
    } else {
        // Grand Boss Default
        const g = ctx.createRadialGradient(0, 0, 4, 0, 0, r);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.4, col);
        g.addColorStop(1, '#0f172a');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        renderRoyalCrown(ctx, r, '#facc15', ['#ef4444', '#38bdf8']);
    }

    // Enrage Fire Eyes (Phase 2)
    if (isEnraged) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#dc2626';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(0, 0, r + 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

// --- Boss Helper: Dragon Boss ---
function renderDragonBoss(ctx, t, r, col) {
    const flap = Math.sin(t * 5) * (r * 0.5);
    // Great Dragon Wings
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-r * 1.8, -r * 1.1 + flap);
    ctx.lineTo(-r * 1.3, r * 0.2 + flap);
    ctx.lineTo(-r * 0.6, 0);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r * 1.8, -r * 1.1 + flap);
    ctx.lineTo(r * 1.3, r * 0.2 + flap);
    ctx.lineTo(r * 0.6, 0);
    ctx.closePath();
    ctx.fill();

    // Dragon Body
    ctx.fillStyle = col || '#dc2626';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.75, r * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dragon Horns
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(-r * 0.4, -r * 0.8); ctx.lineTo(-r * 0.9, -r * 1.5); ctx.lineTo(-r * 0.2, -r * 1.0);
    ctx.moveTo(r * 0.4, -r * 0.8); ctx.lineTo(r * 0.9, -r * 1.5); ctx.lineTo(r * 0.2, -r * 1.0);
    ctx.fill();

    // Fiery Maw
    ctx.fillStyle = '#ea580c';
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, -r * 0.4, r * 0.3, 0, Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;
}

// --- Boss Helper: Dark Knight Boss ---
function renderKnightBoss(ctx, t, r, col) {
    // Flowing Cape
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.moveTo(-r * 0.7, -r * 0.3); ctx.lineTo(r * 0.7, -r * 0.3); ctx.lineTo(r * 0.9, r * 1.1); ctx.lineTo(-r * 0.9, r * 1.1);
    ctx.closePath();
    ctx.fill();

    // Black Gothic Plate Armor
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-r * 0.75, -r * 0.8, r * 1.5, r * 1.6, 8);
    ctx.fill();

    // Spiked Pauldrons
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(-r * 0.8, -r * 0.7); ctx.lineTo(-r * 1.3, -r * 0.9); ctx.lineTo(-r * 0.7, -r * 0.3);
    ctx.moveTo(r * 0.8, -r * 0.7); ctx.lineTo(r * 1.3, -r * 0.9); ctx.lineTo(r * 0.7, -r * 0.3);
    ctx.fill();

    // Glowing Visor Slit
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#dc2626';
    ctx.shadowBlur = 10;
    ctx.fillRect(-r * 0.45, -r * 0.4, r * 0.9, 5);
    ctx.shadowBlur = 0;

    // Colossal Dark Broadsword
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(r * 0.75, -r * 1.4, 5, r * 1.9);
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(r * 0.55, -r * 0.5, r * 0.45, 5);
}

// --- Boss Helper: Demon Lord Boss ---
function renderDemonBoss(ctx, t, r, col) {
    // 4 Hellfire Wings
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(-r * 1.6, -r * 0.9); ctx.lineTo(-r * 1.2, 0);
    ctx.moveTo(0, 0); ctx.lineTo(r * 1.6, -r * 0.9); ctx.lineTo(r * 1.2, 0);
    ctx.fill();

    // Giant Curved Demon Horns
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-r * 0.4, -r * 0.6); ctx.quadraticCurveTo(-r * 1.3, -r * 1.4, -r * 0.7, -r * 1.6); ctx.lineTo(-r * 0.2, -r * 0.8);
    ctx.moveTo(r * 0.4, -r * 0.6); ctx.quadraticCurveTo(r * 1.3, -r * 1.4, r * 0.7, -r * 1.6); ctx.lineTo(r * 0.2, -r * 0.8);
    ctx.fill();

    // Body
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.7, r * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Searing Eyes
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(-r * 0.25, -r * 0.35, 4, 0, Math.PI * 2);
    ctx.arc(r * 0.25, -r * 0.35, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

// --- Boss Helper: Royal Crown ---
function renderRoyalCrown(ctx, r, crownColor, gems) {
    ctx.fillStyle = crownColor || '#facc15';
    ctx.beginPath();
    ctx.moveTo(-r * 0.6, -r * 0.75);
    ctx.lineTo(-r * 0.75, -r * 1.25);
    ctx.lineTo(-r * 0.3, -r * 0.95);
    ctx.lineTo(0, -r * 1.35);
    ctx.lineTo(r * 0.3, -r * 0.95);
    ctx.lineTo(r * 0.75, -r * 1.25);
    ctx.lineTo(r * 0.6, -r * 0.75);
    ctx.closePath();
    ctx.fill();

    // Crown Base Rim
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(-r * 0.6, -r * 0.8, r * 1.2, 3.5);

    // Crown Gems
    if (gems && gems.length > 0) {
        ctx.fillStyle = gems[0] || '#ef4444';
        ctx.beginPath(); ctx.arc(0, -r * 1.1, 3, 0, Math.PI * 2); ctx.fill();
        if (gems.length > 1) {
            ctx.fillStyle = gems[1] || '#38bdf8';
            ctx.beginPath(); ctx.arc(-r * 0.45, -r * 1.0, 2.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(r * 0.45, -r * 1.0, 2.5, 0, Math.PI * 2); ctx.fill();
        }
    }
}

