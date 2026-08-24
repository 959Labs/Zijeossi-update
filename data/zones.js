// ============================================================================
// Zones & Continents Configuration Database
// ============================================================================

const ZONE_THEME_COLORS = {'village': '#4ade80', 'forest': '#22c55e', 'dungeon_b1': '#6366f1', 'dungeon_b2': '#f97316', 'dungeon_b3': '#0ea5e9', 'graveyard': '#a855f7', 'desert': '#eab308', 'oasis_town': '#f59e0b', 'gold_crypt': '#facc15', 'dragon_nest': '#ef4444', 'frozen_tundra': '#38bdf8', 'frost_camp': '#38bdf8', 'ocean_trench': '#06b6d4', 'blood_citadel': '#e11d48', 'citadel_sanctuary': '#f43f5e', 'swamp': '#84cc16', 'shadow_realm': '#8b5cf6', 'heaven_altar': '#fbbf24', 'sky_haven': '#fde047', 'god_sanctuary': '#ec4899', 'lazy_paradise': '#f472b6', 'crystal_cave': '#c084fc', 'ancient_ruins': '#94a3b8', 'astral_void': '#a21caf'};

function getZoneTheme(zoneKey) {
    const color = ZONE_THEME_COLORS[zoneKey] || '#c084fc';
    const name = (typeof ZONE_CONFIG !== 'undefined' && ZONE_CONFIG[zoneKey]) ? ZONE_CONFIG[zoneKey].name : '미지의 차원';
    return { name: name, color: color };
}

