# 🐭 Dancing Mouse — Web UI

키보드를 칠 때마다 귀여운 쥐가 춤추는 풀스크린 웹 UI.

![mouse](./public/mouse-icon.svg)

## 미리보기

- 8개 SVG 댄스 포즈 순환 (`arms-up → lean-right → jump → lean-left → kick → peace → kick-right → spin`)
- 키 입력마다 포즈 전환 + 음표/별 파티클이 위로 튀어오름
- 좌상단 키 카운터, 우상단 현재 포즈 이름
- 하단에 최근 입력 버퍼 표시 (40자까지)
- 키 입력이 없으면 부드럽게 숨쉬는 idle 애니메이션

## 실행

```bash
git clone https://github.com/sunhwa508/dancing-mouse-app.git
cd dancing-mouse-app
npm install
npm run dev          # http://localhost:5173 에서 열림
```

## 빌드

```bash
npm run build        # dist/ 에 정적 파일 생성
npm run preview      # 빌드 결과 미리보기
```

## 정적 SVG 이미지 추출

8개 포즈는 `public/mouse/pose-*.svg` 에 정적 파일로도 들어있어요. 이미지를 새로
빼고 싶으면:

```bash
npm run export-poses
```

`scripts/export-poses.tsx` 가 React SSR 로 각 포즈를 렌더링해서 `public/mouse/`
와 `public/mouse-icon.svg` 를 갱신합니다.

## 구조

```
src/
├── App.tsx, App.css         # 무대 + 키 입력 핸들러
├── components/
│   ├── Mouse.tsx            # 파라미터로 분리된 SVG 쥐 본체
│   └── Sparkles.tsx         # 키 입력 시 떠오르는 파티클
├── data/poses.ts            # 8개 포즈 (팔/다리 회전, 꼬리 path, 표정, 응원 멘트)
public/
├── mouse-icon.svg           # favicon
└── mouse/pose-*.svg         # 8개 정적 댄스 이미지
scripts/
└── export-poses.tsx         # SSR 로 정적 SVG 재생성
```

## 다음 단계 아이디어

- 사운드: Web Audio API 로 키 입력 시 부드러운 팝 사운드
- 콤보 효과: 연타 시 더 격렬한 애니메이션
- 데스크탑 앱: Tauri 로 래핑 + 글로벌 키 후킹 (macOS 접근성 권한 필요)
- 테마: 캐릭터 스킨 (생쥐 외에 토끼, 곰 등)

## 라이선스

MIT
