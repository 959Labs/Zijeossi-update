// ============================================================================
// 🎨 Zijeossi 2D Pixel Sprite Engine & Atlas Manager (Phase 3)
// ============================================================================

class SpriteManager {
    constructor() {
        this.cache = {};
        this.pixelScale = 2.5; // Default crisp pixel multiplier
        this.initAtlas();
    }

    createOffscreen(w, h) {
        if (typeof document === 'undefined') return { canvas: {}, ctx: {} };
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.imageSmoothingEnabled = false; // Pixel-perfect rendering
        return { canvas, ctx };
    }

    initAtlas() {
        if (typeof document === 'undefined') return;
        this.generatePlayerSprites();
        this.generateWeaponSprites();
        this.generatePropSprites();
            this.generateMonsterSprites();
}

    // Helper to draw a pixel-matrix grid using a color palette
    drawPixelGrid(ctx, ox, oy, grid, palette, pixelSize = 2) {
        if (!ctx || typeof ctx.fillRect !== 'function') return;
        for (let r = 0; r < grid.length; r++) {
            const row = grid[r];
            for (let c = 0; c < row.length; c++) {
                const colorKey = row[c];
                if (colorKey && colorKey !== '.' && palette[colorKey]) {
                    ctx.fillStyle = palette[colorKey];
                    ctx.fillRect(ox + c * pixelSize, oy + r * pixelSize, pixelSize, pixelSize);
                }
            }
        }
    }

    // ========================================================================
    // 1. Player 2D Pixel Sprite Generator (4 Directions, 4-Frame Walk, Idle, Attack)
    // ========================================================================
    generatePlayerSprites() {
        const directions = ['down', 'up', 'side'];
        const states = ['idle', 'walk1', 'walk2', 'attack', 'hurt'];
        const classes = ['warrior', 'mage', 'archer', 'rogue'];
        const armors = ['default', 'armor_leather', 'armor_iron', 'armor_dragon', 'armor_abyss', 'armor_celestial'];

        // Base Skin & Hair Palettes
        const skinColors = {
            '.': null,
            'S': '#fcd34d', // Skin base
            'D': '#f59e0b', // Skin shadow
            'H': '#78350f', // Hair (Bob's brown hair)
            'E': '#0f172a', // Eye
            'W': '#ffffff', // White
            'M': '#b45309', // Mustache / Beard (Uncle Bob's trademark!)
        };

        // Class Headwear / Accent Palettes
        const classPalettes = {
            warrior: { 'C': '#94a3b8', 'A': '#3b82f6', 'G': '#facc15' },
            mage:    { 'C': '#a855f7', 'A': '#c084fc', 'G': '#fde047' },
            archer:  { 'C': '#16a34a', 'A': '#4ade80', 'G': '#fbbf24' },
            rogue:   { 'C': '#334155', 'A': '#64748b', 'G': '#e2e8f0' }
        };

        // Armor Body Palettes
        const armorPalettes = {
            'default':         { 'B': '#475569', 'L': '#64748b', 'T': '#94a3b8', 'P': '#1e293b' },
            'armor_leather':   { 'B': '#854d0e', 'L': '#a16207', 'T': '#ca8a04', 'P': '#451a03' },
            'armor_iron':      { 'B': '#475569', 'L': '#94a3b8', 'T': '#e2e8f0', 'P': '#334155' },
            'armor_dragon':    { 'B': '#991b1b', 'L': '#dc2626', 'T': '#f87171', 'P': '#450a0a' },
            'armor_abyss':     { 'B': '#3b0764', 'L': '#6b21a8', 'T': '#a855f7', 'P': '#1e1b4b' },
            'armor_celestial': { 'B': '#ca8a04', 'L': '#eab308', 'T': '#fef08a', 'P': '#713f12' }
        };

        for (const cls of classes) {
            for (const arm of armors) {
                for (const dir of directions) {
                    for (const st of states) {
                        const key = 'player_' + cls + '_' + arm + '_' + dir + '_' + st;
                        const { canvas, ctx } = this.createOffscreen(48, 48);

                        const combinedPalette = {
                            ...skinColors,
                            ...classPalettes[cls],
                            ...armorPalettes[arm]
                        };

                        this.renderPlayerFrame(ctx, dir, st, cls, arm, combinedPalette);
                        this.cache[key] = canvas;
                    }
                }
            }
        }
    }

