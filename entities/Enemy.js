// ============================================================================
// 40 Legendary Raid Boss Database (Full Roster & Mechanics - Bilingual)
// ============================================================================
const BOSS_DATA_DB = {
    'boss_slime_king': { name: '슬라임 킹', name_en: 'Slime King', title: '젤라틴의 대왕', title_en: 'Gelatin Sovereign', hp: 600, speed: 80, damage: 18, radius: 36, color: '#16a34a', exp: 80, gold: 80, bulletType: 'venom_spit', bulletSpeed: 280, waves: 4, specialDesc: '점액 파편 폭발', specialDesc_en: 'Mucus Burst Explosion', dropItem: 'sword_emerald' },
    'boss_mushroom_emperor': { name: '독버섯 황제 포자킹', name_en: 'Spore King Mushroom Emperor', title: '포자의 지배자', title_en: 'Ruler of Spores', hp: 750, speed: 85, damage: 20, radius: 34, color: '#9333ea', exp: 80, gold: 100, bulletType: 'venom_spit', bulletSpeed: 300, waves: 4, specialDesc: '맹독 포자 방출', specialDesc_en: 'Toxic Spore Discharge', dropItem: 'potion_buff' },
    'boss_goblin_warlord': { name: '고블린 대족장 그룩타', name_en: 'Goblin Warlord Grukta', title: '비취 숲의 약탈자', title_en: 'Plunderer of Jade Woods', hp: 850, speed: 105, damage: 24, radius: 32, color: '#65a30d', exp: 91, gold: 120, bulletType: 'arrow', bulletSpeed: 340, waves: 3, specialDesc: '회전 도끼 난무', specialDesc_en: 'Whirling Axe Flurry', dropItem: 'armor_emerald' },
    'boss_shadow_panther': { name: '그림자 흑표범 섀도우팽', name_en: 'Shadow Panther Shadowfang', title: '비취 숲의 암습자', title_en: 'Jade Forest Ambush Predator', hp: 1100, speed: 135, damage: 26, radius: 30, color: '#1e293b', exp: 105, gold: 140, bulletType: 'arrow', bulletSpeed: 380, waves: 4, specialDesc: '초고속 그림자 도약 습격', specialDesc_en: 'Supersonic Shadow Leap Assault', dropItem: 'ring_wind' },
    'boss_treant_ancient': { name: '고대 엘더 엔트', name_en: 'Ancient Elder Treant', title: '숲의 고대 수호신', title_en: 'Primordial Forest Guardian', hp: 1400, speed: 65, damage: 30, radius: 42, color: '#14532d', exp: 126, gold: 160, bulletType: 'sword_beam', bulletSpeed: 300, waves: 6, specialDesc: '뿌리 가시 소환', specialDesc_en: 'Root Thorn Summon', dropItem: 'ring_mana' },
    'boss_dark_knight': { name: '타락한 암흑 기사 아서', name_en: 'Fallen Dark Knight Arthur', title: '미궁의 배신자', title_en: 'Traitor of the Labyrinth', hp: 1800, speed: 110, damage: 34, radius: 34, color: '#475569', exp: 162, gold: 200, bulletType: 'dark_orb', bulletSpeed: 320, waves: 4, specialDesc: '3단 암흑 검기', specialDesc_en: 'Triple Dark Blade Surge', dropItem: 'sword_shadow' },
    'boss_gargoyle_stone': { name: '석화의 가고일 로드', name_en: 'Petrification Gargoyle Lord', title: '미궁의 수호석상', title_en: 'Labyrinth Guardian Statue', hp: 2100, speed: 80, damage: 36, radius: 38, color: '#64748b', exp: 182, gold: 220, bulletType: 'dark_orb', bulletSpeed: 310, waves: 5, specialDesc: '석화 광역 초음파', specialDesc_en: 'Stone Curse Ultrasonic Wave', dropItem: 'armor_plate' },
    'boss_skeleton_general': { name: '해골 군단장 발록', name_en: 'Undead Skeleton General Balrog', title: '불멸의 해골 장군', title_en: 'Immortal Skeleton Commander', hp: 2400, speed: 90, damage: 38, radius: 36, color: '#cbd5e1', exp: 212, gold: 250, bulletType: 'arrow', bulletSpeed: 360, waves: 5, specialDesc: '해골 뼈창 투척', specialDesc_en: 'Bone Spear Javelin', dropItem: 'armor_necro' },
    'boss_reaper': { name: '죽음의 사신 타나토스', name_en: 'Reaper of Death Thanatos', title: '영혼 수확자', title_en: 'Soul Harvester', hp: 2800, speed: 115, damage: 42, radius: 36, color: '#3b0764', exp: 263, gold: 300, bulletType: 'dark_orb', bulletSpeed: 340, waves: 6, specialDesc: '사신의 낫 영혼 베기', specialDesc_en: 'Soul Severing Scythe', dropItem: 'ring_berserk' },
    'boss_blood_count': { name: '피의 군주 카밀라 백작', name_en: 'Blood Lord Count Carmilla', title: '밤의 지배자', title_en: 'Ruler of the Night', hp: 3200, speed: 125, damage: 44, radius: 34, color: '#881337', exp: 293, gold: 350, bulletType: 'dark_orb', bulletSpeed: 350, waves: 7, specialDesc: '흡혈 박쥐 떼 방출', specialDesc_en: 'Vampiric Bat Swarm', dropItem: 'potion_crit' },
    'boss_banshee_queen': { name: '비명의 여왕 밴시', name_en: 'Screaming Banshee Queen', title: '원혼의 통곡', title_en: 'Lament of Vengeful Spirits', hp: 3500, speed: 130, damage: 45, radius: 32, color: '#7c3aed', exp: 334, gold: 380, bulletType: 'dark_orb', bulletSpeed: 360, waves: 8, specialDesc: '초음파 광역 통곡', specialDesc_en: 'Ultrasonic Soul Wail', dropItem: 'sword_sand' },
    'boss_sand_worm': { name: '사막의 지배자 샌드웜', name_en: 'Desert Sovereign Sandworm', title: '모래 심연의 괴수', title_en: 'Behemoth of the Sand Abyss', hp: 3900, speed: 95, damage: 48, radius: 46, color: '#b45309', exp: 405, gold: 450, bulletType: 'sand_ball', bulletSpeed: 330, waves: 6, specialDesc: '모래 지진 폭발', specialDesc_en: 'Sandquake Eruption', dropItem: 'ring_sand' },
    'boss_scorpion_empress': { name: '진홍의 전갈 여제 셀케트', name_en: 'Crimson Scorpion Empress Serket', title: '사막의 맹독 여제', title_en: 'Desert Venom Empress', hp: 4300, speed: 110, damage: 50, radius: 44, color: '#9a3412', exp: 446, gold: 500, bulletType: 'sand_ball', bulletSpeed: 340, waves: 6, specialDesc: '맹독 꼬리침 연타', specialDesc_en: 'Venom Stinger Barrage', dropItem: 'ring_berserk' },
    'boss_anubis_shadow': { name: '사막의 심판관 아누비스', name_en: 'Desert Arbiter Anubis', title: '망자의 저울', title_en: 'Scale of the Dead', hp: 4800, speed: 115, damage: 52, radius: 36, color: '#78350f', exp: 496, gold: 550, bulletType: 'holy_beam', bulletSpeed: 380, waves: 5, specialDesc: '앙크 심판 레이저', specialDesc_en: 'Ankh Judgment Laser', dropItem: 'armor_pharaoh' },
    'boss_pharaoh_curse': { name: '황금 파라오 투탕카멘', name_en: 'Golden Pharaoh Tutankhamun', title: '불멸의 태양 파라오', title_en: 'Immortal Sun Pharaoh', hp: 5500, speed: 100, damage: 56, radius: 40, color: '#eab308', exp: 598, gold: 650, bulletType: 'sand_ball', bulletSpeed: 350, waves: 8, specialDesc: '황금 쇠사슬 구속', specialDesc_en: 'Golden Chain Shackles', dropItem: 'sword_flame' },
    'boss_sphinx_guardian': { name: '수수께끼의 스핑크스', name_en: 'Sphinx of Riddles', title: '피라미드 수호수', title_en: 'Pyramid Guardian Beast', hp: 7700, speed: 120, damage: 60, radius: 44, color: '#ca8a04', exp: 698, gold: 750, bulletType: 'sand_ball', bulletSpeed: 370, waves: 7, specialDesc: '수수께끼 충격파', specialDesc_en: 'Riddle Shockwave', dropItem: 'ring_magma' },
    'boss_magma_behemoth': { name: '용암 거인 베히모스', name_en: 'Magma Behemoth', title: '심연의 마그마 타이탄', title_en: 'Abyssal Magma Titan', hp: 8700, speed: 75, damage: 65, radius: 48, color: '#b91c1c', exp: 820, gold: 850, bulletType: 'dragon_breath', bulletSpeed: 320, waves: 6, specialDesc: '마그마 분출 격돌', specialDesc_en: 'Magma Eruption Collision', dropItem: 'armor_dragon' },
    'boss_hellhound_cerberus': { name: '지옥의 삼두견 켈베로스', name_en: 'Cerberus the Hellhound', title: '명계의 문지기', title_en: 'Gatekeeper of the Underworld', hp: 9900, speed: 120, damage: 68, radius: 44, color: '#991b1b', exp: 972, gold: 1000, bulletType: 'dragon_breath', bulletSpeed: 370, waves: 8, specialDesc: '삼두 삼중 화염방사', specialDesc_en: 'Triple Hellfire Flamethrower', dropItem: 'ring_magma' },
    'boss_fire_dragon': { name: '진홍의 화룡 이그니스', name_en: 'Crimson Fire Dragon Ignis', title: '폭주하는 화염룡', title_en: 'Raging Flame Dragon', hp: 11200, speed: 105, damage: 72, radius: 46, color: '#dc2626', exp: 1134, gold: 1200, bulletType: 'dragon_breath', bulletSpeed: 360, waves: 8, specialDesc: '화룡의 멸망 브레스', specialDesc_en: 'Cataclysmic Fire Breath', dropItem: 'sword_dragon' },
    'boss_inferno_lord': { name: '지옥불 군주 아스모데우스', name_en: 'Infernal Lord Asmodeus', title: '인페르노의 군주', title_en: 'Monarch of the Inferno', hp: 12400, speed: 110, damage: 76, radius: 42, color: '#7f1d1d', exp: 1256, gold: 1400, bulletType: 'dragon_breath', bulletSpeed: 380, waves: 10, specialDesc: '지옥불 화염 기둥', specialDesc_en: 'Hellfire Pillar Blast', dropItem: 'potion_crit' },
    'boss_black_dragon': { name: '암흑 흑룡 칼라미티', name_en: 'Dark Black Dragon Calamity', title: '파멸의 흑염룡', title_en: 'Black Flame Dragon of Ruin', hp: 13600, speed: 115, damage: 80, radius: 52, color: '#18181b', exp: 1397, gold: 1600, bulletType: 'dragon_breath', bulletSpeed: 410, waves: 12, specialDesc: '흑염 멸망 브레스', specialDesc_en: 'Abyssal Flame Breath', dropItem: 'armor_dragon' },
    'boss_elder_wyrm': { name: '고대룡 파브니르', name_en: 'Elder Wyrm Fafnir', title: '황금 탐욕의 고룡', title_en: 'Ancient Dragon of Avarice', hp: 14800, speed: 115, damage: 83, radius: 50, color: '#991b1b', exp: 1539, gold: 1800, bulletType: 'dragon_breath', bulletSpeed: 400, waves: 12, specialDesc: '360도 전방위 드래곤 브레스', specialDesc_en: '360° Omnidirectional Wyrm Breath', dropItem: 'ring_freeze' },
    'boss_frost_yeti': { name: '빙하 거인 예티 킹', name_en: 'Glacial Giant Yeti King', title: '혹한의 설원 제왕', title_en: 'Monarch of the Frozen Tundra', hp: 16000, speed: 90, damage: 86, radius: 48, color: '#0369a1', exp: 1681, gold: 2000, bulletType: 'frost_shard', bulletSpeed: 350, waves: 6, specialDesc: '얼음 바위 투척', specialDesc_en: 'Ice Boulder Catapult', dropItem: 'armor_frost' },
    'boss_blizzard_fenrir': { name: '빙하의 늑대왕 펜리르', name_en: 'Blizzard Wolf King Fenrir', title: '서리 폭풍의 야수', title_en: 'Beast of the Frost Gale', hp: 17200, speed: 130, damage: 89, radius: 44, color: '#0284c7', exp: 1822, gold: 2200, bulletType: 'frost_shard', bulletSpeed: 400, waves: 8, specialDesc: '블리자드 하울링 돌진', specialDesc_en: 'Blizzard Howling Charge', dropItem: 'ring_freeze' },
    'boss_ice_queen': { name: '영구동토의 얼음 여왕', name_en: 'Permafrost Ice Queen', title: '혹한의 절대영도', title_en: 'Absolute Zero of the Arctic', hp: 18500, speed: 125, damage: 92, radius: 36, color: '#38bdf8', exp: 1984, gold: 2400, bulletType: 'frost_shard', bulletSpeed: 390, waves: 10, specialDesc: '블리자드 눈보라', specialDesc_en: 'Blizzard Storm Surge', dropItem: 'sword_frost' },
    'boss_lich_king': { name: '서리한의 리치 킹 켈투자드', name_en: 'Frostmourne Lich King Kel\'Thuzad', title: '언데드 빙하 군주', title_en: 'Undead Glacial Overlord', hp: 20200, speed: 100, damage: 95, radius: 42, color: '#0284c7', exp: 2187, gold: 2600, bulletType: 'frost_shard', bulletSpeed: 370, waves: 8, specialDesc: '프로스트 노바 폭발', specialDesc_en: 'Frost Nova Detonation', dropItem: 'ring_abyss' },
    'boss_frost_dragon': { name: '혹한의 빙룡 신드라고사', name_en: 'Glacial Wyrm Sindragosa', title: '부활한 서리 고룡', title_en: 'Resurrected Frost Wyrm', hp: 22400, speed: 120, damage: 98, radius: 50, color: '#7dd3fc', exp: 2430, gold: 2900, bulletType: 'frost_shard', bulletSpeed: 410, waves: 12, specialDesc: '절대영도 빙룡 브레스', specialDesc_en: 'Absolute Zero Wyrm Breath', dropItem: 'armor_abyss' },
    'boss_kraken_tentacle': { name: '심해의 괴수 크라켄', name_en: 'Abyssal Monster Kraken', title: '해구의 거대 촉수', title_en: 'Colossal Deep Sea Tentacles', hp: 24800, speed: 85, damage: 102, radius: 52, color: '#0f766e', exp: 2714, gold: 3200, bulletType: 'sword_beam', bulletSpeed: 360, waves: 8, specialDesc: '8방향 촉수 대강타', specialDesc_en: '8-Way Tentacle Ground Slam', dropItem: 'sword_abyss' },
    'boss_siren_abyss': { name: '심해의 유혹 세이렌 퀸', name_en: 'Abyssal Enchantress Siren Queen', title: '해구의 매혹자', title_en: 'Trench Temptress', hp: 27200, speed: 105, damage: 106, radius: 40, color: '#0d9488', exp: 2997, gold: 3500, bulletType: 'holy_beam', bulletSpeed: 380, waves: 9, specialDesc: '매혹의 음파 소용돌이', specialDesc_en: 'Alluring Sonic Vortex', dropItem: 'armor_abyss' },
    'boss_leviathan': { name: '대양의 지배자 레비아탄', name_en: 'Ocean Monarch Leviathan', title: '원초의 대해일', title_en: 'Primordial Megatsunami', hp: 30000, speed: 115, damage: 110, radius: 54, color: '#047857', exp: 3341, gold: 3800, bulletType: 'holy_beam', bulletSpeed: 390, waves: 10, specialDesc: '대해일 쓰나미 파동', specialDesc_en: 'Tsunami Shockwave Wave', dropItem: 'ring_venom' },
    'boss_hydra_venom': { name: '구두룡 맹독 히드라', name_en: 'Nine-Headed Poison Hydra', title: '불사의 9두 독룡', title_en: 'Immortal 9-Headed Toxic Drake', hp: 33500, speed: 110, damage: 115, radius: 52, color: '#15803d', exp: 3746, gold: 4200, bulletType: 'venom_spit', bulletSpeed: 380, waves: 9, specialDesc: '9방향 맹독 난사', specialDesc_en: '9-Way Venom Barrage', dropItem: 'sword_venom' },
    'boss_toxic_plague': { name: '역병의 군주 벨제붑', name_en: 'Plague Lord Beelzebub', title: '부패와 파리의 왕', title_en: 'King of Decay and Flies', hp: 37500, speed: 135, damage: 120, radius: 40, color: '#3f6212', exp: 4212, gold: 4600, bulletType: 'venom_spit', bulletSpeed: 420, waves: 12, specialDesc: '역병 파리떼 소환', specialDesc_en: 'Plague Fly Swarm', dropItem: 'armor_swamp' },
    'boss_void_stalker': { name: '공허의 추적자 카직스', name_en: 'Void Stalker Kha\'Zix', title: '차원의 암살 괴수', title_en: 'Dimensional Assassin Beast', hp: 42000, speed: 145, damage: 126, radius: 42, color: '#581c87', exp: 4759, gold: 5000, bulletType: 'void_spike', bulletSpeed: 430, waves: 8, specialDesc: '공허 점멸 암살', specialDesc_en: 'Void Blink Ambush', dropItem: 'sword_void' },
    'boss_chaos_aberration': { name: '혼돈의 변종 크툴루스', name_en: 'Chaos Aberration Cthulhus', title: '차원 왜곡 괴수', title_en: 'Spacetime Warping Monster', hp: 47000, speed: 110, damage: 132, radius: 54, color: '#4c1d95', exp: 5366, gold: 5500, bulletType: 'void_spike', bulletSpeed: 420, waves: 12, specialDesc: '시공간 왜곡 파동', specialDesc_en: 'Spacetime Distortion Wave', dropItem: 'ring_void' },
    'boss_shadow_monarch': { name: '그림자 군주 아시본', name_en: 'Shadow Monarch Ashborn', title: '불멸의 그림자 황제', title_en: 'Immortal Emperor of Shadows', hp: 52500, speed: 125, damage: 138, radius: 46, color: '#311042', exp: 6075, gold: 6000, bulletType: 'void_spike', bulletSpeed: 410, waves: 14, specialDesc: '그림자 블랙홀 소환', specialDesc_en: 'Shadow Black Hole Summon', dropItem: 'ring_void' },
    'boss_valkyrie_prime': { name: '발키리 수장 브륀힐트', name_en: 'Valkyrie Prime Brynhildr', title: '천공의 빛의 창', title_en: 'Radiant Spear of Heaven', hp: 58500, speed: 140, damage: 144, radius: 40, color: '#facc15', exp: 6885, gold: 6600, bulletType: 'holy_beam', bulletSpeed: 440, waves: 10, specialDesc: '신성한 빛의 투창', specialDesc_en: 'Holy Celestial Spear Throw', dropItem: 'armor_celestial' },
    'boss_archangel_uriel': { name: '대천사 우리엘', name_en: 'Archangel Uriel', title: '신의 심판의 불꽃', title_en: 'Flame of Divine Judgment', hp: 65000, speed: 130, damage: 150, radius: 46, color: '#fde047', exp: 7796, gold: 7200, bulletType: 'holy_beam', bulletSpeed: 450, waves: 12, specialDesc: '심판의 벼락 광선', specialDesc_en: 'Thunder of Judgment Ray', dropItem: 'ring_divine' },
    'boss_seraphim': { name: '천공의 심판자 세라핌', name_en: 'Celestial Judge Seraphim', title: '6익 대천사 신성판테온', title_en: '6-Winged Divine Pantheon Archangel', hp: 73000, speed: 120, damage: 158, radius: 52, color: '#fef08a', exp: 8910, gold: 8000, bulletType: 'holy_beam', bulletSpeed: 430, waves: 16, specialDesc: '8방향 천공의 광탄', specialDesc_en: '8-Way Celestial Radiant Orbs', dropItem: 'sword_celestial' },
    'boss_astral_devourer': { name: '성간 포식자 네뷸라', name_en: 'Astral Devourer Nebula', title: '은하를 삼키는 자', title_en: 'Devourer of Galaxies', hp: 60000, speed: 115, damage: 146, radius: 56, color: '#6366f1', exp: 7088, gold: 7000, bulletType: 'galaxy_star', bulletSpeed: 430, waves: 14, specialDesc: '성간 초신성 폭발', specialDesc_en: 'Interstellar Supernova Blast', dropItem: 'ring_divine' },
    'boss_time_chronos': { name: '시공의 지배자 크로노스', name_en: 'Lord of Spacetime Chronos', title: '시간의 절대자', title_en: 'Absolute Master of Time', hp: 68000, speed: 130, damage: 154, radius: 48, color: '#06b6d4', exp: 8302, gold: 7800, bulletType: 'galaxy_star', bulletSpeed: 460, waves: 18, specialDesc: '시간 왜곡 정지 탄막', specialDesc_en: 'Time Stasis Bullet Barrage', dropItem: 'sword_celestial' },
    'boss_crystal_colossus': { name: '자수정 거신 크리스탈로스', name_en: 'Amethyst Colossus Crystallos', title: '수정 동굴의 수호 거신', title_en: 'Crystal Cavern Guardian', hp: 4600, speed: 75, damage: 54, radius: 46, color: '#a855f7', exp: 526, gold: 580, bulletType: 'frost_shard', bulletSpeed: 340, waves: 6, specialDesc: '자수정 파편 지진', specialDesc_en: 'Amethyst Shard Quake', dropItem: 'ring_mana' },
    'boss_emerald_dragon': { name: '비취 에메랄드 와이번', name_en: 'Jade Emerald Wyvern', title: '수정 광맥의 비룡', title_en: 'Crystal Vein Drake', hp: 5200, speed: 120, damage: 58, radius: 44, color: '#10b981', exp: 608, gold: 680, bulletType: 'venom_spit', bulletSpeed: 380, waves: 8, specialDesc: '맹독 수정 브레스', specialDesc_en: 'Toxic Crystal Breath', dropItem: 'sword_emerald' },
    'boss_colossus_goliath': { name: '고대 거신 골리앗', name_en: 'Ancient Titan Goliath', title: '하늘 유적의 거신', title_en: 'Titan of Sky Ruins', hp: 12000, speed: 70, damage: 78, radius: 52, color: '#78716c', exp: 1336, gold: 1500, bulletType: 'holy_beam', bulletSpeed: 330, waves: 8, specialDesc: '거신 대지 강타', specialDesc_en: 'Titan Earth Slam', dropItem: 'armor_plate' },
    'boss_chariot_phantom': { name: '태양 전차의 환영', name_en: 'Phantom Sun Chariot', title: '고대 전장의 전차병', title_en: 'Ancient Battlefield Charioteer', hp: 13000, speed: 140, damage: 82, radius: 42, color: '#f59e0b', exp: 1458, gold: 1650, bulletType: 'sword_beam', bulletSpeed: 420, waves: 10, specialDesc: '빛의 돌진 바퀴살', specialDesc_en: 'Radiant Wheel Charge', dropItem: 'sword_flame' },
    'boss_vampire_emperor': { name: '흡혈귀 황제 블라드 3세', name_en: 'Vampire Emperor Vlad III', title: '진홍 성채의 황제', title_en: 'Emperor of Crimson Citadel', hp: 26000, speed: 130, damage: 104, radius: 44, color: '#991b1b', exp: 2835, gold: 3400, bulletType: 'dark_orb', bulletSpeed: 400, waves: 10, specialDesc: '핏빛 피바다 소용돌이', specialDesc_en: 'Blood Sea Whirlpool', dropItem: 'potion_crit' },
    'boss_blood_dragon': { name: '진홍 핏빛룡 카르마', name_en: 'Crimson Blood Drake Karma', title: '피의 성채 수호룡', title_en: 'Blood Citadel Guardian Drake', hp: 28500, speed: 120, damage: 108, radius: 52, color: '#b91c1c', exp: 3200, gold: 3700, bulletType: 'dragon_breath', bulletSpeed: 410, waves: 12, specialDesc: '핏빛 용염 브레스', specialDesc_en: 'Blood Dragon Flame Breath', dropItem: 'sword_dragon' },
    'boss_dream_weaver': { name: '꿈의 방직자 모르페우스', name_en: 'Dreamweaver Morpheus', title: '영원한 수면의 지배자', title_en: 'Master of Eternal Slumber', hp: 88000, speed: 125, damage: 175, radius: 52, color: '#f472b6', exp: 11340, gold: 9500, bulletType: 'galaxy_star', bulletSpeed: 450, waves: 20, specialDesc: '수면 유도 꿈방울 난사', specialDesc_en: 'Sleep Inducing Dream Bubble Barrage', dropItem: 'armor_lazy_god' },
    'boss_pillow_king': { name: '온수매트 대왕 슬리퍼', name_en: 'Heated Mattress King Sleeper', title: '절대 기상 거부자', title_en: 'Absolute Waking Rejector', hp: 95000, speed: 150, damage: 190, radius: 56, color: '#fb7185', exp: 16200, gold: 12000, bulletType: 'galaxy_star', bulletSpeed: 470, waves: 22, specialDesc: '극세사 이불 회오리', specialDesc_en: 'Microfiber Blanket Cyclone', dropItem: 'ring_lazy_god' },
    'boss_lucifer_fallen': { name: '타락천사 루시퍼', name_en: 'Fallen Angel Lucifer', title: '새벽의 별 묵시록', title_en: 'Morning Star of the Apocalypse', hp: 83000, speed: 135, damage: 170, radius: 50, color: '#831843', exp: 10328, gold: 8800, bulletType: 'galaxy_star', bulletSpeed: 440, waves: 18, specialDesc: '묵시록 종말의 십자가', specialDesc_en: 'Apocalypse Crucifix Blast', dropItem: 'potion_god' },
    'boss_primordial_overlord': { name: '태초의 신역 수호신 아르고스', name_en: 'Primordial Overlord Argos', title: '신역의 문을 지키는 태초의 집행관', title_en: 'Primordial Arbiter of the Sanctum Gates', hp: 99999, speed: 160, damage: 200, radius: 58, color: '#7c2d12', exp: 20250, gold: 15000, bulletType: 'galaxy_star', bulletSpeed: 480, waves: 24, specialDesc: '태초의 은하 심판 탄막', specialDesc_en: 'Primordial Galactic Judgment Barrage', dropItem: 'sword_lazy_god' }
};