// 15 Continents / Zones Configuration Database
// ============================================================================
const ZONE_CONFIG = {
    'village': {
        name: '🌲 평화로운 시작의 마을',
        sub: '장로와 대장장이, 상인, 푹신한 침대가 있는 안전한 모험의 안식처입니다.',
        tile: 'grass',
        level: 'Lv. 1 (안전 마을)',
        isSafe: true,
        mobs: [],
        bosses: [],
        portals: [
            { to: 'forest', x: 3600, y: 2000, name: '요정의 비취 숲' },
            { to: 'dungeon_b1', x: 500, y: 500, name: '고대 미궁 B1' },
            { to: 'trial_tower', x: 2100, y: 1500, name: '🗼 무한의 시련 탑' }
        ]
    },
    'trial_tower': {
        name: '🗼 무한의 시련 탑 (Tower of Trial)',
        sub: '1층부터 50층까지 몬스터 웨이브를 격파하고 시련의 증표와 전설 직업 무기를 쟁취하세요.',
        tile: 'crystal',
        level: 'Lv. 10 ~ 99 (무한 챌린지)',
        isSafe: false,
        mobs: [],
        bosses: [],
        portals: [{ to: 'village', x: 2100, y: 2600, name: '시작의 마을 (탈출)' }]
    },
    'forest': {
        name: '🌿 요정의 비취 숲',
        sub: '고블린 부족, 흑표범, 고대 엔트가 서식하는 거대한 숲입니다.',
        tile: 'forest',
        level: 'Lv. 5 ~ 15',
        mobs: ['forest_goblin', 'ent'],
        bosses: ['boss_goblin_warlord', 'boss_shadow_panther', 'boss_treant_ancient'],
        portals: [{ to: 'village', x: 450, y: 2000, name: '시작의 마을' }, { to: 'graveyard', x: 3600, y: 2000, name: '망자의 묘지' }, { to: 'crystal_cave', x: 2000, y: 3600, name: '수정 동굴' }]
    },
    'dungeon_b1': {
        name: '🌀 고대 미궁 던전 B1',
        sub: '해골 군단, 가고일 로드, 암흑 기사가 도사리는 지하 미궁입니다.',
        tile: 'dungeon',
        level: 'Lv. 15 ~ 25',
        mobs: ['archer', 'bat', 'skeleton'],
        bosses: ['boss_dark_knight', 'boss_gargoyle_stone', 'boss_skeleton_general'],
        portals: [{ to: 'village', x: 500, y: 500, name: '시작의 마을' }, { to: 'dungeon_b2', x: 3500, y: 3500, name: '화염 심연 B2' }]
    },
    'graveyard': {
        name: '🪦 망자의 안식처 묘지',
        sub: '사신 타나토스, 흡혈귀 카밀라, 비명의 밴시가 지배하는 묘역입니다.',
        tile: 'graveyard',
        level: 'Lv. 25 ~ 35',
        mobs: ['zombie', 'wraith'],
        bosses: ['boss_reaper', 'boss_blood_count', 'boss_banshee_queen'],
        portals: [{ to: 'forest', x: 450, y: 2000, name: '비취 숲' }, { to: 'oasis_town', x: 3600, y: 2000, name: '오아시스 마을' }]
    },
    'oasis_town': {
        name: '🏜️ 사막 오아시스 안식처',
        sub: '사막 횡단 상단과 연금술사, 텐트 침대가 있는 평화로운 오아시스 쉼터입니다.',
        tile: 'sand',
        level: 'Lv. 35 (안전 마을)',
        isSafe: true,
        mobs: [],
        bosses: [],
        portals: [{ to: 'graveyard', x: 450, y: 2000, name: '망자의 묘지' }, { to: 'desert', x: 3600, y: 2000, name: '황혼의 사막' }]
    },
    'desert': {
        name: '🏜️ 황혼의 신기루 사막',
        sub: '샌드웜, 전갈 여제, 아누비스가 도사리는 죽음의 사막입니다.',
        tile: 'sand',
        level: 'Lv. 35 ~ 45',
        mobs: ['scorpion', 'mummy'],
        bosses: ['boss_sand_worm', 'boss_scorpion_empress', 'boss_anubis_shadow'],
        portals: [{ to: 'oasis_town', x: 450, y: 2000, name: '오아시스 마을' }, { to: 'pyramid', x: 3600, y: 2000, name: '파라오의 영묘' }]
    },
    'crystal_cave': {
        name: '💎 신비의 수정 광산 동굴',
        sub: '자수정 거신과 비취 와이번이 잠든 빛나는 광맥 동굴입니다.',
        tile: 'crystal',
        level: 'Lv. 40 ~ 50',
        mobs: ['bat', 'golem'],
        bosses: ['boss_crystal_colossus', 'boss_emerald_dragon'],
        portals: [{ to: 'forest', x: 2000, y: 450, name: '비취 숲' }, { to: 'ancient_ruins', x: 3600, y: 3600, name: '고대 거신 유적' }]
    },
    'pyramid': {
        name: '🏛️ 고대 파라오의 영묘',
        sub: '황금 파라오 투탕카멘과 스핑크스의 수수께끼 영묘입니다.',
        tile: 'gold_crypt',
        level: 'Lv. 45 ~ 55',
        mobs: ['mummy', 'golem'],
        bosses: ['boss_pharaoh_curse', 'boss_sphinx_guardian'],
        portals: [{ to: 'desert', x: 450, y: 2000, name: '황혼 사막' }, { to: 'dungeon_b2', x: 3500, y: 3500, name: '화염 심연 B2' }]
    },
    'dungeon_b2': {
        name: '🌋 화염 심연 던전 B2',
        sub: '마그마 베히모스, 켈베로스, 지옥불 군주의 화염 지옥입니다.',
        tile: 'magma',
        level: 'Lv. 55 ~ 65',
        mobs: ['golem', 'wraith'],
        bosses: ['boss_magma_behemoth', 'boss_hellhound_cerberus', 'boss_inferno_lord'],
        portals: [{ to: 'dungeon_b1', x: 500, y: 500, name: '미궁 B1' }, { to: 'dragon_nest', x: 3500, y: 3500, name: '화룡의 둥지' }]
    },
    'dragon_nest': {
        name: '🐲 불타는 화룡의 둥지',
        sub: '화룡 이그니스, 암흑 흑룡 칼라미티, 고대룡 파브니르의 둥지입니다.',
        tile: 'volcano',
        level: 'Lv. 65 ~ 75',
        mobs: ['drake', 'wraith'],
        bosses: ['boss_fire_dragon', 'boss_black_dragon', 'boss_elder_wyrm'],
        portals: [{ to: 'dungeon_b2', x: 500, y: 500, name: '화염 심연 B2' }, { to: 'frost_camp', x: 3500, y: 3500, name: '설원 전진 기지' }]
    },
    'frost_camp': {
        name: '❄️ 설원 모닥불 전진 기지',
        sub: '방한구 대장장이와 온돌 모닥불, 주막 침대가 있는 따뜻한 설원 전진 기지입니다.',
        tile: 'snow',
        level: 'Lv. 75 (안전 마을)',
        isSafe: true,
        mobs: [],
        bosses: [],
        portals: [{ to: 'dragon_nest', x: 500, y: 500, name: '화룡의 둥지' }, { to: 'frozen_tundra', x: 3500, y: 3500, name: '혹한의 설원' }]
    },
    'ancient_ruins': {
        name: '🏛️ 고대 거신들의 유적지',
        sub: '고대 거신 골리앗과 태양 전차의 환영이 지키는 천공 유적입니다.',
        tile: 'ruins',
        level: 'Lv. 70 ~ 80',
        mobs: ['sentinel', 'golem'],
        bosses: ['boss_colossus_goliath', 'boss_chariot_phantom'],
        portals: [{ to: 'crystal_cave', x: 450, y: 450, name: '수정 동굴' }, { to: 'frozen_tundra', x: 3600, y: 3600, name: '빙하 설원' }]
    },
    'frozen_tundra': {
        name: '❄️ 혹한의 빙하 설원',
        sub: '빙하 예티 킹, 늑대왕 펜리르, 얼음 여왕의 영구동토 빙원입니다.',
        tile: 'snow',
        level: 'Lv. 75 ~ 85',
        mobs: ['frost_wolf', 'frost_wraith'],
        bosses: ['boss_frost_yeti', 'boss_blizzard_fenrir', 'boss_ice_queen'],
        portals: [{ to: 'frost_camp', x: 500, y: 500, name: '설원 전진 기지' }, { to: 'dungeon_b3', x: 3500, y: 3500, name: '영구동토 감옥 B3' }]
    },
    'dungeon_b3': {
        name: '🧊 얼음 영구동토 감옥 B3',
        sub: '서리한의 리치 킹과 빙룡 신드라고사가 잠든 빙하 감옥입니다.',
        tile: 'frost',
        level: 'Lv. 85 ~ 95',
        mobs: ['frost_golem', 'frost_wraith'],
        bosses: ['boss_lich_king', 'boss_frost_dragon'],
        portals: [{ to: 'frozen_tundra', x: 500, y: 500, name: '빙하 설원' }, { to: 'abyss_trench', x: 3500, y: 3500, name: '심해 해구' }]
    },
    'abyss_trench': {
        name: '🌊 심연의 해저 해구',
        sub: '크라켄, 세이렌 퀸, 대양의 지배자 레비아탄의 심해입니다.',
        tile: 'ocean_trench',
        level: 'Lv. 95 ~ 105',
        mobs: ['abyss_angler', 'golem'],
        bosses: ['boss_kraken_tentacle', 'boss_siren_abyss', 'boss_leviathan'],
        portals: [{ to: 'dungeon_b3', x: 500, y: 500, name: '영구동토 B3' }, { to: 'citadel_sanctuary', x: 3500, y: 3500, name: '성채 비밀 은신처' }]
    },
    'citadel_sanctuary': {
        name: '🏰 성채 기사단 비밀 은신처',
        sub: '성기사단 보급관과 피난민들이 모여 휴식하는 안전한 은신처입니다.',
        tile: 'blood_castle',
        level: 'Lv. 105 (안전 쉼터)',
        isSafe: true,
        mobs: [],
        bosses: [],
        portals: [{ to: 'abyss_trench', x: 500, y: 500, name: '심해 해구' }, { to: 'blood_citadel', x: 3500, y: 3500, name: '흡혈귀 성채' }]
    },
    'blood_citadel': {
        name: '🏰 진홍빛 흡혈귀 성채',
        sub: '흡혈귀 황제 블라드 3세와 진홍 핏빛룡이 군림하는 피의 성채입니다.',
        tile: 'blood_castle',
        level: 'Lv. 100 ~ 110',
        mobs: ['zombie', 'wraith'],
        bosses: ['boss_vampire_emperor', 'boss_blood_dragon'],
        portals: [{ to: 'citadel_sanctuary', x: 500, y: 500, name: '기사단 은신처' }, { to: 'poison_swamp', x: 3500, y: 3500, name: '맹독 늪지' }]
    },
    'poison_swamp': {
        name: '☣️ 맹독의 부패 늪지대',
        sub: '구두룡 히드라와 역병 군주 벨제붑이 숨쉬는 맹독의 늪입니다.',
        tile: 'swamp',
        level: 'Lv. 105 ~ 115',
        mobs: ['poison_spider', 'slime'],
        bosses: ['boss_hydra_venom', 'boss_toxic_plague'],
        portals: [{ to: 'blood_citadel', x: 500, y: 500, name: '흡혈귀 성채' }, { to: 'shadow_realm', x: 3500, y: 3500, name: '그림자 차원' }]
    },
    'shadow_realm': {
        name: '🌌 암흑 그림자 차원',
        sub: '공허 추적자 카직스, 혼돈의 크툴루스, 그림자 군주 아시본의 암흑계입니다.',
        tile: 'void',
        level: 'Lv. 115 ~ 125',
        mobs: ['void_walker', 'wraith'],
        bosses: ['boss_void_stalker', 'boss_chaos_aberration', 'boss_shadow_monarch'],
        portals: [{ to: 'poison_swamp', x: 500, y: 500, name: '맹독 늪지' }, { to: 'sky_haven', x: 3500, y: 3500, name: '천공의 구름 안식처' }]
    },
    'sky_haven': {
        name: '⚡ 천공의 구름 안식처',
        sub: '천사의 축복과 치유의 성수, 황금빛 침대가 놓인 지고의 쉼터입니다.',
        tile: 'celestial',
        level: 'Lv. 125 (안전 성소)',
        isSafe: true,
        mobs: [],
        bosses: [],
        portals: [{ to: 'shadow_realm', x: 500, y: 500, name: '그림자 차원' }, { to: 'heaven_altar', x: 3500, y: 3500, name: '천공 판테온' }]
    },
    'heaven_altar': {
        name: '⚡ 천공의 판테온 제단',
        sub: '발키리 브륀힐트, 대천사 우리엘, 심판자 세라핌의 성역입니다.',
        tile: 'celestial',
        level: 'Lv. 125 ~ 140',
        mobs: ['sentinel', 'valkyrie'],
        bosses: ['boss_valkyrie_prime', 'boss_archangel_uriel', 'boss_seraphim'],
        portals: [{ to: 'sky_haven', x: 500, y: 500, name: '천공 안식처' }, { to: 'astral_void', x: 3500, y: 3500, name: '성간 공허' }]
    },
    'astral_void': {
        name: '🌌 시공간 성간 공허',
        sub: '성간 포식자 네뷸라와 시공의 지배자 크로노스의 우주 공간입니다.',
        tile: 'astral',
        level: 'Lv. 130 ~ 145',
        mobs: ['void_walker', 'sentinel'],
        bosses: ['boss_astral_devourer', 'boss_time_chronos'],
        portals: [{ to: 'heaven_altar', x: 500, y: 500, name: '천공 제단' }, { to: 'god_sanctuary', x: 3500, y: 3500, name: '태초의 신역' }]
    },
    'god_sanctuary': {
        name: '👑 태초의 신역 (성소 제단)',
        sub: '타락천사 루시퍼와 신역의 문을 지키는 [태초의 수호신 아르고스]의 성소입니다.',
        tile: 'cosmic',
        level: 'Lv. 140 ~ MAX',
        mobs: ['celestial_avatar', 'sentinel'],
        bosses: ['boss_lucifer_fallen', 'boss_primordial_overlord'],
        portals: [{ to: 'astral_void', x: 500, y: 500, name: '성간 공허' }, { to: 'lazy_paradise', x: 3500, y: 3500, name: '나태 낙원' }]
    },
    'lazy_paradise': {
        name: '🛌 꿈속의 극세사 나태 낙원',
        sub: '모르페우스와 온수매트 대왕 슬리퍼가 지키는 궁극의 영원한 수면 낙원입니다.',
        tile: 'paradise',
        level: 'Lv. 150 ~ MAX',
        mobs: ['slime', 'celestial_avatar'],
        bosses: ['boss_dream_weaver', 'boss_pillow_king'],
        portals: [{ to: 'god_sanctuary', x: 500, y: 500, name: '태초의 신역' }, { to: 'village', x: 3500, y: 3500, name: '시작의 마을' }]
    }
};