    renderPlayerFrame(ctx, dir, state, cls, armor, pal) {
        const ps = 2; // Pixel size (16x16 grid -> 32x32 pixels, centered in 48x48)
        let ox = 8;
        let oy = 8;

        // Bobbing & Offset based on state
        if (state === 'walk1') oy += 1;
        else if (state === 'walk2') oy -= 1;
        else if (state === 'attack') ox += (dir === 'side' ? 4 : 0);
        else if (state === 'hurt') ox -= 2;

        if (dir === 'down') {
            // Front View Grid (16x16)
            const headGrid = [
                '....HHHHHHHH....',
                '...HHHHHHHHHH...',
                '..HHSSSSSSSSHH..',
                '..HHSEESSEESHH..',
                '..HHSSSSSSSSHH..',
                '..HHSSMMMMSSHH..',
                '...HSSMMMMSSH...',
                '....SSSSSSSS....'
            ];
            const bodyGrid = [
                '...TTBBBBBBTT...',
                '..TLLBBBBBLLT...',
                '..TLLLLLLLLLT...',
                '...LLLLLLLLL....',
                '....PP....PP....',
                '....PP....PP....',
                '...PPPP..PPPP...',
                '...PPPP..PPPP...'
            ];

            // Legs animation variation
            if (state === 'walk1') {
                bodyGrid[6] = '...PPPP..PP.....';
                bodyGrid[7] = '...PPPP.........';
            } else if (state === 'walk2') {
                bodyGrid[6] = '.....PP..PPPP...';
                bodyGrid[7] = '.........PPPP...';
            }

            this.drawPixelGrid(ctx, ox, oy, headGrid, pal, ps);
            this.drawPixelGrid(ctx, ox, oy + 16, bodyGrid, pal, ps);

            // Class Hat / Accessories
            if (cls === 'mage') {
                const hat = [
                    '.....AAAAAA.....',
                    '....AAAAAAAA....',
                    '...AAAAAAAAG....',
                    '..CCCCCCCCCCCC..'
                ];
                this.drawPixelGrid(ctx, ox, oy - 6, hat, pal, ps);
            } else if (cls === 'warrior') {
                const helm = [
                    '....GGGGGGGG....',
                    '...GCCCCCCCCG...',
                    '...GCCCCCCCCG...'
                ];
                this.drawPixelGrid(ctx, ox, oy - 2, helm, pal, ps);
            }
        } else if (dir === 'up') {
            // Back View Grid (16x16)
            const headGrid = [
                '....HHHHHHHH....',
                '...HHHHHHHHHH...',
                '..HHHHHHHHHHHH..',
                '..HHHHHHHHHHHH..',
                '..HHHHHHHHHHHH..',
                '..HHHHHHHHHHHH..',
                '...HHHHHHHHHH...',
                '....HHHHHHHH....'
            ];
            const bodyGrid = [
                '...TTBBBBBBTT...',
                '..TLLBBBBBLLT...',
                '..TLLLLLLLLLT...',
                '...LLLLLLLLL....',
                '....PP....PP....',
                '....PP....PP....',
                '...PPPP..PPPP...',
                '...PPPP..PPPP...'
            ];

            if (state === 'walk1') {
                bodyGrid[6] = '...PPPP..PP.....';
                bodyGrid[7] = '...PPPP.........';
            } else if (state === 'walk2') {
                bodyGrid[6] = '.....PP..PPPP...';
                bodyGrid[7] = '.........PPPP...';
            }

            this.drawPixelGrid(ctx, ox, oy, headGrid, pal, ps);
            this.drawPixelGrid(ctx, ox, oy + 16, bodyGrid, pal, ps);
        } else {
            // Side View Grid (16x16)
            const headGrid = [
                '....HHHHHH......',
                '...HHHHHHHH.....',
                '..HHHSSSSSSH....',
                '..HHHSSEESSH....',
                '..HHHSSSSSSH....',
                '..HHHSSMMMMS....',
                '...HHSSMMMMS....',
                '....SSSSSSSS....'
            ];
            const bodyGrid = [
                '...TTBBBBB......',
                '..TLLBBBBBL.....',
                '..TLLLLLLLL.....',
                '...LLLLLLLL.....',
                '....PP...PP.....',
                '....PP...PP.....',
                '...PPPP.PPPP....',
                '...PPPP.PPPP....'
            ];

            if (state === 'walk1') {
                bodyGrid[4] = '....PP..........';
                bodyGrid[5] = '....PPPP........';
                bodyGrid[6] = '....PPPP........';
                bodyGrid[7] = '................';
            } else if (state === 'walk2') {
                bodyGrid[4] = '.........PP.....';
                bodyGrid[5] = '.......PPPP.....';
                bodyGrid[6] = '.......PPPP.....';
                bodyGrid[7] = '................';
            }

            this.drawPixelGrid(ctx, ox, oy, headGrid, pal, ps);
            this.drawPixelGrid(ctx, ox, oy + 16, bodyGrid, pal, ps);
        }
    }

