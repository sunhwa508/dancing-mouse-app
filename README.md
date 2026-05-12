# 🐭 Dancing Mouse

키보드를 칠 때마다 귀여운 쥐가 춤춥니다. **데스크탑 오버레이** 와 **풀스크린 웹 UI** 두 가지 모드로 동작합니다.

![mouse](./public/mouse-icon.svg)

## 모드

| 모드 | 명령 | 설명 |
|------|------|------|
| **데스크탑 오버레이** | `npm run overlay` | Electron 으로 화면 우하단에 캐릭터만 떠있음. 어디서 타이핑하든 글로벌 키 후킹으로 반응 |
| **웹 UI** | `npm run dev` | 브라우저 풀스크린, 헤더/입력 버퍼/응원 멘트 포함 |

## 빠른 시작

```bash
git clone https://github.com/sunhwa508/dancing-mouse-app.git
cd dancing-mouse-app
npm install

# A) 데스크탑 오버레이 (추천)
npm run overlay

# B) 웹 UI
npm run dev          # http://localhost:5173
```

> **macOS 권한**: 오버레이의 글로벌 키 감지를 위해 첫 실행 시
> `시스템 설정 → 개인정보 보호 및 보안 → 손쉬운 사용` 에서 `Electron` 항목을 켜주세요.
> 권한이 없으면 캐릭터는 떠있지만 키 입력에 반응하지 않습니다.

## 미리보기

- 8개 SVG 댄스 포즈 순환 (`arms-up → lean-right → jump → lean-left → kick → peace → kick-right → spin`)
- 키 입력마다 포즈 전환 + 음표/별 파티클이 위로 튀어오름
- 키 입력이 없으면 부드럽게 숨쉬는 idle 애니메이션
- 오버레이는 frameless / transparent / always-on-top — 드래그로 위치 이동 가능

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
electron/
├── main.cjs                 # transparent / frameless / always-on-top 윈도우 + 글로벌 키 IPC
└── preload.cjs              # window.dancingMouseApi.onKeystroke
src/
├── App.tsx, App.css         # 풀스크린 웹 모드 (헤더, 버퍼, 응원 멘트)
├── OverlayApp.tsx, OverlayApp.css  # 오버레이 모드 (캐릭터만, 투명 배경)
├── main.tsx                 # ?overlay=1 쿼리로 모드 분기
├── components/
│   ├── Mouse.tsx            # 파츠 분리된 SVG 쥐 본체
│   └── Sparkles.tsx         # 음표/별 파티클
├── data/poses.ts            # 8개 포즈 (팔/다리 회전, 꼬리 path, 표정, 응원 멘트)
public/
├── mouse-icon.svg           # favicon
└── mouse/pose-*.svg         # 8개 정적 댄스 이미지
scripts/
├── export-poses.tsx                # SSR 로 정적 SVG 재생성
└── fix-keylistener-perms.cjs       # node-global-key-listener 바이너리 chmod +x
```

## 캐릭터 추가

오버레이는 캐릭터 팩 구조로 되어 있습니다.

```
public/characters/<id>/
├── frame-001.png ... frame-NNN.png   # 알파 채널 PNG 시퀀스 (배경 제거됨)
└── thumb.png                          # 설정 화면 썸네일
src/characters/registry.ts             # 메타데이터 등록
```

새 캐릭터 추가는 헬퍼 스크립트로 한 방에:

```bash
# 1) 한 번만: 배경 제거용 Python venv 셋업
python3 -m venv .venv
.venv/bin/pip install "rembg[cpu,cli]"

# 2) 캐릭터 인제스트
scripts/add-character.sh <gif-url> <id> [every-N=8] [scale-w=200]

# 예시:
scripts/add-character.sh https://media1.tenor.com/.../cat-dance.gif cat
```

스크립트가 GIF 다운로드 → ffmpeg 으로 프레임 추출 → `rembg birefnet-general` 로 배경 제거 →
썸네일 생성까지 자동 수행하고 마지막에 `src/characters/registry.ts` 에 붙여 넣을 메타데이터를
출력합니다. 그것만 등록하면 설정 패널의 캐릭터 그리드에 자동 등장.

## 오버레이 설정 (⚙)

오버레이 위에 마우스 올리면 우상단에 톱니바퀴가 나타납니다.

- **캐릭터 선택** — 그리드에서 클릭
- **크기 조절** — 120 ~ 600 px 슬라이더 (Electron 창 자체가 IPC 로 리사이즈됨)
- **종료** — 앱 quit
- 설정은 `localStorage` 에 저장되어 다음 실행 시 복원됨

## 다음 단계 아이디어

- 사운드: Web Audio API 로 키 입력 시 부드러운 팝 사운드
- 콤보 효과: 연타 시 더 격렬한 애니메이션 / 다른 sparkle 패턴
- 캐릭터 팩 마켓플레이스 (드래그&드롭으로 폴더 인제스트)
- 프로덕션 패키징 (`electron-builder` 로 .dmg 빌드 + 코드 사인)

## 라이선스

MIT
