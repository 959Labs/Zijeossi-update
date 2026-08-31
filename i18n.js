// ============================================================================
// i18n Core Engine & Bilingual Dictionary (Korean / English)
// Uncle Bob's Lazy Awakening (지저씨 : 각성했지만 게으르고 싶어)
// ============================================================================

const I18N_DICTIONARY = {
    ko: {
        // App / Meta
        "game.title": "지저씨 : 각성했지만 게으르고 싶어",
        "game.subtitle": "< 지저씨 : 각성했지만 게으르고 싶어 >",
        "game.title_line1": "Uncle Bob's",
        "game.title_line2": "Lazy Awakening",

        // Dev Comment
        "dev.badge": "📢 개발자 코멘트",
        "dev.comment": "누가 플레이 하게 될지는 모르지만 피드백은 언제나 환영입니다 ~~ ^3^",

        // Main Title Menu
        "menu.continue": "💾 싱글플레이 이어하기 (Continue)",
        "menu.new_game": "⚔️ 싱글플레이 새로 시작 (New Game)",
        "menu.multiplayer": "🌐 코옵 멀티플레이 (Co-op Multiplayer)",
        "menu.settings": "⚙️ 게임 가이드 & 환경설정 [P]",
        "menu.quit": "🚪 게임 완전 종료 (Quit Game)",
        "menu.skip_hint": "스킵: [Space / ENTER / ESC / 클릭]",

        // Control Guide Badge
        "guide.badge_title": "🎮 조작 가이드",
        "guide.move": "메뉴 이동",
        "guide.select": "선택 & 시작",
        "guide.interact": "NPC & 상점 대화",
        "guide.attack_dash": "기본 공격 / 대시",
        "guide.skills": "스킬 및 궁극기",

        // Top Right HUD Buttons
        "hud.pause": " 일시정지 [ESC]",
        "hud.quit": " 종료",
        "hud.map": " 지도 [M]",
        "hud.skillbook": " 스킬북 [K]",
        "hud.inventory": " 가방 [I]",
        "hud.settings": " 설정 [P]",
        "hud.save": " 저장",
        "hud.fullscreen": " 전체화면",
        "hud.copy": " 복사",
        "hud.sync": " 동기화",
        "hud.saved": "💾 저장됨",

        // Top Left Stack
        "quest.header": "📜 퀘스트",
        "quest.none": "수주한 퀘스트가 없습니다.",
        "quest.progress": "진행 중",
        "quest.ready": "완료 가능! 장로에게 보고",
        "quest.target": "목표: ",
        "tower.title": "무한의 시련 탑",
        "tower.mobs_left": "👾 잔여 몬스터: ",
        "tower.mobs_unit": "마리",
        "tower.coins": "🪙 시련의 증표: ",
        "tower.coins_unit": "개",
        "tower.floor_clear": "🎉 {floor}층 클리어! (HP/MP 40% 회복 & 시련의 증표 +{coins})",
        "party.join_teleport": "합류 🚀",

        // Hotbar & Action Deck
        "hotbar.ultimate": "궁극기",
        "hotbar.whirlwind": "회오리",
        "hotbar.beam": "검기",
        "hotbar.attack": "평타",
        "hotbar.parry": "패링",
        "hotbar.smash": "강타",
        "hotbar.frost": "빙결",
        "hotbar.flame": "화염",
        "hotbar.blessing": "가호",
        "hotbar.dash": "대시",
        "hotbar.interact": "상호작용",
        "hotbar.guide_tagline": "<span>방향키</span> 이동 • <span>Q W E A S D Z X C</span> 9개 스킬 • <span>Space</span> 대시 • <span>K</span> 스킬북 • <span>F</span> 상호작용 • <span>I</span> 가방 • <span>P</span> 설정",

        // Mobile Advisory
        "advisory.title": "가로 모드 권장",
        "advisory.desc": "스마트폰을 가로로 돌리시면 넓은 시야와 쾌적한 조작으로 플레이하실 수 있습니다.",

        // Chat
        "chat.placeholder": "메시지 입력 후 [Enter] (취소: [Esc])",
        "chat.send": "전송",

        // Pause Modal
        "pause.title": "일시정지",
        "pause.resume": "▶️ 게임 계속하기 (Resume) [ESC]",
        "pause.skills": "⚡ 스킬북 & 9슬롯 세팅 [K]",
        "pause.guide": "📖 모험 & 조작 가이드 (Guide)",
        "pause.save": "💾 게임 저장하기 (Quick Save)",
        "pause.settings": "⚙️ 환경설정 (Settings) [P]",
        "pause.title_menu": "🏠 타이틀 화면으로 나가기 (Main Menu)",
        "pause.quit": "🚪 게임 완전 종료 (Quit Game)",
        "pause.guide_footer": "조작: [↑ / ↓ 방향키] 이동 • [ENTER] 선택 • [ESC] 계속하기",

        // Settings Modal
        "settings.title": "⚙️ 환경설정 (Settings)",
        "settings.language_section": "🌐 언어 설정 (Language)",
        "settings.sound_section": "🔊 사운드 설정",
        "settings.bgm": "배경음악 음량 (BGM)",
        "settings.sfx": "효과음 음량 (SFX)",
        "settings.autopotion_section": "🛵 편의 기능 & 배달앱 자동 물약 (Auto-Potion)",
        "settings.autopotion_label": "🛵 위기 탈출 자동 물약 결제:",
        "settings.autopotion_desc": "• 전투 중 체력이 설정 비율 이하로 떨어지면 가방의 HP 물약을 자동 소비(\"띵동! 배달 완료!\")하여 위기에서 탈출합니다.",
        "settings.controls_section": "⚔️ 조작 및 전투 효과",
        "settings.dodge_mode": "회피(대시) 조작 방식",
        "settings.dodge_both": "Space 키 + 방향키 더블 탭 둘 다 허용 (기본 권장)",
        "settings.dodge_space": "Space 키만 사용",
        "settings.dodge_double": "방향키 더블 탭만 사용",
        "settings.shake": "화면 흔들림 타격 효과 (Screen Shake)",
        "settings.aim": "스마트 몬스터 자동 타겟팅 (Auto Aim)",
        "settings.secret_section": "🎁 시크릿 코드 & 쿠폰 입력 (Secret Code)",
        "settings.secret_placeholder": "시크릿 코드 입력",
        "settings.secret_submit": "⚡ 코드 입력",
        "settings.version_section": "🚀 버전 정보 & 온라인 자동 업데이트 (Auto-Patch)",
        "settings.current_ver": "현재 게임 버전: ",
        "settings.check_update": "🔄 최신 업데이트 확인",
        "settings.cross_save_section": "💾 세이브 데이터 백업 & 버전/기기 이전 (Cross-Save)",
        "settings.export_code": "📋 내 세이브 코드 복사 (백업)",
        "settings.import_code": "📥 세이브 코드 불러오기 (복구)",
        "settings.close_hint": "단축키 [P] 또는 [F]로 닫을 수 있습니다.",
        "settings.confirm": "확인 [P/F]",

        // Inventory Modal
        "inv.title": "🎒 인벤토리 & 장비창",
        "inv.close": "닫기 [I/F]",
        "inv.controls": "조작: [방향키] 가방 슬롯 이동 • [ENTER] 장착/사용 • [I / F] 닫기",
        "inv.class_guide": "💡 [4대 백수 전직] 무기(검/활/지팡이/단검)를 가방에서 장착([ENTER])하면 해당 직업으로 즉시 전직되어 고유 평타와 모션이 활성화됩니다!",
        "inv.equipped_gear": "장착 장비",
        "inv.slot_weapon": "무기",
        "inv.slot_armor": "갑옷",
        "inv.slot_accessory": "장신구",
        "inv.current_class": "현재 전투 직업",
        "inv.stat_atk": "공격력:",
        "inv.stat_hp": "최대 체력:",
        "inv.stat_mp": "최대 마나:",
        "inv.stat_spd": "이동속도:",
        "inv.stat_trial_coins": "시련의 증표:",
        "inv.bag_title": "소지품 가방 (20칸)",
        "inv.item_detail_title": "아이템 상세 정보",
        "inv.item_detail_empty": "가방에서 아이템을 선택하세요.",
        "inv.equip_btn": "장착 [ENTER]",
        "inv.use_btn": "사용 [ENTER]",
        "inv.unequip_btn": "해제",

        // Class Names & Tags
        "class.warrior": "⚔️ 게으른 검사",
        "class.warrior_desc": "묵직한 3단 베기 콤보",
        "class.archer": "🏹 방구석 궁수",
        "class.archer_desc": "원거리 고속 3연사 화살",
        "class.mage": "🪄 누워있는 대마법사",
        "class.mage_desc": "3갈래 유도 비전 마법탄",
        "class.rogue": "🗡️ 드러누운 암살자",
        "class.rogue_desc": "초고속 5단 난무 단검",

        // Shop Modal
        "shop.title": "🛒 방랑 상인의 만물상",
        "shop.tab_buy": "🛒 아이템 구매",
        "shop.tab_sell": "💰 아이템 판매",
        "shop.controls": "조작: [← / → 또는 Tab] 탭 전환 • [↑ / ↓] 항목 선택 • [ENTER] 구매/판매 • [F] 닫기",
        "shop.gold": "🪙 보유 골드: ",
        "shop.bag": "🎒 가방: ",
        "shop.buy_btn": "구매 ({price} G)",
        "shop.sell_btn": "판매 (+{price} G)",
        "shop.buy_success": "🎉 [{name}]을(를) 구매했습니다! (-{price} G)",
        "shop.sell_success": "💰 [{name}]을(를) 판매했습니다! (+{price} G)",
        "shop.no_gold": "⚠️ 골드가 부족합니다! (필요: {price} G)",
        "shop.bag_full": "⚠️ 가방이 가득 찼습니다! (최대 20칸)",
        "shop.cannot_sell_equipped": "⚠️ 장착 중인 장비는 판매할 수 없습니다.",

        // Trial Shop Modal
        "trial_shop.title": "✨ 아스텔의 시련 보물소 (전설 직업 무기 교환)",
        "trial_shop.controls": "조작: [↑ / ↓ 방향키] 품목 선택 • [ENTER] 시련의 증표로 교환 • [F / ESC] 닫기",
        "trial_shop.coins": "🪙 보유 시련의 증표: ",
        "trial_shop.unit": "개",
        "trial_shop.exchange_btn": "교환 ({price} 🪙)",
        "trial_shop.exchange_success": "🌟 [{name}] 교환 성공! (-{price} 시련의 증표)",
        "trial_shop.no_coins": "⚠️ 시련의 증표가 부족합니다! (필요: {price}개)",

        // Forge Modal
        "forge.title": "⚒️ 대장장이의 불꽃 대장간",
        "forge.desc": "✨ [슬롯 계승 강화] 어떤 새 장비를 착용해도 강화 수치가 100% 영구 유지·계승됩니다!",
        "forge.controls": "조작: [↑/↓ 방향키] 항목 이동 • [ENTER] 강화 • [F] 닫기",
        "forge.gold": "보유 골드: ",
        "forge.upgrade_btn": "강화 (+{level} ➔ +{next})",
        "forge.max_level": "⭐ MAX 강화 달성",
        "forge.success": "✨ 강화 성공! [{slot}] 수치가 +{level}(으)로 상승했습니다! (-{price} G)",
        "forge.no_gold": "⚠️ 강화 비용이 부족합니다! (필요: {price} G)",

        // Casino Modal
        "casino.title": "🎲 959 럭키 카지노 하우스 (Jackpot House)",
        "casino.tab_dice": "🎲 더블 다이스 (High-Low)",
        "casino.tab_slot": "🎰 3-릴 미니 슬롯",
        "casino.gold": "🪙 내 보유 골드: ",
        "casino.bet_display": "🎯 베팅액: ",
        "casino.bet_label": "베팅 금액:",
        "casino.dice_sum": "주사위 합: ",
        "casino.dice_low_title": "📉 로우 (LOW)",
        "casino.dice_low_sub": "주사위 합 2 ~ 6",
        "casino.dice_low_pay": "배당 2.0x",
        "casino.dice_seven_title": "🌟 럭키 7 (JACKPOT)",
        "casino.dice_seven_sub": "주사위 합 정확히 7",
        "casino.dice_seven_pay": "대박 5.0x",
        "casino.dice_high_title": "📈 하이 (HIGH)",
        "casino.dice_high_sub": "주사위 합 8 ~ 12",
        "casino.dice_high_pay": "배당 2.0x",
        "casino.slot_spin": "🎰 레버 당기기 (SPIN!)",
        "casino.default_comment": "도박사 잭: \"원하는 게임과 베팅액을 고르고 도전해 보게나!\"",
        "casino.win_dice": "🎉 적중! 도박사 잭: \"오호! 눈썰미가 제법이군! (+{payout} G)\"",
        "casino.lose_dice": "💸 낙첨! 도박사 잭: \"아쉽구먼! 운은 다시 돌아오는 법이지!\"",
        "casino.win_slot": "🎰 잭팟 축하! 도박사 잭: \"대단하군! 상금 (+{payout} G)을 가져가게!\"",
        "casino.win_slot_grand": "👑 초특급 잭팟! (+{payout} G & 전설 강화석)",
        "casino.no_gold": "⚠️ 베팅할 골드가 부족합니다!",

        // Skill Book Modal
        "skillbook.title": "⚡ 지저씨의 스킬북 & 9슬롯 커스텀 장착",
        "skillbook.controls": "조작: [↑ / ↓] 스킬 선택 • [ENTER] 선택 후 배치할 키(Q, W, E, A, S, D, Z, X, C) 입력 • [DEL] 해제 • [X] 전체 해제 • [K / F / ESC] 닫기",
        "skillbook.deck_title": "🎯 장착된 9개 퀵슬롯",
        "skillbook.active_slots": "{count} / 9 슬롯 활성화",
        "skillbook.clear_all": "🗑️ 전체 해제 [X]",
        "skillbook.tip": "💡 팁: 모든 슬롯을 다 채우지 않아도 되며, 자주 쓰는 스킬만 원하는 키에 배치할 수 있습니다. 장착된 슬롯을 클릭하면 즉시 해제됩니다.",
        "skillbook.lib_title": "📖 보유 스킬 라이브러리 (총 {count}종)",
        "skillbook.tab_all": "전체 (All)",
        "skillbook.tab_warrior": "⚔️ 검사",
        "skillbook.tab_archer": "🏹 궁수",
        "skillbook.tab_mage": "🪄 마법사",
        "skillbook.tab_rogue": "🗡️ 암살자",
        "skillbook.tab_general": "✨ 공용",
        "skillbook.slot_empty": "(비어있음)",
        "skillbook.not_equipped": "미장착",
        "skillbook.click_to_unequip": "클릭 시 해제",
        "skillbook.awakening_locked_tag": "🔒 2차 각성 미달성",
        "skillbook.awakening_locked_title": "\"그 레벨에 잠이 오늬?\" (현재 Lv {level} / 필요 Lv 50)",
        "skillbook.awakening_locked_desc": "• Lv 50 달성 시 직업별 2차 각성 패시브와 전용 궁극기가 정식 해금됩니다!",
        "skillbook.warrior_passive_tag": "⚔️ 2차 각성 패시브 [불굴의 백수 투기] (Lv {level} 활성)",
        "skillbook.warrior_passive_desc": "• 체력이 30% 이하로 떨어지면 공격력 +20% 증가 및 받는 피해 25% 영구 감소",
        "skillbook.archer_passive_tag": "🏹 2차 각성 패시브 [방구석 매의 눈] (Lv {level} 활성)",
        "skillbook.archer_passive_desc": "• 기본 치명타율 +30% 증가 & 사거리 250px 밖의 적 타격 시 피해 +30% 증폭",
        "skillbook.mage_passive_tag": "🪄 2차 각성 패시브 [무한의 마력로] (Lv {level} 활성)",
        "skillbook.mage_passive_desc": "• 마나 자연 재생 속도 +100% 증가 (24 MP/s) & 스킬 사용 시 20% 확률로 쿨다운 즉시 초기화",
        "skillbook.rogue_passive_tag": "🗡️ 2차 각성 패시브 [치명적 암살 본능] (Lv {level} 활성)",
        "skillbook.rogue_passive_desc": "• 치명타 피해량 +100% 증가 (3.0배) & 적 처치 시 2초간 즉시 은신 + 이속 +100",

        // World Map Modal
        "worldmap.title": "🗺️ 아르카디아 대륙 원정 지도 (Expedition Map)",
        "worldmap.current_loc": "📍 현재 위치: ",
        "worldmap.mobs_header": "⚔️ 출현 몬스터 & 보스",
        "worldmap.roads_header": "🧭 연결된 원정 경로 (Connected Roads)",
        "worldmap.tip": "💡 모험 안내: 지도를 통한 순간이동은 지원되지 않습니다. 필드 가장자리의 포탈을 걸어서 이동하세요. 마을로 복귀하려면 [📜 마을 귀환 주문서]를 사용하세요!",

        // Multiplayer Modal
        "multi.title": "코옵 멀티플레이 로비 (Co-op Lobby)",
        "multi.subtitle": "최대 4인 실시간 파티 협동 & 보스 레이드",
        "multi.nick_label": "🏷️ 내 캐릭터 닉네임 설정",
        "multi.nick_placeholder": "닉네임 입력 (최대 12자)",
        "multi.random_nick": "🎲 랜덤 닉네임",
        "multi.host_badge": "👑 방장 (Host)",
        "multi.host_title": "내가 방 만들기",
        "multi.host_desc": "내가 방장이 되어 서버를 열고 친구들을 내 월드로 초대하여 함께 사냥합니다.",
        "multi.lan_label": "📱 같은 Wi-Fi 친구 초대 주소:",
        "multi.copy_btn": "📋 복사",
        "multi.copied": "복사됨! ✅",
        "multi.host_start": "🚀 방 개설 & 모험 시작",
        "multi.join_badge": "⚔️ 파티원 (Guest)",
        "multi.join_title": "친구 방에 참가하기",
        "multi.join_desc": "친구가 알려준 서버 주소(예: http://192.168.0.X:3000)로 접속하여 파티에 합류합니다.",
        "multi.join_label": "🔗 접속할 방장 서버 주소:",
        "multi.join_start": "⚔️ 방 입장 & 파티 참가",
        "multi.back_btn": "← 메인 메뉴로 돌아가기",

        // Radar
        "radar.my_loc": "내 위치",
        "radar.portal": "포탈",
        "radar.npc": "NPC",
        "radar.enemy": "적",
        "radar.boss": "보스",
        "radar.close_hint": "[Tab / ESC] 레이더 닫기",

        // Dialogue
        "dialogue.default_speaker": "마을 장로",
        "dialogue.confirm_btn": "확인 [F/Enter]",
        "dialogue.default_welcome": "용사여, 마을에 오신 것을 환영하네!",

        // In-game Toasts & Alerts
        "toast.saved": "💾 게임이 저장되었습니다!",
        "toast.auto_delivery": "🛵 띵동! [배달앱 특급 물약] 자동 배달 완료! (체력 회복)",
        "toast.level_up": "🎉 레벨 업! Lv.{level} 달성! (HP/MP 완충, 능력치 대폭 상승)",
        "toast.death": "💀 쓰러졌습니다... 마을에서 부활합니다. (골드 일부 손실)",
        "toast.town_return": "🌀 [마을 귀환 주문서] 평화로운 시작의 마을로 즉시 귀환했습니다!",
        "toast.secret_success": "🎁 시크릿 보상 획득: {reward}",
        "toast.secret_invalid": "⚠️ 유효하지 않거나 이미 사용한 코드입니다."
    },

    en: {
        // App / Meta
        "game.title": "Uncle Bob's Lazy Awakening",
        "game.subtitle": "< Uncle Bob's Lazy Awakening : Awakened But Wants to Sleep >",
        "game.title_line1": "Uncle Bob's",
        "game.title_line2": "Lazy Awakening",

        // Dev Comment
        "dev.badge": "📢 Dev Comment",
        "dev.comment": "Wherever you play from, feedback and reviews are always welcome! ~~ ^3^",

        // Main Title Menu
        "menu.continue": "💾 Continue Adventure (Continue)",
        "menu.new_game": "⚔️ New Adventure (New Game)",
        "menu.multiplayer": "🌐 Co-op Multiplayer (4-Player Party)",
        "menu.settings": "⚙️ Game Guide & Settings [P]",
        "menu.quit": "🚪 Quit Game (Exit)",
        "menu.skip_hint": "Skip: [Space / ENTER / ESC / Click]",

        // Control Guide Badge
        "guide.badge_title": "🎮 Controls Guide",
        "guide.move": "Move Menu",
        "guide.select": "Select & Start",
        "guide.interact": "NPC / Shop Interact",
        "guide.attack_dash": "Attack / Dash",
        "guide.skills": "Skills & Ultimate",

        // Top Right HUD Buttons
        "hud.pause": " Pause [ESC]",
        "hud.quit": " Quit",
        "hud.map": " Map [M]",
        "hud.skillbook": " Skills [K]",
        "hud.inventory": " Bag [I]",
        "hud.settings": " Settings [P]",
        "hud.save": " Save",
        "hud.fullscreen": " Fullscreen",
        "hud.copy": " Copy",
        "hud.sync": " Sync",
        "hud.saved": "💾 Saved",

        // Top Left Stack
        "quest.header": "📜 Quest Log",
        "quest.none": "No active quest.",
        "quest.progress": "In Progress",
        "quest.ready": "Ready to Complete! Talk to Elder",
        "quest.target": "Target: ",
        "tower.title": "Tower of Trial",
        "tower.mobs_left": "👾 Mobs Left: ",
        "tower.mobs_unit": " mobs",
        "tower.coins": "🪙 Trial Badges: ",
        "tower.coins_unit": " pcs",
        "tower.floor_clear": "🎉 Floor {floor} Cleared! (HP/MP restored 40% & Badges +{coins})",
        "party.join_teleport": "Join 🚀",

        // Hotbar & Action Deck
        "hotbar.ultimate": "Ultimate",
        "hotbar.whirlwind": "Whirlwind",
        "hotbar.beam": "Sword Beam",
        "hotbar.attack": "Attack",
        "hotbar.parry": "Parry",
        "hotbar.smash": "Smash",
        "hotbar.frost": "Frost",
        "hotbar.flame": "Flame",
        "hotbar.blessing": "Blessing",
        "hotbar.dash": "Dash",
        "hotbar.interact": "Interact",
        "hotbar.guide_tagline": "<span>Arrow / WASD</span> Move • <span>Q W E A S D Z X C</span> 9 Skills • <span>Space</span> Dash • <span>K</span> Skill Book • <span>F</span> Interact • <span>I</span> Bag • <span>P</span> Settings",

        // Mobile Advisory
        "advisory.title": "Landscape Recommended",
        "advisory.desc": "Rotate your device horizontally for the best combat view and responsive touch controls.",

        // Chat
        "chat.placeholder": "Type message and press [Enter] (Cancel: [Esc])",
        "chat.send": "Send",

        // Pause Modal
        "pause.title": "GAME PAUSED",
        "pause.resume": "▶️ Resume Game (Resume) [ESC]",
        "pause.skills": "⚡ Skill Book & 9-Slot Loadout [K]",
        "pause.guide": "📖 Adventure & Control Guide (Guide)",
        "pause.save": "💾 Quick Save Game (Save)",
        "pause.settings": "⚙️ Settings & Audio (Settings) [P]",
        "pause.title_menu": "🏠 Return to Main Menu (Title)",
        "pause.quit": "🚪 Quit to Desktop (Quit Game)",
        "pause.guide_footer": "Controls: [↑ / ↓ Arrows] Move • [ENTER] Select • [ESC] Resume",

        // Settings Modal
        "settings.title": "⚙️ Settings & Options",
        "settings.language_section": "🌐 Language (언어 설정)",
        "settings.sound_section": "🔊 Audio Settings",
        "settings.bgm": "Music Volume (BGM)",
        "settings.sfx": "Sound Effects (SFX)",
        "settings.autopotion_section": "🛵 Quality of Life & Auto-Potion Delivery",
        "settings.autopotion_label": "🛵 Emergency Auto-Potion Delivery:",
        "settings.autopotion_desc": "• Automatically consumes HP potions from your bag when health drops below the threshold (\"Ding-Dong! Delivery arrived!\").",
        "settings.controls_section": "⚔️ Controls & Combat Effects",
        "settings.dodge_mode": "Dodge (Dash) Control Scheme",
        "settings.dodge_both": "Allow both Space key & Arrow Double-Tap (Recommended)",
        "settings.dodge_space": "Space key only",
        "settings.dodge_double": "Arrow key Double-Tap only",
        "settings.shake": "Screen Shake on Impact (Juice)",
        "settings.aim": "Smart Monster Auto-Aiming",
        "settings.secret_section": "🎁 Secret Redeem Codes & Coupons",
        "settings.secret_placeholder": "Enter secret promo code",
        "settings.secret_submit": "⚡ Redeem Code",
        "settings.version_section": "🚀 Version & Online Hot-Patch Update",
        "settings.current_ver": "Current Game Version: ",
        "settings.check_update": "🔄 Check for Updates",
        "settings.cross_save_section": "💾 Save Data Backup & Cross-Save Transfer",
        "settings.export_code": "📋 Copy Save Code (Backup)",
        "settings.import_code": "📥 Import Save Code (Restore)",
        "settings.close_hint": "Press [P] or [F] to close.",
        "settings.confirm": "Confirm [P/F]",

        // Inventory Modal
        "inv.title": "🎒 Inventory & Equipment",
        "inv.close": "Close [I/F]",
        "inv.controls": "Controls: [Arrow Keys] Navigate • [ENTER] Equip/Use • [I / F] Close",
        "inv.class_guide": "💡 [4 Class Archetypes] Equip any weapon (Sword / Bow / Staff / Dagger) from your bag ([ENTER]) to immediately switch your class and basic attack style!",
        "inv.equipped_gear": "Equipped Gear",
        "inv.slot_weapon": "Weapon",
        "inv.slot_armor": "Armor",
        "inv.slot_accessory": "Accessory",
        "inv.current_class": "Active Class",
        "inv.stat_atk": "Attack:",
        "inv.stat_hp": "Max HP:",
        "inv.stat_mp": "Max MP:",
        "inv.stat_spd": "Move Speed:",
        "inv.stat_trial_coins": "Trial Badges:",
        "inv.bag_title": "Backpack (20 Slots)",
        "inv.item_detail_title": "Item Details",
        "inv.item_detail_empty": "Select an item from your backpack.",
        "inv.equip_btn": "Equip [ENTER]",
        "inv.use_btn": "Use [ENTER]",
        "inv.unequip_btn": "Unequip",

        // Class Names & Tags
        "class.warrior": "⚔️ Lazy Warrior (Uncle Bob)",
        "class.warrior_desc": "Heavy 3-hit melee sword slash combo",
        "class.archer": "🏹 Homebody Archer",
        "class.archer_desc": "Rapid 3-arrow long-range barrage",
        "class.mage": "🪄 Bedridden Archmage",
        "class.mage_desc": "3-way homing arcane missile storm",
        "class.rogue": "🗡️ Slothful Rogue",
        "class.rogue_desc": "Ultra-fast 5-hit phantom dual daggers",

        // Shop Modal
        "shop.title": "🛒 Traveling Merchant's Outpost",
        "shop.tab_buy": "🛒 Buy Items",
        "shop.tab_sell": "💰 Sell Items",
        "shop.controls": "Controls: [← / → or Tab] Switch Tab • [↑ / ↓] Select • [ENTER] Buy/Sell • [F] Close",
        "shop.gold": "🪙 Gold: ",
        "shop.bag": "🎒 Bag: ",
        "shop.buy_btn": "Buy ({price} G)",
        "shop.sell_btn": "Sell (+{price} G)",
        "shop.buy_success": "🎉 Purchased [{name}]! (-{price} G)",
        "shop.sell_success": "💰 Sold [{name}]! (+{price} G)",
        "shop.no_gold": "⚠️ Not enough gold! (Need: {price} G)",
        "shop.bag_full": "⚠️ Backpack is full! (Max 20 slots)",
        "shop.cannot_sell_equipped": "⚠️ Cannot sell currently equipped item.",

        // Trial Shop Modal
        "trial_shop.title": "✨ Astel's Trial Treasury (Legendary Weapon Exchange)",
        "trial_shop.controls": "Controls: [↑ / ↓ Arrows] Select • [ENTER] Exchange with Trial Badges • [F / ESC] Close",
        "trial_shop.coins": "🪙 Trial Badges: ",
        "trial_shop.unit": " pcs",
        "trial_shop.exchange_btn": "Exchange ({price} 🪙)",
        "trial_shop.exchange_success": "🌟 Successfully exchanged [{name}]! (-{price} Trial Badges)",
        "trial_shop.no_coins": "⚠️ Not enough Trial Badges! (Need: {price})",

        // Forge Modal
        "forge.title": "⚒️ Blacksmith's Blazing Forge",
        "forge.desc": "✨ [Permanent Slot Inheritance] Enhancement levels are 100% permanently inherited across all new gear!",
        "forge.controls": "Controls: [↑/↓ Arrows] Select Slot • [ENTER] Upgrade • [F] Close",
        "forge.gold": "Gold: ",
        "forge.upgrade_btn": "Upgrade (+{level} ➔ +{next})",
        "forge.max_level": "⭐ MAX Upgrade Reached",
        "forge.success": "✨ Upgrade Successful! [{slot}] raised to +{level}! (-{price} G)",
        "forge.no_gold": "⚠️ Not enough gold to forge! (Need: {price} G)",

        // Casino Modal
        "casino.title": "🎲 959 Lucky Casino House (Jackpot)",
        "casino.tab_dice": "🎲 Double Dice (High-Low)",
        "casino.tab_slot": "🎰 3-Reel Mini Slots",
        "casino.gold": "🪙 Your Gold: ",
        "casino.bet_display": "🎯 Bet: ",
        "casino.bet_label": "Bet Amount:",
        "casino.dice_sum": "Dice Sum: ",
        "casino.dice_low_title": "📉 LOW (2 ~ 6)",
        "casino.dice_low_sub": "Dice sum 2 to 6",
        "casino.dice_low_pay": "Payout 2.0x",
        "casino.dice_seven_title": "🌟 LUCKY 7 (JACKPOT)",
        "casino.dice_seven_sub": "Dice sum exactly 7",
        "casino.dice_seven_pay": "Jackpot 5.0x",
        "casino.dice_high_title": "📈 HIGH (8 ~ 12)",
        "casino.dice_high_sub": "Dice sum 8 to 12",
        "casino.dice_high_pay": "Payout 2.0x",
        "casino.slot_spin": "🎰 PULL LEVER (SPIN!)",
        "casino.default_comment": "Gambler Jack: \"Pick your game and bet amount, and test your luck!\"",
        "casino.win_dice": "🎉 WON! Gambler Jack: \"Oho! Sharp eye! (+{payout} G)\"",
        "casino.lose_dice": "💸 LOST! Gambler Jack: \"Tough luck! Fortune always comes back around!\"",
        "casino.win_slot": "🎰 JACKPOT! Gambler Jack: \"Incredible! Take your prize (+{payout} G)!\"",
        "casino.win_slot_grand": "👑 GRAND JACKPOT! (+{payout} G & Legendary Stone)",
        "casino.no_gold": "⚠️ Not enough gold to place bet!",

        // Skill Book Modal
        "skillbook.title": "⚡ Uncle Bob's Skill Codex & 9-Slot Custom Loadout",
        "skillbook.controls": "Controls: [↑ / ↓] Select Skill • [ENTER] Assign to Key (Q, W, E, A, S, D, Z, X, C) • [DEL] Unequip • [X] Clear All • [K / F / ESC] Close",
        "skillbook.deck_title": "🎯 Assigned 9 Quick Slots",
        "skillbook.active_slots": "{count} / 9 Slots Active",
        "skillbook.clear_all": "🗑️ Clear All [X]",
        "skillbook.tip": "💡 Tip: You don't need to fill all slots. Place your favorite skills on any preferred key. Clicking an equipped slot unequips it.",
        "skillbook.lib_title": "📖 Skill Library ({count} Total)",
        "skillbook.tab_all": "All",
        "skillbook.tab_warrior": "⚔️ Warrior",
        "skillbook.tab_archer": "🏹 Archer",
        "skillbook.tab_mage": "🪄 Mage",
        "skillbook.tab_rogue": "🗡️ Rogue",
        "skillbook.tab_general": "✨ General",
        "skillbook.slot_empty": "(Empty)",
        "skillbook.not_equipped": "Unequipped",
        "skillbook.click_to_unequip": "Click to unequip",
        "skillbook.awakening_locked_tag": "🔒 2nd Awakening Locked",
        "skillbook.awakening_locked_title": "\"Can you really sleep at that level?\" (Current Lv {level} / Required Lv 50)",
        "skillbook.awakening_locked_desc": "• Reach Lv 50 to unlock class-exclusive 2nd Awakening Passives and Ultimate skills!",
        "skillbook.warrior_passive_tag": "⚔️ 2nd Awakening Passive [Indomitable Sloth Spirit] (Lv {level} Active)",
        "skillbook.warrior_passive_desc": "• When HP drops below 30%, gain +20% Attack and permanently reduce damage taken by 25%",
        "skillbook.archer_passive_tag": "🏹 2nd Awakening Passive [Couch Potato Hawk-Eye] (Lv {level} Active)",
        "skillbook.archer_passive_desc": "• +30% Crit Rate & +30% amplified damage against targets further than 250px",
        "skillbook.mage_passive_tag": "🪄 2nd Awakening Passive [Infinite Mana Reactor] (Lv {level} Active)",
        "skillbook.mage_passive_desc": "• Mana regen +100% (24 MP/s) & 20% chance to immediately reset skill cooldown upon casting",
        "skillbook.rogue_passive_tag": "🗡️ 2nd Awakening Passive [Lethal Sloth Instinct] (Lv {level} Active)",
        "skillbook.rogue_passive_desc": "• Crit Damage +100% (3.0x multiplier) & gain 2s Stealth +100 Move Speed upon defeating any foe",

        // World Map Modal
        "worldmap.title": "🗺️ Arcadia Continent Expedition Atlas",
        "worldmap.current_loc": "📍 Current Location: ",
        "worldmap.mobs_header": "⚔️ Encounter Mobs & Bosses",
        "worldmap.roads_header": "🧭 Connected Expedition Roads",
        "worldmap.tip": "💡 Exploration Tip: Fast travel via map is disabled. Walk into portal gates at the field edges. To safely return to village, use [📜 Town Return Scroll]!",

        // Multiplayer Modal
        "multi.title": "Co-op Multiplayer Lobby",
        "multi.subtitle": "Up to 4-Player Real-Time Co-op & Raid Bosses",
        "multi.nick_label": "🏷️ Set Your Character Nickname",
        "multi.nick_placeholder": "Enter Nickname (Max 12 chars)",
        "multi.random_nick": "🎲 Random Name",
        "multi.host_badge": "👑 Host Room",
        "multi.host_title": "Create a Room",
        "multi.host_desc": "Host a local/online world and invite friends to hunt bosses together.",
        "multi.lan_label": "📱 Same Wi-Fi Invite Address:",
        "multi.copy_btn": "📋 Copy",
        "multi.copied": "Copied! ✅",
        "multi.host_start": "🚀 Host Room & Start Adventure",
        "multi.join_badge": "⚔️ Guest Party",
        "multi.join_title": "Join Friend's Room",
        "multi.join_desc": "Connect to your friend's hosted server URL (e.g. http://192.168.0.X:3000) and join their world.",
        "multi.join_label": "🔗 Host Server Address:",
        "multi.join_start": "⚔️ Join Room & Party Up",
        "multi.back_btn": "← Return to Main Menu",

        // Radar
        "radar.my_loc": "My Location",
        "radar.portal": "Portal",
        "radar.npc": "NPC",
        "radar.enemy": "Enemy",
        "radar.boss": "Boss",
        "radar.close_hint": "[Tab / ESC] Close Radar",

        // Dialogue
        "dialogue.default_speaker": "Village Elder",
        "dialogue.confirm_btn": "Confirm [F/Enter]",
        "dialogue.default_welcome": "Welcome to the village, awakened hero!",

        // In-game Toasts & Alerts
        "toast.saved": "💾 Game saved successfully!",
        "toast.auto_delivery": "🛵 Ding-Dong! [Emergency Potion Delivery] arrived! (HP restored)",
        "toast.level_up": "🎉 LEVEL UP! Reached Lv.{level}! (HP/MP fully refilled, stats boosted)",
        "toast.death": "💀 You collapsed... Revived in village. (Some gold lost)",
        "toast.town_return": "🌀 [Town Return Scroll] Safely teleported to Peaceful Starting Village!",
        "toast.secret_success": "🎁 Secret Reward Claimed: {reward}",
        "toast.secret_invalid": "⚠️ Invalid or already redeemed promo code."
    }
};

