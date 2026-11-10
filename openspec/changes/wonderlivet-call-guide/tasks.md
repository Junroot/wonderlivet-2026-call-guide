## 1. 저장소 기본 구성

- [x] 1.1 `index.html`, `src/`, `data/`, `tools/` 디렉터리와 `.nojekyll`을 만들고, `index.html`에 `noindex` 메타 태그와 ES 모듈 진입점(`src/main.js`)을 넣는다
- [x] 1.2 `README.md`에 로컬 실행 방법(`npx serve .` 등 정적 서버 사용, `file://`로는 YouTube 임베드가 동작하지 않음)과 콘텐츠 추가 절차를 적는다
- [x] 1.3 `package.json`에 의존성 없이 `validate`, `test` 스크립트만 정의한다(`node --test`)

## 2. 데이터 형식과 도구

- [x] 2.1 `src/cue-time.js`에 콜 시간 계산(`{line, offset}`은 0 기준 첨자 `lines[line].t + offset` / `{t}` / 시간 미정이면 null)과 영상 시간 변환(`+ offsetSec`) 함수를 만들고 `node --test`로 단위 테스트한다
- [x] 2.2 `tools/validate.mjs`를 만든다. song-data 명세의 오류·경고 규칙을 검사하고 오류가 없을 때만 `data/songs/index.json`을 생성한다. 범위 밖 줄 참조(30줄 곡의 `line: 30`은 오류, `line: 29`는 정상), 빈 `sources[]`, 없는 `artistId`, `{t: null}` 콜이 경고만 내고 색인을 막지 않는 사례를 테스트한다
- [x] 2.3 `tools/fetch-lrclib.mjs`를 만든다. 길이가 가장 가까운 동기화 가사를 고르고, 동기화 가사가 없으면 일반 가사로 `t: null` 뼈대를 만들며, 기존 파일은 덮어쓰지 않는다
- [x] 2.4 `data/lineup.json`에 곡 데이터 대상 22팀의 일자·스테이지·시간·한글 이름과 공연 의식(오랄 「4本打ち」, 삼보마스터 「全員優勝!」, 스이세이 「今日もかわいい」, QWER 멤버 이름 연호)을 넣는다. 출처는 `research/`를 따른다

## 3. 목록 화면 (song-catalog)

- [x] 3.1 `src/router.js`에 해시 라우팅(`#/`, `#/artist/<id>`, `#/song/<id>`, `#/edit/<id>`)과 "찾을 수 없음" 화면을 만든다
- [x] 3.2 첫 화면에 일자 탭을 만든다. 곡이 있는 아티스트만 시작 시간 순으로 보여주고, 오늘 이후 가장 가까운 공연일을 기본 탭으로 고른다
- [x] 3.3 아티스트 화면에 공연 의식, 곡 목록, 콜 종류 아이콘, 검수 상태 표시를 만든다
- [x] 3.4 모바일 폭(360px)과 데스크톱에서 레이아웃이 깨지지 않는지 확인한다

## 4. 연습 화면 (practice-player)

- [x] 4.1 `src/player.js`에 YouTube IFrame API 로더와 `getCurrentTime` 보간(rAF + `performance.now()`, 일시정지·탐색·속도 변경 시 기준값 재설정)을 만든다
- [x] 4.2 가사 줄 목록(원문 + 한글 발음)과 줄 아래 콜 표시를 렌더링하고, 현재 줄 강조와 자동 스크롤을 붙인다
- [x] 4.3 콜 표시 영역에 "다음"(1.5초 전), "지금" 상태를 만들고, 펜라이트 색은 `color`로 표시한다. 시간을 계산할 수 없는 콜은 강조 없이 목록에만 표시한다
- [x] 4.4 가사 줄 클릭 탐색, 재생 속도(0.75배/1배), 발음 표시 켜고 끄기(`localStorage`에 유지)를 만든다
- [x] 4.5 임베드 차단 오류(101/150)가 나면 YouTube 링크로 대체 표시하고, 출처 링크 목록을 화면 아래에 붙인다
- [ ] 4.6 샘플 곡 하나(狂乱 Hey Kids!!)로 강조 오차가 0.2초 이내인지 직접 재생해 확인한다 — **사용자 확인**
- [x] 4.7 외부 재생 모드: 임베드 차단(101/150)이나 영상 미지정이면 자동 전환하고, 직접 고를 수도 있게 한다. 가사 줄 누르기로 시계 맞추기, ±0.5초, 일시정지를 만들고 보정 도구도 같은 시계를 쓰게 한다

## 5. 타이밍 보정 도구 (timing-editor)

- [x] 5.1 `#/edit/<id>` 화면에서 Space로 다음 대상(시간 없는 줄, `{t: null}` 콜, 아직 기록하지 않은 줄 기준 콜 — 줄 기준 콜은 자신이 붙은 줄 뒤)에 시간을 기록하고, 항목을 눌러 대상을 바꿀 수 있게 한다. 줄 기준 콜에는 `offset = 현재 가사 시간 - lines[line].t`를 기록하고, 기록 여부는 작업 상태에만 둔다
- [x] 5.2 ←/→(0.1초), Shift+←/→(0.01초) 미세 조정(줄 기준 콜은 `offset` 조정)과 조정 후 1초 전부터 다시 재생하는 기능, 순서 역전 경고를 만든다
- [x] 5.3 `offsetSec` 직접 입력과 "첫 가사 줄을 지금으로" 버튼을 만들고, 영상 로드 시 `youtube.durationSec`를 기록한다
- [x] 5.4 `localStorage` 자동 저장과 이어 하기/버리기 안내, JSON 내려받기와 클립보드 복사, "타이밍 검수 완료" 체크를 만든다