// ============================================================================
// Multi-Phase Bosses & Tough Monsters (30 Raid Bosses System)
// ============================================================================
class Enemy {
    constructor(x, y, type = 'slime', id = null) {
        this.id = id || ('mob_' + Math.random().toString(36).slice(2, 9));
        this.x = x;
        this.y = y;
        this.type = type;
        this.active = true;
        this.stunTimer = 0;
        this.knockback = { vx: 0, vy: 0 };
        this.animTimer = Math.random() * 10;
        this.attackCooldown = 0;
        this.specialTimer = 0;
        this.phase = 1;
        this.summonCooldown = 0;
        this.flashTimer = 0;

        if (BOSS_DATA_DB[type]) {
            // Boss Configuration
            const b = BOSS_DATA_DB[type];
            this.isBoss = true;
            this.bossKey = type;
            this.bossData = b;
            this.bossName = (typeof tData === 'function' ? tData(b, 'name') : b.name);
            this.bossTitle = (typeof tData === 'function' ? tData(b, 'title') : b.title);
            this.radius = b.radius;
            this.hp = b.hp;
            this.maxHp = b.hp;
            this.speed = b.speed;
            this.damage = b.damage;
            this.expReward = b.exp;
            this.goldReward = b.gold;
            this.color = b.color;
            this.bulletType = b.bulletType;
            this.bulletSpeed = b.bulletSpeed;
            this.waves = b.waves;
            this.dropItem = b.dropItem;
        } else if (type === 'forest_goblin') {
            this.radius = 15; this.hp = 160; this.maxHp = 160; this.speed = 85; this.damage = 14; this.expReward = 10; this.goldReward = 4; this.color = '#65a30d';
        } else if (type === 'ent') {
            this.radius = 22; this.hp = 160; this.maxHp = 160; this.speed = 55; this.damage = 22; this.expReward = 10; this.goldReward = 4; this.color = '#14532d';
        } else if (type === 'zombie') {
            this.radius = 16; this.hp = 160; this.maxHp = 160; this.speed = 65; this.damage = 20; this.expReward = 22; this.goldReward = 8; this.color = '#475569';
        } else if (type === 'scorpion') {
            this.radius = 16; this.hp = 160; this.maxHp = 160; this.speed = 110; this.damage = 24; this.expReward = 12; this.goldReward = 12; this.color = '#b45309';
        } else if (type === 'mummy') {
            this.radius = 18; this.hp = 160; this.maxHp = 160; this.speed = 70; this.damage = 28; this.expReward = 42; this.goldReward = 15; this.color = '#ca8a04';
        } else if (type === 'drake') {
            this.radius = 22; this.hp = 160; this.maxHp = 160; this.speed = 100; this.damage = 36; this.expReward = 65; this.goldReward = 12; this.color = '#dc2626';
        } else if (type === 'frost_wolf') {
            this.radius = 16; this.hp = 160; this.maxHp = 160; this.speed = 135; this.damage = 32; this.expReward = 55; this.goldReward = 18; this.color = '#38bdf8';
        } else if (type === 'abyss_angler') {
            this.radius = 20; this.hp = 160; this.maxHp = 160; this.speed = 95; this.damage = 44; this.expReward = 12; this.goldReward = 8; this.color = '#0d9488';
        } else if (type === 'poison_spider') {
            this.radius = 18; this.hp = 160; this.maxHp = 160; this.speed = 120; this.damage = 48; this.expReward = 100; this.goldReward = 35; this.color = '#22c55e';
        } else if (type === 'void_walker') {
            this.radius = 22; this.hp = 160; this.maxHp = 160; this.speed = 125; this.damage = 56; this.expReward = 48; this.goldReward = 45; this.color = '#a855f7';
        } else if (type === 'celestial_avatar') {
            this.radius = 24; this.hp = 160; this.maxHp = 160; this.speed = 115; this.damage = 68; this.expReward = 65; this.goldReward = 16; this.color = '#fde047';
        } else if (type === 'skeleton') {
            this.radius = 16; this.hp = 160; this.maxHp = 160; this.speed = 100; this.damage = 18; this.expReward = 15; this.goldReward = 8; this.color = '#cbd5e1';
        } else if (type === 'archer') {
            this.radius = 15; this.hp = 160; this.maxHp = 160; this.speed = 85; this.damage = 15; this.expReward = 8; this.goldReward = 8; this.color = '#94a3b8';
        } else if (type === 'bat') {
            this.radius = 12; this.hp = 160; this.maxHp = 160; this.speed = 140; this.damage = 14; this.expReward = 12; this.goldReward = 4; this.color = '#ef4444';
        } else if (type === 'golem') {
            this.radius = 24; this.hp = 160; this.maxHp = 160; this.speed = 60; this.damage = 26; this.expReward = 48; this.goldReward = 18; this.color = '#b45309';
        } else if (type === 'wraith') {
            this.radius = 15; this.hp = 160; this.maxHp = 160; this.speed = 125; this.damage = 22; this.expReward = 38; this.goldReward = 16; this.color = '#6366f1';
        } else if (type === 'frost_wraith') {
            this.radius = 16; this.hp = 160; this.maxHp = 160; this.speed = 130; this.damage = 28; this.expReward = 52; this.goldReward = 22; this.color = '#38bdf8';
        } else if (type === 'frost_golem') {
            this.radius = 26; this.hp = 160; this.maxHp = 160; this.speed = 55; this.damage = 34; this.expReward = 72; this.goldReward = 28; this.color = '#0284c7';
        } else if (type === 'sentinel') {
            this.radius = 18; this.hp = 160; this.maxHp = 160; this.speed = 110; this.damage = 32; this.expReward = 90; this.goldReward = 32; this.color = '#facc15';
        } else if (type === 'valkyrie') {
            this.radius = 20; this.hp = 160; this.maxHp = 160; this.speed = 135; this.damage = 42; this.expReward = 42; this.goldReward = 40; this.color = '#fde047';
        } else {
            // Default Slime
            this.radius = 14; this.hp = 160; this.maxHp = 160; this.speed = 75; this.damage = 12; this.expReward = 8; this.goldReward = 3; this.color = '#15803d';
        }
    }

