// ============================================================================
// Item Codex Database (Weapons, Armors, Accessories, Consumables, Specialties)
// ============================================================================

const ITEM_DB = {
    // === 1. Weapons (4 Class Archetypes: Sword, Bow, Staff, Dagger) ===
    // ⚔️ 1-A. Swords (게으른 검사 - Warrior)
    'sword_iron': { id: 'sword_iron', name: '기사의 강철검', slot: 'weapon', weaponType: 'sword', rarity: 'rare', icon: '🗡️', atk: 15, desc: '단단하게 벼려낸 기사용 검 (공격력 +15)', price: 100, sellPrice: 50 },
    'sword_emerald': { id: 'sword_emerald', name: '요정의 비취 검', slot: 'weapon', weaponType: 'sword', rarity: 'rare', icon: '🌿', atk: 25, desc: '비취 숲 엘프의 정기가 서린 검 (공격력 +25)', price: 220, sellPrice: 110 },
    'sword_shadow': { id: 'sword_shadow', name: '망령의 그림자 도', slot: 'weapon', weaponType: 'sword', rarity: 'rare', icon: '💀', atk: 38, desc: '묘지의 원혼을 베는 영혼의 검 (공격력 +38)', price: 380, sellPrice: 190 },
    'sword_sand': { id: 'sword_sand', name: '파라오의 황금 사브르', slot: 'weapon', weaponType: 'sword', rarity: 'epic', icon: '🏜️', atk: 52, desc: '사막의 모래폭풍을 부르는 황금 곡도 (공격력 +52)', price: 620, sellPrice: 310 },
    'sword_flame': { id: 'sword_flame', name: '불꽃의 룬 블레이드', slot: 'weapon', weaponType: 'sword', rarity: 'epic', icon: '🔥', atk: 68, desc: '마그마 심연의 화염 룬이 깃든 대검 (공격력 +68)', price: 900, sellPrice: 450 },
    'sword_dragon': { id: 'sword_dragon', name: '용기사의 드래곤 슬레이어', slot: 'weapon', weaponType: 'sword', rarity: 'epic', icon: '🐉', atk: 88, desc: '고룡의 숨결이 깃든 궁극의 대검 (공격력 +88)', price: 1350, sellPrice: 670 },
    'sword_frost': { id: 'sword_frost', name: '서리한 프로스트모어', slot: 'weapon', weaponType: 'sword', rarity: 'epic', icon: '❄️', atk: 110, desc: '절대영도의 한기가 서린 빙하의 마검 (공격력 +110)', price: 1900, sellPrice: 950 },
    'sword_abyss': { id: 'sword_abyss', name: '심해의 레비아탄 삼지창', slot: 'weapon', weaponType: 'sword', rarity: 'legendary', icon: '🔱', atk: 140, desc: '심해의 해구를 지배하는 대양의 삼지창 (공격력 +140)', price: 2700, sellPrice: 1350 },
    'sword_venom': { id: 'sword_venom', name: '히드라의 맹독 아기토', slot: 'weapon', weaponType: 'sword', rarity: 'legendary', icon: '🐍', atk: 175, desc: '맹독 늪지대 구두룡의 맹독 이빨 검 (공격력 +175)', price: 3800, sellPrice: 1900 },
    'sword_void': { id: 'sword_void', name: '공허 군주의 카오스 엣지', slot: 'weapon', weaponType: 'sword', rarity: 'legendary', icon: '🌌', atk: 220, desc: '암흑 차원을 가르는 공허의 낫 (공격력 +220)', price: 5200, sellPrice: 2600 },
    'sword_celestial': { id: 'sword_celestial', name: '천공의 심판검 세라핌', slot: 'weapon', weaponType: 'sword', rarity: 'legendary', icon: '⚡', atk: 280, desc: '신들의 제단에서 강림한 궁극의 빛의 검 (공격력 +280)', price: 7500, sellPrice: 3750 },
    'sword_lazy_god': { id: 'sword_lazy_god', name: '침대베개 신검 (게으른 자의 일격)', slot: 'weapon', weaponType: 'sword', rarity: 'legendary', icon: '🛌', atk: 450, desc: '각성했지만 이불 밖으로 나가기 싫은 신의 일격검 (공격력 +450)', price: 15000, sellPrice: 7500 },
    'sword_dragon_overlord': { id: 'sword_dragon_overlord', name: '패왕의 용신검 [바하무트]', slot: 'weapon', weaponType: 'sword', rarity: 'legendary', icon: '🐉', atk: 340, desc: '시련의 탑을 정복한 자만이 쥘 수 있는 패왕의 대검 (공격력 +340)', price: 9500, sellPrice: 4750, trialPrice: 90 },

    // 🏹 1-B. Bows (방구석 궁수 - Archer)
    'bow_wooden': { id: 'bow_wooden', name: '초심자의 단궁', slot: 'weapon', weaponType: 'bow', rarity: 'common', icon: '🏹', atk: 14, desc: '초보 사냥꾼이 사용하는 가벼운 단궁 (공격력 +14)', price: 90, sellPrice: 45 },
    'bow_hunter': { id: 'bow_hunter', name: '사냥꾼의 컴포짓 보우', slot: 'weapon', weaponType: 'bow', rarity: 'rare', icon: '🏹', atk: 28, desc: '맹수를 제압하는 강력한 장궁 (공격력 +28)', price: 240, sellPrice: 120 },
    'bow_elven_wind': { id: 'bow_elven_wind', name: '엘프의 바람 관통궁', slot: 'weapon', weaponType: 'bow', rarity: 'epic', icon: '🍃', atk: 60, desc: '바람을 가르고 적을 관통하는 요정의 활 (공격력 +60)', price: 850, sellPrice: 425 },
    'bow_magma_flare': { id: 'bow_magma_flare', name: '작열의 화염 폭풍궁', slot: 'weapon', weaponType: 'bow', rarity: 'epic', icon: '🔥', atk: 95, desc: '화염 화살을 연사하는 마그마 활 (공격력 +95)', price: 1500, sellPrice: 750 },
    'bow_wind_sniper': { id: 'bow_wind_sniper', name: '바람의 저격궁 [천벌]', slot: 'weapon', weaponType: 'bow', rarity: 'legendary', icon: '🌪️', atk: 190, desc: '초원거리에서 적을 꿰뚫는 바람의 신궁 (공격력 +190)', price: 4200, sellPrice: 2100, trialPrice: 45 },
    'bow_celestial_judgment': { id: 'bow_celestial_judgment', name: '천공의 심판궁 [세라핌]', slot: 'weapon', weaponType: 'bow', rarity: 'legendary', icon: '✨', atk: 320, desc: '빛의 화살로 악을 정화하는 궁극의 천공활 (공격력 +320)', price: 8800, sellPrice: 4400, trialPrice: 90 },

    // 🪄 1-C. Staffs (누워있는 대마법사 - Mage)
    'staff_apprentice': { id: 'staff_apprentice', name: '수습 마법사의 지팡이', slot: 'weapon', weaponType: 'staff', rarity: 'common', icon: '🪄', atk: 16, desc: '마력을 머금은 떡갈나무 지팡이 (공격력 +16)', price: 100, sellPrice: 50 },
    'staff_arcane_blue': { id: 'staff_arcane_blue', name: '비전 수정 마법봉', slot: 'weapon', weaponType: 'staff', rarity: 'rare', icon: '🔮', atk: 32, desc: '푸른 비전 에너지를 방출하는 지팡이 (공격력 +32)', price: 260, sellPrice: 130 },
    'staff_frost_orb': { id: 'staff_frost_orb', name: '영구빙하의 서리 보주', slot: 'weapon', weaponType: 'staff', rarity: 'epic', icon: '❄️', atk: 65, desc: '냉기 폭풍을 소환하는 빙하의 지팡이 (공격력 +65)', price: 920, sellPrice: 460 },
    'staff_abyss_caller': { id: 'staff_abyss_caller', name: '심해의 소환사 지팡이', slot: 'weapon', weaponType: 'staff', rarity: 'epic', icon: '🌊', atk: 105, desc: '해일을 부르는 대양의 비전 지팡이 (공격력 +105)', price: 1650, sellPrice: 825 },
    'staff_arcane_sage': { id: 'staff_arcane_sage', name: '대현자의 비전 지팡이', slot: 'weapon', weaponType: 'staff', rarity: 'legendary', icon: '🌌', atk: 200, desc: '3갈래 유도 마법 탄환을 쏟아내는 대현자의 지팡이 (공격력 +200)', price: 4500, sellPrice: 2250, trialPrice: 45 },
    'staff_celestial_god': { id: 'staff_celestial_god', name: '성스러운 천공 대지팡이', slot: 'weapon', weaponType: 'staff', rarity: 'legendary', icon: '🌟', atk: 335, desc: '신성한 빛의 폭격을 내리는 궁극의 지팡이 (공격력 +335)', price: 9200, sellPrice: 4600, trialPrice: 90 },

    // 🗡️ 1-D. Daggers (드러누운 암살자 - Rogue)
    'dagger_rusty': { id: 'dagger_rusty', name: '암살자의 녹슨 쌍단검', slot: 'weapon', weaponType: 'dagger', rarity: 'common', icon: '🗡️', atk: 13, desc: '빠르게 연속 타격하는 쌍단검 (공격력 +13)', price: 85, sellPrice: 40 },
    'dagger_emerald_fang': { id: 'dagger_emerald_fang', name: '요정의 비취 송곳니', slot: 'weapon', weaponType: 'dagger', rarity: 'rare', icon: '🌿', atk: 26, desc: '초고속 5단 난무를 펼치는 비취 단검 (공격력 +26)', price: 230, sellPrice: 115 },
    'dagger_sand_phantom': { id: 'dagger_sand_phantom', name: '신기루 환영의 단도', slot: 'weapon', weaponType: 'dagger', rarity: 'epic', icon: '🏜️', atk: 58, desc: '모래처럼 빠르게 스치는 암살검 (공격력 +58)', price: 880, sellPrice: 440 },
    'dagger_venom_viper': { id: 'dagger_venom_viper', name: '맹독 살무사의 비수', slot: 'weapon', weaponType: 'dagger', rarity: 'epic', icon: '🐍', atk: 98, desc: '치명타율이 대폭 상승하는 독침 단검 (공격력 +98)', price: 1550, sellPrice: 775 },
    'dagger_shadow_assassin': { id: 'dagger_shadow_assassin', name: '암살자의 그림자 쌍단검', slot: 'weapon', weaponType: 'dagger', rarity: 'legendary', icon: '💀', atk: 195, desc: '초고속 5연타와 치명타로 적을 분쇄하는 암살 단검 (공격력 +195)', price: 4400, sellPrice: 2200, trialPrice: 45 },
    'dagger_void_reaper': { id: 'dagger_void_reaper', name: '공허의 리퍼 단도 [카오스]', slot: 'weapon', weaponType: 'dagger', rarity: 'legendary', icon: '🌑', atk: 325, desc: '시공간을 찢는 최속의 암살 무기 (공격력 +325)', price: 9000, sellPrice: 4500, trialPrice: 90 },

    // 🪙 Trial Exclusives & Elixirs
    'potion_trial_elixir': { id: 'potion_trial_elixir', name: '🧪 시련의 초월 각성 영약', slot: 'consumable', rarity: 'legendary', icon: '🧪', desc: '60초간 공격력 +100%, 이동속도 +50, 모든 스킬 쿨다운 50% 단축', price: 500, sellPrice: 200, trialPrice: 15 },
    'potion_god_trial': { id: 'potion_god_trial', name: '🌟 시련의 전지전능 영약', slot: 'consumable', rarity: 'legendary', icon: '🌟', desc: 'HP/MP 100% 즉시 회복 및 45초간 불사 상태 부여', price: 800, sellPrice: 350, trialPrice: 25 },

    // === 2. Armors (Tier 1 ~ Tier 10 God Tier) ===
    'armor_leather': { id: 'armor_leather', name: '모험가의 가죽옷', slot: 'armor', rarity: 'common', icon: '🥋', hp: 40, desc: '가벼운 가죽 흉갑 (최대 체력 +40)', price: 80, sellPrice: 40 },
    'armor_plate': { id: 'armor_plate', name: '강철 판금 갑옷', slot: 'armor', rarity: 'rare', icon: '🛡️', hp: 80, desc: '묵직한 강철 판금 갑옷 (최대 체력 +80)', price: 180, sellPrice: 90 },
    'armor_emerald': { id: 'armor_emerald', name: '엘프의 비취 흉갑', slot: 'armor', rarity: 'rare', icon: '🍃', hp: 140, desc: '정령의 생명력이 깃든 비취 흉갑 (최대 체력 +140)', price: 350, sellPrice: 175 },
    'armor_necro': { id: 'armor_necro', name: '망령의 흑골 판금갑', slot: 'armor', rarity: 'rare', icon: '☠️', hp: 220, desc: '사신의 묘지에서 발굴한 흑골 갑주 (최대 체력 +220)', price: 550, sellPrice: 275 },
    'armor_pharaoh': { id: 'armor_pharaoh', name: '황금 파라오의 불멸 성의', slot: 'armor', rarity: 'epic', icon: '👑', hp: 320, desc: '피라미드 파라오의 불멸의 미이라 옷 (최대 체력 +320)', price: 850, sellPrice: 425 },
    'armor_dragon': { id: 'armor_dragon', name: '드래곤 스케일 아머', slot: 'armor', rarity: 'epic', icon: '🐲', hp: 450, desc: '화룡의 비늘로 짠 불타는 경갑 (최대 체력 +450)', price: 1300, sellPrice: 650 },
    'armor_frost': { id: 'armor_frost', name: '빙하 성기사의 영구동토 갑주', slot: 'armor', rarity: 'epic', icon: '🧊', hp: 600, desc: '절대 녹지 않는 영구빙하의 갑주 (최대 체력 +600)', price: 1900, sellPrice: 950 },
    'armor_abyss': { id: 'armor_abyss', name: '심해 크라켄 비늘갑', slot: 'armor', rarity: 'legendary', icon: '🐙', hp: 800, desc: '심해의 초고수압을 견디는 단단한 갑주 (최대 체력 +800)', price: 2800, sellPrice: 1400 },
    'armor_swamp': { id: 'armor_swamp', name: '맹독 히드라 카라페이스', slot: 'armor', rarity: 'legendary', icon: '🧪', hp: 1050, desc: '모든 독기를 반사하는 구두룡의 외골격 (최대 체력 +1050)', price: 4000, sellPrice: 2000 },
    'armor_void': { id: 'armor_void', name: '공허 그림자 슈라우드', slot: 'armor', rarity: 'legendary', icon: '🌑', hp: 1400, desc: '차원의 왜곡을 흡수하는 그림자 갑옷 (최대 체력 +1400)', price: 5800, sellPrice: 2900 },
    'armor_celestial': { id: 'armor_celestial', name: '세라핌의 천공 수호 성의', slot: 'armor', rarity: 'legendary', icon: '✨', hp: 1900, desc: '대천사의 축복이 서린 천공의 성의 (최대 체력 +1900)', price: 8200, sellPrice: 4100 },
    'armor_lazy_god': { id: 'armor_lazy_god', name: '극세사 온수매트 수호성의', slot: 'armor', rarity: 'legendary', icon: '♨️', hp: 3200, desc: '침대에서 절대 벗어나고 싶지 않은 불멸의 보온력 (최대 체력 +3200)', price: 18000, sellPrice: 9000 },

    // === 3. Accessories (Tier 1 ~ Tier 10 God Tier) ===
    'ring_wind': { id: 'ring_wind', name: '바람의 정령 반지', slot: 'accessory', rarity: 'rare', icon: '💍', spd: 35, desc: '바람의 정령이 깃든 반지 (이동속도 +35)', price: 180, sellPrice: 90 },
    'ring_mana': { id: 'ring_mana', name: '마나의 비전 보옥', slot: 'accessory', rarity: 'rare', icon: '🔮', mp: 60, desc: '마력을 증폭시키는 푸른 보석 (최대 마나 +60)', price: 240, sellPrice: 120 },
    'ring_berserk': { id: 'ring_berserk', name: '버서커의 분노 인장', slot: 'accessory', rarity: 'epic', icon: '🩸', atk: 25, spd: 25, desc: '투쟁심을 고양시키는 광전사의 반지 (공격력 +25, 이속 +25)', price: 500, sellPrice: 250 },
    'ring_sand': { id: 'ring_sand', name: '사막의 모래시계 인장', slot: 'accessory', rarity: 'epic', icon: '⏳', atk: 35, hp: 120, desc: '흐르는 시간을 다스리는 사막의 보옥 (공격력 +35, 체력 +120)', price: 800, sellPrice: 400 },
    'ring_magma': { id: 'ring_magma', name: '화염 심연의 마그마 핵', slot: 'accessory', rarity: 'epic', icon: '🌋', atk: 50, hp: 180, desc: '작열하는 심연의 열기를 담은 펜던트 (공격력 +50, 체력 +180)', price: 1200, sellPrice: 600 },
    'ring_freeze': { id: 'ring_freeze', name: '서리 군주의 얼음 인장', slot: 'accessory', rarity: 'legendary', icon: '💎', atk: 70, mp: 120, desc: '혹한의 마력을 담은 인장 반지 (공격력 +70, 마나 +120)', price: 1800, sellPrice: 900 },
    'ring_abyss': { id: 'ring_abyss', name: '심해 레비아탄의 심장', slot: 'accessory', rarity: 'legendary', icon: '🌊', atk: 90, hp: 280, mp: 150, desc: '대양의 심연 에너지가 고동치는 핵 (공격력 +90, 체력 +280, 마나 +150)', price: 2800, sellPrice: 1400 },
    'ring_venom': { id: 'ring_venom', name: '맹독 히드라의 오팔', slot: 'accessory', rarity: 'legendary', icon: '🧪', atk: 120, spd: 45, desc: '초고속 독침 반응을 부여하는 오팔 (공격력 +120, 이속 +45)', price: 4200, sellPrice: 2100 },
    'ring_void': { id: 'ring_void', name: '공허 차원의 오리진 링', slot: 'accessory', rarity: 'legendary', icon: '🕳️', atk: 160, mp: 250, spd: 55, desc: '공간을 뛰어넘는 차원의 고리 (공격력 +160, 마나 +250, 이속 +55)', price: 6200, sellPrice: 3100 },
    'ring_divine': { id: 'ring_divine', name: '신성한 전능의 천공 고리', slot: 'accessory', rarity: 'legendary', icon: '👑', atk: 220, hp: 450, mp: 350, desc: '모든 스탯을 초월적으로 끌어올리는 신의 고리', price: 9500, sellPrice: 4750 },
    'ring_lazy_god': { id: 'ring_lazy_god', name: '절대 낮잠의 에메랄드 링', slot: 'accessory', rarity: 'legendary', icon: '😴', atk: 350, hp: 800, mp: 600, spd: 75, desc: '움직이지 않고도 모든 것을 이룰 수 있는 나태의 신의 반지', price: 20000, sellPrice: 10000 },

    // === 4. Consumables & Special Elixirs ===
    'scroll_town_return': { id: 'scroll_town_return', name: '📜 마을 귀환 주문서', slot: 'consumable', rarity: 'rare', icon: '📜', desc: '사용 시 즉시 안전지대인 [시작의 마을] 분수대 앞으로 귀환합니다.', price: 35, sellPrice: 15 },
    'potion_hp': { id: 'potion_hp', name: '체력 회복 물약', slot: 'consumable', rarity: 'common', icon: '🧪', desc: '체력을 70 회복합니다.', price: 20, sellPrice: 10 },
    'potion_mp': { id: 'potion_mp', name: '마나 회복 물약', slot: 'consumable', rarity: 'common', icon: '💧', desc: '마나를 70 회복합니다.', price: 20, sellPrice: 10 },
    'potion_buff': { id: 'potion_buff', name: '공격력 강화 물약', slot: 'consumable', rarity: 'rare', icon: '⚡', desc: '18초간 공격력과 이동속도를 강화합니다.', price: 40, sellPrice: 20 },
    'potion_crit': { id: 'potion_crit', name: '광전사의 비약', slot: 'consumable', rarity: 'epic', icon: '🍷', desc: '30초간 공격력이 2배 증가합니다.', price: 150, sellPrice: 75 },
    'potion_elixir': { id: 'potion_elixir', name: '고대 엘릭서 영약', slot: 'consumable', rarity: 'legendary', icon: '✨', desc: '체력과 마나를 즉시 100% 완전 회복합니다.', price: 90, sellPrice: 45 },
    'potion_god': { id: 'potion_god', name: '전지전능 신의 성수', slot: 'consumable', rarity: 'legendary', icon: '🌟', desc: '체력/마나 완충 및 45초간 무적에 준하는 초강력 버프 부여', price: 350, sellPrice: 175 },

    // === 5. Town Regional Specialties (마을별 5대 테마 고유 특산품) ===
    // [1. 평화로운 시작의 마을 특산품]
    'potion_herb_tea': { id: 'potion_herb_tea', name: '🍵 [특산] 비취 약초 달인 물', slot: 'consumable', rarity: 'rare', icon: '🍵', desc: 'HP/MP를 즉시 120 회복하고 30초간 이동속도가 15% 증가합니다.', price: 35, sellPrice: 18 },
    'armor_lazy_pajama': { id: 'armor_lazy_pajama', name: '👕 [특산] 나태한 수면 잠옷', slot: 'armor', rarity: 'rare', icon: '👕', hp: 95, desc: '지저씨가 애용하는 초극세사 잠옷 (최대 체력 +95, 이동속도 +10)', price: 180, sellPrice: 90 },
    'sword_wooden_legend': { id: 'sword_wooden_legend', name: '🗡️ [특산] 장인의 흑단목 장검', slot: 'weapon', rarity: 'rare', icon: '🗡️', atk: 30, desc: '마을 목공 장인이 깎아낸 수작 (공격력 +30, 크리티컬 +15%)', price: 160, sellPrice: 80 },
    'ring_clover': { id: 'ring_clover', name: '🍀 [특산] 행운의 네잎클로버 링', slot: 'accessory', rarity: 'rare', icon: '🍀', atk: 12, hp: 60, desc: '골드 획득량과 몬스터 드랍률을 높여주는 행운의 반지', price: 200, sellPrice: 100 },

    // [2. 사막 오아시스 안식처 특산품]
    'potion_cactus_juice': { id: 'potion_cactus_juice', name: '🌵 [특산] 오아시스 선인장 즙', slot: 'consumable', rarity: 'epic', icon: '🌵', desc: '60초간 화염 저항 50% 및 이동속도 +25를 부여합니다.', price: 75, sellPrice: 38 },
    'sword_scimitar_gold': { id: 'sword_scimitar_gold', name: '⚔️ [특산] 황금 모래바람 시미터', slot: 'weapon', rarity: 'epic', icon: '⚔️', atk: 75, desc: '사막 유목민 대상의 비전 곡도 (공격력 +75, 모래폭풍 칼날)', price: 580, sellPrice: 290 },
    'armor_desert_cloak': { id: 'armor_desert_cloak', name: '🧕 [특산] 신기루 유목민 망토', slot: 'armor', rarity: 'epic', icon: '🧕', hp: 360, desc: '모래바람을 피하고 신기루처럼 민첩해지는 비단 망토 (체력 +360)', price: 620, sellPrice: 310 },
    'ring_mirage_amber': { id: 'ring_mirage_amber', name: '💍 [특산] 신기루 호박석 고리', slot: 'accessory', rarity: 'epic', icon: '💍', atk: 45, mp: 200, desc: '오아시스 지하에서 채굴된 신비로운 호박석 (공격력 +45, 마나 +200)', price: 680, sellPrice: 340 },

    // [3. 설원 모닥불 전진 기지 특산품]
    'potion_hot_chocolate': { id: 'potion_hot_chocolate', name: '☕ [특산] 온돌 주막의 핫초코', slot: 'consumable', rarity: 'epic', icon: '☕', desc: '90초간 빙결 면역 및 공격력을 25% 상승시킵니다.', price: 120, sellPrice: 60 },
    'sword_frost_cleaver': { id: 'sword_frost_cleaver', name: '🪓 [특산] 빙하 단련 서리대도', slot: 'weapon', rarity: 'epic', icon: '🪓', atk: 125, desc: '영구빙하를 쪼개어 단련한 혹한의 대도 (공격력 +125, 한기 폭풍)', price: 1450, sellPrice: 725 },
    'armor_yeti_fur': { id: 'armor_yeti_fur', name: '🧥 [특산] 설원 예티 털 방한갑옷', slot: 'armor', rarity: 'epic', icon: '🧥', hp: 650, desc: '설원의 혹독한 눈보라를 완벽히 막아내는 털갑옷 (체력 +650)', price: 1550, sellPrice: 775 },
    'ring_blizzard_gem': { id: 'ring_blizzard_gem', name: '💎 [특산] 영구동토 눈꽃 반지', slot: 'accessory', rarity: 'legendary', icon: '💎', atk: 75, mp: 320, spd: 30, desc: '눈꽃의 결정이 서린 영구동토의 가호 (공격 +75, 마나 +320, 이속 +30)', price: 1700, sellPrice: 850 },

    // [4. 성채 기사단 비밀 은신처 특산품]
    'potion_holy_water': { id: 'potion_holy_water', name: '🧪 [특산] 기사단 성수 엘릭서', slot: 'consumable', rarity: 'legendary', icon: '🧪', desc: '체력을 80% 회복하고 45초간 언데드/마족에게 가하는 피해가 40% 증가합니다.', price: 200, sellPrice: 100 },
    'sword_silver_crusader': { id: 'sword_silver_crusader', name: '⚔️ [특산] 은빛 성기사단 성검', slot: 'weapon', rarity: 'legendary', icon: '⚔️', atk: 185, desc: '어둠의 흡혈귀 군단을 단칼에 베어 넘기는 은빛 성검 (공격력 +185)', price: 2900, sellPrice: 1450 },
    'armor_crusader_plate': { id: 'armor_crusader_plate', name: '🛡️ [특산] 축복받은 성기사 판금갑', slot: 'armor', rarity: 'legendary', icon: '🛡️', hp: 950, desc: '성기사단의 축복으로 보호받는 묵직한 백은 갑옷 (체력 +950)', price: 3100, sellPrice: 1550 },
    'ring_blood_vampire': { id: 'ring_blood_vampire', name: '🩸 [특산] 흡혈 사냥꾼의 루비링', slot: 'accessory', rarity: 'legendary', icon: '🩸', atk: 115, hp: 350, spd: 40, desc: '타격 시 입힌 피해의 12%를 체력으로 흡수하는 루비링', price: 3300, sellPrice: 1650 },

    // [5. 천공의 구름 안식처 특산품]
    'potion_ambrosia': { id: 'potion_ambrosia', name: '🍷 [특산] 천상의 이슬 암브로시아', slot: 'consumable', rarity: 'legendary', icon: '🍷', desc: 'HP/MP를 즉시 100% 충전하고 45초간 무적 보호막을 전개합니다.', price: 500, sellPrice: 250 },
    'sword_archangel_lance': { id: 'sword_archangel_lance', name: '🔱 [특산] 대천사의 광휘창', slot: 'weapon', rarity: 'legendary', icon: '🔱', atk: 265, desc: '천상의 신성 광선을 3발 유도 발사하는 대천사의 창 (공격력 +265)', price: 5600, sellPrice: 2800 },
    'armor_cloud_robe': { id: 'armor_cloud_robe', name: '🪽 [특산] 천공의 구름 날개 로브', slot: 'armor', rarity: 'legendary', icon: '🪽', hp: 1500, desc: '천공의 구름으로 엮어 공중에 부유하며 날아다니는 로브 (체력 +1500, 이속 +50)', price: 6200, sellPrice: 3100 },
    'ring_pillow_dream': { id: 'ring_pillow_dream', name: '🛏️ [특산] 지저씨의 궁극 베개 반지', slot: 'accessory', rarity: 'legendary', icon: '🛏️', atk: 160, hp: 1100, mp: 800, spd: 60, desc: '착용하는 순간 언제 어디서나 편안한 꿀잠 버프를 받는 궁극의 반지', price: 7800, sellPrice: 3900 }
};