## 6. 배포

- [ ] 6.1 GitHub에 공개 저장소를 만들고 push한 뒤 Pages를 `main` / `(root)`로 켠다 — **사용자 승인 후 진행**
- [ ] 6.2 배포 URL에서 첫 화면, 샘플 곡 연습 화면, 보정 화면이 동작하는지 확인한다

## 7. 곡 데이터: 금요일 11/20 (11곡)

대상: 狂乱 Hey Kids!!, カンタンナコト (THE ORAL CIGARETTES) / ビビデバ, ソワレ (호시마치 스이세이) / ANIMA, GG (ReoNa) / IN_MY_HEAD (natori) / 踊楽園 (CLAN QUEEN) / ファジーネーブル (Conton Candy) / 条司 (jo0ji) / ケダモノのフレンズ (nishina)

- [x] 7.1 곡마다 임베드 가능한 공식 음원 또는 MV를 고르고 `fetch-lrclib.mjs`로 뼈대를 만든다. LRCLIB에 없는 곡은 따로 기록한다
- [x] 7.2 `research/`의 출처를 따라 콜을 `cues[]`에 넣는다. `at.line`은 0 기준 첨자로 적고(N번째 줄 → `N - 1`), 가사 없는 구간의 절대 시간 콜은 `{t: null}`로 적는다. 공식 콜 영상이 있는 곡은 영상과 대조한다
- [ ] 7.3 일본어 가사에 한글 발음 초안을 넣고 `validate`를 통과시킨 뒤 배포한다 (발음 초안·validate 완료, 배포는 승인 대기. 곡별 상태는 `research/content-status.md`)
- [ ] 7.4 보정 도구로 타이밍을 검수하고 발음을 검수한다 — **사용자 검수**

## 8. 곡 데이터: 토요일 11/21 (24곡)

대상: 閃光, ワタリドリ, starrrrrrr, Kick & Spin, ENDROLL ([Alexandros]) / FIRE BIRD, BLACK SHOUT, PASSIONATE ANTHEM, Neo-Aspect, Song I am., R (Roselia) / 世界はそれを愛と呼ぶんだぜ, できっこないを やらなくちゃ, ヒューマニティ！, 花束 (SAMBOMASTER) / オドループ, スパークルダンサー (FREDERIC) / 影色舞, 迷星叫, 壱雫空, 往欄印 (MyGO!!!!!) / 私、アイドル宣言, 今日もサクラ舞う暁に (CHiCO with HoneyWorks) / PONPONPON (Kyary Pamyu Pamyu)

- [x] 8.1 영상 선택과 LRCLIB 뼈대 생성 (7.1과 같은 절차)
- [x] 8.2 콜 입력. 往欄印은 디시 콜표 이미지 05를 확인해야 상세 콜을 넣을 수 있다 (往欄印은 My One Ticket 가이드로 입력)
- [ ] 8.3 한글 발음 초안, `validate` 통과, 배포 (발음 초안·validate 완료, 배포는 승인 대기)
- [ ] 8.4 타이밍과 발음 검수 — **사용자 검수**

## 9. 곡 데이터: 일요일 11/22 (21곡)

대상: 冥冥, ダンス・デカダンス, 銃電中, FLASH BACK!!!!!!!!, Banquet (Chevon) / 고민중독, 내 이름 맑음, Discord (QWER) / SWEET STEP, Call me Tell me, ハートの魔法, DASH!!!, カワイイコレクション (SWEET STEADY) / 夏色, ビューティフル, サヨナラバス (YUZU) / さくらんぼ (Ai Otsuka) / 倍倍FIGHT!, 総意♡So Free, キス・ミー・パティシエ (CANDY TUNE) / フィナーレ。 (eill)

- [x] 9.1 영상 선택과 LRCLIB 뼈대 생성 (7.1과 같은 절차)
- [ ] 9.2 콜 입력. KAWAII LAB. 두 팀은 공식 Cheering Guide 영상과 대조한다 (15곡 완료. 영상은 볼 수 없어 글 출처로만 입력. QWER Discord는 콜 0개)
- [ ] 9.3 한글 발음 초안(한국어 곡은 `ko: null`), `validate` 통과, 배포 (발음 초안·validate 완료, 배포는 승인 대기)
- [ ] 9.4 타이밍과 발음 검수 — **사용자 검수**

## 10. 미조사 곡 재조사

- [x] 10.1 검색 한도 때문에 못 찾아본 약 28곡(`research/final-songs.md`의 "미조사" 목록)을 재조사하고, 결과를 `research/extra-calls-*.md`에 덧붙인다. 디시인사이드 갤러리의 원더리벳 2026 대비 콜표를 먼저 찾는다
- [x] 10.2 JavaScript로만 열리는 페이지(myoneticket.ing)와 디시 콜표 이미지는 브라우저 자동화로 읽을지 사용자에게 확인한 뒤 진행한다
- [ ] 10.3 기준(응원 정보 있음 + 셋리스트 40% 이상)을 통과한 곡을 해당 일자 섹션 절차로 추가한다

## 11. 마무리 확인

- [x] 11.1 `lineup.json`의 스테이지·시간을 공식 발표(wonderli.vet, 공식 X)와 대조해 고친다
- [ ] 11.2 전체 곡이 `validate`를 경고 없이 통과하는지, 검수 미완료 곡이 화면에 표시되는지 확인한다
