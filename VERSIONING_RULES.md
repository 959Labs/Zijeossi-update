# 🚀 Zijeossi Game - Version Release Protocol (공식 배포 수칙)

버전업(Version Bump)을 진행할 때마다 아래 5개 필수 파일 세트를 동시에 누락 없이 100% 동기화하여 갱신합니다.

## 1. 버전업 필수 동기화 파일 체크리스트
1. **`version.json`**:
   - `"version"`: 최신 버전 표기 (예: `"v2.1.2"`)
   - `"patchNotes"`: 인게임 모달에 노출될 핵심 패치 내역 리스트 갱신
2. **`game.js`**:
   - `this.version = 'v2.1.x'` 버전 문자열 동기화
   - 타이틀/HUD 내 버전 배지 동기화
3. **`CHANGELOG.md`**:
   - 상단에 신규 버전 섹션(`## 🌟 [v2.1.x] ... (YYYY-MM-DD)`) 추가
   - 신규 기능, 시스템 밸런스, 버그 수정 내역 상세 기록
4. **`README.md`**:
   - 상단 버전 배지(`![Version](...v2.1.x...)`) 갱신
   - 주요 특징 및 개발 연대기 요약 최신화
5. **`build_exe.py` 자동 빌드**:
   - 새 코드가 반영된 `지저씨.exe` 및 `Zijeossi.exe` 최종 동기화 빌드 및 AppData 캐시 청소

## 2. 깃허브(GitHub) 경량 배포 파일 4종
배포 시에는 아래 4개 파일만 깃허브에 Commit/Push:
- `game.js`
- `version.json`
- `CHANGELOG.md`
- `README.md`