    update(dt, player, game) {
        if (!this.active) return;
        if (player && player.timeStopTimer > 0) {
            dt *= 0.25; // 75% Time Dilation Slowdown!
        }

        if (this.flashTimer > 0) this.flashTimer -= dt;

        // Guest Mode: Zone Authority executes AI and bullets, Guest updates visuals and local contact damage
        if (game && game.network && !game.network.isZoneHost) {
            this.animTimer += dt * 5;
            if (this.stunTimer > 0) this.stunTimer -= dt;
            if (this.attackCooldown > 0) this.attackCooldown -= dt;
            this.x += this.knockback.vx * dt;
            this.y += this.knockback.vy * dt;
            this.knockback.vx *= 0.85;
            this.knockback.vy *= 0.85;

            // Guest local melee contact damage check
            if (player && player.hp > 0 && this.attackCooldown <= 0) {
                const distToMe = Math.hypot(player.x - this.x, player.y - this.y);
                if (distToMe <= this.radius + player.radius) {
                    const angle = Math.atan2(player.y - this.y, player.x - this.x);
                    player.takeDamage(this.damage, Math.cos(angle) * 200, Math.sin(angle) * 200, game);
                    this.attackCooldown = 1.0;
                }
            }
            return;
        }

        this.animTimer += dt * 5;
        if (this.stunTimer > 0) this.stunTimer -= dt;
        if (this.attackCooldown > 0) this.attackCooldown -= dt;
        if (this.specialTimer > 0) this.specialTimer -= dt;
        if (this.summonCooldown > 0) this.summonCooldown -= dt;

        this.x += this.knockback.vx * dt;
        this.y += this.knockback.vy * dt;
        this.knockback.vx *= 0.85;
        this.knockback.vy *= 0.85;

        if (this.stunTimer > 0) return;

        // 🎯 멀티플레이 동적 어그로 타겟 선정: 현재 맵에 있는 가장 가까운 플레이어(본인 또는 파티원)를 추적
        let targetPlayer = (player && player.hp > 0) ? player : null;
        let minDist = targetPlayer ? Math.hypot(player.x - this.x, player.y - this.y) : Infinity;

        if (game && game.remotePlayers) {
            for (const id in game.remotePlayers) {
                const rp = game.remotePlayers[id];
                if (rp && rp.hp > 0 && (!rp.currentZone || rp.currentZone === game.currentZone)) {
                    const d = Math.hypot(rp.x - this.x, rp.y - this.y);
                    if (d < minDist) {
                        minDist = d;
                        targetPlayer = rp;
                    }
                }
            }
        }

        if (!targetPlayer) return;
        const distToPlayer = minDist;
        const aggroRange = this.isBoss ? 750 : 360;

        // Boss Specialized AI Pattern
        if (this.isBoss) {
            const hpRatio = this.maxHp > 0 ? this.hp / this.maxHp : 0;
            if (hpRatio <= 0.5 && this.phase === 1) {
                this.phase = 2;
                this.speed *= 1.25;
                this.damage = Math.round(this.damage * 1.2);
                sounds.playUltimate();
                game.camera.shake(0.9, 20);
                const isEn = (typeof getLanguage === 'function' && getLanguage() === 'en');
                const bName = (typeof tData === 'function' && BOSS_DATA_DB[this.type]) ? tData(BOSS_DATA_DB[this.type], 'name') : this.bossName;
                game.showNotification(isEn ? `⚡ [Enraged Awakening] ${bName} entered Phase 2!` : `⚡ [광폭화 각성] ${bName}이 2페이즈로 돌입했습니다!`);
                game.particles.spawn(this.x, this.y, this.color, 45, 220, 0.9, 8);
            }

            if (distToPlayer <= aggroRange) {
                // 1. Regular Spell Barrage
                if (this.attackCooldown <= 0) {
                    this.attackCooldown = this.phase === 2 ? 1.5 : 2.3;
                    sounds.playSwordBeam();
                    const angle = Math.atan2(targetPlayer.y - this.y, targetPlayer.x - this.x);
                    const waves = this.phase === 2 ? Math.round(this.waves * 1.5) : this.waves;
                    for (let i = 0; i < waves; i++) {
                        const a = this.phase === 2 ? (i / waves) * Math.PI * 2 : angle + (i - (waves - 1) / 2) * 0.22;
                        game.projectiles.push(new Projectile(this.x, this.y, Math.cos(a) * this.bulletSpeed, Math.sin(a) * this.bulletSpeed, this.damage * 0.85, 520, this.bulletType, false));
                    }
                }

                // 2. Boss Ultimate Special Skill
                if (this.specialTimer <= 0) {
                    this.specialTimer = this.phase === 2 ? 5.0 : 7.0;
                    sounds.playUltimate();
                    game.camera.shake(0.6, 14);
                    const isEn = (typeof getLanguage === 'function' && getLanguage() === 'en');
                    const bName = (typeof tData === 'function' && BOSS_DATA_DB[this.type]) ? tData(BOSS_DATA_DB[this.type], 'name') : this.bossName;
                    const specDesc = (typeof tData === 'function' && BOSS_DATA_DB[this.type]) ? tData(BOSS_DATA_DB[this.type], 'specialDesc') : BOSS_DATA_DB[this.type].specialDesc;
                    game.showNotification(isEn ? `⚠️ ${bName} casts [${specDesc}]!` : `⚠️ ${bName}의 [${specDesc}] 발동!`);
                    for (let i = 0; i < 6; i++) {
                        setTimeout(() => {
                            if (!this.active || !game.running) return;
                            const px = targetPlayer.x + (Math.random() * 160 - 80);
                            const py = targetPlayer.y + (Math.random() * 160 - 80);
                            game.particles.spawn(px, py, this.color, 24, 130, 0.6, 6);
                            if (player && Math.hypot(player.x - px, player.y - py) <= 60) {
                                player.takeDamage(Math.round(this.damage * 0.75), 0, 0, game);
                            }
                        }, i * 180);
                    }
                }

                const angle = Math.atan2(targetPlayer.y - this.y, targetPlayer.x - this.x);
                this.x += Math.cos(angle) * this.speed * dt;
                this.y += Math.sin(angle) * this.speed * dt;

                if (distToPlayer <= this.radius + targetPlayer.radius && this.attackCooldown <= 0.4) {
                    if (targetPlayer === player) {
                        player.takeDamage(this.damage, Math.cos(angle) * 350, Math.sin(angle) * 350, game);
                    }
                    this.attackCooldown = 1.1;
                }
            }
        } else {
            // Standard Monster AI
            if (distToPlayer <= aggroRange && distToPlayer > this.radius + targetPlayer.radius) {
                const angle = Math.atan2(targetPlayer.y - this.y, targetPlayer.x - this.x);
                const nx = this.x + Math.cos(angle) * this.speed * dt;
                const ny = this.y + Math.sin(angle) * this.speed * dt;
                if (!game.checkCollision(nx, this.y, this.radius)) this.x = nx;
                if (!game.checkCollision(this.x, ny, this.radius)) this.y = ny;
            } else if (distToPlayer > aggroRange) {
                // Ambient Roam AI when player is far away
                this.roamTimer = (this.roamTimer || Math.random() * 3) - dt;
                if (this.roamTimer <= 0) {
                    this.roamTimer = Math.random() * 3 + 2;
                    this.roamAngle = Math.random() * Math.PI * 2;
                    this.isRoaming = Math.random() < 0.6;
                }
                if (this.isRoaming) {
                    const rx = this.x + Math.cos(this.roamAngle) * (this.speed * 0.45) * dt;
                    const ry = this.y + Math.sin(this.roamAngle) * (this.speed * 0.45) * dt;
                    if (!game.checkCollision(rx, this.y, this.radius)) this.x = rx;
                    if (!game.checkCollision(this.x, ry, this.radius)) this.y = ry;
                }
            }

            if (distToPlayer <= this.radius + targetPlayer.radius && this.attackCooldown <= 0) {
                const angle = Math.atan2(targetPlayer.y - this.y, targetPlayer.x - this.x);
                if (targetPlayer === player) {
                    player.takeDamage(this.damage, Math.cos(angle) * 200, Math.sin(angle) * 200, game);
                }
                this.attackCooldown = 1.0;
            }
        }
    }

