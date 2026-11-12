# 예상 세트리스트 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 42팀의 예상 세트리스트를 `data/setlists.json`에 담고 아티스트 화면과 홈 화면에 보여 준다.

**Architecture:** 세트리스트는 손으로 정리한 결과만 담는 별도 JSON 파일이다. `npm run validate`가 곡 데이터와 함께 이 파일을 검사하고, `loadCatalog()`가 함께 불러와 화면에 넘긴다. 조사는 `research/setlist-expected-<묶음>.{md,json}`에 서브에이전트가 쓰고, 마지막 작업에서 합친다.

**Tech Stack:** 빌드 없는 정적 사이트 (HTML + ES 모듈 + JSON), Node 내장 `node:test`

**Spec:** `docs/superpowers/specs/2026-11-12-expected-setlist-design.md`

## Global Constraints

- 등급 값은 `sure` / `likely` / `maybe`, 화면 표기는 확실 / 유력 / 가능.
- 등급 기준: 80% 이상 `sure`, 50% 이상 80% 미만 `likely`, 그 아래 `maybe`.
- `seen`은 `null` 또는 `[k, n]` (정수, 0 ≤ k ≤ n, n ≥ 1).
- 곡 제목은 원제 표기 (일본 곡 일본어, 한국 곡 한국어).
- 검증 오류가 있으면 `data/songs/index.json`을 만들지 않는다 (기존 동작 유지).
- 공식 타임테이블은 2026-11-12 재확인 결과 2026-11-10 기록과 같다. `research/timetable-official.md`는 고치지 않는다.

## Review Focus

1. `songs`가 빈 아티스트: 아티스트 화면에 "예상할 근거가 부족합니다"와 `note`가 보이고, 홈에도 카드가 보여야 한다. (Task 2, 5의 화면 확인 단계)
2. `seen: null`인 곡: 횟수 자리를 비우고 "null"이나 "undefined"를 출력하지 않아야 한다. (Task 2 화면 확인)
3. 다른 아티스트의 곡을 가리키는 `songId`: 링크가 엉뚱한 곡으로 가지 않게 검증 오류여야 한다. (Task 1 테스트)
4. `lineup.json`에 없는 아티스트 키 (오타 난 id): 화면에 영영 안 보이므로 검증 오류여야 한다. (Task 1 테스트)
5. 휴대폰 폭(375px)에서 긴 일본어 제목: 줄바꿈되고 가로 스크롤이 생기지 않아야 한다. (Task 2 화면 확인)

---

### Task 1: 세트리스트 검증

**Files:**
- Create: `tools/lib/validate-setlists.mjs`
- Create: `data/setlists.json` (`{ "updated": "2026-11-12", "artists": {} }`)
- Modify: `tools/validate.mjs` (setlists 읽기, 오류·경고 합치기)
- Test: `test/validate-setlists.test.mjs`

**Interfaces:**
- Produces: `validateSetlists(setlists, { artistIds: Set<string>, songs: Map<string, { artistId: string }> }) -> { errors: {where, message}[], warnings: {where, message}[] }`. `where`는 `data/setlists.json` 또는 `data/setlists.json artists.<id>` / `... artists.<id> songs[<i>]` 형식.

- [ ] **Step 1: 실패하는 테스트 작성** (`test/validate-setlists.test.mjs`)

정상 항목 하나(`basis`, `songs` 1곡, `candidates: []`, `sources` 1개, `note: null`)를 만드는 `makeEntry(over)` 도우미를 두고 아래를 확인한다.
- `valid entry passes`: errors 0
- `unknown artist key`: `artists.nope` → 오류 메시지에 `lineup.json에 없는 아티스트` 포함
- `bad tier`: `tier: 'certain'` → 오류
- `bad seen`: `[3, 2]`, `[1, 0]`, `[1.5, 3]`, `'2/3'` 각각 오류. `null`과 `[0, 4]`는 통과
- `songId of other artist`: `songs`에 `{ id: 'x', artistId: 'other' }`가 있을 때 `songId: 'x'` → 오류. 없는 id도 오류
- `candidates checked too`: `candidates[0].seen = [5, 2]` → 오류
- `missing fields`: `basis`, `songs`, `candidates`, `sources`, `note` 각각 빠지면 오류 (`note: null`은 통과)
- `no source url`: `sources: [{ label: 'x' }]` → 오류
- `bad updated`: `updated: '11/12'` → 오류
- `missing setlist warns`: `artistIds`에 있는데 항목이 없는 아티스트 → warnings 1, errors 0