    // ========================================================================
    // 2. Weapon & Effect 2D Pixel Sprites
    // ========================================================================
    generateWeaponSprites() {
        const weaponTypes = ['sword_iron', 'sword_dragon', 'staff_mystic', 'bow_elven', 'dagger_shadow'];
        const wPalette = {
            '.': null,
            'I': '#e2e8f0', 'S': '#94a3b8', 'D': '#475569',
            'G': '#facc15', 'O': '#ea580c', 'R': '#ef4444',
            'P': '#a855f7', 'C': '#38bdf8', 'W': '#78350f'
        };

        for (const w of weaponTypes) {
            const { canvas, ctx } = this.createOffscreen(32, 32);
            if (w.includes('sword') || w.includes('blade')) {
                const isDragon = w.includes('dragon');
                const swordGrid = [
                    '...............I',
                    '..............II',
                    '.............II.',
                    '............II..',
                    '...........II...',
                    '..........II....',
                    '.........II.....',
                    '........II......',
                    '.......II.......',
                    '......GG........',
                    '.....GGGG.......',
                    '....WWGG........',
                    '...WW...........',
                    '..WW............',
                    '.GG.............',
                    '................'
                ];
                if (isDragon) {
                    wPalette['I'] = '#f87171';
                    wPalette['S'] = '#dc2626';
                    wPalette['G'] = '#facc15';
                }
                this.drawPixelGrid(ctx, 4, 4, swordGrid, wPalette, 1.5);
            } else if (w.includes('staff')) {
                const staffGrid = [
                    '..........PPPP..',
                    '.........PPCCPP.',
                    '..........PPPP..',
                    '...........WW...',
                    '..........WW....',
                    '.........WW.....',
                    '........WW......',
                    '.......WW.......',
                    '......WW........',
                    '.....WW.........',
                    '....WW..........',
                    '...WW...........',
                    '..WW............',
                    '.GG.............',
                    '................'
                ];
                this.drawPixelGrid(ctx, 4, 4, staffGrid, wPalette, 1.5);
            } else if (w.includes('bow')) {
                const bowGrid = [
                    '.......GG.......',
                    '.....GG..I......',
                    '...GG....I......',
                    '..G......I......',
                    '.G.......I......',
                    '.G.......I......',
                    '.G.......I......',
                    '..G......I......',
                    '...GG....I......',
                    '.....GG..I......',
                    '.......GG.......',
                    '................'
                ];
                this.drawPixelGrid(ctx, 4, 4, bowGrid, wPalette, 1.5);
            }
            this.cache['weapon_' + w] = canvas;
        }
    }

