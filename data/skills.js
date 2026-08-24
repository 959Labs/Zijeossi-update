// ============================================================================
// Skill Codex & Tooltips Database (4 Class Archetypes + Universal)
// ============================================================================

// Comprehensive Skill Codex Database & Multipliers (Tooltips)
// ============================================================================
const SKILL_TOOLTIPS = {
    'A': {
        name: '기본 공격 (Normal Attack)',
        key: '[A] / 좌클릭',
        icon: '⚔️',
        cost: '0 MP',
        cooldown: '0.08초',
        type: '물리 3단 콤보',
        mult: '1타 120% ➔ 2타 160% ➔ 3타 240% 치명타',
        desc: '가장 가까운 적을 향해 신속한 3단 베기 콤보를 시전합니다. 3타는 180도 광역 베기와 함께 치명타 피해를 입히며, 전설 무기 장착 시 고유 투사체(검기/얼음/별빛 등)가 함께 발사됩니다.',
        tip: '이동하면서 평타를 섞어 치면 적의 공격을 피하며 지속 딜을 넣을 수 있습니다.'
    },
    'Space': {
        name: '대시 / 무적 회피 (Dodge Dash)',
        key: '[Space]',
        icon: '💨',
        cost: '0 MP',
        cooldown: '0.55초',
        type: '특수 회피',
        mult: '0.32초간 완전 무적',
        desc: '바라보는 방향 또는 이동 방향으로 순간적으로 돌진합니다. 돌진 중 0.32초 동안 모든 적의 공격, 탄막, 광역 스킬을 100% 무시하고 통과합니다.',
        tip: '보스가 붉은 전조 모션이나 탄막을 날릴 때 타이밍 맞춰 회피하세요.'
    },
    'W': {
        name: '회오리 참격 (Whirlwind Slash)',
        key: '[W]',
        icon: '🌪️',
        cost: '20 MP',
        cooldown: '4.0초',
        type: '물리 전방위 광역',
        mult: '공격력의 320% 광역 피해',
        desc: '자신 주변 360도 전방위의 모든 적을 일격에 베어내고 넉백을 입힙니다. 다수의 잡몹이 몰려왔을 때 일망타진할 수 있는 최고의 광역기입니다.',
        tip: '숲 고블린이나 해골 떼에 둘러싸였을 때 즉시 사용하세요.'
    },
    'E': {
        name: '검기 방출 (Sword Beam)',
        key: '[E]',
        icon: '🗡️',
        cost: '15 MP',
        cooldown: '3.0초',
        type: '원거리 관통',
        mult: '공격력의 280% 관통 피해',
        desc: '검 끝에서 초고속 직선 검기를 날려 사거리 500px 내의 모든 적을 관통하여 타격합니다. 원거리 적이나 안전거리에서 보스를 견제하기에 최적입니다.',
        tip: '일렬로 서 있는 적들에게 쏘면 모든 적을 관통하여 피해를 줍니다.'
    },
    'S': {
        name: '방패 패링 (Shield Parry)',
        key: '[S]',
        icon: '🛡️',
        cost: '15 MP',
        cooldown: '5.0초',
        type: '방어 & 반사',
        mult: '1.0초간 피해 100% 무효화',
        desc: '1.0초 동안 방패를 세워 전방위 모든 공격을 완벽하게 튕겨내고(PARRY!), 0.5초 무적을 얻습니다.',
        tip: '보스의 강력한 단타 강타나 특수기를 패링하면 노데미지로 반격 찬스를 만듭니다.'
    },
    'D': {
        name: '대지 강타 (Earth Slam)',
        key: '[D]',
        icon: '💥',
        cost: '25 MP',
        cooldown: '7.0초',
        type: '광역 지진 & 기절',
        mult: '공격력의 420% 피해 + 2.5초 스턴',
        desc: '대지를 강하게 내리쳐 반경 110px에 지진 폭발을 일으킵니다. 강력한 420% 피해와 함께 범위 내 모든 적을 2.5초 동안 완전히 무력화(기절)시킵니다.',
        tip: '보스나 위험한 정예 몹을 스턴시킨 후 궁극기나 콤보 공격을 쏟아부으세요.'
    },
    'Q': {
        name: '검 폭풍 궁극기 (Blade Storm)',
        key: '[Q]',
        icon: '⚡',
        cost: '50 MP',
        cooldown: '16.0초',
        type: '궁극 연타 광역기',
        mult: '16연타 폭풍 베기 (총합 1,300+ 누적 딜)',
        desc: '각성한 지저씨의 힘을 해방하여 전방 200px 영역에 16번의 초고속 황금 참격을 난사합니다. 보스의 체력을 단숨에 깎아버리는 필살기입니다.',
        tip: 'D 스킬(대지 강타)로 보스를 스턴시킨 후 연계하면 16연타를 풀히트시킬 수 있습니다.'
    },
    'pot_1': {
        name: '체력 물약 (HP Potion)',
        key: '[1]',
        icon: '🧪',
        cost: '소모품',
        cooldown: '즉시 사용',
        type: '체력 회복',
        mult: 'HP +70 즉시 회복',
        desc: '마을 상인에게 구매하거나 몬스터/상자에서 획득할 수 있는 고농축 생명력 물약입니다.',
        tip: '체력이 50% 이하로 떨어지면 위험하니 미리 복용하세요.'
    },
    'pot_2': {
        name: '마나 물약 (MP Potion)',
        key: '[2]',
        icon: '💧',
        cost: '소모품',
        cooldown: '즉시 사용',
        type: '마나 회복',
        mult: 'MP +70 즉시 회복',
        desc: '스킬과 궁극기를 연속으로 쏟아부을 수 있도록 마나를 70 즉시 충전합니다.',
        tip: '궁극기(50 MP)와 스킬 콤보를 연속으로 쓸 때 사용하세요.'
    },
    'pot_3': {
        name: '전투 강화 물약 (Buff Potion)',
        key: '[3]',
        icon: '🔥',
        cost: '소모품',
        cooldown: '지속 18초',
        type: '전투 강화 버프',
        mult: '공격력 & 이동속도 +40% 증가',
        desc: '18초 동안 공격력과 이동속도를 비약적으로 상승시켜 먼치킨 화력을 냅니다.',
        tip: '레이드 보스전에 진입하기 직전에 마시면 보스를 순식간에 녹일 수 있습니다.'
    }
};