// Current active language: 'ko' (default) or 'en'
let currentLanguage = 'ko';

function initI18n() {
    try {
        const saved = localStorage.getItem('zijeossi_lang');
        if (saved === 'ko' || saved === 'en') {
            currentLanguage = saved;
        } else {
            // Auto detect from browser / OS
            const navLang = (navigator.language || navigator.userLanguage || 'ko').toLowerCase();
            if (navLang.startsWith('ko')) {
                currentLanguage = 'ko';
            } else {
                currentLanguage = 'en';
            }
        }
    } catch (e) {
        currentLanguage = 'ko';
    }
    updateAllDOMTranslations();
}

function getLanguage() {
    return currentLanguage;
}

function setLanguage(lang) {
    if (lang !== 'ko' && lang !== 'en') return;
    currentLanguage = lang;
    try {
        localStorage.setItem('zijeossi_lang', lang);
    } catch (e) {}

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update all DOM elements tagged with data-i18n
    updateAllDOMTranslations();

    // Trigger Game UI Refresh if game instance exists
    if (window.game) {
        if (window.game.updateHUD) window.game.updateHUD();
        if (window.game.updateQuestHUD) window.game.updateQuestHUD();
        if (window.game.updateInventoryUI) window.game.updateInventoryUI();
        if (window.game.updateSkillBookUI) window.game.updateSkillBookUI();
        if (window.game.updateShopUI) window.game.updateShopUI();
        if (window.game.updateForgeUI) window.game.updateForgeUI();
        if (window.game.updateCasinoUI) window.game.updateCasinoUI();
        if (window.game.renderWorldMap) window.game.renderWorldMap();
        if (window.game.updateGuideUI) window.game.updateGuideUI();
    }
}

