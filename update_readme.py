import re

with open('README.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Update version badge
content = re.sub(r'version-v\d+\.\d+\.\d+', 'version-v3.3.0', content)

# Add to 개발 연대기
new_history = "- **2026-08-25**: **v3.0.0 4인 실시간 코옵 멀티플레이 & 보스 레이드 대규모 업데이트 완성**\n- **2026-09-01**: **v3.3.0 다국어(i18n) 번역 시스템 완비, 타격감(Game Juice) 극대화, 2D 픽셀 스프라이트 전환 및 엔진 GPU 렌더링 한계 최적화 완료**"
content = content.replace("- **2026-08-25**: **v3.0.0 4인 실시간 코옵 멀티플레이 & 보스 레이드 대규모 업데이트 완성**", new_history)

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(content)