- [ ] **Step 2: 테스트 실행해 실패 확인**

Run: `node --test test/validate-setlists.test.mjs`
Expected: FAIL (모듈 없음)

- [ ] **Step 3: `validateSetlists` 구현**

`validate-songs.mjs`의 `isStr`·`isNum` 스타일을 따른다. 곡 항목 검사(`title`, `tier`, `seen`, `songId`)는 `songs[]`와 `candidates[]`가 같은 함수를 쓰되, `candidates[]`는 `tier`가 없다.

- [ ] **Step 4: 테스트 통과 확인**

Run: `node --test test/validate-setlists.test.mjs`
Expected: PASS

- [ ] **Step 5: `tools/validate.mjs` 연결**

`data/setlists.json`을 읽고(읽기 실패는 오류), `lineup.artists`의 id 집합과 `songs`의 `data.id → { artistId }` 맵을 넘긴다. 오류는 `errors`에, 경고는 출력에 합친다. 콘솔 요약 줄에 세트리스트 아티스트 수를 덧붙인다.

- [ ] **Step 6: 전체 확인**

Run: `npm test && npm run validate`
Expected: 테스트 전부 PASS. validate는 오류 0, 경고에 "세트리스트 없음" 23개, `index.json 생성 완료`

- [ ] **Step 7: 커밋**

`git add tools/lib/validate-setlists.mjs tools/validate.mjs test/validate-setlists.test.mjs data/setlists.json` 후 "세트리스트 검증 추가".

---

### Task 2: 세트리스트 불러오기와 화면

**Files:**
- Modify: `src/data.js` (`loadCatalog`)
- Modify: `src/views/artist.js` (세트리스트 칸)
- Modify: `src/views/home.js:59-71` (아티스트 필터, 카드 설명)
- Modify: `src/style.css` (세트리스트 목록, 등급 배지)

**Interfaces:**
- Consumes: `data/setlists.json` 형식 (spec 1장)
- Produces: `loadCatalog()` 반환값에 `setlists: Map<artistId, entry>`, `setlistsUpdated: string` 추가

- [ ] **Step 1: `loadCatalog()`에 `data/setlists.json` 추가**

기존 `Promise.all`에 세 번째 `getJson`으로 넣는다.

- [ ] **Step 2: 아티스트 화면에 세트리스트 칸 추가**

공연 의식 칸과 곡 목록 칸 사이. 기존 `h('section.rituals' ...)` 구조를 따른다.
- 제목: `h('h2.section-label', h('span', 'SETLIST'), \`예상 세트리스트 (약 ${n}곡)\`)`
- 목록 `ol.setlist`: 곡마다 제목, `span.tier.tier-<sure|likely|maybe>` (확실/유력/가능), `seen`이 있으면 `k/n`, `songId`가 있으면 `#/song/<songId>`로 가는 "▶ 연습" 링크, 곡 `note`가 있으면 작은 글씨
- `songs`가 비면 목록 대신 `p.empty` "예상할 근거가 부족합니다."
- 후보: `candidates`가 있으면 `후보: 제목 (k/n) · ...`
- 아티스트 `note`, `근거: <basis>`, 출처 링크(공연 의식의 `p.sources` 형식), `갱신 <setlistsUpdated>`
- 세트리스트 항목이 없으면 칸을 그리지 않는다

- [ ] **Step 3: 홈 화면 필터와 카드 설명 수정**

필터를 `songsByArtist.has(a.id) || setlists.has(a.id)`로 바꾼다. 카드 설명의 곡 수 자리는 곡이 있으면 `N곡`, 없으면 `세트리스트만`. 빈 목록 문구는 "이 날은 아직 데이터가 있는 아티스트가 없습니다."로 바꾼다.

- [ ] **Step 4: 스타일 추가**