    getLocalizedBossName() {
        if (!this.isBoss) return this.bossName || '';
        const b = this.bossData || BOSS_DATA_DB[this.type];
        if (b && typeof tData === 'function') return tData(b, 'name');
        return this.bossName || '';
    }

    getLocalizedBossTitle() {
        if (!this.isBoss) return this.bossTitle || '';
        const b = this.bossData || BOSS_DATA_DB[this.type];
        if (b && typeof tData === 'function') return tData(b, 'title');
        return this.bossTitle || '';
    }

    takeDamage(amount, kx, ky, game, isCrit = false) {
        if (!this.active) return;
        this.hp -= amount;
        this.knockback.vx = kx;
        this.knockback.vy = ky;
        this.flashTimer = isCrit ? 0.08 : 0.05;

        sounds.playHit();
        if (game) {
            // Micro hit-stop only on critical strikes to keep 60fps fluid combat without lag
            if (isCrit && game.triggerHitStop) game.triggerHitStop(0.025);
            if (game.camera) game.camera.shake(isCrit ? 0.08 : 0.04, isCrit ? 3.5 : 1.5);
            if (game.particles) {
                game.particles.spawn(this.x, this.y, this.color, isCrit ? 6 : 3, isCrit ? 90 : 60, 0.22, isCrit ? 3.5 : 2.5);
                game.particles.spawnDamageNumber(this.x, this.y, `${amount}`, isCrit ? '#facc15' : '#ffffff', isCrit);
                const sparkAngle = Math.atan2(ky || 0, kx || 0);
                game.particles.spawnSlashSparks(this.x, this.y, sparkAngle, isCrit ? '#fde047' : '#ffffff', isCrit ? 4 : 2);
            }
        }

        if (this.hp <= 0) {
            this.active = false;
            sounds.playCoin();
            if (game && game.particles) {
                game.particles.spawn(this.x, this.y, this.color, 16, 140, 0.4, 5);
                game.particles.spawnSlashSparks(this.x, this.y, 0, '#fde047', 8);
            }
            if (game && game.onEnemyKilled) game.onEnemyKilled(this);
        }
    }

