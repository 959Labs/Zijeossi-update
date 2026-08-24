const CURRENT_CLIENT_VERSION = '3.0.0';
window.CURRENT_CLIENT_VERSION = CURRENT_CLIENT_VERSION;
const UPDATE_MANIFEST_URLS = [
    'https://raw.githubusercontent.com/959Labs/Zijeossi-update/main/version.json',
    'https://raw.githubusercontent.com/959Labs/Zijeossi-update/refs/heads/main/version.json',
    'https://cdn.jsdelivr.net/gh/959Labs/Zijeossi-update@main/version.json'
];
const UPDATE_SCRIPT_URLS = [
    'https://raw.githubusercontent.com/959Labs/Zijeossi-update/main/game.js',
    'https://raw.githubusercontent.com/959Labs/Zijeossi-update/refs/heads/main/game.js',
    'https://cdn.jsdelivr.net/gh/959Labs/Zijeossi-update@main/game.js'
];

function isNewerVersion(remote, local) {
    if (!remote || !local) return false;
    const rParts = remote.replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
    const lParts = local.replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(rParts.length, lParts.length); i++) {
        const r = rParts[i] || 0;
        const l = lParts[i] || 0;
        if (r > l) return true;
        if (r < l) return false;
    }
    return false;
}

function scrollElementIntoContainerView(container, element) {
    if (!container || !element) return;
    element.scrollIntoView({ block: 'nearest', behavior: 'auto' });
}



// ============================================================================
// 2D Top-Down Action RPG - 4K High-Fidelity Sprites, 5-Zone Massive Expansion,
// 12-Chapter Epic Questline, 4 Raid Bosses & World Map Atlas (M Key)
// ============================================================================