등급 배지는 기존 테마 변수 안에서 세 단계가 구분되게 한다 (`sure`는 주황 채움, `likely`는 주황 테두리, `maybe`는 흐린 테두리처럼). 제목은 `overflow-wrap: anywhere`로 줄바꿈되게 한다.

- [ ] **Step 5: 시험용 데이터로 화면 확인**

`data/setlists.json`에 임시로 두 항목을 넣는다: `oral-cigarettes`(곡 3개, 하나는 `songId: "oral-kyouran-hey-kids"`, 하나는 `seen: null`)와 `jo0ji`(`songs: []`, `note` 있음). `npm run validate` 후 `python3 -m http.server 8000`으로 `http://localhost:8000`을 열어 확인한다.
- 홈 11/20 탭에 jo0ji 카드가 "세트리스트만"으로 보인다
- ORAL 화면: 등급 배지 3종, `seen: null` 곡에 횟수 없음, 연습 링크가 연습 화면으로 간다
- jo0ji 화면: "예상할 근거가 부족합니다."와 메모
- 375px 폭에서 가로 스크롤 없음
확인 후 임시 항목은 지운다 (`artists: {}`로 되돌림).

- [ ] **Step 6: 커밋**

"아티스트 화면에 예상 세트리스트 표시, 홈에 세트리스트만 있는 팀 표시".

---

### Task 3: 라인업에 19팀 추가

**Files:**
- Modify: `data/lineup.json`

**Interfaces:**
- Consumes: 조사 에이전트가 정한 id와 한글 이름 (`research/setlist-expected-*.json`의 키, 각 에이전트 보고)
- Produces: 아래 id들이 `lineup.json`에 존재: `aiweo`, `song-sohee`, `da-ice`, `idiotape`, `amazarashi`, `thornapple`, `shepherd-bois`, `midnight-grand-orchestra`, `tak-miku-teto`, `tani-yuuki`, `indigo-la-end`, `hanroro`, `tomatomat`, `kuromi`, `brandy-senki`, `mrch`, `humbreaders`, `nell`, `sukimaswitch`

- [ ] **Step 1: 19팀 항목 추가**

`name`은 공식 타임테이블 표기, `date`·`stage`·`start`·`end`는 `research/timetable-official.md` 값, `rituals: []`. 한국 팀의 `nameKo`는 한국어 이름(넬, 한로로 등), 일본 팀은 통용 한글 표기. 배열 안 위치는 기존 항목과 같은 일자 묶음 안에 둔다.

- [ ] **Step 2: 검증**

Run: `npm run validate`
Expected: 오류 0, "세트리스트 없음" 경고 42개

- [ ] **Step 3: 커밋**

"라인업에 곡 데이터가 없던 19팀 추가".

---

### Task 4: 조사 결과를 `data/setlists.json`으로 합치기

**Files:**
- Modify: `data/setlists.json`
- Add: `research/setlist-expected-{jrock,jpop,korean,idol,virtual}.{md,json}` (조사 에이전트 산출물)

- [ ] **Step 1: 다섯 JSON 합치기**

키가 겹치지 않는지, 42팀이 모두 있는지 확인하며 `artists`에 합친다. `updated`는 합친 날짜.

- [ ] **Step 2: `songId` 연결**

`data/songs/index.json`의 같은 아티스트 곡 제목과 `songs[].title`·`candidates[].title`을 대조해 `songId`를 넣는다. 제목 표기가 달라 자동으로 안 맞는 곡은 손으로 맞춘다.

- [ ] **Step 3: 등급 검토**

각 곡의 `seen` 비율이 등급 기준과 맞는지 확인하고, 다르면 곡 `note`에 이유가 있는지 본다. 이유가 없으면 등급을 기준대로 고친다.

- [ ] **Step 4: 검증**

Run: `npm test && npm run validate`
Expected: PASS, 오류 0, "세트리스트 없음" 경고 0

- [ ] **Step 5: 화면 확인**

로컬 서버에서 세 일자 홈 화면에 42팀이 모두 보이는지, 근거 부족 팀 한 곳과 곡 데이터가 많은 팀(Roselia) 한 곳을 열어 본다.

- [ ] **Step 6: 커밋**

"42팀 예상 세트리스트 추가".
