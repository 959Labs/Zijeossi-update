// ============================================================================
// 4K Ultra-Detailed Procedural Texture Atlas (256x256 High-Density Tiles)
// ============================================================================

class TextureAtlas {
    constructor() {
        this.tiles = {};
        this.generateUltraTextures();
    }

    createCanvas(w, h) {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        return { canvas: c, ctx };
    }

    generateUltraTextures() {
        const s = 256;

        // 1. 4K 고화질 유기농 잔디밭 타일 (Ultra HD Organic Grass Tile)
        const grass = this.createCanvas(s, s);
        const gCtx = grass.ctx;
        
        // Base multi-tone gradient
        const gGrad = gCtx.createRadialGradient(s * 0.4, s * 0.4, 20, s * 0.5, s * 0.5, s * 0.85);
        gGrad.addColorStop(0, '#225422');
        gGrad.addColorStop(0.5, '#163d16');
        gGrad.addColorStop(1, '#0e2b0e');
        gCtx.fillStyle = gGrad;
        gCtx.fillRect(0, 0, s, s);

        // Micro ground soil noise
        for (let i = 0; i < 800; i++) {
            const px = Math.random() * s;
            const py = Math.random() * s;
            gCtx.fillStyle = Math.random() < 0.5 ? 'rgba(30, 80, 30, 0.35)' : 'rgba(10, 35, 10, 0.45)';
            gCtx.fillRect(px, py, 2.5, 2.5);
        }

        // Layered Grass Blades (High-density with 6 organic shades)
        const grassColors = ['#1a431a', '#245e24', '#327c32', '#44a044', '#5ec75e', '#86ef86'];
        for (let i = 0; i < 450; i++) {
            const bx = Math.random() * (s - 14) + 7;
            const by = Math.random() * (s - 14) + 7;
            const col = grassColors[Math.floor(Math.random() * grassColors.length)];
            const bladeLen = Math.random() * 8 + 6;
            const tilt = (Math.random() - 0.5) * 5;

            gCtx.fillStyle = col;
            gCtx.beginPath();
            gCtx.moveTo(bx, by);
            gCtx.lineTo(bx - 2.5 + tilt, by - bladeLen * 0.6);
            gCtx.lineTo(bx + tilt * 1.5, by - bladeLen);
            gCtx.lineTo(bx + 3.5, by - bladeLen * 0.4);
            gCtx.closePath();
            gCtx.fill();

            // Sunlit blade tips
            if (i % 5 === 0) {
                gCtx.fillStyle = 'rgba(255, 255, 255, 0.55)';
                gCtx.fillRect(bx + tilt * 1.5 - 0.5, by - bladeLen, 1.5, 1.5);
            }
        }

        // Clover clusters (3-leaf & 4-leaf patches)
        for (let c = 0; c < 12; c++) {
            const cx = Math.random() * (s - 30) + 15;
            const cy = Math.random() * (s - 30) + 15;
            const leaves = (c === 0) ? 4 : 3; // Rare 4-leaf clover!
            gCtx.fillStyle = '#4ade80';
            for (let l = 0; l < leaves; l++) {
                const la = (l / leaves) * Math.PI * 2;
                gCtx.beginPath();
                gCtx.arc(cx + Math.cos(la) * 4.5, cy + Math.sin(la) * 4.5, 3.5, 0, Math.PI * 2);
                gCtx.fill();
            }
            gCtx.fillStyle = '#15803d';
            gCtx.beginPath();
            gCtx.arc(cx, cy, 2, 0, Math.PI * 2);
            gCtx.fill();
        }

        // Wild Flowers (Daisy, Lavender, Buttercup, Rose petals)
        const flowerTypes = [
            { petal: '#f472b6', center: '#fef08a' }, // Pink Daisy
            { petal: '#facc15', center: '#b45309' }, // Gold Buttercup
            { petal: '#a78bfa', center: '#ffffff' }, // Purple Lavender
            { petal: '#60a5fa', center: '#ffffff' }, // Bluebell
            { petal: '#f87171', center: '#facc15' }  // Wild Red Poppy
        ];
        for (let i = 0; i < 28; i++) {
            const fx = Math.random() * (s - 24) + 12;
            const fy = Math.random() * (s - 24) + 12;
            const ftype = flowerTypes[i % flowerTypes.length];

            // 5 Petals
            gCtx.fillStyle = ftype.petal;
            for (let p = 0; p < 5; p++) {
                const pa = (p / 5) * Math.PI * 2;
                gCtx.beginPath();
                gCtx.arc(fx + Math.cos(pa) * 3, fy + Math.sin(pa) * 3, 2.2, 0, Math.PI * 2);
                gCtx.fill();
            }
            // Center Core
            gCtx.fillStyle = ftype.center;
            gCtx.beginPath();
            gCtx.arc(fx, fy, 1.8, 0, Math.PI * 2);
            gCtx.fill();
        }
        this.tiles['grass'] = grass.canvas;

        // 2. 4K 3D 입체 조약돌 흙길 타일 (Ultra 3D Embossed Cobblestone Tile)
        const dirt = this.createCanvas(s, s);
        const dCtx = dirt.ctx;
        dCtx.fillStyle = '#2d1e14';
        dCtx.fillRect(0, 0, s, s);

        // Ground earth grain
        for (let i = 0; i < 500; i++) {
            dCtx.fillStyle = Math.random() < 0.5 ? '#1f130b' : '#3d2b1f';
            dCtx.fillRect(Math.random() * s, Math.random() * s, 3, 3);
        }

        const stonePalette = ['#543d2b', '#6b4e37', '#7d5c41', '#8f6a4b', '#483424', '#60432e'];
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const sx = c * 32 + (r % 2 === 0 ? 0 : 16) + (Math.random() * 4 - 2);
                const sy = r * 32 + (Math.random() * 4 - 2);
                const w = 26 + (Math.random() * 5 - 2.5);
                const h = 26 + (Math.random() * 5 - 2.5);

                // Deep Ambient Occlusion Drop Shadow behind stone
                dCtx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                dCtx.beginPath();
                dCtx.roundRect(sx + 2, sy + 3, w, h, 7);
                dCtx.fill();

                // Stone Base Body
                dCtx.fillStyle = stonePalette[(r * 8 + c) % stonePalette.length];
                dCtx.beginPath();
                dCtx.roundRect(sx, sy, w, h, 6);
                dCtx.fill();

                // Top-Left 3D Specular Highlight Bevel
                dCtx.fillStyle = 'rgba(255, 255, 255, 0.22)';
                dCtx.beginPath();
                dCtx.roundRect(sx + 2, sy + 2, w - 4, 3.5, 3);
                dCtx.fill();
                dCtx.beginPath();
                dCtx.roundRect(sx + 2, sy + 2, 3.5, h - 4, 3);
                dCtx.fill();

                // Bottom-Right Deep Shadow Bevel
                dCtx.fillStyle = 'rgba(0, 0, 0, 0.45)';
                dCtx.beginPath();
                dCtx.roundRect(sx + 3, sy + h - 4, w - 6, 3, 2);
                dCtx.fill();

                // Small surface rock speckles
                if ((r + c) % 2 === 0) {
                    dCtx.fillStyle = 'rgba(255, 255, 255, 0.12)';
                    dCtx.fillRect(sx + w * 0.4, sy + h * 0.35, 3, 2);
                }
            }
        }

        // Scattered loose micro-pebbles in crevices
        for (let i = 0; i < 40; i++) {
            const px = Math.random() * s;
            const py = Math.random() * s;
            dCtx.fillStyle = '#a88162';
            dCtx.beginPath();
            dCtx.arc(px, py, Math.random() * 1.8 + 1, 0, Math.PI * 2);
            dCtx.fill();
        }
        this.tiles['dirt'] = dirt.canvas;

        // 3. 4K 고대 미궁 룬 석판 타일 (Ultra Ancient Dungeon Slate Tile)
        const dungeon = this.createCanvas(s, s);
        const dnCtx = dungeon.ctx;
        dnCtx.fillStyle = '#070a11';
        dnCtx.fillRect(0, 0, s, s);

        const slatePalette = ['#1e293b', '#253349', '#192231', '#2d3d56'];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const bx = c * 64 + 3;
                const by = r * 64 + 3;
                
                // Deep tile gap shadow
                dnCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                dnCtx.fillRect(bx + 2, by + 3, 58, 58);

                // Slab body
                dnCtx.fillStyle = slatePalette[(r * 4 + c) % slatePalette.length];
                dnCtx.beginPath();
                dnCtx.roundRect(bx, by, 58, 58, 5);
                dnCtx.fill();

                // Chiselled Bevel Glint
                dnCtx.fillStyle = 'rgba(203, 213, 225, 0.25)';
                dnCtx.fillRect(bx + 2, by + 2, 54, 2.5);
                dnCtx.fillRect(bx + 2, by + 2, 2.5, 54);

                // Shadow edge
                dnCtx.fillStyle = 'rgba(2, 6, 23, 0.6)';
                dnCtx.fillRect(bx + 2, by + 53.5, 54, 2.5);
                dnCtx.fillRect(bx + 53.5, by + 2, 2.5, 54);

                // Surface Chiseled Cracks & Moss
                if ((r + c) % 2 === 0) {
                    dnCtx.strokeStyle = 'rgba(15, 23, 42, 0.8)';
                    dnCtx.lineWidth = 1.5;
                    dnCtx.beginPath();
                    dnCtx.moveTo(bx + 12, by + 45);
                    dnCtx.lineTo(bx + 26, by + 28);
                    dnCtx.lineTo(bx + 48, by + 36);
                    dnCtx.stroke();

                    // Green Moss in cracks
                    dnCtx.fillStyle = '#15803d';
                    dnCtx.fillRect(bx + 14, by + 42, 3, 3);
                    dnCtx.fillRect(bx + 25, by + 29, 2.5, 2.5);
                }

                // Glowing Arcane Runic Inlay
                if ((r * 4 + c) % 3 === 0) {
                    dnCtx.strokeStyle = '#c084fc';
                    dnCtx.shadowColor = '#a855f7';
                    dnCtx.shadowBlur = 6;
                    dnCtx.lineWidth = 2;
                    dnCtx.beginPath();
                    dnCtx.moveTo(bx + 29, by + 16);
                    dnCtx.lineTo(bx + 42, by + 29);
                    dnCtx.lineTo(bx + 29, by + 42);
                    dnCtx.lineTo(bx + 16, by + 29);
                    dnCtx.closePath();
                    dnCtx.stroke();
                    dnCtx.shadowBlur = 0;

                    dnCtx.fillStyle = '#ffffff';
                    dnCtx.beginPath();
                    dnCtx.arc(bx + 29, by + 29, 2.5, 0, Math.PI * 2);
                    dnCtx.fill();
                }
            }
        }
        this.tiles['dungeon'] = dungeon.canvas;

        // 4. 4K 화염 심연 흑요석 & 용암 타일 (Ultra Magma Fissure Tile)
        const magma = this.createCanvas(s, s);
        const mCtx = magma.ctx;
        mCtx.fillStyle = '#150505';
        mCtx.fillRect(0, 0, s, s);

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const bx = c * 64 + 4;
                const by = r * 64 + 4;
                mCtx.fillStyle = '#260e0e';
                mCtx.beginPath();
                mCtx.roundRect(bx, by, 56, 56, 6);
                mCtx.fill();

                // Molten Core Fissure
                mCtx.strokeStyle = '#ef4444';
                mCtx.shadowColor = '#f97316';
                mCtx.shadowBlur = 10;
                mCtx.lineWidth = 3;
                mCtx.beginPath();
                mCtx.moveTo(bx + 4, by + 28);
                mCtx.quadraticCurveTo(bx + 28, by + 18, bx + 52, by + 34);
                mCtx.stroke();
                mCtx.shadowBlur = 0;

                // Searing Bright Lava Vein Center
                mCtx.strokeStyle = '#fef08a';
                mCtx.lineWidth = 1.2;
                mCtx.beginPath();
                mCtx.moveTo(bx + 6, by + 28);
                mCtx.quadraticCurveTo(bx + 28, by + 18, bx + 50, by + 34);
                mCtx.stroke();
            }
        }
        this.tiles['magma'] = magma.canvas;

        // 5. 4K 얼음 영구동토 빙하 타일 (Ultra Frost Cryo Tile)
        const frost = this.createCanvas(s, s);
        const fCtx = frost.ctx;
        fCtx.fillStyle = '#06283d';
        fCtx.fillRect(0, 0, s, s);

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const bx = c * 64 + 3;
                const by = r * 64 + 3;
                fCtx.fillStyle = '#0b4263';
                fCtx.beginPath();
                fCtx.roundRect(bx, by, 58, 58, 6);
                fCtx.fill();

                // Ice Bevel
                fCtx.fillStyle = 'rgba(186, 230, 253, 0.45)';
                fCtx.fillRect(bx + 3, by + 3, 52, 2.5);
                fCtx.fillRect(bx + 3, by + 3, 2.5, 52);

                // Crystalline Fracture
                fCtx.strokeStyle = '#e0f2fe';
                fCtx.shadowColor = '#38bdf8';
                fCtx.shadowBlur = 6;
                fCtx.lineWidth = 1.8;
                fCtx.beginPath();
                fCtx.moveTo(bx + 14, by + 18);
                fCtx.lineTo(bx + 32, by + 32);
                fCtx.lineTo(bx + 48, by + 22);
                fCtx.stroke();
                fCtx.shadowBlur = 0;
            }
        }
        this.tiles['frost'] = frost.canvas;

        // 6. 4K 천공의 신전 대리석 제단 타일 (Ultra Celestial Pantheon Tile)
        const celestial = this.createCanvas(s, s);
        const clCtx = celestial.ctx;
        clCtx.fillStyle = '#18153d';
        clCtx.fillRect(0, 0, s, s);

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const bx = c * 64 + 4;
                const by = r * 64 + 4;
                clCtx.fillStyle = '#2e2a70';
                clCtx.beginPath();
                clCtx.roundRect(bx, by, 56, 56, 8);
                clCtx.fill();

                clCtx.strokeStyle = '#facc15';
                clCtx.shadowColor = '#fde047';
                clCtx.shadowBlur = 8;
                clCtx.lineWidth = 2;
                clCtx.strokeRect(bx + 8, by + 8, 40, 40);
                clCtx.shadowBlur = 0;

                clCtx.fillStyle = '#ffffff';
                clCtx.beginPath();
                clCtx.arc(bx + 28, by + 28, 4.5, 0, Math.PI * 2);
                clCtx.fill();
            }
        }
        this.tiles['celestial'] = celestial.canvas;

        // 7. 4K 비취 요정 숲 타일 (Emerald Forest)
        const forest = this.createCanvas(s, s);
        const foCtx = forest.ctx;
        foCtx.fillStyle = '#064e3b';
        foCtx.fillRect(0, 0, s, s);
        for (let i = 0; i < 350; i++) {
            foCtx.fillStyle = i % 3 === 0 ? '#047857' : (i % 2 === 0 ? '#10b981' : '#34d399');
            foCtx.fillRect(Math.random() * s, Math.random() * s, 3.5, 3.5);
        }
        this.tiles['forest'] = forest.canvas;

        // 8. 4K 묘지 타일 (Graveyard Cursed Slate)
        const grave = this.createCanvas(s, s);
        const grCtx = grave.ctx;
        grCtx.fillStyle = '#110e2e';
        grCtx.fillRect(0, 0, s, s);
        for (let i = 0; i < 20; i++) {
            grCtx.fillStyle = '#1e1b4b';
            grCtx.fillRect(Math.random() * (s - 40), Math.random() * (s - 40), 38, 38);
        }
        this.tiles['graveyard'] = grave.canvas;

        // 9. 4K 황금 사막 타일 (Mirage Sand)
        const sand = this.createCanvas(s, s);
        const saCtx = sand.ctx;
        saCtx.fillStyle = '#78350f';
        saCtx.fillRect(0, 0, s, s);
        for (let i = 0; i < 400; i++) {
            saCtx.fillStyle = i % 2 === 0 ? '#b45309' : '#d97706';
            saCtx.fillRect(Math.random() * s, Math.random() * s, 2.5, 2.5);
        }
        this.tiles['sand'] = sand.canvas;

        // 10. 4K 파라오 영묘 타일 (Gold Crypt)
        const crypt = this.createCanvas(s, s);
        const crCtx = crypt.ctx;
        crCtx.fillStyle = '#3b1502';
        crCtx.fillRect(0, 0, s, s);
        for (let i = 0; i < 16; i++) {
            crCtx.strokeStyle = '#eab308';
            crCtx.lineWidth = 2;
            crCtx.strokeRect((i % 4) * 64 + 4, Math.floor(i / 4) * 64 + 4, 56, 56);
        }
        this.tiles['gold_crypt'] = crypt.canvas;

        // 11. 4K 화산 용의 둥지 타일 (Volcano Wyrm)
        const volcano = this.createCanvas(s, s);
        const voCtx = volcano.ctx;
        voCtx.fillStyle = '#330808';
        voCtx.fillRect(0, 0, s, s);
        for (let i = 0; i < 300; i++) {
            voCtx.fillStyle = i % 2 === 0 ? '#991b1b' : '#dc2626';
            voCtx.fillRect(Math.random() * s, Math.random() * s, 3, 3);
        }
        this.tiles['volcano'] = volcano.canvas;

        // 12. 4K 설원 만년설 타일 (Snow Tundra)
        const snow = this.createCanvas(s, s);
        const snCtx = snow.ctx;
        snCtx.fillStyle = '#0c4a6e';
        snCtx.fillRect(0, 0, s, s);
        for (let i = 0; i < 350; i++) {
            snCtx.fillStyle = i % 2 === 0 ? '#bae6fd' : '#e0f2fe';
            snCtx.fillRect(Math.random() * s, Math.random() * s, 3, 3);
        }
        this.tiles['snow'] = snow.canvas;

        // 13. 4K 심해 해구 타일 (Ocean Trench)
        const ocean = this.createCanvas(s, s);
        const ocCtx = ocean.ctx;
        ocCtx.fillStyle = '#022119';
        ocCtx.fillRect(0, 0, s, s);
        for (let i = 0; i < 220; i++) {
            ocCtx.fillStyle = '#0d9488';
            ocCtx.beginPath();
            ocCtx.arc(Math.random() * s, Math.random() * s, 2.5, 0, Math.PI * 2);
            ocCtx.fill();
        }
        this.tiles['ocean_trench'] = ocean.canvas;

        // 14. 4K 맹독 늪지대 타일 (Toxic Swamp)
        const swamp = this.createCanvas(s, s);
        const swCtx = swamp.ctx;
        swCtx.fillStyle = '#0f2107';
        swCtx.fillRect(0, 0, s, s);
        for (let i = 0; i < 200; i++) {
            swCtx.fillStyle = '#4ade80';
            swCtx.fillRect(Math.random() * s, Math.random() * s, 3, 3);
        }
        this.tiles['swamp'] = swamp.canvas;

        // 15. 4K 공허 차원 타일 (Void Realm)
        const voidTile = this.createCanvas(s, s);
        const vdCtx = voidTile.ctx;
        vdCtx.fillStyle = '#120221';
        vdCtx.fillRect(0, 0, s, s);
        for (let i = 0; i < 250; i++) {
            vdCtx.fillStyle = '#a855f7';
            vdCtx.fillRect(Math.random() * s, Math.random() * s, 2.5, 2.5);
        }
        this.tiles['void'] = voidTile.canvas;

        // 16. 4K 태초의 신역 우주 성소 타일 (Cosmic Genesis)
        const cosmic = this.createCanvas(s, s);
        const csCtx = cosmic.ctx;
        csCtx.fillStyle = '#02050e';
        csCtx.fillRect(0, 0, s, s);
        for (let i = 0; i < 300; i++) {
            csCtx.fillStyle = i % 3 === 0 ? '#f472b6' : (i % 2 === 0 ? '#facc15' : '#60a5fa');
            csCtx.fillRect(Math.random() * s, Math.random() * s, 2.5, 2.5);
        }
        this.tiles['cosmic'] = cosmic.canvas;

        // 17. 4K 신비의 수정 동굴 타일 (Crystal Cavern)
        const crystal = this.createCanvas(s, s);
        const crystCtx = crystal.ctx;
        crystCtx.fillStyle = '#090d16';
        crystCtx.fillRect(0, 0, s, s);
        for (let i = 0; i < 250; i++) {
            crystCtx.fillStyle = i % 2 === 0 ? '#c084fc' : '#818cf8';
            crystCtx.beginPath();
            crystCtx.arc(Math.random() * s, Math.random() * s, 3, 0, Math.PI * 2);
            crystCtx.fill();
        }
        this.tiles['crystal'] = crystal.canvas;

        // 18. 4K 고대 거신 룬 유적 타일 (Ancient Ruins)
        const ruins = this.createCanvas(s, s);
        const rnCtx = ruins.ctx;
        rnCtx.fillStyle = '#1f1c1b';
        rnCtx.fillRect(0, 0, s, s);
        for (let i = 0; i < 220; i++) {
            rnCtx.fillStyle = i % 2 === 0 ? '#ca8a04' : '#a8a29e';
            rnCtx.fillRect(Math.random() * s, Math.random() * s, 4, 2);
        }
        this.tiles['ruins'] = ruins.canvas;

        // 19. 4K 진홍빛 흡혈귀 성채 타일 (Blood Citadel)
        const bloodC = this.createCanvas(s, s);
        const blCtx = bloodC.ctx;
        blCtx.fillStyle = '#330707';
        blCtx.fillRect(0, 0, s, s);
        for (let i = 0; i < 240; i++) {
            blCtx.fillStyle = i % 2 === 0 ? '#ef4444' : '#991b1b';
            blCtx.fillRect(Math.random() * s, Math.random() * s, 3, 3);
        }
        this.tiles['blood_castle'] = bloodC.canvas;

        // 20. 4K 시공간 성간 공허 타일 (Astral Void)
        const astral = this.createCanvas(s, s);
        const asCtx = astral.ctx;
        asCtx.fillStyle = '#030511';
        asCtx.fillRect(0, 0, s, s);
        for (let i = 0; i < 300; i++) {
            asCtx.fillStyle = i % 3 === 0 ? '#38bdf8' : (i % 2 === 0 ? '#e879f9' : '#ffffff');
            asCtx.fillRect(Math.random() * s, Math.random() * s, 2, 2);
        }
        this.tiles['astral'] = astral.canvas;

        // 21. 4K 꿈속의 나태 낙원 타일 (Lazy Paradise)
        const paradise = this.createCanvas(s, s);
        const prCtx = paradise.ctx;
        prCtx.fillStyle = '#161338';
        prCtx.fillRect(0, 0, s, s);
        for (let i = 0; i < 280; i++) {
            prCtx.fillStyle = i % 2 === 0 ? '#fbcfe8' : '#fef08a';
            prCtx.beginPath();
            prCtx.arc(Math.random() * s, Math.random() * s, 3.5, 0, Math.PI * 2);
            prCtx.fill();
        }
        this.tiles['paradise'] = paradise.canvas;
    }
}

const textures = new TextureAtlas();