    // ========================================================================
    // 3. Prop Pixel Sprites (Chests, Campfire, Crystals)
    // ========================================================================
    generatePropSprites() {
        const chestPal = {
            '.': null,
            'W': '#854d0e', 'B': '#a16207', 'G': '#facc15',
            'I': '#334155', 'K': '#0f172a', 'R': '#ef4444'
        };

        const chestClosed = [
            '....GGGGGGGG....',
            '...GBBBBBBBBGG..',
            '..GBBWWWWWWBBG..',
            '..GBBWWWWWWBBG..',
            '..GGGGGGGGGGGG..',
            '..GIIIIKIIIIIG..',
            '..GWWWWKWWWWWG..',
            '..GWWWWKWWWWWG..',
            '..GGGGGGGGGGGG..'
        ];

        const { canvas: cClosed, ctx: ctxC } = this.createOffscreen(36, 36);
        this.drawPixelGrid(ctxC, 2, 8, chestClosed, chestPal, 2);
        this.cache['prop_chest_closed'] = cClosed;
    }

    // ========================================================================
    // 4. Public Draw Methods
    // ========================================================================
    
    // ========================================================================
    // 5. Monster Pixel Sprites (Slime, Goblin, Skeleton, Bat, Zombie, Spider)
    // ========================================================================
    generateMonsterSprites() {
        // Slime
        const slimePal = { '.': null, 'G': '#22c55e', 'L': '#86efac', 'D': '#15803d', 'E': '#0f172a', 'W': '#ffffff' };
        const slimeFrames = [
            [
                '......LLLL......',
                '....LLGGGGLL....',
                '...LGGGGGGGGL...',
                '..LGGGGGGGGGGL..',
                '..LGEEGGGGGEEGL.',
                '.LGEWEGGGGGEWEGL',
                '.LGGGGGGGGGGGGGL',
                '.LGGDDDDDDDDGGGL',
                '.LDDDDDDDDDDDDGL',
                '..DDDDDDDDDDDD..'
            ],
            [
                '................',
                '....LLLLLLLL....',
                '..LLGGGGGGGGLL..',
                '.LGGGGGGGGGGGGL.',
                '.LGEEGGGGGEEGL..',
                'LGEWEGGGGGEWEGL.',
                'LGGGGGGGGGGGGGGL',
                'LDDDDDDDDDDDDDDL',
                '.DDDDDDDDDDDDDD.'
            ]
        ];

        slimeFrames.forEach((f, idx) => {
            const { canvas, ctx } = this.createOffscreen(36, 36);
            this.drawPixelGrid(ctx, 2, 8, f, slimePal, 2);
            this.cache['mob_slime_' + idx] = canvas;
        });

        // Skeleton
        const skelPal = { '.': null, 'W': '#f8fafc', 'S': '#94a3b8', 'D': '#475569', 'E': '#ef4444', 'K': '#0f172a' };
        const skelGrid = [
            '....WWWWWW......',
            '...WWWWWWWW.....',
            '..WWKEWWKEWW....',
            '..WWKKWWKKWW....',
            '..WWWWWWWWWW....',
            '...WWWWWWWW.....',
            '....DDSSDD......',
            '...WWDDDDWW.....',
            '..WW.DDDD.WW....',
            '..WW.DDDD.WW....',
            '.....DDDD.......',
            '....SS..SS......',
            '...WW....WW.....',
            '...WW....WW.....',
            '..DD......DD....'
        ];
        const { canvas: cSkel, ctx: ctxSkel } = this.createOffscreen(36, 36);
        this.drawPixelGrid(ctxSkel, 2, 2, skelGrid, skelPal, 2);
        this.cache['mob_skeleton_0'] = cSkel;

        // Bat
        const batPal = { '.': null, 'B': '#1e1b4b', 'P': '#4c1d95', 'E': '#ef4444', 'W': '#ffffff' };
        const batGrid1 = [
            'PP..........PP..',
            'PPPP......PPPP..',
            'PPPPPP..PPPPPP..',
            '.PPPPPEEPPPPP...',
            '..PPPPEEPPPP....',
            '...BBBBBBBB.....',
            '....BBBBBB......',
            '.....BBBB.......'
        ];
        const batGrid2 = [
            '................',
            '................',
            '....PPPPPPPP....',
            '..PPPPPEEPPPPP..',
            '.PPPPPPEEPPPPPP.',
            'PPPPBBBBBBBBPPPP',
            'PPP..BBBBBB..PPP',
            'P.....BBBB.....P'
        ];
        [batGrid1, batGrid2].forEach((f, idx) => {
            const { canvas, ctx } = this.createOffscreen(36, 36);
            this.drawPixelGrid(ctx, 2, 8, f, batPal, 2);
            this.cache['mob_bat_' + idx] = canvas;
        });

        // Goblin
        const gobPal = { '.': null, 'G': '#15803d', 'L': '#4ade80', 'E': '#ef4444', 'C': '#854d0e', 'W': '#ffffff', 'D': '#166534' };
        const gobGrid = [
            '..L...........L.',
            '.LLG.........GLL',
            '..LGGGGGGGGGGGL.',
            '...LGEEEGEEEL...',
            '...LGGGGGGGGG...',
            '....GGWWWWGG....',
            '.....GGGGGG.....',
            '....CCCCCCCC....',
            '...CCCDDDDCCC...',
            '...CC.CCCC.CC...',
            '......CCCC......',
            '.....GG..GG.....',
            '....GGG..GGG....'
        ];
        const { canvas: cGob, ctx: ctxGob } = this.createOffscreen(36, 36);
        this.drawPixelGrid(ctxGob, 2, 4, gobGrid, gobPal, 2);
        this.cache['mob_forest_goblin_0'] = cGob;
    }