    render(ctx, isTargeted = false) {
        if (!this.active) return;

        ctx.save();
        ctx.translate(this.x, this.y);

        if (isTargeted) {
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([5, 4]);
            ctx.beginPath(); ctx.arc(0, 0, this.radius + 12, 0, Math.PI * 2); ctx.stroke();
            ctx.setLineDash([]);
        }

        // Drop Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
        ctx.beginPath();
        ctx.ellipse(0, this.radius * 0.75 + 4, this.radius * 1.1, this.radius * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        // Custom Visual Rendering based on Monster/Boss Type
        renderMonsterGraphic(ctx, this);

        // ⚡ Zero-Lag Instant White Flash Overlay on Hit
        if (this.flashTimer > 0) {
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * 1.05, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // HP Bar
        const barWidth = Math.max(28, this.radius * 2.2);
        const barHeight = this.isBoss ? 5 : 3.5;
        const hpPercent = this.maxHp > 0 ? Math.max(0, Math.min(1, this.hp / this.maxHp)) : 0;
        const barY = -this.radius - (this.isBoss ? 16 : 10);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(-barWidth / 2 - 1, barY - 1, barWidth + 2, barHeight + 2, 3);
        ctx.fill();

        ctx.fillStyle = this.isBoss ? '#facc15' : (hpPercent > 0.4 ? '#ef4444' : '#dc2626');
        ctx.beginPath();
        ctx.roundRect(-barWidth / 2, barY, barWidth * hpPercent, barHeight, 2);
        ctx.fill();

        // Boss Title Badge
        if (this.isBoss) {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 1;
            const bName = `👑 ${this.getLocalizedBossName()}`;
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            const tw = ctx.measureText(bName).width;
            ctx.beginPath();
            ctx.roundRect(-tw / 2 - 6, barY - 15, tw + 12, 13, 4);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#fde047';
            ctx.fillText(bName, 0, barY - 5);
        }

        ctx.restore();
    }
}