// Translation helper with fallback and interpolation: t('quest.floor_clear', { floor: 5, coins: 10 })
function t(key, params = {}) {
    const dict = I18N_DICTIONARY[currentLanguage] || I18N_DICTIONARY.ko;
    let text = dict[key] || (I18N_DICTIONARY.ko && I18N_DICTIONARY.ko[key]) || key;

    for (const [k, v] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
    return text;
}

// Data object localization helper (e.g. item.name vs item.name_en)
function tData(obj, field = 'name') {
    if (!obj) return '';
    if (currentLanguage === 'en') {
        const enField = `${field}_en`;
        if (obj[enField]) return obj[enField];
    }
    return obj[field] || '';
}

// Update all DOM elements with i18n data attributes
function updateAllDOMTranslations() {
    // 1. Text Content: [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
            el.innerHTML = t(key);
        }
    });

    // 2. Title Tooltips: [data-i18n-title]
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (key) {
            el.setAttribute('title', t(key));
        }
    });

    // 3. Placeholders: [data-i18n-placeholder]
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) {
            el.setAttribute('placeholder', t(key));
        }
    });

    // 4. Update Language Switcher active styles in Title Screen and Settings
    ['titleBtnKo', 'btnLangKo', 'langBtnKo'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (currentLanguage === 'ko') el.classList.add('active');
            else el.classList.remove('active');
        }
    });
    ['titleBtnEn', 'btnLangEn', 'langBtnEn'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (currentLanguage === 'en') el.classList.add('active');
            else el.classList.remove('active');
        }
    });

    // 5. Update Stamped Title Display
    updateTitleScreenDisplay();
}