// ============================================================================
// Main Game Controller (15-Zone World, M-Key Atlas, 30 Raid Bosses, 20 Quests)
// ============================================================================
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.minimapCanvas = document.getElementById('minimapCanvas');
        this.minimapCtx = this.minimapCanvas ? this.minimapCanvas.getContext('2d') : null;

        this.input = new InputHandler();
        this.camera = new Camera(window.innerWidth, window.innerHeight);
        this.particles = new ParticleSystem();

        this.ui = new UISystem(this);
        this.questSystem = new QuestSystem(this);
        this.casino = new CasinoSystem(this);
        this.inventory = new InventorySystem(this);
        this.shop = new ShopSystem(this);
        this.network = (typeof NetworkSystem !== 'undefined') ? new NetworkSystem(this) : null;
        this.chatSystem = (typeof ChatSystem !== 'undefined') ? new ChatSystem(this) : null;

        this.currentZone = 'village';
        this.mapWidth = 4200;
        this.mapHeight = 4200;
        this.windTime = 0;
        this.radarPulseTimer = 0;

        this.player = new Player(2100, 2100);
        this.enemies = [];
        this.props = [];
        this.projectiles = [];
        this.quests = JSON.parse(JSON.stringify(QUEST_DB));
        this.isPaused = false;
        this.pauseSelectedIndex = 0;
        this.usedCodes = {};

        this.running = true;
        this.lastTime = performance.now();
        this.isDialogueOpen = false;
        this.isSettingsOpen = false;
        this.isGuideOpen = false;
        this.isTabRadarOpen = false;
        this.isSkillBookOpen = false;
        this.skillBookSelectedIndex = 0;
        this.skillBookWaitingKeyForSkillId = null;
        this.isInventoryOpen = false;
        this.isShopOpen = false;
        this.isForgeOpen = false;
        this.isWorldMapOpen = false;
        this.isMultiplayer = false;
        this.isMultiplayerModalOpen = false;

        this.autoPotionThreshold = 0.3; // Default: 30%
        this.autoPotionCooldown = 0;
        this.skillSlotWasOnCd = {};

        this.modalJustClosedThisFrame = false;

        // shopTab, shopSelectedIndex, shopSellSelectedIndex, shopWares, forgeSelectedIndex, bagSelectedIndex
        // → ShopSystem, InventorySystem이 단독 소유. Game 생성자에서 중복 선언 제거.

        this.respawnTimer = 0;
        this.ambientParticleTimer = 0;
        this.maxEnemies = 45;
        this.nearbyInteractable = null;

        this.settings = {
            bgmVolume: 0.25,
            sfxVolume: 0.6,
            screenShake: true,
            autoAim: true
        };

        this.isIntroOpen = true;
        this.introSelectedIndex = 0;
        this.isPrologueOpen = false;
        this.introParticles = [];
        this.traps = [];
        this.groundZones = [];

        window.game = this;
        this.ensureV210UI();

        this.titleCanvas = document.getElementById('titleBackgroundCanvas');
        this.titleCtx = this.titleCanvas ? this.titleCanvas.getContext('2d') : null;
        this.initTitleEmbers();

        this.towerFloor = 1;
        this.towerMaxFloor = 50;
        this.trialCoins = 0;
        this.isTowerFloorCleared = false;
        this.isTrialShopOpen = false;
        // trialShopSelectedIndex, trialShopWares
        // → ShopSystem이 단독 소유. Game 생성자에서 중복 선언 제거.

        this.initWorld();
        this.setupEventListeners();
        this.setupIntroEventListeners();
        this.resize();
        this.loadSettings();
        this.updateInventoryUI();
        this.updateQuestHUD();

        if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);
        this.autoSaveInterval = setInterval(() => {
            if (!this.isIntroOpen) this.saveGame(true);
        }, 10000);
    }

    isAnyModalOpen() {
        return this.isDialogueOpen || this.isShopOpen || this.isForgeOpen || this.isInventoryOpen || this.isSkillBookOpen || this.isSettingsOpen || this.isGuideOpen || this.isWorldMapOpen || this.isPrologueOpen || this.isPaused || this.isCasinoOpen || this.isTabRadarOpen || this.isTrialShopOpen || this.isMultiplayerModalOpen;
    }

    // ── ShopSystem 상태 프록시 (입력 핸들러에서 this.shopTab 형식으로 접근 가능) ──
    get shopTab()              { return this.shop   ? this.shop.shopTab              : 'buy'; }
    set shopTab(v)             { if   (this.shop)     this.shop.shopTab              = v; }
    get shopSelectedIndex()    { return this.shop   ? this.shop.shopSelectedIndex    : 0; }
    set shopSelectedIndex(v)   { if   (this.shop)     this.shop.shopSelectedIndex    = v; }
    get shopSellSelectedIndex(){ return this.shop   ? this.shop.shopSellSelectedIndex: 0; }
    set shopSellSelectedIndex(v){ if  (this.shop)     this.shop.shopSellSelectedIndex= v; }
    get shopWares()            { return this.shop   ? this.shop.shopWares            : []; }
    get trialShopSelectedIndex()   { return this.shop ? this.shop.trialShopSelectedIndex : 0; }
    set trialShopSelectedIndex(v)  { if  (this.shop)   this.shop.trialShopSelectedIndex  = v; }
    get trialShopWares()           { return this.shop ? this.shop.trialShopWares         : []; }

    // ── CasinoSystem 상태 프록시 ──
    get casinoTab()  { return this.casino ? this.casino.casinoTab : 'dice'; }
    set casinoTab(v) { if   (this.casino)   this.casino.casinoTab = v; }
    get casinoBet()  { return this.casino ? this.casino.casinoBet : 20; }
    set casinoBet(v) { if   (this.casino)   this.casino.casinoBet = v; }

    // ── InventorySystem 상태 프록시 ──
    get forgeSelectedIndex()   { return this.inventory ? this.inventory.forgeSelectedIndex : 0; }
    set forgeSelectedIndex(v)  { if (this.inventory)     this.inventory.forgeSelectedIndex = v; }
    get bagSelectedIndex()     { return this.inventory ? this.inventory.bagSelectedIndex : 0; }
    set bagSelectedIndex(v)   { if (this.inventory)     this.inventory.bagSelectedIndex = v; }

    resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 3);
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx.resetTransform();
        this.ctx.scale(dpr, dpr);
        this.camera.resize(window.innerWidth, window.innerHeight);
        this.ctx.imageSmoothingEnabled = true;

        const cCanvas = document.getElementById('cinematicCanvas');
        if (cCanvas) {
            cCanvas.width = window.innerWidth;
            cCanvas.height = window.innerHeight;
        }
    }

    initWorld() {
        this.ensureV210UI();
        this.enemies = [];
        this.props = [];
        this.projectiles = [];

        const zConf = ZONE_CONFIG[this.currentZone] || ZONE_CONFIG['village'];

        // 1. Interactive Town Props & Special Buildings
        if (zConf.isSafe) {
            this.props.push(new Prop(2160, 2040, 'npc'));            // 📜 장로
            this.props.push(new Prop(1980, 2080, 'merchant'));       // 🛒 만물 상인
            this.props.push(new Prop(2220, 2160, 'blacksmith'));     // ⚒️ 대장장이
            this.props.push(new Prop(2000, 2220, 'gambler'));        // 🎲 도박사 잭 (카지노)
            this.props.push(new Prop(2100, 1680, 'trial_merchant')); // ✨ 아스텔 (시련의 보물상인)
            this.props.push(new Prop(2100, 2140, 'campfire'));       // 🔥 온돌 모닥불
            this.props.push(new Prop(2100, 1960, 'bed'));            // 🛏️ 나태의 푹신한 침대
            this.props.push(new Prop(1980, 1960, 'chest'));          // 📦 좌측 보물상자
            this.props.push(new Prop(2220, 1960, 'chest'));          // 📦 우측 보물상자
            this.props.push(new Prop(2100, 1840, 'fountain'));       // ⛲ 회복의 분수대
        } else if (this.currentZone === 'trial_tower') {
            this.isTowerFloorCleared = false;
            this.props.push(new Prop(2100, 1920, 'shrine'));
            this.props.push(new Prop(2100, 2350, 'fountain'));
        } else {
            this.props.push(new Prop(2100, 1920, 'shrine'));
            this.props.push(new Prop(1200, 1200, 'fountain'));
            this.props.push(new Prop(3000, 3000, 'fountain'));
            this.props.push(new Prop(3000, 1200, 'chest'));
            this.props.push(new Prop(1200, 3000, 'chest'));
        }

        // 2. Zone Connection Portals
        if (zConf.portals) {
            zConf.portals.forEach(p => {
                this.props.push(new Prop(p.x, p.y, `portal_${p.to}`));
            });
        }

        // 3. Tower of Trial Special Floor Spawning
        if (this.currentZone === 'trial_tower') {
            const floor = this.towerFloor || 1;
            const floorScale = 1 + (floor - 1) * 0.15;
            const isGatekeeper = (floor % 10 === 0);
            const isMiniBoss = !isGatekeeper && (floor % 5 === 0);

            if (isGatekeeper) {
                const gatekeeperBosses = ['boss_dark_knight', 'boss_dragon_ancient', 'boss_anubis_shadow', 'boss_reaper', 'boss_god_king'];
                const bType = gatekeeperBosses[Math.min(gatekeeperBosses.length - 1, Math.floor(floor / 10) - 1)];
                const boss = new Enemy(2100, 1600, bType);
                boss.maxHp = Math.round(boss.maxHp * floorScale * 1.3);
                boss.hp = boss.maxHp;
                boss.attackPower = Math.round(boss.attackPower * (1 + (floor - 1) * 0.12));
                this.enemies.push(boss);
            } else if (isMiniBoss) {
                const miniBosses = ['boss_shadow_panther', 'boss_gargoyle_stone', 'boss_crystal_colossus', 'boss_blood_count'];
                const mbType = miniBosses[Math.floor(floor / 5) % miniBosses.length];
                const mb = new Enemy(2100, 1650, mbType);
                mb.maxHp = Math.round(mb.maxHp * floorScale);
                mb.hp = mb.maxHp;
                this.enemies.push(mb);
                for (let i = 0; i < 4; i++) {
                    const ang = (i / 4) * Math.PI * 2;
                    const ex = 2100 + Math.cos(ang) * 350;
                    const ey = 2100 + Math.sin(ang) * 350;
                    const minion = new Enemy(ex, ey, 'skeleton');
                    minion.maxHp = Math.round(minion.maxHp * floorScale);
                    minion.hp = minion.maxHp;
                    this.enemies.push(minion);
                }
            } else {
                const count = Math.min(12, 5 + Math.floor(floor / 4));
                const mobPool = ['goblin', 'skeleton', 'archer', 'orc_warrior', 'wraith', 'scorpion', 'golem'];
                for (let i = 0; i < count; i++) {
                    const ang = (i / count) * Math.PI * 2;
                    const dist = 320 + Math.random() * 200;
                    const ex = 2100 + Math.cos(ang) * dist;
                    const ey = 2100 + Math.sin(ang) * dist;
                    const mType = mobPool[(floor + i) % mobPool.length];
                    const e = new Enemy(ex, ey, mType);
                    e.maxHp = Math.round(e.maxHp * floorScale);
                    e.hp = e.maxHp;
                    e.attackPower = Math.round(e.attackPower * (1 + (floor - 1) * 0.08));
                    this.enemies.push(e);
                }
            }
            return;
        }

        // 3. Ambient Props (High density across 4200x4200)
        for (let i = 0; i < 90; i++) {
            const rx = Math.random() * (this.mapWidth - 400) + 200;
            const ry = Math.random() * (this.mapHeight - 400) + 200;
            if (Math.hypot(rx - 2100, ry - 2100) > 320) {
                const rand = Math.random();
                if (rand < 0.4) this.props.push(new Prop(rx, ry, 'bush'));
                else if (rand < 0.7) this.props.push(new Prop(rx, ry, 'tree'));
                else if (rand < 0.85) this.props.push(new Prop(rx, ry, 'rock'));
                else this.props.push(new Prop(rx, ry, 'crystal'));
            }
        }

        // 4. Spawn Zone Bosses (Only in hostile wilderness zones)
        if (!zConf.isSafe && zConf.bosses && zConf.bosses.length > 0) {
            if (zConf.bosses.length === 1) {
                this.enemies.push(new Enemy(2600, 2600, zConf.bosses[0]));
            } else if (zConf.bosses.length === 2) {
                this.enemies.push(new Enemy(1400, 1400, zConf.bosses[0]));
                this.enemies.push(new Enemy(2800, 2800, zConf.bosses[1]));
            } else {
                this.enemies.push(new Enemy(1400, 1400, zConf.bosses[0]));
                this.enemies.push(new Enemy(2800, 2800, zConf.bosses[1]));
                this.enemies.push(new Enemy(2800, 1400, zConf.bosses[2]));
            }
        }

        // 5. Spawn Standard Monsters (Only in hostile wilderness zones)
        if (!zConf.isSafe) {
            for (let i = 0; i < this.maxEnemies; i++) {
                this.spawnRandomEnemy(false);
            }
        }
    }

    switchZone(newZone, showAnimation = true, spawnX = 2100, spawnY = 2100) {
        if (!ZONE_CONFIG[newZone]) return;
        const overlay = document.getElementById('zoneTransitionOverlay');
        const titleEl = document.getElementById('zoneTitleText');
        const subEl = document.getElementById('zoneSubText');
        const zConf = ZONE_CONFIG[newZone];

        if (titleEl) titleEl.innerText = zConf.name;
        if (subEl) subEl.innerText = zConf.sub;

        if (!showAnimation) {
            this.currentZone = newZone;
            this.player.x = spawnX;
            this.player.y = spawnY;
            this.initWorld();
            return;
        }

        if (overlay) overlay.classList.add('active');

        setTimeout(() => {
            this.currentZone = newZone;
            this.player.x = spawnX;
            this.player.y = spawnY;
            this.initWorld();

            setTimeout(() => {
                if (overlay) overlay.classList.remove('active');
            }, 500);
        }, 400);
    }

    spawnRandomEnemy(showPortalFX = true) {
        const zConf = ZONE_CONFIG[this.currentZone] || ZONE_CONFIG['village'];
        if (zConf.isSafe) return;

        let rx, ry, dist;
        let attempts = 0;
        do {
            rx = Math.random() * (this.mapWidth - 400) + 200;
            ry = Math.random() * (this.mapHeight - 400) + 200;
            dist = Math.hypot(rx - this.player.x, ry - this.player.y);
            attempts++;
        } while ((dist < 350 || Math.hypot(rx - 2100, ry - 2100) < 320) && attempts < 25);

        const mobPool = zConf.mobs || ['slime'];
        if (!mobPool || mobPool.length === 0) return;
        const type = mobPool[Math.floor(Math.random() * mobPool.length)];

        const newEnemy = new Enemy(rx, ry, type);
        this.enemies.push(newEnemy);

        if (showPortalFX) {
            this.particles.spawn(rx, ry, '#22c55e', 18, 110, 0.5, 4.5);
        }
    }

    checkMonsterRespawn() {
        if (this.network && !this.network.isZoneHost) return;

        const zConf = ZONE_CONFIG[this.currentZone] || ZONE_CONFIG['village'];
        if (zConf.isSafe) return;

        const activeCount = this.enemies.filter(e => e.active && !e.isBoss).length;
        if (activeCount < this.maxEnemies) {
            const needSpawn = Math.min(4, this.maxEnemies - activeCount);
            for (let i = 0; i < needSpawn; i++) {
                this.spawnRandomEnemy(true);
            }
        }
    }

    findClosestEnemy(x, y, maxRange = 320) {
        let closest = null;
        let minDist = maxRange;
        for (const e of this.enemies) {
            if (!e.active) continue;
            const d = Math.hypot(e.x - x, e.y - y);
            if (d < minDist) {
                minDist = d;
                closest = e;
            }
        }
        return closest;
    }

    getNearbyInteractable() {
        let closest = null;
        let minDist = 75;
        for (const prop of this.props) {
            if (prop.active && (prop.type === 'npc' || prop.type === 'merchant' || prop.type === 'blacksmith' || prop.type === 'gambler' || prop.type === 'bed' || prop.type.startsWith('portal_') || prop.type === 'campfire' || prop.type === 'shrine' || prop.type === 'fountain' || (prop.type === 'chest' && !prop.opened))) {
                const d = Math.hypot(this.player.x - prop.x, this.player.y - prop.y);
                if (d <= minDist) {
                    minDist = d;
                    closest = prop;
                }
            }
        }
        return closest;
    }

    checkCollision(x, y, radius) {
        if (x - radius < 64 || x + radius > this.mapWidth - 64 ||
            y - radius < 64 || y + radius > this.mapHeight - 64) {
            return true;
        }

        for (const prop of this.props) {
            if (prop.active && prop.solid) {
                if (Math.hypot(x - prop.x, y - prop.y) < radius + prop.radius) {
                    return true;
                }
            }
        }
        return false;
    }

    checkPlayerAttackHits(hitbox) {
        this.enemies.forEach(e => {
            if (!e.active) return;
            const dist = Math.hypot(e.x - hitbox.x, e.y - hitbox.y);
            if (dist <= hitbox.radius + e.radius) {
                const angleToEnemy = Math.atan2(e.y - hitbox.y, e.x - hitbox.x);
                let angleDiff = Math.abs(angleToEnemy - hitbox.angle);
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                angleDiff = Math.abs(angleDiff);

                if (angleDiff <= hitbox.arc / 2 + 0.35) {
                    const kx = Math.cos(angleToEnemy) * 200;
                    const ky = Math.sin(angleToEnemy) * 200;

                    if (this.network && !this.network.isZoneHost) {
                        this.network.sendHitMonster(e.id, hitbox.damage, kx, ky, hitbox.isCrit);
                        sounds.playHit();
                        this.particles.spawn(e.x, e.y, e.color || '#ef4444', 6, 70, 0.3, 3);
                        this.particles.spawnDamageNumber(e.x, e.y, `${hitbox.damage}`, hitbox.isCrit ? '#facc15' : '#ffffff', hitbox.isCrit);
                    } else {
                        e.takeDamage(hitbox.damage, kx, ky, this, hitbox.isCrit);
                    }

                    if (this.player.equipment.accessory === 'ring_blood_vampire') {
                        const healAmount = Math.max(1, Math.round(hitbox.damage * 0.12));
                        this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);
                        this.particles.spawn(this.player.x, this.player.y, '#ef4444', 2, 35, 0.25, 3);
                    }
                }
            }
        });

        this.props.forEach(p => {
            if (p.active && (p.type === 'pot' || p.type === 'bush' || p.type === 'crystal') && Math.hypot(p.x - hitbox.x, p.y - hitbox.y) <= hitbox.radius + p.radius) {
                p.takeDamage(this);
            }
        });
    }

    interactWithWorld(player) {
        const target = this.getNearbyInteractable();
        if (target) {
            target.interact(player, this);
        }
    }

    onEnemyKilled(enemy) {
        return this.questSystem.onEnemyKilled(enemy);
    }

    onPlayerDeath() {
        const reqExp = this.player.maxExp || 100;
        const penaltyExp = Math.round(reqExp * 0.35);
        const actualLost = Math.min(this.player.exp, penaltyExp);
        this.player.exp = Math.max(0, this.player.exp - penaltyExp);

        // Reset player states completely
        this.player.state = 'idle';
        this.player.attackTimer = 0;
        this.player.attackCooldown = 0;
        this.player.dodgeTimer = 0;
        this.player.dodgeCooldown = 0;
        this.player.knockback = { vx: 0, vy: 0 };
        this.player.invulnerableTimer = 3.0; // 3 seconds safety shield
        this.player.hp = this.player.maxHp;
        this.player.mp = this.player.maxMp;

        try {
            sounds.playGameOver();
        } catch(e) {}

        this.showNotification(`💀 [뼈아픈 나태] 사망하여 경험치 -${actualLost} EXP (-35%)를 잃고 마을 침대에서 일어났습니다!`);

        this.currentZone = 'village';
        this.player.x = 2100;
        this.player.y = 2100;
        this.projectiles = []; // Clear active projectiles
        this.initWorld();

        this.camera.shake(0.5, 15);
        this.updateHUD();
        this.saveGame(true);
    }

    showNotification(text) {
        return this.ui.showNotification(text);
    }

    interactWithElder() {
        return this.ui.interactWithElder();
    }

    showDialogue(speaker, message) {
        return this.ui.showDialogue(speaker, message);
    }

    closeDialogue() {
        return this.ui.closeDialogue();
    }

    updateQuestHUD() {
        return this.questSystem.updateQuestHUD();
    }

    // ========================================================================
    // 🗺️ Maple-Style Visual Node Roadmap World Map (M Key)
    // ========================================================================

    // ========================================================================
    // 🛡️ v2.1.0 Self-Healing Dynamic DOM & Style Injector (Backwards Compatibility)
    // ========================================================================
    ensureV210UI() {
        if (!document.getElementById('zijeossi-v210-dynamic-style')) {
            const style = document.createElement('style');
            style.id = 'zijeossi-v210-dynamic-style';
            style.textContent = `
                .worldmap-card.node-map-theme {
                    width: 1080px !important; max-width: 96vw !important; background: #0f172a !important; border: 2px solid #3b82f6 !important; border-radius: 16px !important; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(59, 130, 246, 0.25) !important; display: flex !important; flex-direction: column !important; overflow: hidden !important;
                }
                .current-loc-badge { font-size: 13px !important; color: #38bdf8 !important; background: rgba(14, 165, 233, 0.15) !important; border: 1px solid rgba(56, 189, 248, 0.4) !important; border-radius: 20px !important; padding: 4px 14px !important; font-weight: 700 !important; }
                .node-map-wrapper { display: flex !important; height: 550px !important; background: radial-gradient(circle at center, #1e293b 0%, #090d16 100%) !important; border-top: 1.5px solid #334155 !important; position: relative !important; }
                .node-map-canvas-container { flex: 1 !important; position: relative !important; overflow: hidden !important; background: #0b1120 !important; box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.8) !important; }
                .node-map-svg { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; pointer-events: none !important; z-index: 1 !important; }
                .node-map-pins-layer { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; z-index: 2 !important; }
                .map-node-pin { position: absolute !important; transform: translate(-50%, -50%) !important; display: flex !important; flex-direction: column !important; align-items: center !important; cursor: pointer !important; transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important; }
                .map-node-pin:hover { transform: translate(-50%, -50%) scale(1.18) !important; z-index: 10 !important; }
                .map-node-pin.active-selected { transform: translate(-50%, -50%) scale(1.22) !important; z-index: 12 !important; }
                .node-icon-circle { width: 36px !important; height: 36px !important; border-radius: 50% !important; background: #1e293b !important; border: 2px solid #64748b !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 17px !important; box-shadow: 0 4px 12px rgba(0,0,0,0.6) !important; transition: all 0.2s !important; position: relative !important; }
                .map-node-pin:hover .node-icon-circle { border-color: #facc15 !important; box-shadow: 0 0 16px rgba(250, 204, 21, 0.7) !important; }
                .map-node-pin.current-zone-pin .node-icon-circle { border-color: #38bdf8 !important; background: #0284c7 !important; box-shadow: 0 0 20px #38bdf8 !important; animation: playerPinPulse 1.5s infinite alternate !important; }
                @keyframes playerPinPulse { 0% { box-shadow: 0 0 10px #38bdf8, 0 0 25px rgba(56, 189, 248, 0.6); transform: scale(1.0); } 100% { box-shadow: 0 0 22px #38bdf8, 0 0 40px rgba(56, 189, 248, 0.9); transform: scale(1.08); } }
                .player-here-badge { position: absolute !important; top: -22px !important; background: #38bdf8 !important; color: #0f172a !important; font-size: 9.5px !important; font-weight: 900 !important; padding: 1.5px 6px !important; border-radius: 10px !important; white-space: nowrap !important; box-shadow: 0 2px 8px rgba(0,0,0,0.5) !important; animation: bounceBadge 1s infinite alternate !important; }
                @keyframes bounceBadge { 0% { transform: translateY(0); } 100% { transform: translateY(-4px); } }
                .node-name-pill { margin-top: 3px !important; background: rgba(15, 23, 42, 0.94) !important; border: 1px solid #334155 !important; border-radius: 8px !important; padding: 1.5px 6px !important; font-size: 10px !important; font-weight: 800 !important; color: #e2e8f0 !important; white-space: nowrap !important; box-shadow: 0 2px 6px rgba(0,0,0,0.5) !important; }
                .map-node-pin.current-zone-pin .node-name-pill { border-color: #38bdf8 !important; color: #38bdf8 !important; }
                .node-zone-detail-card { width: 320px !important; background: #0f172a !important; border-left: 1.5px solid #334155 !important; padding: 22px !important; display: flex !important; flex-direction: column !important; gap: 16px !important; overflow-y: auto !important; }
                .detail-header-zone { display: flex !important; align-items: center !important; gap: 14px !important; padding-bottom: 12px !important; border-bottom: 1px solid #1e293b !important; }
                .detail-zone-icon { font-size: 34px !important; background: #1e293b !important; border: 1.5px solid #475569 !important; border-radius: 12px !important; padding: 6px 10px !important; }
                .detail-header-zone h3 { margin: 0 0 4px 0 !important; font-size: 18px !important; color: #f8fafc !important; font-weight: 800 !important; }
                .level-req-badge { font-size: 11px !important; background: #1e293b !important; color: #facc15 !important; border: 1px solid rgba(250, 204, 21, 0.4) !important; padding: 2px 8px !important; border-radius: 6px !important; font-weight: 700 !important; }
                .detail-desc-text { font-size: 13px !important; color: #94a3b8 !important; line-height: 1.5 !important; margin: 0 !important; }
                .detail-section h4 { margin: 0 0 8px 0 !important; font-size: 13px !important; color: #cbd5e1 !important; font-weight: 700 !important; display: flex !important; align-items: center !important; gap: 6px !important; }
                .detail-mobs-list { font-size: 12.5px !important; color: #e2e8f0 !important; background: #1e293b !important; padding: 10px 12px !important; border-radius: 8px !important; border: 1px solid #334155 !important; line-height: 1.6 !important; }
                .detail-portals-list { display: flex !important; flex-wrap: wrap !important; gap: 6px !important; }
                .portal-chip { font-size: 11.5px !important; background: #1e293b !important; color: #38bdf8 !important; border: 1px solid #0284c7 !important; padding: 4px 10px !important; border-radius: 8px !important; font-weight: 700 !important; transition: background 0.15s !important; }
                .portal-chip:hover { background: #0369a1 !important; color: #fff !important; }
                .map-explore-tip { margin-top: auto !important; font-size: 11.5px !important; color: #f59e0b !important; background: rgba(245, 158, 11, 0.1) !important; border: 1px dashed rgba(245, 158, 11, 0.4) !important; padding: 10px 12px !important; border-radius: 8px !important; line-height: 1.5 !important; }

                .casino-card { width: 620px !important; max-width: 95vw !important; background: #0f172a !important; border: 2px solid #f59e0b !important; border-radius: 16px !important; box-shadow: 0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(245, 158, 11, 0.25) !important; display: flex !important; flex-direction: column !important; overflow: hidden !important; padding: 20px !important; gap: 14px !important; }
                .bet-selector-row { display: flex !important; align-items: center !important; gap: 8px !important; }
                .bet-label { font-size: 12px !important; color: #94a3b8 !important; font-weight: 700 !important; }
                .bet-btn { padding: 4px 12px !important; background: #1e293b !important; border: 1px solid #475569 !important; color: #e2e8f0 !important; font-size: 12px !important; font-weight: 800 !important; border-radius: 8px !important; cursor: pointer !important; transition: all 0.15s !important; }
                .bet-btn:hover { border-color: #facc15 !important; color: #facc15 !important; }
                .bet-btn.active { background: #f59e0b !important; color: #0f172a !important; border-color: #facc15 !important; box-shadow: 0 0 10px rgba(245, 158, 11, 0.5) !important; }
                .dice-arena { display: flex !important; flex-direction: column !important; align-items: center !important; gap: 12px !important; padding: 18px !important; background: #1e293b !important; border-radius: 12px !important; border: 1px solid #334155 !important; }
                .dice-cup { display: flex !important; gap: 20px !important; }
                .dice-cube { width: 55px !important; height: 55px !important; background: #f8fafc !important; color: #0f172a !important; border-radius: 12px !important; font-size: 40px !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: 0 6px 16px rgba(0,0,0,0.6) !important; user-select: none !important; transition: transform 0.15s !important; }
                .dice-cube.rolling { animation: diceShake 0.4s infinite !important; }
                @keyframes diceShake { 0% { transform: rotate(0deg) scale(1); } 25% { transform: rotate(-15deg) scale(1.1); } 75% { transform: rotate(15deg) scale(1.1); } 100% { transform: rotate(0deg) scale(1); } }
                .dice-sum-badge { font-size: 14px !important; font-weight: 900 !important; color: #facc15 !important; background: #0f172a !important; padding: 4px 14px !important; border-radius: 20px !important; border: 1px solid #f59e0b !important; }
                .dice-options-grid { display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 10px !important; }
                .dice-choice-btn { background: #1e293b !important; border: 2px solid #475569 !important; border-radius: 12px !important; padding: 12px 8px !important; cursor: pointer !important; display: flex !important; flex-direction: column !important; align-items: center !important; gap: 4px !important; transition: all 0.15s !important; }
                .dice-choice-btn:hover { border-color: #38bdf8 !important; transform: translateY(-2px) !important; }
                .dice-choice-btn.lucky-seven { border-color: #eab308 !important; background: linear-gradient(180deg, #1e293b 0%, rgba(234, 179, 8, 0.15) 100%) !important; }
                .choice-title { font-size: 14px !important; font-weight: 900 !important; color: #f8fafc !important; }
                .choice-sub { font-size: 10.5px !important; color: #94a3b8 !important; }
                .choice-payout { font-size: 12px !important; font-weight: 900 !important; color: #38bdf8 !important; }
                .lucky-seven .choice-payout { color: #facc15 !important; }
                .slot-machine-arena { display: flex !important; flex-direction: column !important; align-items: center !important; gap: 16px !important; padding: 20px !important; background: #1e293b !important; border-radius: 12px !important; border: 1px solid #334155 !important; }
                .slot-reel-box { display: flex !important; gap: 14px !important; background: #0f172a !important; padding: 14px 22px !important; border-radius: 14px !important; border: 2px solid #f59e0b !important; box-shadow: inset 0 0 15px rgba(0,0,0,0.8) !important; }
                .slot-reel { width: 60px !important; height: 60px !important; background: #1e293b !important; border-radius: 10px !important; font-size: 36px !important; display: flex !important; align-items: center !important; justify-content: center !important; border: 1px solid #475569 !important; user-select: none !important; }
                .slot-reel.spinning { animation: reelSpin 0.1s infinite linear !important; filter: blur(1px) !important; }
                @keyframes reelSpin { 0% { transform: translateY(-4px); } 50% { transform: translateY(4px); } 100% { transform: translateY(-4px); } }
                .slot-spin-btn { width: 100% !important; padding: 14px !important; font-size: 15px !important; font-weight: 900 !important; color: #0f172a !important; background: linear-gradient(135deg, #f59e0b, #eab308) !important; border: none !important; border-radius: 12px !important; cursor: pointer !important; box-shadow: 0 6px 18px rgba(245, 158, 11, 0.4) !important; transition: all 0.15s !important; }
                .slot-spin-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 24px rgba(245, 158, 11, 0.6) !important; }
                .slot-payout-table { display: flex !important; justify-content: space-between !important; font-size: 11px !important; color: #94a3b8 !important; background: #1e293b !important; padding: 8px 12px !important; border-radius: 8px !important; }
                .hud-top-left-stack { position: absolute !important; top: 12px !important; left: 12px !important; display: flex !important; flex-direction: column !important; gap: 8px !important; z-index: 10 !important; pointer-events: none !important; }
                .quest-tracker-box { position: relative !important; top: auto !important; left: auto !important; max-width: 280px !important; }
                .tower-tracker-box { position: relative !important; top: auto !important; left: auto !important; border-color: #38bdf8 !important; background: rgba(15, 23, 42, 0.95) !important; box-shadow: 0 4px 20px rgba(56, 189, 248, 0.25) !important; max-width: 280px !important; }
                .class-guide-banner { display: flex !important; align-items: center !important; gap: 8px !important; background: rgba(245, 158, 11, 0.12) !important; border: 1px solid rgba(245, 158, 11, 0.4) !important; border-radius: 10px !important; padding: 8px 12px !important; margin-bottom: 12px !important; font-size: 12px !important; color: #fef08a !important; line-height: 1.4 !important; }
                .player-class-desc-tag { font-size: 11px !important; color: #94a3b8 !important; text-align: center !important; margin-top: 4px !important; font-weight: 600 !important; }
                .skill-filter-bar { display: flex !important; gap: 6px !important; flex-wrap: wrap !important; padding-bottom: 2px !important; }
                .skill-filter-btn { background: #1e293b !important; border: 1px solid #475569 !important; color: #94a3b8 !important; padding: 4px 9px !important; font-size: 11px !important; font-weight: 800 !important; border-radius: 8px !important; cursor: pointer !important; transition: all 0.15s ease !important; }
                .skill-filter-btn:hover { border-color: #facc15 !important; color: #facc15 !important; }
                .skill-filter-btn.active { background: #0284c7 !important; color: #ffffff !important; border-color: #38bdf8 !important; box-shadow: 0 0 10px rgba(56, 189, 248, 0.4) !important; }
                .skill-filter-btn.class-warrior-tab.active { background: #dc2626 !important; border-color: #f87171 !important; box-shadow: 0 0 10px rgba(239, 68, 68, 0.4) !important; }
                .skill-filter-btn.class-archer-tab.active { background: #059669 !important; border-color: #34d399 !important; box-shadow: 0 0 10px rgba(16, 185, 129, 0.4) !important; }
                .skill-filter-btn.class-mage-tab.active { background: #7e22ce !important; border-color: #c084fc !important; box-shadow: 0 0 10px rgba(168, 85, 247, 0.4) !important; }
                .skill-filter-btn.class-rogue-tab.active { background: #ca8a04 !important; border-color: #fde047 !important; box-shadow: 0 0 10px rgba(234, 179, 8, 0.4) !important; }
                .skill-filter-btn.class-general-tab.active { background: #4f46e5 !important; border-color: #818cf8 !important; box-shadow: 0 0 10px rgba(99, 102, 241, 0.4) !important; }
                .awakening-passive-banner { display: flex !important; flex-direction: column !important; gap: 4px !important; background: rgba(15, 23, 42, 0.85) !important; border: 1px solid #3b82f6 !important; border-radius: 8px !important; padding: 7px 12px !important; font-size: 11.5px !important; color: #e2e8f0 !important; line-height: 1.4 !important; }
                .awakening-passive-header { display: flex !important; align-items: center !important; gap: 8px !important; flex-wrap: wrap !important; }
                .awakening-passive-tag { background: #0284c7 !important; color: #ffffff !important; font-size: 10.5px !important; font-weight: 900 !important; padding: 2px 7px !important; border-radius: 4px !important; white-space: nowrap !important; }
                .awakening-passive-title { font-weight: 800 !important; font-size: 12px !important; color: #f8fafc !important; }
                .awakening-passive-desc { font-size: 11px !important; color: #94a3b8 !important; padding-left: 2px !important; }
                .skill-slot.skill-disabled { opacity: 0.38 !important; filter: grayscale(0.85) brightness(0.7) !important; border-color: #475569 !important; }

                /* 🌟 Intro Title Screen Dynamic Styling for Older Clients */
                .intro-screen-overlay { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: #050811 !important; z-index: 9000 !important; display: flex !important; align-items: center !important; justify-content: center !important; overflow: hidden !important; transition: opacity 0.4s ease-out !important; }
                .intro-screen-overlay.fade-out, .intro-screen-overlay.hidden { opacity: 0 !important; pointer-events: none !important; display: none !important; }
                .title-bg-canvas { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; z-index: 1 !important; pointer-events: none !important; }
                .cinematic-title-menu-layer { position: relative !important; z-index: 20 !important; display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: space-between !important; gap: 16px !important; padding: 24px 20px !important; width: 94vw !important; max-width: 1100px !important; min-height: 90vh !important; }
                .intro-top-dev-comment { display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; text-align: center !important; gap: 8px !important; background: rgba(15, 23, 42, 0.9) !important; border: 1.5px solid rgba(245, 158, 11, 0.6) !important; border-radius: 14px !important; padding: 10px 24px !important; box-shadow: 0 8px 24px rgba(0,0,0,0.85) !important; max-width: 680px !important; }
                .dev-comment-badge { font-size: 13px !important; font-weight: 900 !important; color: #f59e0b !important; letter-spacing: 2px !important; background: rgba(245, 158, 11, 0.18) !important; padding: 4px 14px !important; border-radius: 14px !important; border: 1px solid rgba(245, 158, 11, 0.4) !important; }
                .dev-comment-bubble { display: flex !important; flex-direction: column !important; align-items: center !important; text-align: center !important; }
                .dev-comment-line { margin: 0 !important; font-size: 15px !important; font-weight: 700 !important; color: #fef08a !important; line-height: 1.5 !important; }
                .stamped-title-box { display: flex !important; flex-direction: column !important; align-items: center !important; gap: 10px !important; margin: 4px 0 !important; }
                .stamped-chars-row { display: flex !important; align-items: center !important; justify-content: center !important; gap: 32px !important; }
                .stamp-char { font-size: 84px !important; font-weight: 900 !important; letter-spacing: 6px !important; background: linear-gradient(180deg, #ffffff 10%, #fef08a 35%, #f97316 70%, #991b1b 100%) !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; filter: drop-shadow(0 0 24px rgba(249, 115, 22, 0.95)) drop-shadow(0 10px 20px rgba(0,0,0,1)) !important; display: inline-block !important; }
                .stamp-subtitle { font-size: 18px !important; font-weight: 900 !important; letter-spacing: 3px !important; color: #fbbf24 !important; text-shadow: 0 0 16px rgba(250, 204, 21, 0.75), 0 3px 10px #000 !important; }
                .intro-menu-container { display: flex !important; flex-direction: column !important; gap: 12px !important; width: 100% !important; max-width: 540px !important; }
                .intro-menu-btn { background: linear-gradient(90deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98)) !important; border: 2px solid #475569 !important; border-radius: 14px !important; padding: 14px 22px !important; color: #f1f5f9 !important; font-size: 16px !important; font-weight: 800 !important; display: flex !important; align-items: center !important; gap: 12px !important; cursor: pointer !important; box-shadow: 0 8px 20px rgba(0,0,0,0.65) !important; transition: all 0.15s !important; }
                .intro-menu-btn .btn-arrow { font-size: 15px !important; color: transparent !important; }
                .intro-menu-btn.active .btn-arrow { color: #facc15 !important; }
                .intro-menu-btn:hover, .intro-menu-btn.active { border-color: #facc15 !important; background: linear-gradient(90deg, rgba(245, 158, 11, 0.38), rgba(30, 41, 59, 0.98) 80%) !important; box-shadow: 0 0 24px rgba(250, 204, 21, 0.7) !important; transform: scale(1.03) translateX(4px) !important; }
                .intro-bottom-right-guide { position: absolute !important; bottom: 20px !important; right: 24px !important; background: rgba(15, 23, 42, 0.92) !important; border: 1.5px solid #334155 !important; border-radius: 14px !important; padding: 12px 16px !important; z-index: 25 !important; box-shadow: 0 10px 30px rgba(0,0,0,0.85) !important; }
                .guide-badge-header { font-size: 11.5px !important; font-weight: 800 !important; color: #38bdf8 !important; margin-bottom: 6px !important; }
                .guide-row { display: flex !important; justify-content: space-between !important; gap: 14px !important; font-size: 11px !important; color: #cbd5e1 !important; margin-bottom: 3px !important; }
                .key-pill { background: #1e293b !important; color: #facc15 !important; border: 1px solid #475569 !important; border-radius: 6px !important; padding: 1px 6px !important; font-weight: 800 !important; }

                /* 🎬 959 Labs Studio Splash Dynamic Styling */
                .studio-splash-screen { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: #171717 !important; z-index: 99999 !important; display: flex !important; align-items: center !important; justify-content: center !important; opacity: 1 !important; transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important; user-select: none !important; cursor: pointer !important; overflow: hidden !important; }
                .studio-splash-screen.fade-out, .studio-splash-screen.hidden { opacity: 0 !important; pointer-events: none !important; display: none !important; }
                .studio-logo-img { width: 100vw !important; height: 100vh !important; max-width: 100vw !important; max-height: 100vh !important; object-fit: contain !important; background-color: transparent !important; border: none !important; outline: none !important; box-shadow: none !important; animation: studioFullIntro 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards !important; }
                .splash-skip-hint { position: absolute !important; bottom: 24px !important; right: 28px !important; font-size: 12.5px !important; color: #64748b !important; z-index: 3 !important; letter-spacing: 1px !important; opacity: 0.75 !important; background: rgba(0, 0, 0, 0.4) !important; padding: 6px 14px !important; border-radius: 20px !important; border: 1px solid rgba(255, 255, 255, 0.08) !important; backdrop-filter: blur(8px) !important; }
                @keyframes studioFullIntro { 0% { opacity: 0; transform: scale(0.96); } 20% { opacity: 1; } 100% { opacity: 1; transform: scale(1.0); } }
            `;
            document.head.appendChild(style);
        }

        // 🎵 Sound Self-Healing for Hot-Patched Clients (if client has older audio.js)
        if (typeof sounds !== 'undefined' && sounds) {
            if (!sounds.playBow) {
                sounds.playBow = function() {
                    if (this.muted || !this.ctx) return;
                    this.init();
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
                };
            }
            if (!sounds.playBlessing) sounds.playBlessing = function() { this.playHeal(); };
            if (!sounds.playDodge) sounds.playDodge = function() { this.playDash(); };
        }

        // 2. Ensure World Map Modal DOM
        let worldModal = document.getElementById('worldMapModal');
        if (!worldModal) {
            worldModal = document.createElement('div');
            worldModal.id = 'worldMapModal';
            worldModal.className = 'hidden modal-backdrop';
            document.body.appendChild(worldModal);
        }
        if (!document.getElementById('nodeMapSvg')) {
            worldModal.innerHTML = `
                <div class="worldmap-card node-map-theme">
                    <div class="modal-header">
                        <h2>🗺️ 아르카디아 대륙 원정 지도 (Expedition Map)</h2>
                        <div class="current-loc-badge" id="mapCurrentLocBadge">📍 현재 위치: <strong id="mapCurrentZoneName">시작의 마을</strong></div>
                        <button id="worldMapCloseBtn" class="dialogue-close" onclick="game.toggleWorldMap()">닫기 [M/F/ESC]</button>
                    </div>
                    
                    <div class="node-map-wrapper">
                        <div id="nodeMapCanvasContainer" class="node-map-canvas-container">
                            <svg id="nodeMapSvg" class="node-map-svg"></svg>
                            <div id="nodeMapPinsLayer" class="node-map-pins-layer"></div>
                        </div>

                        <div id="nodeZoneDetailCard" class="node-zone-detail-card">
                            <div class="detail-header-zone">
                                <span id="mapDetailIcon" class="detail-zone-icon">🌲</span>
                                <div>
                                    <h3 id="mapDetailTitle">시작의 마을</h3>
                                    <span id="mapDetailLevel" class="level-req-badge">Lv. 1 (안전 마을)</span>
                                </div>
                            </div>
                            <p id="mapDetailDesc" class="detail-desc-text">장로와 대장장이, 상인이 있는 평화로운 안식처입니다.</p>
                            
                            <div class="detail-section">
                                <h4>⚔️ 출현 몬스터 & 보스</h4>
                                <div id="mapDetailMobs" class="detail-mobs-list">평화로운 안식처 (몬스터 없음)</div>
                            </div>

                            <div class="detail-section">
                                <h4>🧭 연결된 원정 경로 (Connected Roads)</h4>
                                <div id="mapDetailPortals" class="detail-portals-list">
                                    <span class="portal-chip">🌿 요정의 비취 숲</span>
                                    <span class="portal-chip">🌀 고대 미궁 B1</span>
                                </div>
                            </div>

                            <div class="map-explore-tip">
                                💡 <strong>모험 안내</strong>: 지도를 통한 순간이동은 지원되지 않습니다. 필드 가장자리의 포탈을 걸어서 이동하세요. 마을로 복귀하려면 <strong>[📜 마을 귀환 주문서]</strong>를 사용하세요!
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // 3. Ensure Casino Modal DOM
        let casinoModal = document.getElementById('casinoModal');
        if (!casinoModal) {
            casinoModal = document.createElement('div');
            casinoModal.id = 'casinoModal';
            casinoModal.className = 'hidden modal-backdrop';
            document.body.appendChild(casinoModal);
        }
        if (!document.getElementById('casinoTabDice')) {
            casinoModal.innerHTML = `
                <div class="casino-card">
                    <div class="modal-header">
                        <h2>🎲 959 럭키 카지노 하우스 (Jackpot House)</h2>
                        <button id="casinoCloseBtn" class="dialogue-close" onclick="game.toggleCasino()">닫기 [F/ESC]</button>
                    </div>

                    <div class="shop-tabs-row">
                        <button id="casinoTabDice" class="shop-tab active" onclick="game.switchCasinoTab('dice')">🎲 더블 다이스 (High-Low)</button>
                        <button id="casinoTabSlot" class="shop-tab" onclick="game.switchCasinoTab('slot')">🎰 3-릴 미니 슬롯</button>
                    </div>

                    <div class="shop-gold-bar">
                        <span>🪙 내 보유 골드: <strong id="casinoGold" style="color: #facc15;">0 G</strong></span>
                        <span id="casinoBetDisplay" class="bag-space-badge">🎯 베팅액: <strong id="casinoBetAmount">20 G</strong></span>
                    </div>

                    <div class="bet-selector-row">
                        <span class="bet-label">베팅 금액:</span>
                        <button class="bet-btn active" onclick="game.setCasinoBet(10)">10 G</button>
                        <button class="bet-btn" onclick="game.setCasinoBet(30)">30 G</button>
                        <button class="bet-btn" onclick="game.setCasinoBet(50)">50 G</button>
                        <button class="bet-btn" onclick="game.setCasinoBet(100)">100 G</button>
                    </div>

                    <div id="casinoDicePanel" class="casino-panel">
                        <div class="dice-arena">
                            <div class="dice-cup">
                                <div id="diceCube1" class="dice-cube">⚅</div>
                                <div id="diceCube2" class="dice-cube">⚅</div>
                            </div>
                            <div id="diceSumText" class="dice-sum-badge">주사위 합: 12</div>
                        </div>

                        <div class="dice-options-grid">
                            <button id="btnBetLow" class="dice-choice-btn" onclick="game.playHighLowDice('low')">
                                <div class="choice-title">📉 로우 (LOW)</div>
                                <div class="choice-sub">주사위 합 2 ~ 6</div>
                                <div class="choice-payout">배당 2.0x</div>
                            </button>
                            <button id="btnBetSeven" class="dice-choice-btn lucky-seven" onclick="game.playHighLowDice('seven')">
                                <div class="choice-title">🌟 럭키 7 (JACKPOT)</div>
                                <div class="choice-sub">주사위 합 정확히 7</div>
                                <div class="choice-payout">대박 5.0x</div>
                            </button>
                            <button id="btnBetHigh" class="dice-choice-btn" onclick="game.playHighLowDice('high')">
                                <div class="choice-title">📈 하이 (HIGH)</div>
                                <div class="choice-sub">주사위 합 8 ~ 12</div>
                                <div class="choice-payout">배당 2.0x</div>
                            </button>
                        </div>
                    </div>

                    <div id="casinoSlotPanel" class="casino-panel hidden">
                        <div class="slot-machine-arena">
                            <div class="slot-reel-box">
                                <div id="slotReel1" class="slot-reel">🍒</div>
                                <div id="slotReel2" class="slot-reel">💎</div>
                                <div id="slotReel3" class="slot-reel">7️⃣</div>
                            </div>
                            <button id="btnSpinSlot" class="slot-spin-btn" onclick="game.playSlotMachine()">
                                🎰 레버 당기기 (SPIN!)
                            </button>
                        </div>

                        <div class="slot-payout-table">
                            <span>🍒 3개 (3x)</span>
                            <span>🔔 3개 (5x)</span>
                            <span>💎 3개 (10x)</span>
                            <span>7️⃣ 3개 (25x)</span>
                            <span>👑 3개 (50x + 전설 영약)</span>
                        </div>
                    </div>

                    <div id="casinoResultBanner" class="casino-result-banner" style="background:#1e293b; border:1px solid #475569; border-radius:8px; padding:10px 14px; font-size:12.5px; font-weight:800; color:#facc15; text-align:center;">
                        🎲 도박사 잭: "원하는 게임과 베팅액을 고르고 도전해 보게나!"
                    </div>
                </div>
            `;
        }

        // 4. Ensure Cinematic Audio Upgrade for old clients
        if (typeof sounds !== 'undefined' && sounds && !sounds.hasCinematicJingleV2) {
            sounds.hasCinematicJingleV2 = true;
            sounds.playStudioJingle = function() {
                this.init();
                if (this.muted || !this.ctx) return;
                try {
                    const now = this.ctx.currentTime;
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
                } catch (e) {}
            };
        }

        // 5. Ensure Intro Screen & Studio Splash for older clients
        if (!document.getElementById('studioSplash')) {
            const splashDiv = document.createElement('div');
            splashDiv.id = 'studioSplash';
            splashDiv.className = 'studio-splash-screen';
            splashDiv.onclick = () => { if (this.skipStudioSplash) this.skipStudioSplash(); };
            splashDiv.innerHTML = `
                <img src="logo_959.png" alt="959 Labs Studio Logo" id="studioLogoImg" class="studio-logo-img" onerror="this.style.display='none'; const fb = document.getElementById('studioFallbackLogo'); if (fb) fb.style.display='flex';">
                <div id="studioFallbackLogo" style="display:none; flex-direction:column; align-items:center; gap:8px;">
                    <div style="font-size: 56px; font-weight: 900; color: #f59e0b; letter-spacing: 4px;">959 LABS</div>
                    <div style="font-size: 14px; font-weight: 700; color: #94a3b8; letter-spacing: 2px;">GAME STUDIO</div>
                </div>
                <div class="splash-skip-hint">스킵: <strong>[Space / ENTER / ESC / 클릭]</strong></div>
            `;
            document.body.appendChild(splashDiv);
        }

        if (!document.getElementById('introTitleScreen')) {
            const introDiv = document.createElement('div');
            introDiv.id = 'introTitleScreen';
            introDiv.className = 'intro-screen-overlay';
            introDiv.innerHTML = `
                <canvas id="titleBackgroundCanvas" class="title-bg-canvas"></canvas>
                <div id="cinematicTitleMenuLayer" class="cinematic-title-menu-layer">
                    <div class="intro-top-dev-comment">
                        <div class="dev-comment-badge">📢 개발자 코멘트</div>
                        <div class="dev-comment-bubble">
                            <p class="dev-comment-line">누가 플레이 하게 될지는 모르지만 피드백은 언제나 환영입니다 ~~ ^3^</p>
                        </div>
                    </div>
                    <div class="stamped-title-box">
                        <div class="stamped-chars-row">
                            <span id="stampChar1" class="stamp-char">지</span>
                            <span id="stampChar2" class="stamp-char">저</span>
                            <span id="stampChar3" class="stamp-char">씨</span>
                        </div>
                        <div id="stampSubtitle" class="stamp-subtitle">&lt; 지저씨 : 각성했지만 게으르고 싶어 &gt;</div>
                    </div>
                    <div id="introMenuContainer" class="intro-menu-container">
                        <button id="introBtnContinue" class="intro-menu-btn active" data-index="0">
                            <span class="btn-arrow">▶</span>
                            <span class="btn-label" id="introBtnContinueLabel">💾 싱글플레이 이어하기 (Continue)</span>
                        </button>
                        <button id="introBtnNewGame" class="intro-menu-btn" data-index="1">
                            <span class="btn-arrow">▶</span>
                            <span class="btn-label">⚔️ 싱글플레이 새로 시작 (New Game)</span>
                        </button>
                        <button id="introBtnMultiplayer" class="intro-menu-btn highlight-multi-menu" data-index="2">
                            <span class="btn-arrow">▶</span>
                            <span class="btn-label">🌐 코옵 멀티플레이 (Co-op Multiplayer) <span class="hot-badge">HOT</span></span>
                        </button>
                        <button id="introBtnSettings" class="intro-menu-btn" data-index="3">
                            <span class="btn-arrow">▶</span>
                            <span class="btn-label">⚙️ 게임 가이드 & 환경설정 [P]</span>
                        </button>
                        <button id="introBtnQuit" class="intro-menu-btn" data-index="4" onclick="game.quitGame()">
                            <span class="btn-arrow">▶</span>
                            <span class="btn-label">🚪 게임 완전 종료 (Quit Game)</span>
                        </button>
                    </div>
                </div>
                <div class="intro-bottom-right-guide">
                    <div class="guide-badge-header">🎮 조작 가이드</div>
                    <div class="guide-badge-content">
                        <div class="guide-row"><span class="key-pill">↑ / ↓</span><span>메뉴 이동</span></div>
                        <div class="guide-row"><span class="key-pill">ENTER / 클릭</span><span>선택 & 시작</span></div>
                        <div class="guide-row"><span class="key-pill">F</span><span>NPC & 상점 대화</span></div>
                        <div class="guide-row"><span class="key-pill">A / Space</span><span>기본 공격 / 대시</span></div>
                        <div class="guide-row"><span class="key-pill">W, E, S, D, Q</span><span>스킬 및 궁극기</span></div>
                    </div>
                </div>
            `;
            document.body.appendChild(introDiv);
            this.titleCanvas = document.getElementById('titleBackgroundCanvas');
            this.titleCtx = this.titleCanvas ? this.titleCanvas.getContext('2d') : null;
            this.setupIntroEventListeners();
        }

        // 6. Ensure SkillBook Modal DOM for older clients
        if (!document.getElementById('skillBookModal')) {
            const sbModal = document.createElement('div');
            sbModal.id = 'skillBookModal';
            sbModal.className = 'hidden modal-backdrop';
            sbModal.innerHTML = `
                <div class="settings-card skillbook-card-theme" style="width: 1060px; max-width: 95vw;">
                    <div class="modal-header">
                        <h2>📚 스킬북 & 9슬롯 룬 각성 (Skill Book)</h2>
                        <button id="skillBookCloseBtn" class="dialogue-close" onclick="game.closeSkillBook()">닫기 [K/F/ESC]</button>
                    </div>
                    <div class="skillbook-split-layout" style="display: flex; gap: 16px; padding: 14px; max-height: 75vh; overflow-y: auto;">
                        <div class="skill-slots-deck" style="width: 320px; flex-shrink: 0;">
                            <div class="deck-title-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <h3 style="font-size: 14px; margin: 0;">🎯 장착된 9개 퀵슬롯</h3>
                                <span class="slot-count-badge" id="equippedSkillCount" style="font-size: 11px;">6 / 9 슬롯 활성화</span>
                                <button id="btnClearAllSkills" class="clear-all-btn" onclick="game.clearAllEquippedSkills()" style="font-size: 11px; padding: 2px 6px; cursor: pointer;">🗑️ 전체 해제</button>
                            </div>
                            <div class="slots-3x3-grid" id="equippedSlotsGrid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;"></div>
                        </div>
                        <div class="skill-catalog-section" style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
                            <div class="skill-filter-bar" id="skillFilterBar">
                                <button class="skill-filter-btn active" data-filter="all" onclick="game.filterSkillBook('all')">✨ 전체</button>
                                <button class="skill-filter-btn class-warrior-tab" data-filter="warrior" onclick="game.filterSkillBook('warrior')">⚔️ 검사</button>
                                <button class="skill-filter-btn class-archer-tab" data-filter="archer" onclick="game.filterSkillBook('archer')">🏹 궁수</button>
                                <button class="skill-filter-btn class-mage-tab" data-filter="mage" onclick="game.filterSkillBook('mage')">🪄 마법사</button>
                                <button class="skill-filter-btn class-rogue-tab" data-filter="rogue" onclick="game.filterSkillBook('rogue')">🗡️ 암살자</button>
                                <button class="skill-filter-btn class-general-tab" data-filter="general" onclick="game.filterSkillBook('general')">🌟 공용</button>
                            </div>
                            <div id="activeAwakeningPassiveBox"></div>
                            <div id="skillLibraryList" class="skill-library-list" style="max-height: 440px; overflow-y: auto;"></div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(sbModal);
        }

        // 7. Ensure Trial Shop Modal DOM for older clients
        if (!document.getElementById('trialShopModal')) {
            const tsModal = document.createElement('div');
            tsModal.id = 'trialShopModal';
            tsModal.className = 'hidden modal-backdrop';
            tsModal.innerHTML = `
                <div class="settings-card trial-shop-theme">
                    <div class="modal-header">
                        <h2>✨ 시련의 보물상인 아스텔 (Tower Shop)</h2>
                        <button id="trialShopCloseBtn" class="dialogue-close" onclick="game.closeTrialShop()">닫기 [F/ESC]</button>
                    </div>
                    <div class="shop-gold-bar" style="background: #1e1b4b; border: 1px solid #6366f1;">
                        <span>🪙 보유 시련의 증표: <strong id="trialShopCoins" style="color: #facc15;">0</strong> 개</span>
                        <span class="bag-space-badge" style="background: rgba(99, 102, 241, 0.2); border-color: #818cf8;">🗼 탑 보상 교환소</span>
                    </div>
                    <div class="trial-shop-wares-grid" id="trialShopList" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 12px; max-height: 480px; overflow-y: auto;"></div>
                </div>
            `;
            document.body.appendChild(tsModal);
        }

        // 8. Ensure HUD Top Left Stack & Tower Tracker for older clients
        if (!document.getElementById('hudTopLeftStack')) {
            const stack = document.createElement('div');
            stack.id = 'hudTopLeftStack';
            stack.className = 'hud-top-left-stack';
            stack.innerHTML = `
                <div id="hudQuestTracker" class="quest-tracker-box">
                    <div class="quest-title">📜 퀘스트</div>
                </div>
                <div id="hudTowerTracker" class="quest-tracker-box tower-tracker-box hidden">
                    <div class="tower-floor-title">🗼 무한의 시련 탑 <span id="towerFloorNum" class="tower-floor-badge">1F</span></div>
                    <div class="tower-mob-status" id="towerMobStatus">👾 잔여 몬스터: <strong id="towerMobsLeft" style="color:#f43f5e;">0</strong>마리</div>
                    <div class="tower-coin-status">🪙 시련의 증표: <strong id="towerCoinsCount" style="color: #facc15;">0</strong>개</div>
                </div>
            `;
            document.body.appendChild(stack);
        }
    }

    toggleWorldMap() {
        this.ensureV210UI();
        this.isWorldMapOpen = !this.isWorldMapOpen;
        const modal = document.getElementById('worldMapModal');
        if (modal) {
            if (this.isWorldMapOpen) {
                this.renderNodeWorldMap();
                modal.classList.remove('hidden');
                sounds.playInteract();
            } else {
                modal.classList.add('hidden');
            }
        }
    }

    renderNodeWorldMap() {
        this.ensureV210UI();
        const svg = document.getElementById('nodeMapSvg');
        const pinsLayer = document.getElementById('nodeMapPinsLayer');
        const curZoneNameEl = document.getElementById('mapCurrentZoneName');
        if (!svg || !pinsLayer) return;

        const currentZ = ZONE_CONFIG[this.currentZone] || ZONE_CONFIG['village'];
        if (curZoneNameEl) curZoneNameEl.innerText = currentZ.name;
        // Node Coordinates on a 680 x 520 canvas (Exact 24 Zones in 6 Columns x 4 Rows)
        const NODE_MAP_DATA = {
            // Column 1 (x: 55) - Extreme North & Deep Sea
            'abyss_trench': { x: 55, y: 70, name: '심연의 해저 해구', icon: '🌊', lvl: 'Lv. 95 ~ 105', desc: '크라켄과 레비아탄이 지배하는 심해 초고수압 해구입니다.', mobs: '심해 아귀, 해저 촉수', bosses: '심해의 괴수 크라켄, 레비아탄', links: ['dungeon_b3', 'citadel_sanctuary'] },
            'dungeon_b3': { x: 55, y: 190, name: '영구동토 감옥 B3', icon: '🧊', lvl: 'Lv. 85 ~ 95', desc: '서리한의 리치 킹이 군림하는 절대영도의 지하 감옥입니다.', mobs: '서리 망령, 빙하 전사', bosses: '서리한의 리치 킹, 빙룡 신드라고사', links: ['frozen_tundra', 'abyss_trench'] },
            'frozen_tundra': { x: 55, y: 310, name: '혹한의 만년설원', icon: '❄️', lvl: 'Lv. 75 ~ 85', desc: '살을 에는 눈보라와 예티 거인이 배회하는 만년설원입니다.', mobs: '설원 늑대, 빙하 골렘', bosses: '빙하 거인 예티 킹, 늑대왕 펜리르', links: ['frost_camp', 'dungeon_b3', 'ancient_ruins'] },
            'frost_camp': { x: 55, y: 430, name: '설원 전진기지', icon: '⛺', lvl: 'Lv. 75 (안전 마을)', desc: '혹한의 설원 입구에 위치한 따뜻한 모닥불 기지입니다.', mobs: '평화 구역 (몬스터 없음)', bosses: '없음', links: ['dragon_nest', 'frozen_tundra'] },

            // Column 2 (x: 168) - Fire & Dragon & Sanctum
            'citadel_sanctuary': { x: 168, y: 70, name: '성채 비밀 은신처', icon: '🏰', lvl: 'Lv. 105 (안전 쉼터)', desc: '성기사단 피난민들이 모여 휴식하는 안전한 성채입니다.', mobs: '평화 구역 (몬스터 없음)', bosses: '없음', links: ['abyss_trench', 'blood_citadel'] },
            'dragon_nest': { x: 168, y: 190, name: '화룡의 둥지', icon: '🐲', lvl: 'Lv. 65 ~ 75', desc: '진홍의 화룡 이그니스가 지배하는 거대한 화산 분화구입니다.', mobs: '화염 드레이크, 화룡 새끼', bosses: '진홍의 화룡 이그니스, 흑룡 칼라미티', links: ['dungeon_b2', 'frost_camp'] },
            'dungeon_b2': { x: 168, y: 310, name: '화염 심연 B2', icon: '🌋', lvl: 'Lv. 55 ~ 65', desc: '작열하는 마그마와 화염 몬스터가 우글거리는 지하 2층입니다.', mobs: '용암 드레이크, 마그마 골렘', bosses: '용암 거인 베히모스, 켈베로스', links: ['dungeon_b1', 'dragon_nest', 'pyramid'] },
            'dungeon_b1': { x: 168, y: 430, name: '고대 미궁 B1', icon: '🌀', lvl: 'Lv. 15 ~ 25', desc: '고대 석판과 어둠의 해골 병단이 가득한 지하 1층입니다.', mobs: '해골 궁수, 화염 박쥐, 가고일', bosses: '타락한 암흑 기사 아서, 가고일 로드', links: ['village', 'dungeon_b2', 'crystal_cave'] },

            // Column 3 (x: 282) - Central Heartland & Castle
            'blood_citadel': { x: 282, y: 70, name: '진홍빛 흡혈귀 성채', icon: '🩸', lvl: 'Lv. 100 ~ 110', desc: '흡혈귀 황제 블라드 3세가 군림하는 피의 고성입니다.', mobs: '흡혈 박쥐, 피의 사제', bosses: '흡혈귀 황제 블라드 3세, 핏빛룡', links: ['citadel_sanctuary', 'poison_swamp'] },
            'ancient_ruins': { x: 282, y: 190, name: '고대 거신 유적', icon: '🏛️', lvl: 'Lv. 70 ~ 80', desc: '태양 전차와 고대 골리앗 거신이 지키는 유적지입니다.', mobs: '고대 골렘, 파수병', bosses: '고대 거신 골리앗, 태양 전차', links: ['crystal_cave', 'frozen_tundra', 'heaven_altar'] },
            'crystal_cave': { x: 282, y: 310, name: '신비의 수정 동굴', icon: '💎', lvl: 'Lv. 40 ~ 50', desc: '영롱한 보석 광맥과 자수정 거신이 잠든 동굴입니다.', mobs: '수정 골렘, 비취 와이번', bosses: '자수정 거신 크리스탈로스', links: ['forest', 'dungeon_b1', 'ancient_ruins'] },
            'village': { x: 282, y: 430, name: '시작의 마을', icon: '🌲', lvl: 'Lv. 1 (안전 마을)', desc: '평화로운 시작점이자 모험가들의 안식처입니다.', mobs: '평화 구역 (몬스터 없음)', bosses: '없음', links: ['forest', 'dungeon_b1', 'graveyard'] },

            // Column 4 (x: 395) - Nature, Graveyard & Void
            'poison_swamp': { x: 395, y: 70, name: '맹독의 부패 늪지대', icon: '☣️', lvl: 'Lv. 105 ~ 115', desc: '구두룡 히드라와 역병 파리가 숨쉬는 맹독의 늪입니다.', mobs: '맹독 거미, 부패 슬라임', bosses: '구두룡 맹독 히드라, 역병 군주 벨제붑', links: ['blood_citadel', 'shadow_realm'] },
            'shadow_realm': { x: 395, y: 190, name: '암흑 그림자 차원', icon: '🌌', lvl: 'Lv. 115 ~ 125', desc: '공허 추적자와 그림자 군주의 암흑 차원입니다.', mobs: '공허 추적자, 차원 변종', bosses: '그림자 군주 아시본, 공허 추적자', links: ['poison_swamp', 'sky_haven'] },
            'graveyard': { x: 395, y: 310, name: '망자의 묘지', icon: '🪦', lvl: 'Lv. 25 ~ 35', desc: '해골과 망령, 좀비가 울부짖는 음산한 묘지입니다.', mobs: '좀비, 해골, 망령', bosses: '죽음의 사신 타나토스, 밴시 퀸', links: ['village', 'forest', 'desert', 'oasis_town'] },
            'forest': { x: 395, y: 430, name: '요정의 비취 숲', icon: '🌿', lvl: 'Lv. 5 ~ 15', desc: '고블린과 엘더 엔트가 배회하는 울창한 숲입니다.', mobs: '숲 고블린, 엘더 엔트', bosses: '고블린 대족장 그룩타, 엘더 엔트', links: ['village', 'graveyard', 'oasis_town', 'crystal_cave'] },

            // Column 5 (x: 508) - Desert, Pyramid & Sky Haven
            'sky_haven': { x: 508, y: 70, name: '천공의 구름 안식처', icon: '🪽', lvl: 'Lv. 125 (안전 성소)', desc: '구름 위에 떠 있는 최후의 신성 안식처 마을입니다.', mobs: '평화 구역 (몬스터 없음)', bosses: '없음', links: ['shadow_realm', 'heaven_altar'] },
            'pyramid': { x: 508, y: 190, name: '파라오의 영묘', icon: '🏛️', lvl: 'Lv. 45 ~ 55', desc: '황금 보물과 저주가 잠든 피라미드 영묘입니다.', mobs: '미이라, 스핑크스', bosses: '황금 파라오 투탕카멘, 아누비스', links: ['desert', 'oasis_town', 'dungeon_b2'] },
            'desert': { x: 508, y: 310, name: '황혼의 사막', icon: '🏜️', lvl: 'Lv. 35 ~ 45', desc: '모래폭풍과 거대전갈, 샌드웜이 도사리는 사막입니다.', mobs: '사막 전갈, 미이라', bosses: '사막의 지배자 샌드웜, 전갈 여제', links: ['oasis_town', 'graveyard', 'pyramid'] },
            'oasis_town': { x: 508, y: 430, name: '사막 오아시스', icon: '🏝️', lvl: 'Lv. 35 (안전 마을)', desc: '사막 한가운데 자리 잡은 오아시스 마을입니다.', mobs: '평화 구역 (몬스터 없음)', bosses: '없음', links: ['forest', 'desert', 'pyramid', 'graveyard'] },

            // Column 6 (x: 620) - Divine Celestial, Void & Paradise
            'heaven_altar': { x: 620, y: 70, name: '천공 판테온 제단', icon: '✨', lvl: 'Lv. 125 ~ 140', desc: '대천사 우리엘과 세라핌이 강림하는 신들의 판테온입니다.', mobs: '천공 아바타, 발키리', bosses: '천공의 심판자 세라핌, 대천사 우리엘', links: ['sky_haven', 'ancient_ruins', 'astral_void'] },
            'astral_void': { x: 620, y: 190, name: '시공간 성간 공허', icon: '🌌', lvl: 'Lv. 130 ~ 145', desc: '성간 포식자 네뷸라와 시공의 지배자 크로노스의 우주입니다.', mobs: '성간 포식자, 시간 왜곡체', bosses: '성간 포식자 네뷸라, 시간 크로노스', links: ['heaven_altar', 'god_sanctuary'] },
            'god_sanctuary': { x: 620, y: 310, name: '태초의 신역', icon: '👑', lvl: 'Lv. 140 ~ MAX', desc: '신역의 문을 지키는 태초의 수호신 아르고스의 성소입니다.', mobs: '성소 수호병, 신역 사제', bosses: '태초의 수호신 아르고스, 타락천사 루시퍼', links: ['astral_void', 'lazy_paradise'] },
            'lazy_paradise': { x: 620, y: 430, name: '꿈속의 나태 낙원', icon: '🛌', lvl: 'Lv. 150 END', desc: '모든 모험을 마친 지저씨가 영원히 꿀잠을 자는 지상 낙원입니다.', mobs: '평화 구역 (온수매트)', bosses: '온수매트 대왕 슬리퍼', links: ['god_sanctuary', 'village'] }
        };

        this.nodeMapData = NODE_MAP_DATA;
        this.selectedMapZone = this.selectedMapZone || this.currentZone;

        // 1. Draw SVG Road Lines
        let svgHtml = '';
        const drawnRoutes = new Set();
        for (const zKey in NODE_MAP_DATA) {
            const node = NODE_MAP_DATA[zKey];
            if (node.links) {
                node.links.forEach(targetKey => {
                    const target = NODE_MAP_DATA[targetKey];
                    if (!target) return;
                    const pairKey = [zKey, targetKey].sort().join('-');
                    if (!drawnRoutes.has(pairKey)) {
                        drawnRoutes.add(pairKey);
                        svgHtml += `<line x1="${node.x}" y1="${node.y}" x2="${target.x}" y2="${target.y}" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6,6" stroke-opacity="0.65" />`;
                    }
                });
            }
        }
        svg.innerHTML = svgHtml;

        // 2. Draw Interactive Node Pins
        pinsLayer.innerHTML = '';
        for (const zKey in NODE_MAP_DATA) {
            const node = NODE_MAP_DATA[zKey];
            const isCurrent = this.currentZone === zKey;
            const isSelected = this.selectedMapZone === zKey;

            const pin = document.createElement('div');
            pin.className = `map-node-pin ${isCurrent ? 'current-zone-pin' : ''} ${isSelected ? 'active-selected' : ''}`;
            pin.style.left = `${node.x}px`;
            pin.style.top = `${node.y}px`;

            pin.innerHTML = `
                ${isCurrent ? '<div class="player-here-badge">📍 내 위치</div>' : ''}
                <div class="node-icon-circle">${node.icon}</div>
                <div class="node-name-pill">${node.name}</div>
            `;

            pin.onclick = () => {
                this.selectWorldMapNode(zKey);
            };

            pinsLayer.appendChild(pin);
        }

        this.updateWorldMapDetailPanel(this.selectedMapZone);
    }

    selectWorldMapNode(zoneKey) {
        this.selectedMapZone = zoneKey;
        sounds.playInteract();
        this.renderNodeWorldMap();
    }

    updateWorldMapDetailPanel(zoneKey) {
        const node = this.nodeMapData?.[zoneKey] || this.nodeMapData?.['village'];
        if (!node) return;

        const iconEl = document.getElementById('mapDetailIcon');
        const titleEl = document.getElementById('mapDetailTitle');
        const lvlEl = document.getElementById('mapDetailLevel');
        const descEl = document.getElementById('mapDetailDesc');
        const mobsEl = document.getElementById('mapDetailMobs');
        const portalsEl = document.getElementById('mapDetailPortals');

        if (iconEl) iconEl.innerText = node.icon;
        if (titleEl) titleEl.innerText = node.name;
        if (lvlEl) lvlEl.innerText = node.lvl;
        if (descEl) descEl.innerText = node.desc;
        if (mobsEl) mobsEl.innerHTML = `<strong>출현 몬스터</strong>: ${node.mobs}<br><strong style="color:#f87171;">출현 보스</strong>: ${node.bosses}`;

        if (portalsEl) {
            portalsEl.innerHTML = '';
            (node.links || []).forEach(linkKey => {
                const targetNode = this.nodeMapData[linkKey];
                if (targetNode) {
                    const chip = document.createElement('span');
                    chip.className = 'portal-chip';
                    chip.innerText = `${targetNode.icon} ${targetNode.name}`;
                    chip.onclick = () => this.selectWorldMapNode(linkKey);
                    chip.style.cursor = 'pointer';
                    portalsEl.appendChild(chip);
                }
            });
        }
    }

    // ========================================================================
    // 🎲 Casino Minigame House (High-Low Dice & 3-Reel Slots)
    // ========================================================================
    toggleCasino() {
        return this.casino.toggleCasino();
    }

    openCasino() {
        return this.casino.openCasino();
    }

    switchCasinoTab(tab) {
        return this.casino.switchCasinoTab(tab);
    }

    setCasinoBet(amount) {
        return this.casino.setCasinoBet(amount);
    }

    updateCasinoUI() {
        return this.casino.updateCasinoUI();
    }

    playHighLowDice(choice) {
        return this.casino.playHighLowDice(choice);
    }

    playSlotMachine() {
        return this.casino.playSlotMachine();
    }

    toggleInventory() {
        return this.inventory.toggleInventory();
    }

    updateInventoryUI() {
        return this.inventory.updateInventoryUI();
    }

    useOrEquipBagItem(index) {
        return this.inventory.useOrEquipBagItem(index);
    }

    toggleForge() {
        return this.inventory.toggleForge();
    }

    updateForgeUI() {
        return this.inventory.updateForgeUI();
    }

    filterSkillBook(filterKey) {
        this.skillBookFilter = filterKey;
        this.skillBookSelectedIndex = 0;
        sounds.playEquip();
        this.updateSkillBookUI();
    }

    updateSkillBookUI() {
        const countBadge = document.getElementById('equippedSkillCount');
        const slotsGrid = document.getElementById('equippedSlotsGrid');
        const libList = document.getElementById('skillLibraryList');
        if (!slotsGrid || !libList) return;

        if (!this.skillBookFilter) this.skillBookFilter = 'all';

        // 1. Update filter tab active buttons
        const filterBtns = document.querySelectorAll('.skill-filter-btn');
        filterBtns.forEach(btn => {
            if (btn.dataset.filter === this.skillBookFilter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // 2. Render Active 2nd Awakening Passive Banner (Lv 50 Requirement)
        const passiveBox = document.getElementById('activeAwakeningPassiveBox');
        if (passiveBox) {
            const wType = this.player.getWeaponType();
            const isAwakened = (this.player.level >= 50);

            if (!isAwakened) {
                passiveBox.innerHTML = `
                    <div class="awakening-passive-header">
                        <span class="awakening-passive-tag" style="background: #475569;">🔒 2차 각성 미달성</span>
                        <span class="awakening-passive-title" style="color: #fca5a5;">"그 레벨에 잠이 오늬?" (현재 Lv <strong>${this.player.level}</strong> / 필요 Lv <strong>50</strong>)</span>
                    </div>
                    <div class="awakening-passive-desc" style="color: #cbd5e1;">
                        • Lv 50 달성 시 직업별 2차 각성 패시브와 전용 궁극기가 정식 해금됩니다!
                    </div>
                `;
            } else {
                if (wType === 'sword') {
                    passiveBox.innerHTML = `
                        <div class="awakening-passive-header">
                            <span class="awakening-passive-tag" style="background: #dc2626;">⚔️ 2차 각성 패시브 [불굴의 백수 투기] (Lv ${this.player.level} 활성)</span>
                        </div>
                        <div class="awakening-passive-desc">
                            • 체력이 30% 이하로 떨어지면 <strong>공격력 +20% 증가</strong> 및 <strong>받는 피해 25% 영구 감소</strong>
                        </div>
                    `;
                } else if (wType === 'bow') {
                    passiveBox.innerHTML = `
                        <div class="awakening-passive-header">
                            <span class="awakening-passive-tag" style="background: #059669;">🏹 2차 각성 패시브 [방구석 매의 눈] (Lv ${this.player.level} 활성)</span>
                        </div>
                        <div class="awakening-passive-desc">
                            • 기본 <strong>치명타율 +30% 증가</strong> & 사거리 250px 밖의 적 타격 시 <strong>피해 +30% 증폭</strong>
                        </div>
                    `;
                } else if (wType === 'staff') {
                    passiveBox.innerHTML = `
                        <div class="awakening-passive-header">
                            <span class="awakening-passive-tag" style="background: #7e22ce;">🪄 2차 각성 패시브 [무한의 마력로] (Lv ${this.player.level} 활성)</span>
                        </div>
                        <div class="awakening-passive-desc">
                            • 마나 자연 재생 속도 <strong>+100% 증가 (24 MP/s)</strong> & 스킬 사용 시 <strong>20% 확률로 쿨다운 즉시 초기화</strong>
                        </div>
                    `;
                } else if (wType === 'dagger') {
                    passiveBox.innerHTML = `
                        <div class="awakening-passive-header">
                            <span class="awakening-passive-tag" style="background: #ca8a04;">🗡️ 2차 각성 패시브 [치명적 암살 본능] (Lv ${this.player.level} 활성)</span>
                        </div>
                        <div class="awakening-passive-desc">
                            • 치명타 피해량 <strong>+100% 증가 (3.0배)</strong> & 적 처치 시 <strong>2초간 즉시 은신 + 이속 +100</strong>
                        </div>
                    `;
                }
            }
        }

        // 3. Update Title Count
        const titleEl = document.getElementById('skillLibraryTitle');
        if (titleEl) {
            titleEl.innerText = `📖 보유 스킬 라이브러리 (총 ${Object.keys(SKILL_DB).length}종)`;
        }

        const slotKeys = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];
        let activeCount = 0;

        // Render 9 Slots Grid
        slotsGrid.innerHTML = slotKeys.map(k => {
            const skillId = this.player.equippedSkills[k];
            const skill = skillId ? SKILL_DB[skillId] : null;
            const isTarget = (this.player.selectedSkillSlotTarget === k);

            if (skill) {
                activeCount++;
                return `
                    <div class="skill-slot-box equipped ${isTarget ? 'target-highlight' : ''}" onclick="window.game.unequipSkillFromSlot('${k}')" title="[${k}] ${skill.name} (클릭 시 해제)">
                        <span class="key-tag">${k}</span>
                        <span class="slot-icon">${skill.icon}</span>
                        <span class="slot-name">${skill.name}</span>
                        <span class="slot-cost">💧 ${skill.mpCost} MP</span>
                    </div>
                `;
            } else {
                return `
                    <div class="skill-slot-box empty ${isTarget ? 'target-highlight' : ''}" onclick="window.game.openSkillBookToSlot('${k}')" title="[${k}] 빈 슬롯">
                        <span class="key-tag">${k}</span>
                        <span class="slot-icon" style="font-size: 22px; opacity: 0.45;">➕</span>
                        <span class="slot-name" style="color: #64748b;">(비어있음)</span>
                        <span class="slot-empty-label">미장착</span>
                    </div>
                `;
            }
        }).join('');

        if (countBadge) {
            countBadge.innerText = `${activeCount} / 9 슬롯 활성화`;
        }

        let allSkills = Object.values(SKILL_DB);
        let skillList = allSkills;
        if (this.skillBookFilter !== 'all') {
            skillList = allSkills.filter(s => {
                if (this.skillBookFilter === 'general') return s.classId === 'all';
                return s.classId === this.skillBookFilter;
            });
        }

        // Render Filtered Skill Library
        libList.innerHTML = skillList.map((skill, idx) => {
            let equippedSlot = null;
            for (const k of slotKeys) {
                if (this.player.equippedSkills[k] === skill.id) {
                    equippedSlot = k;
                    break;
                }
            }

            const isEquipped = !!equippedSlot;
            const isFocused = (idx === this.skillBookSelectedIndex);
            const isWaitingThis = (this.skillBookWaitingKeyForSkillId === skill.id);

            const assignButtons = slotKeys.map(k => {
                const isHere = (equippedSlot === k);
                return `
                    <button class="assign-key-btn ${isHere ? 'equipped-here' : ''}" onclick="window.game.equipSkillToSlot('${skill.id}', '${k}')" title="[${k}] 키에 장착">
                        ${isHere ? `✅ [${k}]` : k}
                    </button>
                `;
            }).join('');

            return `
                <div class="skill-lib-card ${isEquipped ? 'active-equipped' : ''} ${isFocused ? 'keyboard-focused' : ''} ${isWaitingThis ? 'waiting-key-assign' : ''}" onclick="window.game.skillBookSelectedIndex = ${idx}; window.game.updateSkillBookSelectionHighlight();">
                    <div class="skill-card-top">
                        <span class="focus-arrow ${isFocused ? 'active' : ''}">${isFocused ? '▶' : '&nbsp;'}</span>
                        <span class="skill-lib-icon">${skill.icon}</span>
                        <div class="skill-lib-title-box">
                            <div class="skill-lib-name">
                                <span>${skill.name}</span>
                                <span class="skill-type-tag ${skill.type}">${skill.typeName}</span>
                                ${isEquipped ? `<span style="font-size: 11.5px; color: #10b981; font-weight: 800;">[${equippedSlot} 키 장착중]</span>` : ''}
                                ${skill.type === 'ultimate' && skill.id !== 'skill_time_stop' && this.player.level < 50 ? `<span style="font-size: 10px; color: #f87171; background: rgba(239,68,68,0.2); border: 1px solid #ef4444; border-radius: 4px; padding: 1px 5px; font-weight: 800;">🔒 Lv 50 필요 ("그 레벨에 잠이 오늬?")</span>` : ''}
                            </div>
                            <div class="skill-lib-meta">
                                <span>💧 ${skill.mpCost} MP</span>
                                <span>⏱️ 쿨타임 ${skill.cd}초</span>
                            </div>
                        </div>
                    </div>
                    <div class="skill-lib-desc">
                        ${skill.desc}<br>
                        <strong style="color: #fde047;">⚔️ 위력:</strong> ${skill.dmgDesc}
                    </div>
                    ${isWaitingThis ? `
                        <div style="background: rgba(245, 158, 11, 0.25); border: 1.5px solid #f59e0b; border-radius: 8px; padding: 6px 12px; font-size: 12.5px; font-weight: 800; color: #facc15; animation: fullBagPulse 0.8s infinite alternate;">
                            ⚡ 장착할 키 (Q, W, E, A, S, D, Z, X, C) 중 하나를 키보드로 누르세요! [ESC 취소]
                        </div>
                    ` : `
                        <div class="assign-panel">
                            <span class="assign-label">⚡ 슬롯 배치:</span>
                            <div class="assign-keys-row">
                                ${assignButtons}
                            </div>
                        </div>
                    `}
                </div>
            `;
        }).join('');
    }

    upgradeEquipment(slotKey, cost) {
        return this.inventory.upgradeEquipment(slotKey, cost);
    }

    advanceTrialTowerFloor() {
        if (this.towerFloor >= this.towerMaxFloor) {
            this.showNotification('👑 [시련의 정복자] 50층 최종 보스를 격파하여 시련의 탑을 완전 정복했습니다!');
            sounds.playJackpot();
            return;
        }
        this.towerFloor++;
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + Math.round(this.player.maxHp * 0.4));
        this.player.mp = Math.min(this.player.maxMp, this.player.mp + Math.round(this.player.maxMp * 0.4));
        this.player.x = 2100;
        this.player.y = 2100;
        this.isTowerFloorCleared = false;
        this.initWorld();
        this.showNotification(`🗼 [시련의 탑 ${this.towerFloor}F 진입] 새로운 도전이 시작됩니다!`);
    }

    toggleTrialShop() {
        return this.shop.toggleTrialShop();
    }

    updateTrialShopUI() {
        return this.shop.updateTrialShopUI();
    }

    buyTrialItem(itemId, price) {
        return this.shop.buyTrialItem(itemId, price);
    }

    getShopWaresForCurrentZone() {
        return this.shop.getShopWaresForCurrentZone();
    }

    toggleShop() {
        return this.shop.toggleShop();
    }

    switchShopTab(tab) {
        return this.shop.switchShopTab(tab);
    }

    updateShopSelectionHighlight(isBuy) {
        return this.shop.updateShopSelectionHighlight(isBuy);
    }

    updateShopUI() {
        return this.shop.updateShopUI();
    }

    buyItem(itemId, price) {
        return this.shop.buyItem(itemId, price);
    }

    sellItem(inventoryIndex) {
        return this.shop.sellItem(inventoryIndex);
    }

        togglePause() {
        if (this.isIntroOpen) return;
        this.isPaused = !this.isPaused;
        const modal = document.getElementById('pauseModal');
        if (modal) {
            if (this.isPaused) {
                modal.classList.remove('hidden');
                const summaryEl = document.getElementById('pauseSummaryText');
                if (summaryEl) {
                    const zoneName = ZONE_CONFIG[this.currentZone]?.name || '마을';
                    summaryEl.innerText = `Lv.${this.player.level} · ${zoneName} · 🪙 ${this.player.gold.toLocaleString()} G`;
                }
                this.setPauseMenuIndex(0);
                sounds.playInteract();
            } else {
                modal.classList.add('hidden');
                sounds.playInteract();
            }
        }
    }

    setPauseMenuIndex(idx) {
        this.pauseSelectedIndex = Math.max(0, Math.min(6, idx));
        const btnIds = ['pauseBtnResume', 'pauseBtnSkills', 'pauseBtnGuide', 'pauseBtnSave', 'pauseBtnSettings', 'pauseBtnTitle', 'pauseBtnQuit'];
        btnIds.forEach((id, i) => {
            const el = document.getElementById(id);
            if (el) {
                if (i === this.pauseSelectedIndex) el.classList.add('active', 'focused');
                else el.classList.remove('active', 'focused');
            }
        });
        sounds.playInteract();
    }

    executePauseMenu(idx) {
        if (idx === 0) {
            this.togglePause();
        } else if (idx === 1) {
            this.togglePause();
            this.toggleSkillBook();
        } else if (idx === 2) {
            this.togglePause();
            this.toggleGuide();
        } else if (idx === 3) {
            this.saveGame();
            this.showNotification('💾 게임이 안전하게 저장되었습니다!');
        } else if (idx === 4) {
            this.togglePause();
            this.toggleSettings();
        } else if (idx === 5) {
            this.returnToTitle();
        } else if (idx === 6) {
            this.quitGame();
        }
    }

    toggleGuide() {
        this.isGuideOpen = !this.isGuideOpen;
        const modal = document.getElementById('guideModal');
        if (modal) {
            if (this.isGuideOpen) modal.classList.remove('hidden');
            else modal.classList.add('hidden');
        }
        sounds.playInteract();
    }

    toggleTabRadar() {
        this.isTabRadarOpen = !this.isTabRadarOpen;
        const modal = document.getElementById('tabRadarModal');
        if (modal) {
            if (this.isTabRadarOpen) {
                modal.classList.remove('hidden');
                sounds.playMagic();
            } else {
                modal.classList.add('hidden');
                sounds.playInteract();
            }
        }
    }

    setAutoPotionThreshold(val) {
        this.autoPotionThreshold = Number(val);
        const btns = document.querySelectorAll('#autoPotionBtnGroup .auto-potion-btn');
        btns.forEach(btn => {
            const thresh = Number(btn.getAttribute('data-thresh'));
            if (thresh === this.autoPotionThreshold) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        sounds.playInteract();
        const label = this.autoPotionThreshold === 0 ? 'OFF' : `${Math.round(this.autoPotionThreshold * 100)}% 이하`;
        this.showNotification(`🛵 [배달앱 설정] 자동 물약 결제: ${label}`);
        this.saveGame(true);
    }

    returnToTitle() {
        this.saveGame(true);
        this.isPaused = false;
        
        // Hide all game modals
        const modalIds = ['pauseModal', 'settingsModal', 'guideModal', 'tabRadarModal', 'inventoryModal', 'shopModal', 'forgeModal', 'worldMapModal', 'prologueOverlay'];
        modalIds.forEach(id => {
            const m = document.getElementById(id);
            if (m) m.classList.add('hidden');
        });

        this.initIntroDirector();

        const introEl = document.getElementById('introTitleScreen');
        if (introEl) {
            introEl.classList.remove('fade-out', 'hidden');
            introEl.style.display = 'flex';
            introEl.style.opacity = '1';
            introEl.style.pointerEvents = 'auto';
        }
        this.showNotification('🏠 타이틀 화면으로 돌아왔습니다.');
    }

    quitGame() {
        this.saveGame(true);
        if (window.confirm('게임을 안전하게 저장하고 종료하시겠습니까?')) {
            if (window.pywebview && window.pywebview.api && window.pywebview.api.quit_game) {
                window.pywebview.api.quit_game();
            } else {
                window.close();
                this.showNotification('게임을 안전하게 저장했습니다. 창을 닫아주세요.');
            }
        }
    }

    toggleSkillBook() {
        this.isSkillBookOpen = !this.isSkillBookOpen;
        this.skillBookWaitingKeyForSkillId = null;
        const modal = document.getElementById('skillModal');
        if (modal) {
            if (this.isSkillBookOpen) {
                this.skillBookSelectedIndex = 0;
                this.updateSkillBookUI();
                modal.classList.remove('hidden');
                sounds.playInteract();
            } else {
                modal.classList.add('hidden');
            }
        }
    }

    openSkillBookToSlot(slotKey) {
        if (this.player) this.player.selectedSkillSlotTarget = slotKey;
        if (!this.isSkillBookOpen) {
            this.toggleSkillBook();
        } else {
            this.updateSkillBookUI();
        }
    }

    equipSkillToSlot(skillId, slotKey) {
        if (!SKILL_DB[skillId]) return;
        
        // Remove skill if already equipped in another slot to avoid duplicates
        for (const k in this.player.equippedSkills) {
            if (this.player.equippedSkills[k] === skillId) {
                this.player.equippedSkills[k] = null;
            }
        }

        this.player.equippedSkills[slotKey] = skillId;
        this.skillBookWaitingKeyForSkillId = null;
        sounds.playEquip();
        this.updateSkillBookUI();
        this.updateHUD();
        this.saveGame(true);
        this.showNotification(`⚡ [${SKILL_DB[skillId].name}] 스킬이 [${slotKey}] 슬롯에 장착되었습니다!`);
    }

    clearAllEquippedSkills() {
        const slotKeys = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];
        let count = 0;
        slotKeys.forEach(k => {
            if (this.player.equippedSkills[k]) {
                this.player.equippedSkills[k] = null;
                count++;
            }
        });
        this.skillBookWaitingKeyForSkillId = null;
        sounds.playTrash();
        this.updateSkillBookUI();
        this.updateHUD();
        this.saveGame(true);
        this.showNotification(`🗑️ [전체 해제] 장착된 ${count}개의 모든 스킬 슬롯을 비웠습니다.`);
    }

    unequipSkillFromSlot(slotKey) {
        const prevSkillId = this.player.equippedSkills[slotKey];
        if (!prevSkillId) return;
        this.player.equippedSkills[slotKey] = null;
        this.skillBookWaitingKeyForSkillId = null;
        sounds.playTrash();
        this.updateSkillBookUI();
        this.updateHUD();
        this.saveGame(true);
        this.showNotification(`🗑️ [${slotKey}] 슬롯의 스킬이 해제되었습니다.`);
    }

    updateSkillBookSelectionHighlight(shouldScroll = false) {
        const list = document.getElementById('skillLibraryList');
        if (!list) return;
        const cards = list.querySelectorAll('.skill-lib-card');
        let focusedEl = null;

        cards.forEach((card, idx) => {
            const isFocused = (idx === this.skillBookSelectedIndex);
            const arrow = card.querySelector('.focus-arrow');
            if (isFocused) {
                card.classList.add('keyboard-focused');
                if (arrow) {
                    arrow.classList.add('active');
                    arrow.innerHTML = '▶';
                }
                focusedEl = card;
            } else {
                card.classList.remove('keyboard-focused');
                if (arrow) {
                    arrow.classList.remove('active');
                    arrow.innerHTML = '&nbsp;';
                }
            }
        });

        if (focusedEl && shouldScroll) {
            scrollElementIntoContainerView(list, focusedEl);
        }
    }

    closeSettings() {
        this.isSettingsOpen = false;
        const modal = document.getElementById('settingsModal');
        if (modal) modal.classList.add('hidden');
    }

    toggleSettings(forceState = null) {
        if (forceState !== null) {
            this.isSettingsOpen = forceState;
        } else {
            this.isSettingsOpen = !this.isSettingsOpen;
        }
        const modal = document.getElementById('settingsModal');
        if (modal) {
            if (this.isSettingsOpen) modal.classList.remove('hidden');
            else modal.classList.add('hidden');
        }
    }

    closeGuide() {
        this.isGuideOpen = false;
        const modal = document.getElementById('guideModal');
        if (modal) modal.classList.add('hidden');
    }

    closeInventory() {
        return this.inventory.closeInventory();
    }

    closeShop() {
        return this.shop.closeShop();
    }

    closeForge() {
        return this.inventory.closeForge();
    }

    closeSkillBook() {
        this.isSkillBookOpen = false;
        const modal = document.getElementById('skillBookModal');
        if (modal) modal.classList.add('hidden');
    }

    toggleFullscreen() {
        // pywebview native fullscreen toggle
        if (window.pywebview && window.pywebview.api && window.pywebview.api.toggle_fullscreen) {
            window.pywebview.api.toggle_fullscreen().then(isFs => {
                const btn = document.getElementById('btnFullscreen');
                if (btn) {
                    const icon = btn.querySelector('.btn-icon');
                    const text = btn.querySelector('.btn-text');
                    if (icon) icon.textContent = isFs ? '⛶' : '⛶';
                    if (text) text.textContent = isFs ? ' 창 모드' : ' 전체화면';
                }
            });
            return;
        }
        // fallback for browser preview
        const doc = document.documentElement;
        try {
            if (!document.fullscreenElement) {
                doc.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen();
            }
        } catch(e) {}
    }

    saveSettings() {
        localStorage.setItem('retro_rpg_settings', JSON.stringify(this.settings));
    }

    loadSettings() {
        try {
            const raw = localStorage.getItem('retro_rpg_settings');
            if (raw) this.settings = Object.assign(this.settings, JSON.parse(raw));
        } catch (e) {}

        sounds.setBgmVolume(this.settings.bgmVolume);
        sounds.setSfxVolume(this.settings.sfxVolume);
        this.camera.shakeEnabled = this.settings.screenShake;

        const bgmSlider = document.getElementById('settingBgm');
        const sfxSlider = document.getElementById('settingSfx');
        const shakeCheck = document.getElementById('settingShake');
        const aimCheck = document.getElementById('settingAim');

        if (bgmSlider) bgmSlider.value = Math.round(this.settings.bgmVolume * 100);
        if (sfxSlider) sfxSlider.value = Math.round(this.settings.sfxVolume * 100);
        if (shakeCheck) shakeCheck.checked = this.settings.screenShake;
        if (aimCheck) aimCheck.checked = this.settings.autoAim;
        const dodgeSelect = document.getElementById('settingDodgeMode');
        if (dodgeSelect) dodgeSelect.value = this.settings.dodgeMode || 'both';
        const verLabel = document.getElementById('settingsVersionLabel');
        if (verLabel) verLabel.innerText = `v${CURRENT_CLIENT_VERSION}`;
    }

    toggleScreenShake() {
        this.settings.screenShake = !this.settings.screenShake;
        this.camera.shakeEnabled = this.settings.screenShake;
        const shakeCheck = document.getElementById('settingShake');
        if (shakeCheck) shakeCheck.checked = this.settings.screenShake;
        return this.settings.screenShake;
    }

    toggleAutoAim() {
        this.settings.autoAim = !this.settings.autoAim;
        const aimCheck = document.getElementById('settingAim');
        if (aimCheck) aimCheck.checked = this.settings.autoAim;
        return this.settings.autoAim;
    }

    async checkForUpdates(isManual = false) {
        if (isManual) {
            this.showNotification('🌐 최신 업데이트를 확인하는 중입니다...');
        }

        try {
            let manifest = null;
            for (const url of UPDATE_MANIFEST_URLS) {
                try {
                    const resp = await fetch(url + '?t=' + Date.now());
                    if (resp.ok) {
                        manifest = await resp.json();
                        break;
                    }
                } catch (err) {
                    console.warn('Update check endpoint warning:', url, err);
                }
            }

            if (!manifest || !manifest.version) {
                if (isManual) this.showNotification('⚠️ 업데이트 정보를 가져오지 못했습니다. 네트워크를 확인하세요.');
                return;
            }

            this.latestRemoteManifest = manifest;
            const hasNew = isNewerVersion(manifest.version, CURRENT_CLIENT_VERSION);

            if (hasNew) {
                this.showUpdateModal(manifest, isManual);
            } else {
                if (isManual) {
                    sounds.playLevelUp();
                    this.showNotification(`✅ 현재 최신 버전(v${CURRENT_CLIENT_VERSION})을 사용 중입니다!`);
                }
            }
        } catch (e) {
            console.error('Check for updates error:', e);
            if (isManual) this.showNotification('⚠️ 업데이트 확인 중 오류가 발생했습니다.');
        }
    }

    showUpdateModal(manifest, isManual = false) {
        if (this.isIntroOpen && !isManual) {
            this.pendingUpdateManifest = manifest;
            return; // Defer automatic popup until player enters the game
        }
        this.isUpdateModalOpen = true;
        const modal = document.getElementById('updateModal');
        if (!modal) return;

        const curTag = document.getElementById('currentVerTag');
        const newTag = document.getElementById('newVerTag');
        const notesList = document.getElementById('patchNotesList');
        const progressBox = document.getElementById('patchProgressBox');
        const doBtn = document.getElementById('btnDoUpdate');
        const cancelBtn = document.getElementById('btnCancelUpdate');

        if (curTag) curTag.innerText = `현재 v${CURRENT_CLIENT_VERSION}`;
        if (newTag) newTag.innerText = `신규 v${manifest.version}`;
        if (progressBox) progressBox.classList.add('hidden');
        if (doBtn) {
            doBtn.disabled = false;
            doBtn.style.display = 'block';
            doBtn.innerText = '⚡ 지금 1초 만에 업데이트 (권장)';
        }
        if (cancelBtn) cancelBtn.style.display = 'block';

        if (notesList) {
            notesList.innerHTML = '';
            if (manifest.patchNotes && Array.isArray(manifest.patchNotes)) {
                manifest.patchNotes.forEach(note => {
                    const item = document.createElement('div');
                    item.className = 'patch-note-item';
                    item.innerText = '• ' + note;
                    notesList.appendChild(item);
                });
            } else {
                const item = document.createElement('div');
                item.className = 'patch-note-item';
                item.innerText = '• 성능 개선 및 시스템 안정화 업데이트';
                notesList.appendChild(item);
            }
        }

        sounds.playLevelUp();
        modal.classList.remove('hidden');
    }

    closeUpdateModal() {
        this.isUpdateModalOpen = false;
        const modal = document.getElementById('updateModal');
        if (modal) modal.classList.add('hidden');
        sounds.playInteract();
    }

    async executeHotPatch(skipReload = false) {
        const doBtn = document.getElementById('btnDoUpdate');
        const cancelBtn = document.getElementById('btnCancelUpdate');
        const progressBox = document.getElementById('patchProgressBox');
        const fillEl = document.getElementById('patchProgressFill');
        const percentEl = document.getElementById('patchProgressPercent');
        const labelEl = document.getElementById('patchProgressText');

        if (doBtn) doBtn.disabled = true;
        if (cancelBtn) cancelBtn.style.display = 'none';
        if (progressBox) progressBox.classList.remove('hidden');

        const setProgress = (pct, text) => {
            if (fillEl) fillEl.style.width = `${pct}%`;
            if (percentEl) percentEl.innerText = `${pct}%`;
            if (labelEl && text) labelEl.innerText = text;
        };

        setProgress(15, '최신 패치 데이터 다운로드 시작...');
        sounds.playInteract();

        try {
            let patchCode = null;
            for (const url of UPDATE_SCRIPT_URLS) {
                try {
                    setProgress(40, 'GitHub 고속 CDN에서 코드 수신 중...');
                    const resp = await fetch(url + '?t=' + Date.now());
                    if (resp.ok) {
                        patchCode = await resp.text();
                        break;
                    }
                } catch (e) {
                    console.warn('Patch script fetch warning:', url, e);
                }
            }

            if (!patchCode || patchCode.length < 1000) {
                throw new Error('유효한 패치 코드를 수신하지 못했습니다.');
            }

            setProgress(80, '패치 데이터 무결성 검증 및 적용 중...');

            // If running inside PyWebView desktop app, sync patch file to disk
            if (window.pywebview && window.pywebview.api && window.pywebview.api.sync_patch_file) {
                try {
                    await window.pywebview.api.sync_patch_file(patchCode);
                } catch (err) {
                    console.warn('Native patch sync notice:', err);
                }
            }

            // Save to localStorage patch cache
            localStorage.setItem('zijeossi_patched_game_js', patchCode);
            localStorage.setItem('zijeossi_patched_version', this.latestRemoteManifest?.version || 'latest');

            setProgress(100, '🎉 업데이트 완료! 1초 후 자동 새로고침됩니다...');
            sounds.playLevelUp();
            this.showNotification('🎉 [업데이트 완료] 최신 버전으로 게임을 재시작합니다!');

            if (!skipReload) {
                setTimeout(() => {
                    window.location.reload(true);
                }, 1200);
            }

        } catch (err) {
            console.error('Hot patch execution failed:', err);
            setProgress(100, '⚠️ 패치 실패: ' + err.message);
            if (labelEl) labelEl.style.color = '#f87171';
            if (doBtn) {
                doBtn.disabled = false;
                doBtn.innerText = '다시 시도';
            }
            if (cancelBtn) cancelBtn.style.display = 'block';
            this.showNotification('⚠️ 패치 다운로드에 실패했습니다. 네트워크를 확인하세요.');
        }
    }

    triggerSkillFlash(key) {
        const slot = document.getElementById(`slot_${key}`);
        if (slot) {
            slot.classList.remove('flash-ready');
            void slot.offsetWidth;
            slot.classList.add('flash-ready');
        }
    }

    getSaveData() {
        return {
            level: this.player.level,
            exp: this.player.exp,
            maxExp: this.player.maxExp,
            hp: this.player.hp,
            baseHp: this.player.baseHp,
            mp: this.player.mp,
            baseMp: this.player.baseMp,
            gold: this.player.gold,
            baseAttack: this.player.baseAttack,
            upgradeLevels: this.player.upgradeLevels,
            inventory: this.player.inventory,
            equipment: this.player.equipment,
            equippedSkills: this.player.equippedSkills,
            dodgeMode: (this.settings && this.settings.dodgeMode) || 'both',
            autoPotionThreshold: this.autoPotionThreshold,
            quests: this.quests,
            potions: this.player.potions,
            currentZone: this.currentZone,
            x: Math.round(this.player.x),
            y: Math.round(this.player.y),
            usedCodes: this.usedCodes || {},
            towerFloor: this.towerFloor || 1,
            trialCoins: this.trialCoins || 0,
            timestamp: Date.now()
        };
    }

    saveGame(isAuto = false) {
        const data = this.getSaveData();
        localStorage.setItem('retro_rpg_save', JSON.stringify(data));
        if (isAuto) {
            const autoIcon = document.getElementById('autoSaveIndicator');
            if (autoIcon) {
                autoIcon.classList.remove('hidden');
                autoIcon.classList.add('pulse');
                setTimeout(() => {
                    autoIcon.classList.remove('pulse');
                    autoIcon.classList.add('hidden');
                }, 1500);
            }
        } else {
            this.showNotification('게임이 저장되었습니다!');
        }
    }

    loadGame(isAuto = false) {
        try {
            const raw = localStorage.getItem('retro_rpg_save');
            if (raw) {
                const data = JSON.parse(raw);
                this.player.level = data.level || 1;
                this.player.exp = data.exp || 0;
                this.player.maxExp = data.maxExp || 60;
                this.player.baseHp = data.baseHp || 160;
                this.player.baseMp = data.baseMp || 140;
                this.player.baseAttack = data.baseAttack || 38;
                this.player.gold = (typeof data.gold === 'number') ? data.gold : 0;
                this.towerFloor = data.towerFloor || 1;
                this.trialCoins = (typeof data.trialCoins === 'number') ? data.trialCoins : 0;
                this.player.upgradeLevels = data.upgradeLevels || { weapon: 0, armor: 0, accessory: 0 };
                if (data.inventory && Array.isArray(data.inventory)) {
                    this.player.inventory = [];
                    data.inventory.forEach(item => {
                        if (typeof item === 'string') {
                            this.player.addItemToInventory(item, 1);
                        } else if (item && item.id) {
                            this.player.addItemToInventory(item.id, item.count || 1);
                        }
                    });
                } else {
                    this.player.inventory = [{id:'potion_hp', count:3}, {id:'potion_mp', count:2}];
                }
                this.player.equipment = data.equipment || { weapon: null, armor: null, accessory: null };
                if (data.equippedSkills && typeof data.equippedSkills === 'object') {
                    this.player.equippedSkills = Object.assign({
                        Q: 'skill_ultimate',
                        W: 'skill_whirlwind',
                        E: 'skill_sword_beam',
                        A: 'skill_basic',
                        S: 'skill_parry',
                        D: 'skill_smash',
                        Z: 'skill_frost_nova',
                        X: 'skill_fireball',
                        C: 'skill_blessing'
                    }, data.equippedSkills);
                } else {
                    this.player.equippedSkills = {
                        Q: 'skill_ultimate',
                        W: 'skill_whirlwind',
                        E: 'skill_sword_beam',
                        A: 'skill_basic',
                        S: 'skill_parry',
                        D: 'skill_smash',
                        Z: 'skill_frost_nova',
                        X: 'skill_fireball',
                        C: 'skill_blessing'
                    };
                }
                this.player.skillCooldowns = { Q: 0, W: 0, E: 0, A: 0, S: 0, D: 0, Z: 0, X: 0, C: 0 };
                if (data.dodgeMode) {
                    this.settings.dodgeMode = data.dodgeMode;
                }
                if (typeof data.autoPotionThreshold === 'number') {
                    this.setAutoPotionThreshold(data.autoPotionThreshold);
                }
                this.player.potions = data.potions || { hp: 3, mp: 3, buff: 2 };
                if (data.quests) this.quests = data.quests;
                this.usedCodes = data.usedCodes || {};

                // Restore saved zone and player coordinates
                const targetZone = data.currentZone || 'village';
                const targetX = (typeof data.x === 'number') ? data.x : 2100;
                const targetY = (typeof data.y === 'number') ? data.y : 2100;

                this.switchZone(targetZone, false, targetX, targetY);

                this.player.recalculateStats();
                this.player.hp = (typeof data.hp === 'number') ? data.hp : this.player.maxHp;
                this.player.mp = (typeof data.mp === 'number') ? data.mp : this.player.maxMp;

                this.updateInventoryUI();
                this.updateQuestHUD();
                this.updateHUD();
                if (!isAuto) this.showNotification(`💾 저장 데이터를 불러왔습니다! (Lv.${this.player.level} / ${this.player.gold} G)`);
            } else {
                if (!isAuto) this.showNotification('저장된 데이터가 없어 새로운 모험을 시작합니다!');
            }
        } catch (e) {
            console.error('Failed to load save', e);
        }
    }

    submitSecretCode(rawCode) {
        return this.applySecretCode(rawCode);
    }

    applySecretCode(rawCode) {
        if (!rawCode) return;
        const code = rawCode.trim().toLowerCase();
        const fbEl = document.getElementById('cheatFeedbackMsg');
        this.usedCodes = this.usedCodes || {};

        const showCheatMsg = (msg, isSuccess = true) => {
            if (isSuccess) sounds.playLevelUp();
            this.showNotification(msg);
            if (fbEl) {
                fbEl.style.display = 'block';
                fbEl.style.color = isSuccess ? '#4ade80' : '#f87171';
                fbEl.innerText = msg;
                setTimeout(() => { if (fbEl) fbEl.style.display = 'none'; }, 4000);
            }
        };

        if (code === '지준성') {
            if (this.usedCodes['지준성']) {
                showCheatMsg('이미 사용 완료된 쿠폰 번호입니다.', false);
                return;
            }
            this.usedCodes['지준성'] = true;
            this.player.gold += 500;
            this.updateHUD();
            this.updateInventoryUI();
            this.saveGame(true);
            showCheatMsg('🎁 [이벤트 쿠폰] +500 Gold가 지급되었습니다! (1회 한정)');
        } else if (code === 'jsj') {
            this.player.gold += 100000;
            this.updateHUD();
            this.updateInventoryUI();
            this.saveGame(true);
            showCheatMsg('🪙 [시크릿 코드] +100,000 Gold가 지급되었습니다! (보유 골드: ' + this.player.gold + ' G)');
        } else if (code === 'makemerich') {
            this.player.gold += 100000000;
            this.updateHUD();
            this.updateInventoryUI();
            this.saveGame(true);
            showCheatMsg('💰 [시크릿 코드] +100,000,000 Gold가 지급되었습니다!');
        } else if (code === '자라나라머리머리') {
            this.player.level = 50;
            this.player.baseAttack = 200;
            this.player.baseHp = 2000;
            this.player.baseMp = 1500;
            this.player.gold += 500000;
            this.player.recalculateStats();
            this.player.hp = this.player.maxHp;
            this.player.mp = this.player.maxMp;
            this.updateHUD();
            this.saveGame(true);
            showCheatMsg('⚡ [시크릿 코드] 자라나라 머리머리! Lv.50 각성 완료! (공격력 200, HP 2,000, MP 1,500, +50만G)');
        } else if (code === '킹왕짱') {
            this.player.equipment.weapon = 'sword_lazy_god';
            this.player.equipment.armor = 'armor_lazy_god';
            this.player.equipment.accessory = 'ring_lazy_god';
            this.player.upgradeLevels = { weapon: 10, armor: 10, accessory: 10 };
            this.player.potions = { hp: 99, mp: 99, buff: 99 };
            this.player.addItemToInventory('potion_hp', 99);
            this.player.addItemToInventory('potion_mp', 99);
            this.player.addItemToInventory('potion_buff', 99);
            this.player.addItemToInventory('potion_hp', 99);
            this.player.addItemToInventory('potion_mp', 99);
            this.player.addItemToInventory('potion_buff', 99);
            this.player.recalculateStats();
            this.player.hp = this.player.maxHp;
            this.player.mp = this.player.maxMp;
            this.updateHUD();
            this.updateInventoryUI();
            this.saveGame(true);
            showCheatMsg('✨ [시크릿 코드] 킹왕짱! 전설의 나태 신 종결 풀세트(+10 풀강) & 물약 99개가 지급되었습니다!');
        } else if (code === '각성') {
            this.player.hp = this.player.maxHp;
            this.player.mp = this.player.maxMp;
            this.player.buffTimer = 60;
            this.updateHUD();
            showCheatMsg('💖 [시크릿 코드] 각성 완료! 체력/마나 100% 충전 & 공격/이속 +40% 버프 60초 발동!');
        } else if (code === '나태낙원' || code === '낙원' || code === 'paradise') {
            this.switchZone('lazy_paradise');
            showCheatMsg('🛏️ [시크릿 코드] 최종 구역 [꿈속의 나태 낙원]으로 이동했습니다!');
        } else if (code === '신역' || code === '보스' || code === 'boss') {
            this.switchZone('god_sanctuary');
            showCheatMsg('🏛️ [시크릿 코드] 최종 보스 구역 [태초의 신역]으로 이동했습니다!');
        } else if (code === '사막' || code === 'desert') {
            this.switchZone('desert');
            showCheatMsg('🏜️ [시크릿 코드] [황혼의 사막]으로 이동했습니다!');
        } else if (code === '설원' || code === 'snow') {
            this.switchZone('frozen_tundra');
            showCheatMsg('❄️ [시크릿 코드] [혹한의 빙하 설원]으로 이동했습니다!');
        } else {
            showCheatMsg('유효하지 않은 쿠폰 번호이거나 사용 기간이 만료된 코드입니다.', false);
        }
    }

    exportSaveCode() {
        const data = this.getSaveData();
        const code = btoa(encodeURIComponent(JSON.stringify(data)));
        navigator.clipboard.writeText(code).then(() => {
            this.showNotification('세이브 코드가 복사되었습니다!');
        });
        return code;
    }

    importSaveCode(code) {
        try {
            const jsonStr = decodeURIComponent(atob(code.trim()));
            const data = JSON.parse(jsonStr);
            localStorage.setItem('retro_rpg_save', JSON.stringify(data));
            this.loadGame();
            this.showNotification('크로스 세이브 적용 완료!');
            return true;
        } catch (e) {
            alert('올바르지 않은 세이브 코드입니다.');
            return false;
        }
    }

    initTitleEmbers() {
        this.titleEmbers = [];
        const count = 75;
        for (let i = 0; i < count; i++) {
            this.titleEmbers.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                radius: Math.random() * 3 + 1,
                vx: (Math.random() - 0.5) * 20,
                vy: -(Math.random() * 50 + 25),
                alpha: Math.random() * 0.8 + 0.2,
                color: Math.random() < 0.6 ? '#f59e0b' : (Math.random() < 0.85 ? '#ef4444' : '#facc15'),
                pulse: Math.random() * Math.PI * 2
            });
        }
        this.titleStars = [];
        for (let i = 0; i < 90; i++) {
            this.titleStars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * (window.innerHeight * 0.75),
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.7 + 0.3,
                twinkleSpeed: Math.random() * 2 + 1
            });
        }
        this.titleAnimTime = 0;
    }

    renderTitleBackground(dt) {
        if (!this.titleCanvas) {
            this.titleCanvas = document.getElementById('titleBackgroundCanvas');
            if (this.titleCanvas) this.titleCtx = this.titleCanvas.getContext('2d');
        }
        if (!this.titleCanvas || !this.titleCtx) return;
        const ctx = this.titleCtx;
        const w = window.innerWidth;
        const h = window.innerHeight;

        if (this.titleCanvas.width !== w || this.titleCanvas.height !== h) {
            this.titleCanvas.width = w;
            this.titleCanvas.height = h;
        }

        this.titleAnimTime = (this.titleAnimTime || 0) + dt;
        const t = this.titleAnimTime;

        // 1. Epic Cosmic & Volumetric Night Sky Radial Gradient
        const cx = w / 2;
        const cy = h * 0.42;
        const bgGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, Math.max(w, h) * 0.95);
        bgGrad.addColorStop(0, '#431407'); // Deep fiery glow center
        bgGrad.addColorStop(0.35, '#1c1917'); // Dark slate ember aura
        bgGrad.addColorStop(0.7, '#0c0a1f'); // Deep celestial violet
        bgGrad.addColorStop(1, '#030712'); // Pure dark space
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Swirling Aurora Light Bands
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let b = 0; b < 3; b++) {
            const waveY = h * 0.35 + Math.sin(t * 0.8 + b * 2) * 50;
            const aurGrad = ctx.createRadialGradient(cx + Math.cos(t * 0.5 + b) * 200, waveY, 30, cx, waveY, w * 0.65);
            aurGrad.addColorStop(0, b === 0 ? 'rgba(245, 158, 11, 0.18)' : (b === 1 ? 'rgba(239, 68, 68, 0.14)' : 'rgba(168, 85, 247, 0.12)'));
            aurGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = aurGrad;
            ctx.fillRect(0, 0, w, h);
        }
        ctx.restore();

        // 3. Twinkling Stars in Upper Sky
        if (this.titleStars) {
            for (const s of this.titleStars) {
                const tw = (Math.sin(t * s.twinkleSpeed) + 1) * 0.5;
                ctx.fillStyle = `rgba(254, 240, 138, ${s.alpha * (0.4 + 0.6 * tw)})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // 4. Rising Glowing Fire Embers
        if (this.titleEmbers) {
            ctx.save();
            ctx.shadowBlur = 10;
            for (const emb of this.titleEmbers) {
                emb.y += emb.vy * dt;
                emb.x += emb.vx * dt + Math.sin(t * 2 + emb.pulse) * 0.8;
                if (emb.y < -20) {
                    emb.y = h + 10;
                    emb.x = Math.random() * w;
                }
                ctx.shadowColor = emb.color;
                ctx.fillStyle = emb.color;
                ctx.globalAlpha = emb.alpha * (0.6 + 0.4 * Math.sin(t * 3 + emb.pulse));
                ctx.beginPath();
                ctx.arc(emb.x, emb.y, emb.radius, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // 5. Dark Fantasy Mountain Horizon Silhouette at Bottom
        ctx.fillStyle = '#030712';
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(0, h * 0.88);
        ctx.lineTo(w * 0.15, h * 0.82);
        ctx.lineTo(w * 0.32, h * 0.89);
        ctx.lineTo(w * 0.5, h * 0.79); // Center Peak
        ctx.lineTo(w * 0.68, h * 0.88);
        ctx.lineTo(w * 0.85, h * 0.81);
        ctx.lineTo(w, h * 0.86);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();

        // 6. Bottom Volumetric Ground Mist
        const mistGrad = ctx.createLinearGradient(0, h * 0.7, 0, h);
        mistGrad.addColorStop(0, 'rgba(5, 8, 17, 0)');
        mistGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.4)');
        mistGrad.addColorStop(1, 'rgba(3, 7, 18, 0.95)');
        ctx.fillStyle = mistGrad;
        ctx.fillRect(0, h * 0.7, w, h * 0.3);
    }

    start() {
        const loop = (timestamp) => {
            try {
                const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
                this.lastTime = timestamp;

                if (this.isIntroOpen) {
                    this.renderTitleBackground(dt);
                    this.handleKeyboardUINavigation();
                    this.input.update();
                } else {
                    this.update(dt);
                    this.render();
                }
            } catch (err) {
                console.error("Game Loop Recovered:", err);
            }

            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    // ========================================================================
    // Direct Title Screen & Main Menu Controller ('지 저 씨')
    // ========================================================================
    async syncSaveWithNativeDisk() {
        if (window.pywebview && window.pywebview.api && window.pywebview.api.load_file_data) {
            try {
                const diskData = await window.pywebview.api.load_file_data();
                if (diskData) {
                    const localRaw = localStorage.getItem('retro_rpg_save');
                    if (!localRaw) {
                        localStorage.setItem('retro_rpg_save', diskData);
                    } else {
                        try {
                            const diskObj = JSON.parse(diskData);
                            const localObj = JSON.parse(localRaw);
                            if ((diskObj.timestamp || 0) >= (localObj.timestamp || 0)) {
                                localStorage.setItem('retro_rpg_save', diskData);
                            }
                        } catch (e) {}
                    }
                }
                this.updateIntroMenuUI();
            } catch (e) {
                console.warn('Native disk sync error:', e);
            }
        }
    }

    updateIntroMenuUI() {
        const raw = localStorage.getItem('retro_rpg_save');
        const contLabel = document.getElementById('introBtnContinueLabel');
        if (raw) {
            try {
                const data = JSON.parse(raw);
                const zoneName = ZONE_CONFIG[data.currentZone]?.name || '마을';
                if (contLabel) {
                    contLabel.innerText = `💾 모험 이어하기 [Lv.${data.level || 1} · ${zoneName}]`;
                }
                this.setIntroMenuIndex(0, false); // Select 'Continue' by default
            } catch (e) {
                this.setIntroMenuIndex(0, false);
            }
        } else {
            if (contLabel) {
                contLabel.innerText = '💾 모험 이어하기 (저장 데이터 없음)';
            }
            this.setIntroMenuIndex(1, false); // Select 'New Game' by default if no save
        }
    }

    initIntroDirector() {
        if (!document.getElementById('introTitleScreen')) {
            this.isIntroOpen = false;
            try { sounds.init(); sounds.stopIntroMetalBGM(); sounds.startBGM(); } catch(e) {}
            this.startAdventure(true);
            return;
        }
        this.isIntroOpen = true;
        this.studioSplashDone = false;
        sounds.stopBGM();

        // 1. Play 959 Labs Studio AAA Cinematic Prestige Intro Sound
        try {
            sounds.playStudioJingle();
        } catch (e) {}

        // 2. Auto-transition to Title Metal BGM after 3.5s
        this.studioSplashTimer = setTimeout(() => {
            this.skipStudioSplash();
        }, 3500);

        this.updateIntroMenuUI();
        this.syncSaveWithNativeDisk();

        // Listen for pywebview ready event
        window.addEventListener('pywebviewready', () => {
            this.syncSaveWithNativeDisk();
        });
    }

    skipStudioSplash() {
        if (this.studioSplashDone) return;
        this.studioSplashDone = true;
        clearTimeout(this.studioSplashTimer);

        const el = document.getElementById('studioSplash');
        if (el) {
            el.classList.add('fade-out');
            setTimeout(() => {
                el.style.display = 'none';
            }, 600);
        }

        sounds.init();
        sounds.startIntroMetalBGM();
    }

    setupIntroEventListeners() {
        const btnCont = document.getElementById('introBtnContinue');
        const btnNew = document.getElementById('introBtnNewGame');
        const btnMulti = document.getElementById('introBtnMultiplayer');
        const btnSet = document.getElementById('introBtnSettings');
        const btnQuit = document.getElementById('introBtnQuit');

        if (btnCont) {
            btnCont.onclick = (e) => {
                if (e) e.stopPropagation();
                this.executeIntroMenu(0);
            };
        }
        if (btnNew) {
            btnNew.onclick = (e) => {
                if (e) e.stopPropagation();
                this.executeIntroMenu(1);
            };
        }
        if (btnMulti) {
            btnMulti.onclick = (e) => {
                if (e) e.stopPropagation();
                this.executeIntroMenu(2);
            };
        }
        if (btnSet) {
            btnSet.onclick = (e) => {
                if (e) e.stopPropagation();
                this.executeIntroMenu(3);
            };
        }
        if (btnQuit) {
            btnQuit.onclick = (e) => {
                if (e) e.stopPropagation();
                this.executeIntroMenu(4);
            };
        }

        const menuBtns = [btnCont, btnNew, btnMulti, btnSet, btnQuit];
        menuBtns.forEach((btn, idx) => {
            if (btn) {
                btn.onmouseenter = () => this.setIntroMenuIndex(idx, false);
            }
        });

        // Initialize Title Screen
        this.initIntroDirector();
    }

    setIntroMenuIndex(idx, playSound = false) {
        const targetIdx = Math.max(0, Math.min(4, idx));
        const changed = (this.introSelectedIndex !== targetIdx);
        this.introSelectedIndex = targetIdx;
        const btnIds = ['introBtnContinue', 'introBtnNewGame', 'introBtnMultiplayer', 'introBtnSettings', 'introBtnQuit'];
        btnIds.forEach((id, i) => {
            const el = document.getElementById(id);
            if (el) {
                if (i === this.introSelectedIndex) el.classList.add('active');
                else el.classList.remove('active');
            }
        });
        if (playSound && changed && !this.isIntroTransitioning) {
            try { sounds.playInteract(); } catch(e) {}
        }
    }

    executeIntroMenu(idx) {
        if (idx === 0) this.startAdventure(true, false);
        else if (idx === 1) this.startAdventure(false, false);
        else if (idx === 2) this.openMultiplayerModal();
        else if (idx === 3) this.toggleSettings();
        else if (idx === 4) this.quitGame();
    }

    openMultiplayerModal() {
        this.isMultiplayerModalOpen = true;
        const modal = document.getElementById('multiplayerLobbyModal');
        if (modal) modal.classList.remove('hidden');

        // Prefill Nickname
        const nickInput = document.getElementById('multiNicknameInput');
        if (nickInput) {
            const savedNick = (typeof localStorage !== 'undefined' && localStorage.getItem('zijeossi_nickname')) || '게으른_지저씨';
            nickInput.value = savedNick;
        }

        // Fetch Server LAN IP info
        this.fetchServerInfo();
        sounds.playInteract();
    }

    closeMultiplayerModal() {
        this.isMultiplayerModalOpen = false;
        const modal = document.getElementById('multiplayerLobbyModal');
        if (modal) modal.classList.add('hidden');
        sounds.playInteract();
    }

    fetchServerInfo() {
        fetch('/api/server-info')
            .then(res => res.json())
            .then(data => {
                const lanEl = document.getElementById('multiHostLanUrl');
                if (lanEl && data.inviteUrl) {
                    lanEl.innerText = data.inviteUrl;
                }
            })
            .catch(() => {});
    }

    randomizeMultiNickname() {
        const prefixes = [
            '게으른', '각성한', '누워있는', '칼퇴하는', '피곤한', 
            '낮잠자는', '만렙백수', '비범한', '귀차니즘', '치맥원하는', 
            '대마법', '황금빛', '전설의', '폭풍성장', '은밀한', 
            '치명적인', '로또1등', '월급루팡', '일단자자', '심연의',
            '재택근무', '무적의', '눈치빠른', '초사이어인', '소주한잔'
        ];
        const randomNick = `${prefixes[Math.floor(Math.random() * prefixes.length)]}_지저씨`;
        
        const nickInput = document.getElementById('multiNicknameInput');
        if (nickInput) nickInput.value = randomNick;
        if (typeof localStorage !== 'undefined') localStorage.setItem('zijeossi_nickname', randomNick);
        sounds.playCoin();
    }

    copyInviteUrl() {
        const lanEl = document.getElementById('multiHostLanUrl');
        const url = lanEl ? lanEl.innerText : `http://${window.location.hostname}:3000`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification(`📋 초대 주소 [${url}] 가 복사되었습니다!`);
                sounds.playCoin();
            }).catch(() => {
                this.showNotification(`초대 주소: ${url}`);
            });
        } else {
            this.showNotification(`초대 주소: ${url}`);
        }
    }

    startMultiplayerHost() {
        const nickInput = document.getElementById('multiNicknameInput');
        const chosen = (nickInput && nickInput.value.trim().length > 0) ? nickInput.value.trim().slice(0, 12) : '게으른_지저씨';
        
        if (typeof localStorage !== 'undefined') localStorage.setItem('zijeossi_nickname', chosen);

        this.closeMultiplayerModal();
        this.startAdventure(false, true);

        this.player.nickname = chosen;

        if (this.network) {
            this.network.connect();
        }
        this.showNotification(`👑 [방장] 멀티플레이 방을 개설했습니다! (닉네임: ${chosen})`);
    }

    startMultiplayerJoin() {
        const nickInput = document.getElementById('multiNicknameInput');
        const chosen = (nickInput && nickInput.value.trim().length > 0) ? nickInput.value.trim().slice(0, 12) : '게으른_지저씨';
        
        const joinInput = document.getElementById('multiJoinServerUrl');
        let targetUrl = (joinInput && joinInput.value.trim().length > 0) ? joinInput.value.trim() : undefined;

        if (typeof localStorage !== 'undefined') localStorage.setItem('zijeossi_nickname', chosen);

        this.closeMultiplayerModal();
        this.startAdventure(false, true);

        this.player.nickname = chosen;

        if (this.network) {
            this.network.connect(targetUrl);
        }
        this.showNotification(`⚔️ [파티원] 멀티플레이 서버에 접속합니다... (닉네임: ${chosen})`);
    }

    startAdventure(loadSave = false, isMultiplayer = false) {
        this.isIntroOpen = false;
        this.isMultiplayer = isMultiplayer;
        sounds.init();
        sounds.stopIntroMetalBGM();
        sounds.startBGM();

        if (!isMultiplayer && this.network) {
            this.network.disconnect();
        }

        if (this.pendingUpdateManifest) {
            setTimeout(() => {
                if (this.pendingUpdateManifest) {
                    this.showUpdateModal(this.pendingUpdateManifest, true);
                    this.pendingUpdateManifest = null;
                }
            }, 1200);
        } else {
            setTimeout(() => this.checkForUpdates(false), 2500);
        }

        const introEl = document.getElementById('introTitleScreen');
        if (introEl) {
            introEl.classList.add('fade-out');
            introEl.style.opacity = '0';
            introEl.style.pointerEvents = 'none';
            setTimeout(() => {
                introEl.style.display = 'none';
                introEl.classList.add('hidden');
            }, 350);
        }

        if (loadSave) {
            const raw = localStorage.getItem('retro_rpg_save');
            if (raw) {
                this.loadGame();
            } else {
                this.startAdventure(false, isMultiplayer);
                return;
            }
        } else {
            // Fresh New Game: Reset to default stats and start in village
            this.player = new Player(2100, 2100);
            this.currentZone = 'village';
            this.quests = JSON.parse(JSON.stringify(QUEST_DB));
            this.isPaused = false;
            this.pauseSelectedIndex = 0;
            this.usedCodes = {};
            this.switchZone('village', false, 2100, 2100);
            this.updateInventoryUI();
            this.updateQuestHUD();
            this.updateHUD();
            this.showNotification(isMultiplayer ? '🌐 [코옵 멀티플레이] 파티 모험을 시작합니다!' : '⚔️ [싱글플레이] 모험을 시작합니다!');
        }

        const multiNickInput = document.getElementById('multiNicknameInput');
        const chosen = (multiNickInput && multiNickInput.value.trim().length > 0) ? multiNickInput.value.trim().slice(0, 12) : ((typeof localStorage !== 'undefined' && localStorage.getItem('zijeossi_nickname')) || '게으른_지저씨');
        this.player.nickname = chosen;
        if (typeof localStorage !== 'undefined') localStorage.setItem('zijeossi_nickname', chosen);
        if (this.network && isMultiplayer) this.network.sendPlayerState(true);
    }

    handleKeyboardUINavigation() {
        const inp = this.input;

        if (this.isUpdateModalOpen) {
            if (inp.isJustPressed('Escape') || inp.isJustPressed('KeyF')) {
                inp.justPressed['Escape'] = false;
                inp.justPressed['KeyF'] = false;
                this.closeUpdateModal();
            } else if (inp.isEnterPressed()) {
                inp.justPressed['Enter'] = false;
                this.executeHotPatch();
            }
            return;
        }

        if (this.isIntroOpen) {
            if (!this.studioSplashDone) {
                if (inp.isJustPressed('Space') || inp.isEnterPressed() || inp.isJustPressed('Escape') || inp.isInteractPressed() || inp.isAttackPressed()) {
                    inp.justPressed['Space'] = false;
                    inp.justPressed['Enter'] = false;
                    inp.justPressed['Escape'] = false;
                    inp.justPressed['KeyF'] = false;
                    inp.justPressed['KeyA'] = false;
                    this.skipStudioSplash();
                    return;
                }
            }

            if (this.isMultiplayerModalOpen) {
                if (inp.isJustPressed('Escape')) {
                    inp.justPressed['Escape'] = false;
                    this.closeMultiplayerModal();
                    sounds.playInteract();
                }
                return;
            }

            if (this.isSettingsOpen) {
                if (inp.isSettingsPressed() || inp.isInteractPressed() || inp.isJustPressed('Escape')) {
                    this.toggleSettings();
                    this.modalJustClosedThisFrame = true;
                    inp.justPressed['KeyP'] = false;
                    inp.justPressed['KeyF'] = false;
                    inp.justPressed['Escape'] = false;
                    sounds.playInteract();
                }
                return;
            }
            // Main Menu Keyboard Navigation
            if (inp.isJustPressed('ArrowUp')) {
                inp.justPressed['ArrowUp'] = false;
                this.setIntroMenuIndex(this.introSelectedIndex - 1, true);
            }
            if (inp.isJustPressed('ArrowDown')) {
                inp.justPressed['ArrowDown'] = false;
                this.setIntroMenuIndex(this.introSelectedIndex + 1, true);
            }
            if (inp.isEnterPressed() || inp.isJustPressed('Space')) {
                inp.justPressed['Enter'] = false;
                inp.justPressed['Space'] = false;
                this.executeIntroMenu(this.introSelectedIndex);
            }
            if (inp.isSettingsPressed()) {
                inp.justPressed['KeyP'] = false;
                this.toggleSettings();
            }
            return;
        }

        // 1. If Game is Paused (ESC / Pause Modal Navigation)
        if (this.isPaused) {
            if (inp.isJustPressed('Escape')) {
                inp.justPressed['Escape'] = false;
                this.togglePause();
                return;
            }
            if (inp.isJustPressed('ArrowUp')) {
                inp.justPressed['ArrowUp'] = false;
                this.setPauseMenuIndex(this.pauseSelectedIndex - 1);
            }
            if (inp.isJustPressed('ArrowDown')) {
                inp.justPressed['ArrowDown'] = false;
                this.setPauseMenuIndex(this.pauseSelectedIndex + 1);
            }
            if (inp.isEnterPressed() || inp.isJustPressed('Space')) {
                inp.justPressed['Enter'] = false;
                inp.justPressed['Space'] = false;
                this.executePauseMenu(this.pauseSelectedIndex);
            }
            return;
        }

        // 2. Global ESC Key Handler in gameplay (closes modal or opens pause)
        if (inp.isJustPressed('Escape')) {
            inp.justPressed['Escape'] = false;
            if (this.isTabRadarOpen) this.toggleTabRadar();
            else if (this.isGuideOpen) this.toggleGuide();
            else if (this.isSkillBookOpen) this.toggleSkillBook();
            else if (this.isSettingsOpen) this.toggleSettings();
            else if (this.isInventoryOpen) this.toggleInventory();
            else if (this.isShopOpen) this.toggleShop();
            else if (this.isForgeOpen) this.toggleForge();
            else if (this.isWorldMapOpen) this.toggleWorldMap();
            else if (this.isDialogueOpen) this.closeDialogue();
            else this.togglePause();
            this.modalJustClosedThisFrame = true;
            sounds.playInteract();
            return;
        }

        if (this.isTabRadarOpen) {
            if (inp.isJustPressed('Tab') || inp.isJustPressed('Escape') || inp.isJustPressed('KeyF')) {
                inp.justPressed['Tab'] = false;
                inp.justPressed['Escape'] = false;
                inp.justPressed['KeyF'] = false;
                this.toggleTabRadar();
                return;
            }
        }

        if (this.isGuideOpen) {
            if (inp.isJustPressed('Escape') || inp.isJustPressed('KeyF') || inp.isJustPressed('KeyP')) {
                inp.justPressed['Escape'] = false;
                inp.justPressed['KeyF'] = false;
                inp.justPressed['KeyP'] = false;
                this.toggleGuide();
                return;
            }
        }

        if (this.isSkillBookOpen) {
            const skillList = Object.values(SKILL_DB);

            // If in Key Assignment Mode (waiting for user to press Q,W,E,A,S,D,Z,X,C)
            if (this.skillBookWaitingKeyForSkillId) {
                if (inp.isJustPressed('Escape') || inp.isJustPressed('KeyF') || inp.isJustPressed('KeyK')) {
                    inp.justPressed['Escape'] = false;
                    inp.justPressed['KeyF'] = false;
                    inp.justPressed['KeyK'] = false;
                    this.skillBookWaitingKeyForSkillId = null;
                    this.updateSkillBookUI();
                    sounds.playInteract();
                    return;
                }

                const keyMap = {
                    'KeyQ': 'Q', 'KeyW': 'W', 'KeyE': 'E',
                    'KeyA': 'A', 'KeyS': 'S', 'KeyD': 'D',
                    'KeyZ': 'Z', 'KeyX': 'X', 'KeyC': 'C'
                };

                for (const code in keyMap) {
                    if (inp.isJustPressed(code)) {
                        inp.justPressed[code] = false;
                        this.equipSkillToSlot(this.skillBookWaitingKeyForSkillId, keyMap[code]);
                        return;
                    }
                }
                return;
            }

            // Normal Skill Book Navigation (ArrowUp / ArrowDown / Enter / Delete / ESC)
            if (inp.isJustPressed('Escape') || inp.isSkillBookPressed() || inp.isInteractPressed()) {
                inp.justPressed['Escape'] = false;
                inp.justPressed['KeyK'] = false;
                inp.justPressed['KeyF'] = false;
                this.toggleSkillBook();
                this.modalJustClosedThisFrame = true;
                sounds.playInteract();
                return;
            }

            if (inp.isJustPressed('ArrowUp')) {
                inp.justPressed['ArrowUp'] = false;
                if (this.skillBookSelectedIndex > 0) {
                    this.skillBookSelectedIndex--;
                    this.updateSkillBookSelectionHighlight(true);
                    sounds.playInteract();
                }
            } else if (inp.isJustPressed('ArrowDown')) {
                inp.justPressed['ArrowDown'] = false;
                if (this.skillBookSelectedIndex < skillList.length - 1) {
                    this.skillBookSelectedIndex++;
                    this.updateSkillBookSelectionHighlight(true);
                    sounds.playInteract();
                }
            } else if (inp.isEnterPressed()) {
                inp.justPressed['Enter'] = false;
                const targetSkill = skillList[this.skillBookSelectedIndex];
                if (targetSkill) {
                    this.skillBookWaitingKeyForSkillId = targetSkill.id;
                    sounds.playInteract();
                    this.updateSkillBookUI();
                }
            } else if (inp.isJustPressed('KeyX') && !this.skillBookWaitingKeyForSkillId) {
                inp.justPressed['KeyX'] = false;
                this.clearAllEquippedSkills();
            } else if (inp.isJustPressed('Delete') || inp.isJustPressed('Backspace')) {
                inp.justPressed['Delete'] = false;
                inp.justPressed['Backspace'] = false;
                const targetSkill = skillList[this.skillBookSelectedIndex];
                if (targetSkill) {
                    for (const k in this.player.equippedSkills) {
                        if (this.player.equippedSkills[k] === targetSkill.id) {
                            this.unequipSkillFromSlot(k);
                            break;
                        }
                    }
                }
            }
            return;
        }

        if (this.isWorldMapOpen) {
            if (inp.isWorldMapPressed() || inp.isInteractPressed()) {
                this.toggleWorldMap();
                this.modalJustClosedThisFrame = true;
                inp.justPressed['KeyM'] = false;
                inp.justPressed['KeyF'] = false;
                sounds.playInteract();
                return;
            }
        }

        // Delegated System Input Routing
        if (this.isCasinoOpen) {
            this.casino.handleInput(inp);
            return;
        }

        if (this.isDialogueOpen) {
            this.ui.handleInput(inp);
            return;
        }

        if (this.isShopOpen || this.isTrialShopOpen) {
            this.shop.handleInput(inp);
            return;
        }

        if (this.isForgeOpen || this.isInventoryOpen) {
            this.inventory.handleInput(inp);
            return;
        }

        if (this.isSettingsOpen) {
            if (inp.isSettingsPressed() || inp.isInteractPressed()) {
                this.toggleSettings();
                this.modalJustClosedThisFrame = true;
                inp.justPressed['KeyP'] = false;
                inp.justPressed['KeyF'] = false;
                sounds.playInteract();
                return;
            }
        }
    }

    update(dt) {
        if (this.isIntroOpen) {
            this.handleKeyboardUINavigation();
            this.input.update();
            return;
        }

        if (this.isPaused) {
            this.handleKeyboardUINavigation();
            this.input.update();
            return;
        }

        this.windTime += dt;
        this.radarPulseTimer = (this.radarPulseTimer + dt * 2.5) % Math.PI;
        this.camera.update(dt);
        this.modalJustClosedThisFrame = false;

        this.handleKeyboardUINavigation();

        this.player.update(dt, this.input, this);
        if (this.network) this.network.update(dt);
        if (this.chatSystem) this.chatSystem.update(dt);
        this.camera.follow(this.player.x, this.player.y, this.mapWidth, this.mapHeight);

        this.ambientParticleTimer += dt;
        if (this.ambientParticleTimer > 0.08) {
            this.ambientParticleTimer = 0;
            const cam = this.camera;
            const px = cam.x + Math.random() * cam.viewWidth;
            const py = cam.y + Math.random() * cam.viewHeight;

            if (this.currentZone === 'village') {
                this.particles.spawn(px, py, 'rgba(254, 240, 138, 0.4)', 1, 15, 1.5, 2.5);
            } else if (this.currentZone === 'dungeon_b1') {
                this.particles.spawn(px, py, 'rgba(168, 85, 247, 0.35)', 1, 20, 1.4, 2);
            } else if (this.currentZone === 'dungeon_b2') {
                this.particles.spawn(px, py, 'rgba(249, 115, 22, 0.55)', 1, 28, 1.2, 3);
            } else if (this.currentZone === 'dungeon_b3') {
                this.particles.spawn(px, py, 'rgba(56, 189, 248, 0.55)', 1, 35, 1.3, 3);
            } else if (this.currentZone === 'heaven_altar') {
                this.particles.spawn(px, py, 'rgba(250, 204, 21, 0.65)', 1, 40, 1.4, 3.5);
            }
        }

        this.respawnTimer += dt;
        if (this.respawnTimer > 6.0) {
            this.respawnTimer = 0;
            this.checkMonsterRespawn();
        }

        this.nearbyInteractable = this.getNearbyInteractable();
        this.updateMobileInteractButton();

        if (this.currentZone === 'dungeon_b1' || this.currentZone === 'dungeon_b3') {
            this.props.forEach(p => {
                if (p.type === 'trap' && Math.hypot(this.player.x - p.x, this.player.y - p.y) <= 22) {
                    this.player.takeDamage(14, 0, 0, this);
                }
            });
        }

        if (this.currentZone === 'trial_tower') {
            const towerTracker = document.getElementById('hudTowerTracker');
            if (towerTracker) {
                towerTracker.classList.remove('hidden');
                const floorNumEl = document.getElementById('towerFloorNum');
                const mobsLeftEl = document.getElementById('towerMobsLeft');
                const coinsCountEl = document.getElementById('towerCoinsCount');
                if (floorNumEl) floorNumEl.innerText = `${this.towerFloor}F`;
                const activeMobs = this.enemies.filter(e => e.active).length;
                if (mobsLeftEl) mobsLeftEl.innerText = `${activeMobs}`;
                if (coinsCountEl) coinsCountEl.innerText = `${this.trialCoins || 0}`;
            }

            // Check Floor Clear
            const activeMobs = this.enemies.filter(e => e.active).length;
            if (activeMobs === 0 && !this.isTowerFloorCleared) {
                this.isTowerFloorCleared = true;
                sounds.playLevelUp();
                const coins = Math.floor(this.towerFloor * 2 + 5);
                this.trialCoins = (this.trialCoins || 0) + coins;
                this.props.push(new Prop(2100, 1800, 'portal_trial_tower_next'));
                this.particles.spawn(2100, 1800, '#38bdf8', 35, 150, 0.8, 6);
                this.showNotification(`🎉 [시련의 탑 ${this.towerFloor}F 돌파!] 획득: 시련의 증표 +${coins}🪙 (중앙 포탈로 다음 층 이동)`);
            }
        } else {
            const towerTracker = document.getElementById('hudTowerTracker');
            if (towerTracker && !towerTracker.classList.contains('hidden')) {
                towerTracker.classList.add('hidden');
            }
        }

        [...this.enemies].forEach(e => { if (e.active && this.currentZone !== 'village') e.update(dt, this.player, this); });

        // Traps Update
        if (this.traps) {
            for (let i = this.traps.length - 1; i >= 0; i--) {
                const t = this.traps[i];
                t.timer -= dt;
                let triggered = false;
                for (const e of this.enemies) {
                    if (e.active && Math.hypot(e.x - t.x, e.y - t.y) <= t.triggerRadius + e.radius) {
                        triggered = true;
                        break;
                    }
                }
                if (triggered || t.timer <= 0) {
                    sounds.playSlam();
                    this.camera.shake(0.3, 9);
                    this.particles.spawn(t.x, t.y, '#f97316', 30, 160, 0.6, 6);
                    this.enemies.forEach(e => {
                        if (e.active && Math.hypot(e.x - t.x, e.y - t.y) <= t.blastRadius + e.radius) {
                            const a = Math.atan2(e.y - t.y, e.x - t.x);
                            e.takeDamage(t.damage, Math.cos(a) * 250, Math.sin(a) * 250, this, true);
                        }
                    });
                    this.traps.splice(i, 1);
                }
            }
        }

        // Ground Zones Update (Lava / Singularity fields)
        if (this.groundZones) {
            for (let i = this.groundZones.length - 1; i >= 0; i--) {
                const gz = this.groundZones[i];
                gz.duration -= dt;
                gz.tickTimer = (gz.tickTimer || 0) + dt;
                if (gz.tickTimer >= 0.5) {
                    gz.tickTimer = 0;
                    this.enemies.forEach(e => {
                        if (e.active && Math.hypot(e.x - gz.x, e.y - gz.y) <= gz.radius + e.radius) {
                            e.takeDamage(Math.round(gz.dps * 0.5), 0, 0, this, false);
                        }
                    });
                }
                if (gz.duration <= 0) this.groundZones.splice(i, 1);
            }
        }

        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.update(dt, this.particles, this);

            if (p.isPlayer) {
                this.enemies.forEach(e => {
                    if (e.active && !p.pierced.has(e) && Math.hypot(e.x - p.x, e.y - p.y) <= p.radius + e.radius) {
                        p.pierced.add(e);
                        if (this.network && !this.network.isZoneHost) {
                            this.network.sendHitMonster(e.id, p.damage, p.vx * 0.4, p.vy * 0.4, true);
                            sounds.playHit();
                            this.particles.spawn(e.x, e.y, e.color || '#ef4444', 6, 70, 0.3, 3);
                            this.particles.spawnDamageNumber(e.x, e.y, `${p.damage}`, '#facc15', true);
                        } else {
                            e.takeDamage(p.damage, p.vx * 0.4, p.vy * 0.4, this, true);
                        }
                    }
                });
            } else {
                if (Math.hypot(this.player.x - p.x, this.player.y - p.y) <= p.radius + this.player.radius) {
                    this.player.takeDamage(p.damage, p.vx * 0.3, p.vy * 0.3, this);
                    p.active = false;
                }
            }

            if (!p.active) this.projectiles.splice(i, 1);
        }

        this.particles.update(dt);
        this.updateHUD();
        this.updateBossHUD();
        this.renderMinimap();
        if (this.isTabRadarOpen) this.renderTabRadar();
        this.input.update();
    }

    updateBossHUD() {
        const bossBar = document.getElementById('bossHudBar');
        if (!bossBar) return;

        const activeBoss = this.enemies.find(e => e.active && e.isBoss && Math.hypot(this.player.x - e.x, this.player.y - e.y) <= 750);

        if (activeBoss) {
            bossBar.classList.remove('hidden');
            const nameLabel = document.getElementById('bossNameLabel');
            const percentLabel = document.getElementById('bossHpPercentLabel');
            const fillBar = document.getElementById('bossHpFill');
            const ghostBar = document.getElementById('bossHpGhost');

            const hpRatio = activeBoss.maxHp > 0 ? Math.max(0, Math.min(1, activeBoss.hp / activeBoss.maxHp)) : 0;
            const isEnraged = activeBoss.phase === 2;

            nameLabel.innerText = `${isEnraged ? '⚡ [광폭화] ' : ''}👑 ${activeBoss.bossName} <${activeBoss.bossTitle || ''}>`;
            percentLabel.innerText = `${Math.ceil(hpRatio * 100)}% (${Math.ceil(Math.max(0, activeBoss.hp))} / ${activeBoss.maxHp})`;
            fillBar.style.width = `${hpRatio * 100}%`;
            if (ghostBar) ghostBar.style.width = `${hpRatio * 100}%`;
        } else {
            bossBar.classList.add('hidden');
        }
    }

    renderMinimap() {
        if (!this.minimapCtx) return;
        const ctx = this.minimapCtx;
        const w = this.minimapCanvas.width;
        const h = this.minimapCanvas.height;

        const zoneNameEl = document.getElementById('minimapZoneName');
        const coordsEl = document.getElementById('minimapCoords');
        if (coordsEl) coordsEl.innerText = `${Math.round(this.player.x)}, ${Math.round(this.player.y)}`;
        if (zoneNameEl) {
            const zConf = ZONE_CONFIG[this.currentZone] || ZONE_CONFIG['village'];
            zoneNameEl.innerText = zConf.name;
        }

        const zConf = ZONE_CONFIG[this.currentZone] || ZONE_CONFIG['village'];
        let mmColor = '#143314';
        if (zConf.tile === 'forest') mmColor = '#064e3b';
        else if (zConf.tile === 'dungeon') mmColor = '#090d16';
        else if (zConf.tile === 'graveyard') mmColor = '#1e1b4b';
        else if (zConf.tile === 'sand') mmColor = '#78350f';
        else if (zConf.tile === 'gold_crypt') mmColor = '#451a03';
        else if (zConf.tile === 'magma' || zConf.tile === 'volcano') mmColor = '#1c0808';
        else if (zConf.tile === 'snow' || zConf.tile === 'frost') mmColor = '#082f49';
        else if (zConf.tile === 'ocean_trench') mmColor = '#022c22';
        else if (zConf.tile === 'swamp') mmColor = '#142a0a';
        else if (zConf.tile === 'void') mmColor = '#18032b';
        else if (zConf.tile === 'celestial') mmColor = '#1e1b4b';
        else if (zConf.tile === 'cosmic') mmColor = '#030712';
        ctx.fillStyle = mmColor;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < w; i += 30) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
        }

        const scaleX = w / this.mapWidth;
        const scaleY = h / this.mapHeight;

        for (const p of this.props) {
            if (!p.active) continue;
            const px = p.x * scaleX;
            const py = p.y * scaleY;

            if (p.type.startsWith('portal_')) {
                ctx.fillStyle = '#c084fc';
                ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
            } else if (p.type === 'npc') {
                ctx.fillStyle = '#38bdf8';
                ctx.beginPath(); ctx.moveTo(px, py - 6); ctx.lineTo(px + 6, py); ctx.lineTo(px, py + 6); ctx.lineTo(px - 6, py); ctx.fill();
            } else if (p.type === 'merchant') {
                ctx.fillStyle = '#34d399';
                ctx.beginPath(); ctx.arc(px, py, 4.5, 0, Math.PI * 2); ctx.fill();
            } else if (p.type === 'blacksmith') {
                ctx.fillStyle = '#f97316';
                ctx.fillRect(px - 4, py - 4, 8, 8);
            } else if (p.type === 'shrine' || p.type === 'fountain') {
                ctx.fillStyle = '#60a5fa';
                ctx.beginPath(); ctx.arc(px, py, 4.5, 0, Math.PI * 2); ctx.fill();
            } else if (p.type === 'chest' && !p.opened) {
                ctx.fillStyle = '#fbbf24';
                ctx.fillRect(px - 3, py - 3, 6, 6);
            } else if (p.type === 'bed') {
                ctx.fillStyle = '#f472b6';
                ctx.fillRect(px - 3, py - 3, 6, 6);
            }
        }

        for (const e of this.enemies) {
            if (!e.active) continue;
            const ex = e.x * scaleX;
            const ey = e.y * scaleY;

            if (e.isBoss) {
                const bossPulse = Math.sin(this.radarPulseTimer * 3) * 2;
                ctx.fillStyle = '#ef4444';
                ctx.shadowColor = '#dc2626';
                ctx.shadowBlur = 10;
                ctx.beginPath(); ctx.arc(ex, ey, 7 + bossPulse, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;
                ctx.strokeStyle = '#fde047';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            } else {
                ctx.fillStyle = '#f87171';
                ctx.beginPath(); ctx.arc(ex, ey, 2.8, 0, Math.PI * 2); ctx.fill();
            }
        }

        // 4. Remote Party Members Rendering on Minimap
        if (this.remotePlayers) {
            for (const id in this.remotePlayers) {
                const rp = this.remotePlayers[id];
                if (!rp.currentZone || rp.currentZone === this.currentZone) {
                    const rpx = rp.x * scaleX;
                    const rpy = rp.y * scaleY;

                    // Neon Cyan Party Member Radar Pulse
                    const rPulseR = 5 + Math.sin(this.radarPulseTimer + 1) * 6;
                    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
                    ctx.lineWidth = 1.2;
                    ctx.beginPath(); ctx.arc(rpx, rpy, rPulseR, 0, Math.PI * 2); ctx.stroke();

                    // Directional Indicator
                    ctx.save();
                    ctx.translate(rpx, rpy);
                    ctx.rotate(rp.facingAngle);
                    ctx.fillStyle = '#38bdf8';
                    ctx.shadowColor = '#0284c7';
                    ctx.shadowBlur = 8;
                    ctx.beginPath();
                    ctx.moveTo(7, 0); ctx.lineTo(-5, -5); ctx.lineTo(-2, 0); ctx.lineTo(-5, 5);
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath(); ctx.arc(0, 0, 2, 0, Math.PI * 2); ctx.fill();
                    ctx.restore();

                    // Mini Nickname Label on Minimap
                    ctx.font = 'bold 9px Pretendard, sans-serif';
                    ctx.fillStyle = '#38bdf8';
                    ctx.textAlign = 'center';
                    ctx.fillText(rp.nickname || '파티원', rpx, rpy - 8);
                }
            }
        }

        const plX = this.player.x * scaleX;
        const plY = this.player.y * scaleY;

        const pulseR = 6 + Math.sin(this.radarPulseTimer) * 10;
        const pulseAlpha = Math.max(0, 1 - (pulseR / 16));
        ctx.strokeStyle = `rgba(250, 204, 21, ${pulseAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(plX, plY, pulseR, 0, Math.PI * 2); ctx.stroke();

        ctx.save();
        ctx.translate(plX, plY);
        ctx.rotate(this.player.facingAngle);
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(8, 0); ctx.lineTo(-6, -6); ctx.lineTo(-3, 0); ctx.lineTo(-6, 6);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }

    updateMobileInteractButton() {
        const btn = document.getElementById('touchBtnA');
        if (!btn) return;

        if (this.nearbyInteractable) {
            btn.classList.add('interact-mode');
            let icon = '✋';
            if (this.nearbyInteractable.type === 'npc') icon = '💬';
            else if (this.nearbyInteractable.type === 'merchant') icon = '🛒';
            else if (this.nearbyInteractable.type === 'blacksmith') icon = '⚒️';
            else if (this.nearbyInteractable.type === 'gambler') icon = '🎲';
            else if (this.nearbyInteractable.type === 'bed') icon = '🛏️';
            else if (this.nearbyInteractable.type.startsWith('portal_')) icon = '🌀';
            else if (this.nearbyInteractable.type === 'chest') icon = '📦';
            else if (this.nearbyInteractable.type === 'campfire') icon = '🔥';
            else if (this.nearbyInteractable.type === 'shrine') icon = '🏛️';
            else if (this.nearbyInteractable.type === 'fountain') icon = '⛲';
            btn.innerText = icon;
        } else {
            btn.classList.remove('interact-mode');
            btn.innerText = '⚔️';
        }
    }

    updateHUD() {
        const hpFill = document.getElementById('hpBarFill');
        if (hpFill) hpFill.style.width = `${this.player.maxHp > 0 ? Math.max(0, Math.min(1, this.player.hp / this.player.maxHp)) * 100 : 0}%`;
        const hpTxt = document.getElementById('hpText');
        if (hpTxt) hpTxt.innerText = `${Math.ceil(Math.max(0, this.player.hp))} / ${this.player.maxHp}`;

        const mpFill = document.getElementById('mpBarFill');
        if (mpFill) mpFill.style.width = `${this.player.maxMp > 0 ? Math.max(0, Math.min(1, this.player.mp / this.player.maxMp)) * 100 : 0}%`;
        const mpTxt = document.getElementById('mpText');
        if (mpTxt) mpTxt.innerText = `${Math.ceil(Math.max(0, this.player.mp))} / ${this.player.maxMp}`;

        const lvlTxt = document.getElementById('levelText');
        if (lvlTxt) lvlTxt.innerText = `Lv. ${this.player.level}`;
        const gldTxt = document.getElementById('goldText');
        if (gldTxt) gldTxt.innerText = `${this.player.gold} G`;
        const expFill = document.getElementById('expBarFill');
        if (expFill) expFill.style.width = `${this.player.maxExp > 0 ? Math.max(0, Math.min(1, this.player.exp / this.player.maxExp)) * 100 : 0}%`;

        const potHp = document.getElementById('potionHpCount');
        if (potHp) potHp.innerText = this.player.countItemInInventory('potion_hp');
        const potMp = document.getElementById('potionMpCount');
        if (potMp) potMp.innerText = this.player.countItemInInventory('potion_mp');
        const potBuff = document.getElementById('potionBuffCount');
        if (potBuff) potBuff.innerText = this.player.countItemInInventory('potion_buff');

        const mHp = document.getElementById('mPotHpCount');
        if (mHp) mHp.innerText = this.player.potions.hp;
        const mMp = document.getElementById('mPotMpCount');
        if (mMp) mMp.innerText = this.player.potions.mp;
        const mBuff = document.getElementById('mPotBuffCount');
        if (mBuff) mBuff.innerText = this.player.potions.buff;

        // 9 Modular Skill Slots (Q, W, E, A, S, D, Z, X, C)
        const slotKeys = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];
        slotKeys.forEach(k => {
            const skillId = this.player.equippedSkills[k];
            const skill = skillId ? SKILL_DB[skillId] : null;
            const slotEl = document.getElementById(`slot_${k}`);
            const iconEl = document.getElementById(`icon_${k}`);
            const tagEl = document.getElementById(`tag_${k}`);
            const cdEl = document.getElementById(`cd_${k}`);

            if (slotEl && iconEl && tagEl) {
                if (skill) {
                    slotEl.classList.remove('empty-slot');
                    iconEl.innerText = skill.icon;
                    tagEl.innerText = skill.name.length > 3 ? skill.name.slice(0, 3) : skill.name;

                    const curCd = this.player.skillCooldowns[k] || 0;
                    const maxCd = skill.cd || 1.0;

                    if (cdEl) {
                        if (curCd > 0) {
                            this.skillSlotWasOnCd[k] = true;
                            const ratio = Math.max(0, Math.min(1, curCd / maxCd));
                            const deg = Math.round(ratio * 360);
                            cdEl.style.setProperty('--cd-deg', `${deg}deg`);
                            cdEl.classList.add('active');
                            cdEl.innerText = `${curCd.toFixed(1)}s`;
                        } else {
                            if (this.skillSlotWasOnCd[k]) {
                                this.skillSlotWasOnCd[k] = false;
                                slotEl.classList.remove('flash-ready');
                                void slotEl.offsetWidth;
                                slotEl.classList.add('flash-ready');
                            }
                            cdEl.classList.remove('active');
                            cdEl.innerText = '';
                        }
                    }

                    const curWType = this.player.getWeaponType();
                    const isWeaponMismatch = (skill.classId && skill.classId !== 'all' && (
                        (skill.classId === 'warrior' && curWType !== 'sword') ||
                        (skill.classId === 'archer' && curWType !== 'bow') ||
                        (skill.classId === 'mage' && curWType !== 'staff') ||
                        (skill.classId === 'rogue' && curWType !== 'dagger')
                    ));
                    const isLevelLocked = (skill.type === 'ultimate' && skill.id !== 'skill_time_stop' && this.player.level < 50);

                    if (isWeaponMismatch || isLevelLocked) {
                        slotEl.classList.add('skill-disabled');
                    } else {
                        slotEl.classList.remove('skill-disabled');
                    }

                    if (skill.type === 'ultimate') {
                        if (curCd <= 0 && this.player.mp >= skill.mpCost && !isWeaponMismatch && !isLevelLocked) {
                            slotEl.classList.add('ultimate-ready');
                        } else {
                            slotEl.classList.remove('ultimate-ready');
                        }
                    } else {
                        slotEl.classList.remove('ultimate-ready');
                    }
                } else {
                    slotEl.classList.add('empty-slot');
                    iconEl.innerText = '➕';
                    tagEl.innerText = '빈 슬롯';
                    if (cdEl) {
                        cdEl.classList.remove('active');
                        cdEl.innerText = '';
                    }
                    if (k === 'Q') slotEl.classList.remove('ultimate-ready');
                }
            }
        });

        // 파티원 HUD 프레임 갱신
        this.updatePartyHUD();
    }

    updatePartyHUD() {
        const frame = document.getElementById('hudPartyFrame');
        if (!frame || !this.player) return;

        const remoteList = Object.values(this.remotePlayers || {});
        if (remoteList.length === 0) {
            frame.innerHTML = '';
            return;
        }

        const jobIcons = { warrior: '⚔️', archer: '🏹', mage: '🪄', rogue: '🗡️' };
        let html = '';

        // 1. My Card (Local Player)
        const myJob = this.player.getWeaponType ? (
            this.player.getWeaponType() === 'bow' ? 'archer' :
            this.player.getWeaponType() === 'staff' ? 'mage' :
            this.player.getWeaponType() === 'dagger' ? 'rogue' : 'warrior'
        ) : 'warrior';
        const myJobIcon = jobIcons[myJob] || '⚔️';
        const myHpPct = Math.round((this.player.hp / this.player.maxHp) * 100);
        const myZoneName = (ZONE_CONFIG[this.currentZone] && ZONE_CONFIG[this.currentZone].name) || this.currentZone;
        const isMeHost = this.network && this.network.isZoneHost;

        html += `
            <div class="party-member-card is-me">
                <div class="party-member-avatar">${myJobIcon}</div>
                <div class="party-member-info">
                    <div class="party-member-header">
                        <span class="party-member-name">${isMeHost ? '👑 ' : ''}나 (${this.player.nickname})</span>
                        <span class="party-member-zone">${myZoneName}</span>
                    </div>
                    <div class="party-member-bars">
                        <div class="party-mini-hp-bar">
                            <div class="party-mini-hp-fill" style="width: ${myHpPct}%;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 2. Remote Players Cards
        remoteList.forEach(rp => {
            const rpJobIcon = jobIcons[rp.job] || '⚔️';
            const rpHpPct = Math.max(0, Math.min(100, Math.round((rp.hp / (rp.maxHp || 160)) * 100)));
            const rpZone = rp.currentZone || 'village';
            const rpZoneName = (ZONE_CONFIG[rpZone] && ZONE_CONFIG[rpZone].name) || rpZone;
            const isDifferentZone = rpZone !== this.currentZone;

            html += `
                <div class="party-member-card">
                    <div class="party-member-avatar">${rpJobIcon}</div>
                    <div class="party-member-info">
                        <div class="party-member-header">
                            <span class="party-member-name">Lv.${rp.level} ${rp.nickname}</span>
                            <span class="party-member-zone">${rpZoneName}</span>
                        </div>
                        <div class="party-member-bars">
                            <div class="party-mini-hp-bar">
                                <div class="party-mini-hp-fill" style="width: ${rpHpPct}%; background: ${rpHpPct > 50 ? '#22c55e' : (rpHpPct > 25 ? '#f59e0b' : '#ef4444')};"></div>
                            </div>
                        </div>
                    </div>
                    ${isDifferentZone ? `<button class="party-teleport-btn" onclick="game.teleportToPartyZone('${rpZone}')" title="${rpZoneName} (으)로 이동">합류 🚀</button>` : ''}
                </div>
            `;
        });

        frame.innerHTML = html;
    }

    teleportToPartyZone(targetZone) {
        if (!targetZone || targetZone === this.currentZone) return;
        this.switchZone(targetZone, false);
        this.showNotification(`🚀 파티원이 있는 [${(ZONE_CONFIG[targetZone] && ZONE_CONFIG[targetZone].name) || targetZone}] (으)로 이동했습니다!`);
    }

    renderTabRadar() {
        const canvas = document.getElementById('tabRadarCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        const zoneNameEl = document.getElementById('tabRadarZoneName');
        const coordsEl = document.getElementById('tabRadarCoords');
        if (coordsEl) coordsEl.innerText = `(${Math.round(this.player.x)}, ${Math.round(this.player.y)})`;
        const zConf = ZONE_CONFIG[this.currentZone] || ZONE_CONFIG['village'];
        if (zoneNameEl) zoneNameEl.innerText = zConf.name;

        // Background
        ctx.fillStyle = 'rgba(10, 15, 29, 0.95)';
        ctx.fillRect(0, 0, w, h);

        // Tactical Grid
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x < w; x += gridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 0; y < h; y += gridSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // Radar Sweep Line (Tactical visual)
        const sweepAngle = (performance.now() * 0.0015) % (Math.PI * 2);
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(sweepAngle) * Math.max(w, h), Math.sin(sweepAngle) * Math.max(w, h));
        ctx.stroke();
        ctx.restore();

        const pad = 40;
        const drawW = w - pad * 2;
        const drawH = h - pad * 2;
        const scaleX = drawW / this.mapWidth;
        const scaleY = drawH / this.mapHeight;

        // Outer map zone boundary
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(pad, pad, drawW, drawH);

        // Props / Portals / NPCs
        for (const p of this.props) {
            if (!p.active) continue;
            const px = pad + p.x * scaleX;
            const py = pad + p.y * scaleY;

            if (p.type.startsWith('portal_')) {
                const targetKey = p.type.replace('portal_', '');
                const targetName = ZONE_CONFIG[targetKey]?.name || '포탈';
                
                ctx.fillStyle = '#a855f7';
                ctx.shadowColor = '#c084fc';
                ctx.shadowBlur = 12;
                ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;

                ctx.font = 'bold 11px sans-serif';
                ctx.fillStyle = '#e9d5ff';
                ctx.textAlign = 'center';
                ctx.fillText(`🌀 ${targetName}`, px, py - 10);
            } else if (p.type === 'npc' || p.type === 'merchant' || p.type === 'blacksmith' || p.type === 'gambler') {
                let npcIcon = '🧙';
                let npcName = '장로';
                if (p.type === 'merchant') { npcIcon = '🛒'; npcName = '상인'; }
                else if (p.type === 'blacksmith') { npcIcon = '⚒️'; npcName = '대장장이'; }
                else if (p.type === 'gambler') { npcIcon = '🎲'; npcName = '도박사 잭'; }

                ctx.fillStyle = '#facc15';
                ctx.shadowColor = '#facc15';
                ctx.shadowBlur = 10;
                ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;

                ctx.font = 'bold 11px sans-serif';
                ctx.fillStyle = '#fef08a';
                ctx.textAlign = 'center';
                ctx.fillText(`${npcIcon} ${npcName}`, px, py - 9);
            } else if (p.type === 'chest' && !p.opened) {
                ctx.fillStyle = '#fbbf24';
                ctx.fillRect(px - 4, py - 4, 8, 8);
                ctx.font = '10px sans-serif';
                ctx.fillStyle = '#fde68a';
                ctx.textAlign = 'center';
                ctx.fillText('📦 보물상자', px, py - 7);
            } else if (p.type === 'fountain' || p.type === 'shrine') {
                ctx.fillStyle = '#38bdf8';
                ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
            }
        }

        // Enemies
        for (const e of this.enemies) {
            if (!e.active) continue;
            const ex = pad + e.x * scaleX;
            const ey = pad + e.y * scaleY;

            if (e.isBoss) {
                const bossPulse = Math.sin(this.radarPulseTimer * 4) * 3;
                ctx.fillStyle = '#f43f5e';
                ctx.shadowColor = '#f43f5e';
                ctx.shadowBlur = 16;
                ctx.beginPath(); ctx.arc(ex, ey, 9 + bossPulse, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;

                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.font = 'bold 12px sans-serif';
                ctx.fillStyle = '#fecdd3';
                ctx.textAlign = 'center';
                ctx.fillText(`💀 ${e.bossName || '보스'}`, ex, ey - 14);

                const hpRatio = e.maxHp > 0 ? Math.max(0, Math.min(1, e.hp / e.maxHp)) : 0;
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillRect(ex - 18, ey + 12, 36, 4);
                ctx.fillStyle = '#f43f5e';
                ctx.fillRect(ex - 18, ey + 12, 36 * hpRatio, 4);
            } else {
                ctx.fillStyle = '#ef4444';
                ctx.beginPath(); ctx.arc(ex, ey, 3.5, 0, Math.PI * 2); ctx.fill();
            }
        }

        // Remote Party Members on Tab Radar
        if (this.remotePlayers) {
            for (const id in this.remotePlayers) {
                const rp = this.remotePlayers[id];
                if (!rp.currentZone || rp.currentZone === this.currentZone) {
                    const rpx = pad + rp.x * scaleX;
                    const rpy = pad + rp.y * scaleY;

                    const rPulseR = 7 + Math.sin(this.radarPulseTimer * 2 + 1) * 10;
                    ctx.strokeStyle = 'rgba(34, 197, 94, 0.7)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath(); ctx.arc(rpx, rpy, rPulseR, 0, Math.PI * 2); ctx.stroke();

                    ctx.save();
                    ctx.translate(rpx, rpy);
                    ctx.rotate(rp.facingAngle);
                    ctx.shadowColor = '#22c55e';
                    ctx.shadowBlur = 14;
                    ctx.fillStyle = '#22c55e';
                    ctx.beginPath();
                    ctx.moveTo(10, 0); ctx.lineTo(-7, -7); ctx.lineTo(-3, 0); ctx.lineTo(-7, 7);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();

                    // Nameplate on Tab Radar
                    ctx.font = 'bold 11px Pretendard, sans-serif';
                    ctx.fillStyle = '#4ade80';
                    ctx.textAlign = 'center';
                    ctx.fillText(`👥 ${rp.nickname}`, rpx, rpy - 12);

                    const rpHpRatio = Math.max(0, Math.min(1, rp.hp / (rp.maxHp || 160)));
                    ctx.fillStyle = 'rgba(0,0,0,0.7)';
                    ctx.fillRect(rpx - 14, rpy + 10, 28, 3.5);
                    ctx.fillStyle = '#22c55e';
                    ctx.fillRect(rpx - 14, rpy + 10, 28 * rpHpRatio, 3.5);
                }
            }
        }

        // Player
        const plX = pad + this.player.x * scaleX;
        const plY = pad + this.player.y * scaleY;

        const pulseR = 8 + Math.sin(this.radarPulseTimer * 2) * 14;
        const pulseAlpha = Math.max(0, 1 - (pulseR / 22));
        ctx.strokeStyle = `rgba(56, 189, 248, ${pulseAlpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(plX, plY, pulseR, 0, Math.PI * 2); ctx.stroke();

        ctx.save();
        ctx.translate(plX, plY);
        ctx.rotate(this.player.facingAngle);
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(12, 0); ctx.lineTo(-8, -8); ctx.lineTo(-4, 0); ctx.lineTo(-8, 8);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#7dd3fc';
        ctx.textAlign = 'center';
        ctx.fillText('⭐ 내 위치', plX, plY - 14);
    }

    render() {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.camera.applyTransform(this.ctx);

        this.renderMapBackground();

        const remoteList = this.remotePlayers ? Object.values(this.remotePlayers).filter(rp => !rp.currentZone || rp.currentZone === this.currentZone) : [];
        const renderQueue = [this.player, ...remoteList, ...this.enemies.filter(e => e.active), ...this.props.filter(p => p.active)];
        renderQueue.sort((a, b) => a.y - b.y);

        for (const entity of renderQueue) {
            if (entity instanceof Enemy) {
                entity.render(this.ctx, entity === this.player.targetedEnemy);
            } else if (entity instanceof Prop) {
                entity.render(this.ctx, this.windTime);
            } else {
                entity.render(this.ctx);
            }
        }

        // Render Ground Zones (Lava puddles, etc.)
        if (this.groundZones) {
            for (const gz of this.groundZones) {
                this.ctx.save();
                this.ctx.translate(gz.x, gz.y);
                if (gz.type === 'lava') {
                    this.ctx.fillStyle = 'rgba(234, 88, 12, 0.45)';
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, gz.radius, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.strokeStyle = '#ea580c';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                }
                this.ctx.restore();
            }
        }

        // Render Archer Traps
        if (this.traps) {
            for (const t of this.traps) {
                this.ctx.save();
                this.ctx.translate(t.x, t.y);
                this.ctx.shadowColor = '#f59e0b';
                this.ctx.shadowBlur = 10;
                this.ctx.fillStyle = '#dc2626';
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 10, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = '#facc15';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                this.ctx.fillStyle = '#ffffff';
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 3, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }
        }

        for (const p of this.projectiles) p.render(this.ctx);
        this.particles.render(this.ctx);

        this.camera.restoreTransform(this.ctx);

        if (this.currentZone === 'heaven_altar' || this.currentZone === 'god_sanctuary' || this.currentZone === 'lazy_paradise' || this.currentZone === 'crystal_cave') {
            this.renderCelestialLighting();
        } else if (this.currentZone === 'dungeon_b3' || this.currentZone === 'frozen_tundra') {
            this.renderFrostLighting();
        } else if (this.currentZone === 'dungeon_b2' || this.currentZone === 'dragon_nest' || this.currentZone === 'blood_citadel') {
            this.renderAbyssLighting();
        } else if (this.currentZone === 'dungeon_b1' || this.currentZone === 'graveyard' || this.currentZone === 'shadow_realm' || this.currentZone === 'astral_void' || this.currentZone === 'ancient_ruins') {
            this.renderDungeonLighting();
        } else {
            this.renderVignette();
        }
    }

    renderMapBackground() {
        const tileSize = 64;
        const startCol = Math.max(0, Math.floor(this.camera.x / tileSize));
        const endCol = Math.min(this.mapWidth / tileSize, Math.ceil((this.camera.x + this.camera.viewWidth) / tileSize));
        const startRow = Math.max(0, Math.floor(this.camera.y / tileSize));
        const endRow = Math.min(this.mapHeight / tileSize, Math.ceil((this.camera.y + this.camera.viewHeight) / tileSize));

        const zConf = ZONE_CONFIG[this.currentZone] || ZONE_CONFIG['village'];
        const tileTexture = textures.tiles[zConf.tile] || textures.tiles['grass'];

        for (let r = startRow; r < endRow; r++) {
            for (let c = startCol; c < endCol; c++) {
                const x = c * tileSize;
                const y = r * tileSize;

                if (this.currentZone === 'village') {
                    const isDirtPath = (Math.abs(x - 2100) < 120 || Math.abs(y - 2100) < 120);
                    if (isDirtPath) {
                        this.ctx.drawImage(textures.tiles['dirt'], 0, 0, 256, 256, x, y, tileSize, tileSize);
                    } else {
                        this.ctx.drawImage(textures.tiles['grass'], 0, 0, 256, 256, x, y, tileSize, tileSize);
                    }
                } else {
                    this.ctx.drawImage(tileTexture, 0, 0, 256, 256, x, y, tileSize, tileSize);
                }
            }
        }

        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(0, 0, this.mapWidth, 32);
        this.ctx.fillRect(0, this.mapHeight - 32, this.mapWidth, 32);
        this.ctx.fillRect(0, 0, 32, this.mapHeight);
        this.ctx.fillRect(this.mapWidth - 32, 0, 32, this.mapHeight);

        this.ctx.fillStyle = '#334155';
        this.ctx.fillRect(32, 28, this.mapWidth - 64, 4);
        this.ctx.fillRect(32, 32, 4, this.mapHeight - 64);
    }

    renderCelestialLighting() {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const grad = this.ctx.createRadialGradient(cx, cy, 90, cx, cy, Math.max(cx, cy) * 0.95);
        grad.addColorStop(0, 'rgba(250, 204, 21, 0.08)');
        grad.addColorStop(0.5, 'rgba(49, 46, 129, 0.35)');
        grad.addColorStop(1, 'rgba(15, 10, 40, 0.88)');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    renderFrostLighting() {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const grad = this.ctx.createRadialGradient(cx, cy, 80, cx, cy, Math.max(cx, cy) * 0.95);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.06)');
        grad.addColorStop(0.5, 'rgba(8, 47, 73, 0.42)');
        grad.addColorStop(1, 'rgba(2, 20, 35, 0.92)');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    renderAbyssLighting() {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const grad = this.ctx.createRadialGradient(cx, cy, 80, cx, cy, Math.max(cx, cy) * 0.95);
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.05)');
        grad.addColorStop(0.5, 'rgba(69, 10, 10, 0.45)');
        grad.addColorStop(1, 'rgba(15, 2, 2, 0.92)');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    renderDungeonLighting() {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const grad = this.ctx.createRadialGradient(cx, cy, 70, cx, cy, Math.max(cx, cy) * 0.95);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(0.5, 'rgba(5, 8, 17, 0.45)');
        grad.addColorStop(1, 'rgba(2, 4, 10, 0.92)');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    renderVignette() {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const maxR = Math.hypot(cx, cy);
        const grad = this.ctx.createRadialGradient(cx, cy, maxR * 0.45, cx, cy, maxR);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(1, 'rgba(5, 8, 17, 0.55)');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());

        const btnSkill = document.getElementById('btnSkillBook');
        if (btnSkill) btnSkill.addEventListener('click', () => this.toggleSkillBook());
        const btnClear = document.getElementById('btnClearAllSkills');
        if (btnClear) btnClear.addEventListener('click', () => this.clearAllEquippedSkills());
        const skillClose = document.getElementById('skillCloseBtn');
        if (skillClose) skillClose.addEventListener('click', () => this.toggleSkillBook());

        const dodgeSelect = document.getElementById('settingDodgeMode');
        if (dodgeSelect) {
            dodgeSelect.addEventListener('change', (e) => {
                this.settings.dodgeMode = e.target.value;
                this.saveSettings();
                this.saveGame(true);
            });
        }

        const bWm = document.getElementById('btnWorldMap');
        if (bWm) bWm.onclick = () => this.toggleWorldMap();
        const bWmClose = document.getElementById('worldMapCloseBtn');
        if (bWmClose) bWmClose.onclick = () => this.toggleWorldMap();

        const bFull = document.getElementById('btnFullscreen');
        if (bFull) bFull.onclick = () => this.toggleFullscreen();
        // Pause Menu Button Listeners (7 items with 1:1 matching indices)
        const pauseBtns = [
            { id: 'pauseBtnResume', idx: 0, action: () => this.togglePause() },
            { id: 'pauseBtnSkills', idx: 1, action: () => { this.togglePause(); this.toggleSkillBook(); } },
            { id: 'pauseBtnGuide', idx: 2, action: () => { this.togglePause(); this.toggleGuide(); } },
            { id: 'pauseBtnSave', idx: 3, action: () => { this.saveGame(); this.showNotification('💾 게임이 안전하게 저장되었습니다!'); } },
            { id: 'pauseBtnSettings', idx: 4, action: () => { this.togglePause(); this.toggleSettings(); } },
            { id: 'pauseBtnTitle', idx: 5, action: () => this.returnToTitle() },
            { id: 'pauseBtnQuit', idx: 6, action: () => this.quitGame() }
        ];

        pauseBtns.forEach(item => {
            const el = document.getElementById(item.id);
            if (el) {
                el.onclick = (e) => {
                    if (e) e.stopPropagation();
                    item.action();
                };
                el.onmouseenter = () => this.setPauseMenuIndex(item.idx);
            }
        });

        const btnP = document.getElementById('btnPause');
        if (btnP) btnP.addEventListener('click', () => this.togglePause());

        const btnQ = document.getElementById('btnQuit');
        if (btnQ) btnQ.addEventListener('click', () => this.quitGame());

        const bSave = document.getElementById('btnSave');
        if (bSave) bSave.onclick = () => this.saveGame();
        const bExp = document.getElementById('btnExport');
        if (bExp) bExp.onclick = () => this.exportSaveCode();
        const bImp = document.getElementById('btnImport');
        if (bImp) bImp.onclick = () => {
            const code = prompt('세이브 코드를 입력하세요:');
            if (code) this.importSaveCode(code);
        };

        const sBtn = document.getElementById('btnSettings');
        if (sBtn) sBtn.onclick = () => this.toggleSettings();
        const sCloseBtn = document.getElementById('settingsCloseBtn');
        if (sCloseBtn) sCloseBtn.onclick = (e) => { if (e) e.stopPropagation(); this.closeSettings(); };
        const sCloseBtnBottom = document.getElementById('settingsCloseBtnBottom');
        if (sCloseBtnBottom) sCloseBtnBottom.onclick = (e) => { if (e) e.stopPropagation(); this.closeSettings(); };

        const guideBtn = document.getElementById('btnGuide');
        if (guideBtn) guideBtn.onclick = () => this.toggleGuide();
        const guideCloseBtn = document.getElementById('guideCloseBtn');
        if (guideCloseBtn) guideCloseBtn.onclick = (e) => { if (e) e.stopPropagation(); this.closeGuide(); };

        const invBtn = document.getElementById('btnInventory');
        if (invBtn) invBtn.onclick = () => this.toggleInventory();
        const invCloseBtn = document.getElementById('invCloseBtn');
        if (invCloseBtn) invCloseBtn.onclick = (e) => { if (e) e.stopPropagation(); this.closeInventory(); };

        const shopCloseBtn = document.getElementById('shopCloseBtn');
        if (shopCloseBtn) shopCloseBtn.onclick = (e) => { if (e) e.stopPropagation(); this.closeShop(); };

        const forgeCloseBtn = document.getElementById('forgeCloseBtn');
        if (forgeCloseBtn) forgeCloseBtn.onclick = (e) => { if (e) e.stopPropagation(); this.closeForge(); };

        const skillBookCloseBtn = document.getElementById('skillBookCloseBtn');
        if (skillBookCloseBtn) skillBookCloseBtn.onclick = (e) => { if (e) e.stopPropagation(); this.closeSkillBook(); };

        const worldMapCloseBtn = document.getElementById('worldMapCloseBtn');
        if (worldMapCloseBtn) worldMapCloseBtn.onclick = (e) => { if (e) e.stopPropagation(); this.closeWorldMap(); };

        const bgmSlider = document.getElementById('settingBgm');
        if (bgmSlider) {
            bgmSlider.addEventListener('input', (e) => {
                this.settings.bgmVolume = e.target.value / 100;
                sounds.setBgmVolume(this.settings.bgmVolume);
                this.saveSettings();
            });
        }

        const sfxSlider = document.getElementById('settingSfx');
        if (sfxSlider) {
            sfxSlider.addEventListener('input', (e) => {
                this.settings.sfxVolume = e.target.value / 100;
                sounds.setSfxVolume(this.settings.sfxVolume);
                this.saveSettings();
            });
        }

        const shakeCheck = document.getElementById('settingShake');
        if (shakeCheck) {
            shakeCheck.addEventListener('change', (e) => {
                this.settings.screenShake = e.target.checked;
                this.camera.shakeEnabled = this.settings.screenShake;
                this.saveSettings();
            });
        }

        const aimCheck = document.getElementById('settingAim');
        if (aimCheck) {
            aimCheck.addEventListener('change', (e) => {
                this.settings.autoAim = e.target.checked;
                this.saveSettings();
            });
        }

        const closeBtn = document.getElementById('dialogueCloseBtn');
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeDialogue());

        // Quick Potions
        const bindTouchPotion = (id, type) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.player.usePotionFromInventory(type === 'hp' ? 'potion_hp' : type === 'mp' ? 'potion_mp' : 'potion_buff', this);
                }, { passive: false });
            }
        };
        bindTouchPotion('touchPotionHp', 'hp');
        bindTouchPotion('touchPotionMp', 'mp');
        bindTouchPotion('touchPotionBuff', 'buff');

        // Smart Attack / Interact Touch
        const touchBtnA = document.getElementById('touchBtnA');
        if (touchBtnA) {
            touchBtnA.addEventListener('touchstart', (e) => {
                e.preventDefault();
                sounds.init();
                if (!this.isIntroOpen) sounds.startBGM();

                if (this.nearbyInteractable) {
                    if (this.isDialogueOpen) this.closeDialogue();
                    else if (this.isShopOpen) this.toggleShop();
                    else if (this.isForgeOpen) this.toggleForge();
                    else if (this.isWorldMapOpen) this.toggleWorldMap();
                    else this.nearbyInteractable.interact(this.player, this);
                } else {
                    this.input.keys['KeyA'] = true;
                    this.input.justPressed['KeyA'] = true;
                }
            }, { passive: false });

            touchBtnA.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.input.keys['KeyA'] = false;
            });
        }

        // Skills & Dodge
        const bindTouchBtn = (id, keyCode) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.input.keys[keyCode] = true;
                    this.input.justPressed[keyCode] = true;
                    sounds.init();
                    if (!this.isIntroOpen) sounds.startBGM();
                }, { passive: false });
                btn.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.input.keys[keyCode] = false;
                });
            }
        };

        bindTouchBtn('touchBtnSpace', 'Space');
        bindTouchBtn('touchBtnW', 'KeyW');
        bindTouchBtn('touchBtnE', 'KeyE');
        bindTouchBtn('touchBtnS', 'KeyS');
        bindTouchBtn('touchBtnD', 'KeyD');
        bindTouchBtn('touchBtnQ', 'KeyQ');
    }
}

let game = null;

function initGame() {
    if (!game) {
        try {
            game = new Game();
            window.game = game;
            game.start();
            console.log("Game initialized and running successfully!");
        } catch (e) {
            console.error("Game initialization error:", e);
        }
    }
}

window.startGameDirect = function(loadSave = false) {
    if (!game) initGame();
    if (game) game.startAdventure(loadSave);
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initGame();
} else {
    window.addEventListener('DOMContentLoaded', initGame);
}
