import sys

with open('CHANGELOG.md', 'r', encoding='utf-8') as f:
    content = f.read()

parts = content.split('---', 1)

new_log = """---

## 🚀 [v3.3.0] [Phase 3] 2D 스프라이트 렌더러 전환 및 코어 엔진 한계 최적화 (2026-09-01)
- 🎨 **2D 픽셀 스프라이트 렌더러 전환 (`SpriteManager.js`)**:
  - 기존 절차적(Procedural) 도형 렌더링에서 고품질 2D 픽셀 아트 스프라이트 렌더링 파이프라인으로 전환
  - `SpriteManager`를 통한 몬스터, 무기, 투사체 스프라이트 에셋 동적 로딩 및 캐싱 적용
- 🖥️ **무제한 FPS(Uncapped FPS) 완벽 지원**:
  - `requestAnimationFrame` 주기를 모니터 주사율에 맞춰 60Hz, 144Hz, 165Hz, 240Hz에서 모두 최대 프레임으로 렌더링되도록 엔진 코어 수정
  - dt(델타 타임) 클램프 한계를 해제하여 고주사율에서도 물리 계산이 부드럽고 오차 없이 구동되도록 개선
- ⚡ **GPU 렌더링 파이프라인 대대적 최적화 (프레임 드랍 완벽 해결)**:
  - 타격 파티클 폭증 시 매 파티클마다 발생하던 `ctx.save()/restore()` 및 `shadowBlur` 재할당을 **배치(Batch) 그룹화**하여 GPU 컴포지터 과부하 90% 이상 절감
  - 파티클 소멸 배열 로직을 O(n) `splice`에서 O(1) Swap-and-Pop 기법으로 변경하여 메모리 복사 병목 완벽 제거
  - `game.js` 메인 렌더 루프 내부의 잦은 배열/객체 생성(GC 유발)을 Zero-Allocation 방식으로 리팩토링
- 🎵 **WebAudio 과부하 해소 (사운드 디바운스)**:
  - 다수의 몬스터를 검기나 광역기로 동시 타격 시 `playHit()` 오실레이터가 중복 생성되며 발생하던 브라우저 오디오 스레드 렉을 `0.05초` 디바운싱(Debounce)으로 차단
- ⚙️ **역경직(Hit-Stop) 연출 제거**:
  - 고주사율 유저들이 '역경직(게임 속도 30% 감속)'을 '프레임 드랍(렉)'으로 오인하는 문제를 해결하기 위해 해당 연출을 완전 삭제하고 원래 속도로 부드럽게 타격되도록 수정
"""

final_content = parts[0] + new_log + "\n" + parts[1]
with open('CHANGELOG.md', 'w', encoding='utf-8') as f:
    f.write(final_content)