    drawPlayerSprite(ctx, player) {
        if (!ctx) return false;
        const cls = player.heroClass || 'warrior';
        const arm = (player.equipment && player.equipment.armor) || 'default';
        const dir = player.facingDirection || 'down';
        
        let state = 'idle';
        if (player.isAttacking) state = 'attack';
        else if (player.hurtTimer > 0) state = 'hurt';
        else if (player.state === 'move') {
            const step = Math.floor((player.walkAnimTimer * 4) % 2);
            state = step === 0 ? 'walk1' : 'walk2';
        }

        const key = 'player_' + cls + '_' + arm + '_' + (dir === 'left' || dir === 'right' ? 'side' : dir) + '_' + state;
        const sprite = this.cache[key] || this.cache['player_warrior_default_down_idle'];

        if (sprite && sprite.width) {
            ctx.save();
            if (dir === 'left') {
                ctx.scale(-1, 1);
                ctx.drawImage(sprite, -24, -28, 48, 48);
            } else {
                ctx.drawImage(sprite, -24, -28, 48, 48);
            }
            ctx.restore();
            return true;
        }
        return false;
    }

    drawMonsterSprite(ctx, enemy) {
        if (!ctx || !enemy) return false;
        const type = enemy.type;
        const t = enemy.animTimer || 0;
        const frameIdx = Math.floor(t * 4) % 2;
        let sprite = this.cache['mob_' + type + '_' + frameIdx] || this.cache['mob_' + type + '_0'];
        
        if (sprite && sprite.width) {
            ctx.save();
            const r = enemy.radius || 16;
            ctx.drawImage(sprite, -r, -r, r * 2, r * 2);
            ctx.restore();
            return true;
        }
        return false;
    }

    drawWeaponSprite(ctx, weaponId, angle, ox = 0, oy = 0) {
        if (!ctx) return false;
        const wSprite = this.cache['weapon_' + weaponId] || this.cache['weapon_sword_iron'];
        if (wSprite && wSprite.width) {
            ctx.save();
            ctx.translate(ox, oy);
            ctx.rotate(angle);
            ctx.drawImage(wSprite, -16, -16, 32, 32);
            ctx.restore();
            return true;
        }
        return false;
    }
}

if (typeof window !== 'undefined') {
    window.SpriteManager = SpriteManager;
    window.spriteManager = new SpriteManager();
}