// 25+ Comprehensive Skill Library (4 Class Archetypes + Universal)
// ============================================================================
const SKILL_DB = {
    // === 1. ⚔️ WARRIOR (게으른 검사 전용 스킬) ===
    skill_warrior_slash: {
        id: 'skill_warrior_slash',
        classId: 'warrior',
        name: '십자 참격',
        icon: '⚔️',
        type: 'melee',
        typeName: '검사 물리연타',
        mpCost: 16,
        cd: 3.2,
        desc: '전방으로 2연속 X자 거대 검기를 날려 십자 파쇄 피해를 입힙니다.',
        dmgDesc: '공격력의 340% 십자 파쇄 피해',
        tip: '짧은 쿨다운으로 보스나 정예 몹에게 폭발적인 근접 딜을 넣습니다.'
    },
    skill_warrior_shield_charge: {
        id: 'skill_warrior_shield_charge',
        classId: 'warrior',
        name: '방패 돌진',
        icon: '🛡️',
        type: 'melee',
        typeName: '검사 돌진제어',
        mpCost: 18,
        cd: 4.5,
        desc: '전방으로 250px 초고속 돌진하여 경로 상의 적을 밀쳐내고 충돌 시 2초간 기절시킵니다.',
        dmgDesc: '공격력의 300% 피해 + 2초 스턴',
        tip: '적 진형을 붕괴시키거나 원거리 몬스터에게 순식간에 파고듭니다.'
    },
    skill_warrior_whirlwind: {
        id: 'skill_warrior_whirlwind',
        classId: 'warrior',
        name: '선풍 대검풍',
        icon: '🌪️',
        type: 'melee',
        typeName: '검사 회전이동',
        mpCost: 22,
        cd: 5.0,
        desc: '2초 동안 대검을 회전하며 자유롭게 이동하여 주변 적들에게 6연타 회전 베기를 가합니다.',
        dmgDesc: '공격력의 420% 연속 광역 피해 + 넉백',
        tip: '이동하면서 다수의 잡몹 떼를 믹서기처럼 분쇄할 수 있습니다.'
    },
    skill_warrior_earth_slam: {
        id: 'skill_warrior_earth_slam',
        classId: 'warrior',
        name: '대지 파쇄격',
        icon: '💥',
        type: 'melee',
        typeName: '검사 지진강타',
        mpCost: 26,
        cd: 6.5,
        desc: '지면을 대검으로 내리찍어 전방 3갈래 바위 지진파를 일으켜 적들을 공중에 띄우고 기절시킵니다.',
        dmgDesc: '공격력의 460% 피해 + 2.5초 기절',
        tip: '보스의 강력한 패턴을 끊어내는 데 탁월합니다.'
    },
    skill_warrior_ultimate: {
        id: 'skill_warrior_ultimate',
        classId: 'warrior',
        name: '천지개벽 참격폭풍',
        icon: '👑',
        type: 'ultimate',
        typeName: '검사 궁극기',
        mpCost: 50,
        cd: 15.0,
        desc: '황금빛 신성 대검기를 해방하여 화면 전체를 가르는 10연타 광역 참격 폭풍을 소환합니다.',
        dmgDesc: '공격력의 200% x 10타 (총 2,000% 초토화 피해)',
        tip: '보스전 및 대규모 웨이브에서 일발역전의 검사 전용 궁극기입니다.'
    },

    // === 2. 🏹 ARCHER (방구석 궁수 전용 스킬) ===
    skill_archer_rapid_fire: {
        id: 'skill_archer_rapid_fire',
        classId: 'archer',
        name: '속사 난사',
        icon: '🎯',
        type: 'ranged',
        typeName: '궁수 고속연사',
        mpCost: 18,
        cd: 3.5,
        desc: '전방으로 7연속 초고속 관통 화살을 부채꼴로 난사하여 적들을 벌집으로 만듭니다.',
        dmgDesc: '화살당 공격력 90% x 7발 (총 630% 피해)',
        tip: '보스를 향해 근거리에서 전탄 적중 시 폭발적인 데미지가 들어갑니다.'
    },
    skill_archer_wind_piercer: {
        id: 'skill_archer_wind_piercer',
        classId: 'archer',
        name: '바람의 관통 저격',
        icon: '🌪️',
        type: 'ranged',
        typeName: '궁수 초원거리',
        mpCost: 25,
        cd: 5.0,
        desc: '사거리 650px의 거대 바람 관통 화살을 발사합니다. 경로 상의 모든 적을 관통합니다.',
        dmgDesc: '공격력의 450% 초원거리 관통 피해 + 강한 넉백',
        tip: '일렬로 몰려오는 적들을 한 방에 관통 소탕하기에 최적입니다.'
    },
    skill_archer_frost_arrow: {
        id: 'skill_archer_frost_arrow',
        classId: 'archer',
        name: '서리 빙결 화살',
        icon: '❄️',
        type: 'ranged',
        typeName: '궁수 빙결제어',
        mpCost: 22,
        cd: 6.0,
        desc: '적중 시 폭발 반경 90px 내 모든 적을 얼어붙게 만들어 3초간 완전 빙결시킵니다.',
        dmgDesc: '공격력의 320% 냉기 피해 + 3초 동결',
        tip: '접근하는 위험한 몬스터를 얼려두고 안전거리에서 카이팅하세요.'
    },
    skill_archer_explosive_trap: {
        id: 'skill_archer_explosive_trap',
        classId: 'archer',
        name: '폭발 지뢰 덫',
        icon: '💣',
        type: 'ranged',
        typeName: '궁수 설치지뢰',
        mpCost: 20,
        cd: 4.5,
        desc: '발밑에 지뢰 덫을 설치합니다. 몬스터가 밟으면 즉시 폭발하여 반경 110px에 큰 피해를 줍니다.',
        dmgDesc: '공격력의 400% 화염 폭발 피해 + 넉백',
        tip: '도망치면서 경로에 덫을 깔아두면 쫓아오던 적들이 폭사합니다.'
    },
    skill_archer_ultimate: {
        id: 'skill_archer_ultimate',
        classId: 'archer',
        name: '유성우 폭격 화살비',
        icon: '🌟',
        type: 'ultimate',
        typeName: '궁수 궁극기',
        mpCost: 50,
        cd: 16.0,
        desc: '하늘로 신호탄을 쏘아 올려 화면 전체에 수백 발의 빛나는 관통 화살비를 쏟아붓습니다.',
        dmgDesc: '유성 화살당 110% x 20타 (총 2,200% 초토화 피해)',
        tip: '전 화면의 모든 몬스터를 일거에 섬멸하는 궁수의 최종 궁극기입니다.'
    },

    // === 3. 🪄 MAGE (누워있는 대마법사 전용 스킬) ===
    skill_mage_chain_lightning: {
        id: 'skill_mage_chain_lightning',
        classId: 'mage',
        name: '체인 라이트닝',
        icon: '⚡',
        type: 'magic',
        typeName: '마법사 연쇄전격',
        mpCost: 22,
        cd: 4.0,
        desc: '적과 적 사이를 최대 5회 연속 튕기며 감전시키는 고압 연쇄 번개를 방출합니다.',
        dmgDesc: '타격당 공격력의 240% 마법 피해 + 감전',
        tip: '흩어져 있는 몬스터 무리를 순식간에 일망타진합니다.'
    },
    skill_mage_arcane_singularity: {
        id: 'skill_mage_arcane_singularity',
        classId: 'mage',
        name: '비전 특이점',
        icon: '🌀',
        type: 'magic',
        typeName: '마법사 흡인제어',
        mpCost: 25,
        cd: 6.5,
        desc: '전방에 중력 특이점 구체를 소환하여 3.5초간 반경 130px 내 모든 적을 강하게 흡인 후 폭발합니다.',
        dmgDesc: '흡인 틱 피해 + 폭발 시 공격력의 360% 피해',
        tip: '적들을 한곳으로 모아놓고 메테오나 광역 스킬을 연계하세요.'
    },
    skill_mage_meteor: {
        id: 'skill_mage_meteor',
        classId: 'mage',
        name: '메테오 스트라이크',
        icon: '☄️',
        type: 'magic',
        typeName: '마법사 운석낙하',
        mpCost: 35,
        cd: 8.0,
        desc: '거대한 화염 운석을 소환 낙하시켜 반경 140px에 파괴적인 대폭발과 불바다를 생성합니다.',
        dmgDesc: '운석 충돌 520% + 용암 지대 초당 120% 지속 피해',
        tip: '보스의 거대한 히트박스에 직격 시키면 엄청난 폭딜을 냅니다.'
    },
    skill_mage_mana_shield: {
        id: 'skill_mage_mana_shield',
        classId: 'mage',
        name: '마나 실드',
        icon: '🛡️',
        type: 'magic',
        typeName: '마법사 방어막',
        mpCost: 15,
        cd: 10.0,
        desc: '6초간 받는 피해를 70% 감소시키는 비전 방어막을 칩니다. 흡수한 피해의 30%를 마나로 환원합니다.',
        dmgDesc: '6초간 피해 70% 흡수 & 30% 마나 환원',
        tip: '체력이 약한 마법사의 최강 생존기입니다.'
    },
    skill_mage_ultimate: {
        id: 'skill_mage_ultimate',
        classId: 'mage',
        name: '시공간 붕괴 블랙홀',
        icon: '🪐',
        type: 'ultimate',
        typeName: '마법사 궁극기',
        mpCost: 55,
        cd: 18.0,
        desc: '화면 중심에 초거대 암흑 블랙홀을 개방하여 전 맵의 모든 적을 빨아들여 압축 폭발시킵니다.',
        dmgDesc: '12연타 압축 후 대폭발 (총 2,400% 차원 파쇄 피해)',
        tip: '시련의 탑 고층 웨이브를 단 한 번에 정리하는 대마법사의 최종 비기입니다.'
    },

    // === 4. 🗡️ ROGUE (드러누운 암살자 전용 스킬) ===
    skill_rogue_shadow_stealth: {
        id: 'skill_rogue_shadow_stealth',
        classId: 'rogue',
        name: '그림자 은신',
        icon: '💨',
        type: 'melee',
        typeName: '암살자 완전은신',
        mpCost: 15,
        cd: 6.0,
        desc: '3초간 적에게 감지되지 않는 완전 투명 은신 및 이속 +80 상태가 되며 첫 공격이 100% 치명타 2.8배로 발동합니다.',
        dmgDesc: '3초 은신 + 이속 +80 + 첫 공격 280% 치명타',
        tip: '보스의 배후로 안전하게 접근하여 기습할 때 필수적입니다.'
    },
    skill_rogue_shuriken_fan: {
        id: 'skill_rogue_shuriken_fan',
        classId: 'rogue',
        name: '표창 부메랑',
        icon: '🥷',
        type: 'ranged',
        typeName: '암살자 왕복표창',
        mpCost: 18,
        cd: 3.8,
        desc: '5개의 회전 독 표창을 부채꼴로 투척합니다. 표창이 궤도를 돌아 복귀하며 왕복 2회 타격합니다.',
        dmgDesc: '표창당 60% x 5개 x 왕복 2회 (총 600% 피해)',
        tip: '중거리에서 안정적으로 독 피해를 꽂아 넣을 수 있습니다.'
    },
    skill_rogue_fatal_strike: {
        id: 'skill_rogue_fatal_strike',
        classId: 'rogue',
        name: '출혈 급소 찌르기',
        icon: '🩸',
        type: 'melee',
        typeName: '암살자 급소암습',
        mpCost: 22,
        cd: 5.5,
        desc: '적의 등 뒤로 순간이동하여 급소를 베어냅니다. 즉발 피해와 함께 5초간 치명적인 출혈을 유발합니다.',
        dmgDesc: '즉발 380% + 5초간 매초 70% 출혈 피해',
        tip: '체력이 많은 엘리트 몹이나 보스에게 출혈 디버프를 중첩시키세요.'
    },
    skill_rogue_blade_fan: {
        id: 'skill_rogue_blade_fan',
        classId: 'rogue',
        name: '칼날 폭풍 춤',
        icon: '🌪️',
        type: 'melee',
        typeName: '암살자 전방위난사',
        mpCost: 20,
        cd: 4.2,
        desc: '자신 주변 360도 전방위로 16개의 암살 단검을 고속 난사하여 반경 100px 내 적을 일망타진합니다.',
        dmgDesc: '공격력의 360% 전방위 관통 피해',
        tip: '다수의 적에게 둘러싸였을 때 순식간에 전멸시킵니다.'
    },
    skill_rogue_ultimate: {
        id: 'skill_rogue_ultimate',
        classId: 'rogue',
        name: '그림자 분신 환영살',
        icon: '🌑',
        type: 'ultimate',
        typeName: '암살자 궁극기',
        mpCost: 50,
        cd: 15.0,
        desc: '3개의 잔영 분신을 소환하여 전 맵의 적들에게 사방에서 초고속 15연타 잔영 난무를 펼칩니다.',
        dmgDesc: '15연타 초고속 암살 난무 (총 2,100% 치명타 피해)',
        tip: '시전 중 완전 무적 상태로 화면 내 모든 적을 난도질합니다.'
    },

    // === 5. ✨ UNIVERSAL & LEGACY SKILLS ===
    skill_basic: {
        id: 'skill_basic',
        classId: 'all',
        name: '나태의 기본 공격',
        icon: '⚔️',
        type: 'melee',
        typeName: '공용 평타',
        mpCost: 0,
        cd: 0,
        desc: '장착한 무기에 따라 검(3단베기), 활(관통화살), 지팡이(3갈래유도탄), 단검(5연타)으로 자동 분기됩니다.',
        dmgDesc: '무기군별 고유 콤보 및 투사체 발사 (0 MP 소모)',
        tip: '모든 공격의 기본이며 마나 소모가 전혀 없습니다.'
    },
    skill_blessing: {
        id: 'skill_blessing',
        classId: 'all',
        name: '나태의 가호',
        icon: '✨',
        type: 'buff',
        typeName: '공용 버프',
        mpCost: 25,
        cd: 12.0,
        desc: '10초간 잠시 힘을 내어 이동속도 +30%, 치명타 확률 +30% 버프를 얻습니다.',
        dmgDesc: '10초간 이속 +30%, 크리티컬 100% 강화',
        tip: '보스를 몰아치거나 빠르게 이동할 때 켜두세요.'
    },
    skill_prayer: {
        id: 'skill_prayer',
        classId: 'all',
        name: '안식의 치유 기도',
        icon: '💖',
        type: 'buff',
        typeName: '공용 치유',
        mpCost: 35,
        cd: 14.0,
        desc: '마음을 가다듬고 즉시 최대 체력의 35%를 회복하며 모든 해로운 상태이상을 정화합니다.',
        dmgDesc: '최대 HP 35% 즉시 회복',
        tip: '물약이 떨어졌거나 급격한 위기 상황에서 유용한 생존기입니다.'
    },
    skill_time_stop: {
        id: 'skill_time_stop',
        classId: 'all',
        name: '나태의 영역: 시간 감속',
        icon: '⏳',
        type: 'ultimate',
        typeName: '공용 시간제어',
        mpCost: 45,
        cd: 18.0,
        desc: '3.5초 동안 자신을 제외한 필드 내 모든 몬스터와 투사체의 시간을 80% 감속시킵니다.',
        dmgDesc: '3.5초간 전장 전체 80% 슬로우',
        tip: '복잡한 보스 탄막 패턴을 유유히 피하고 일방적으로 공격하세요.'
    },
    skill_whirlwind: { id: 'skill_whirlwind', classId: 'warrior', name: '회오리 참격', icon: '🌪️', type: 'melee', typeName: '검사 회전', mpCost: 18, cd: 4.0, desc: '360도 반경으로 회전 베기.', dmgDesc: '320% 광역 피해', tip: '검사 스킬' },
    skill_sword_beam: { id: 'skill_sword_beam', classId: 'warrior', name: '초승달 검기', icon: '🗡️', type: 'ranged', typeName: '검사 검기', mpCost: 15, cd: 2.8, desc: '직선 검기 발사.', dmgDesc: '280% 관통 피해', tip: '검사 스킬' },
    skill_parry: { id: 'skill_parry', classId: 'warrior', name: '신성 방패 카운터', icon: '🛡️', type: 'defense', typeName: '검사 방어', mpCost: 15, cd: 5.0, desc: '방패 패링 반격.', dmgDesc: '200% 반격', tip: '검사 스킬' },
    skill_smash: { id: 'skill_smash', classId: 'warrior', name: '지면 분쇄 강타', icon: '💥', type: 'melee', typeName: '검사 강타', mpCost: 24, cd: 6.0, desc: '지면 강타 기절.', dmgDesc: '420% 피해', tip: '검사 스킬' },
    skill_ultimate: { id: 'skill_ultimate', classId: 'warrior', name: '각성: 벼락 폭풍', icon: '⚡', type: 'ultimate', typeName: '검사 궁극기', mpCost: 50, cd: 15.0, desc: '10연타 번개 폭풍.', dmgDesc: '1800% 피해', tip: '검사 궁극기' },
    skill_frost_nova: { id: 'skill_frost_nova', classId: 'mage', name: '프로스트 노바', icon: '❄️', type: 'magic', typeName: '마법사 빙결', mpCost: 22, cd: 7.0, desc: '냉기 폭발 빙결.', dmgDesc: '250% 피해', tip: '마법사 스킬' },
    skill_fireball: { id: 'skill_fireball', classId: 'mage', name: '안락의 파이어볼', icon: '🔥', type: 'magic', typeName: '마법사 화염', mpCost: 20, cd: 4.5, desc: '화염 구체 폭발.', dmgDesc: '350% 피해', tip: '마법사 스킬' },
    skill_shadow_step: { id: 'skill_shadow_step', classId: 'rogue', name: '그림자 순간이동 습격', icon: '👤', type: 'melee', typeName: '암살자 암습', mpCost: 20, cd: 5.5, desc: '등 뒤 기습.', dmgDesc: '300% 피해', tip: '암살자 스킬' }
};