function updateTitleScreenDisplay() {
    const stampedTitleBox = document.querySelector('.stamped-title-box');
    const subtitleEl = document.getElementById('stampSubtitle');
    const stampedCharsRow = document.querySelector('.stamped-chars-row');

    if (!stampedTitleBox || !stampedCharsRow) return;

    if (currentLanguage === 'en') {
        stampedTitleBox.classList.add('en-mode');
        stampedCharsRow.innerHTML = `
            <div class="en-title-container">
                <div class="en-title-line1">Uncle Bob's</div>
                <div class="en-title-line2">Lazy Awakening</div>
            </div>
        `;
        if (subtitleEl) {
            subtitleEl.innerText = "< Uncle Bob's Lazy Awakening : Awakened But Wants to Sleep >";
        }
    } else {
        stampedTitleBox.classList.remove('en-mode');
        stampedCharsRow.innerHTML = `
            <span id="stampChar1" class="stamp-char">지</span>
            <span id="stampChar2" class="stamp-char">저</span>
            <span id="stampChar3" class="stamp-char">씨</span>
        `;
        if (subtitleEl) {
            subtitleEl.innerText = "< 지저씨 : 각성했지만 게으르고 싶어 >";
        }
    }
}

// Auto initialize on script load
if (typeof window !== 'undefined') {
    window.I18N_DICTIONARY = I18N_DICTIONARY;
    window.t = t;
    window.tData = tData;
    window.getLanguage = getLanguage;
    window.setLanguage = setLanguage;
    window.updateAllDOMTranslations = updateAllDOMTranslations;

    // Attach DOMContentLoaded hook
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initI18n);
    } else {
        initI18n();
    }
}
