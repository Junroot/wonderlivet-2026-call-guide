# 예상 세트리스트 설계

작성: 2026-11-12

## 목적

WONDERLIVET 2026(2026-11-20~22) 공식 타임테이블의 42팀 전부에 대해 예상 세트리스트를 만들고, 사이트 아티스트 화면에 보여 준다. 공연 전에 아티스트 화면만 열면 어떤 곡이 어떤 순서로 나올 것 같은지, 그 예상을 얼마나 믿을 만한지 알 수 있어야 한다. 콜 데이터가 있는 곡은 바로 연습 화면으로 넘어갈 수 있어야 한다.

## 결정 사항

| 항목 | 결정 |
|---|---|
| 표시 위치 | 사이트 아티스트 화면 (`#/artist/<id>`) |
| 범위 | 공식 타임테이블 42팀 전부. 곡 데이터가 없는 19팀도 아티스트로 추가한다 |
| 표시 방식 | 예상 공연 순서 + 곡별 등급(확실/유력/가능) + 최근 등장 횟수, 아래에 후보곡 |
| 데이터 위치 | 별도 파일 `data/setlists.json`. 등장 횟수와 등급은 조사 결과를 사람이 정리해 적는다 (계산 도구는 만들지 않는다) |

## 1. 데이터 구조: `data/setlists.json`

```json
{
  "updated": "2026-11-12",
  "artists": {
    "oral-cigarettes": {
      "basis": "최근 페스·게스트 세트 6회 (2026-04 ~ 10, setlist.fm·LiveFans)",
      "songs": [
        { "title": "狂乱 Hey Kids!!", "tier": "sure", "seen": [5, 6], "songId": "oral-kyouran-hey-kids" },
        { "title": "DUNK", "tier": "likely", "seen": [5, 6] }
      ],
      "candidates": [{ "title": "5150", "seen": [1, 6] }],
      "sources": [{ "label": "setlist.fm THIS FES '26", "url": "https://..." }],
      "note": null
    }
  }
}
```

### 필드

| 필드 | 필수 | 의미 |
|---|---|---|
| `updated` | O | 마지막으로 갱신한 날짜 (`YYYY-MM-DD`) |
| `artists` | O | 키는 `lineup.json`의 아티스트 id |
| `basis` | O | 근거를 한 문장으로. 조사한 공연 수·기간·출처 사이트 |
| `songs[]` | O | 예상 공연 순서대로 적은 곡. 근거가 없으면 빈 배열 |
| `songs[].title` | O | 원제 표기 (일본 곡은 일본어, 한국 곡은 한국어) |
| `songs[].tier` | O | `sure` / `likely` / `maybe` |
| `songs[].seen` | O | `[등장 횟수, 조사한 공연 수]`. 근거가 없으면 `null` |
| `songs[].songId` | - | 곡 데이터가 있을 때만. 화면에서 연습 링크가 된다 |
| `songs[].note` | - | 등급을 숫자와 다르게 매긴 이유 등 |
| `candidates[]` | O | 예상 목록에는 못 들었지만 나올 수 있는 곡. 없으면 빈 배열. 형식은 `{ title, seen, songId?, note? }` |
| `sources[]` | O | 출처 `{ label, url }`. 최소 하나 |
| `note` | O | 아티스트 단위 메모 (근거 부족 사유 등). 없으면 `null` |

### 곡 수와 순서

- 곡 수는 슬롯 길이(30~60분)와 그 팀의 최근 페스 곡 수 중앙값으로 정한다.
- 순서는 최근 페스에서 그 곡이 주로 놓인 자리(오프닝, 중반, 마지막)를 따른다. 순서 근거가 약하면 `basis`나 `note`에 적는다.

### 등급 기준

| 등급 | 화면 표기 | 기준 (최근 페스 등장률) |
|---|---|---|
| `sure` | 확실 | 80% 이상 |
| `likely` | 유력 | 50% 이상 80% 미만 |
| `maybe` | 가능 | 50% 미만이지만 곡 수를 채우거나 다른 근거가 있는 곡 |

신곡 발매, 한국 공연에서만 부른 곡처럼 숫자 밖의 이유로 등급을 올리거나 내리면 그 곡의 `note`에 이유를 적는다.

### 근거가 부족한 팀

버추얼·신인처럼 최근 공연 기록이 거의 없는 팀은 `songs`를 비우거나 `maybe`만 두고, 아티스트 `note`에 "근거 부족"과 그 이유를 적는다. `seen`은 `null`로 둔다.

## 2. 라인업 추가

- 구현 전에 공식 사이트(https://www.wonderli.vet/home) 타임테이블을 다시 확인한다. 2026-11-10 자료(`research/timetable-official.md`)와 다른 점이 있으면 그 문서와 `lineup.json`을 함께 고친다.
- `data/lineup.json`에 없는 19팀을 추가한다. 필드는 기존 규칙(`validateLineup`)을 따른다: `id`, `name`, `nameKo`, `date`, `stage`, `start`, `end`, `rituals: []`.
- 추가할 19팀: A I W E O, SONG SOHEE, Da-iCE, IDIOTAPE, amazarashi, THORNAPPLE, The Shepherd Bois, Midnight Grand Orchestra, TAK with Hatsune Miku & Kasane Teto, Tani Yuuki, indigo la End, HANRORO, Tomatomat, KUROMI, BRANDY SENKI, MRCH, HUMBREADERS, NELL, SUKIMASWITCH. (`lineup.json` 23팀과 타임테이블 42팀을 대조해 확인한 목록이다.)

## 3. 화면

### 불러오기 (`src/data.js`)

`loadCatalog()`가 `data/setlists.json`도 함께 불러와 `setlists`(아티스트 id → 항목 `Map`)와 `setlistsUpdated`를 돌려준다.

### 아티스트 화면 (`src/views/artist.js`)

공연 의식 칸과 곡 목록 칸 사이에 "SETLIST 예상 세트리스트" 칸을 넣는다.

```
SETLIST  예상 세트리스트 (약 9곡)
 1. 狂乱 Hey Kids!!   [확실]  5/6  ▶연습
 2. DUNK              [유력]  5/6
 ...
후보: 5150 (1/6) · LIMIT (4/6)
근거: 최근 페스·게스트 세트 6회 (2026-04 ~ 10, setlist.fm·LiveFans)
출처: setlist.fm THIS FES '26 · ...   갱신 2026-11-12
```

- 등급 배지는 등급마다 다른 스타일을 쓴다 (기존 테마 색 안에서).
- `seen`이 `null`이면 횟수를 표시하지 않는다.
- `songs`가 비어 있으면 "예상할 근거가 부족합니다"와 아티스트 `note`를 보여 준다.
- 세트리스트 항목이 없는 아티스트는 이 칸을 그리지 않는다.
- 곡 목록 칸은 그대로 둔다. 곡 데이터가 없으면 기존 문구("아직 곡 데이터가 없습니다.")를 보여 준다.

### 홈 화면 (`src/views/home.js`)

- 곡 데이터나 세트리스트 중 하나라도 있으면 아티스트를 보여 준다 (지금은 곡 데이터가 있는 팀만 보인다).
- 카드 설명은 곡 데이터가 있으면 지금처럼 "N곡", 없으면 "세트리스트만"으로 쓴다.

## 4. 검증과 테스트

`npm run validate`(`tools/validate.mjs`)가 `data/setlists.json`도 읽어 검사한다. 오류가 있으면 지금처럼 `data/songs/index.json`을 만들지 않는다. 검사 규칙은 `tools/lib/`에 데이터만 받는 함수로 둔다.

검사 항목:

- `updated`가 `YYYY-MM-DD` 형식인지
- `artists`의 키가 `lineup.json`에 있는 아티스트 id인지
- 각 항목에 `basis`, `songs`, `candidates`, `sources`, `note`가 있는지
- `tier`가 `sure` / `likely` / `maybe` 중 하나인지
- `seen`이 `null`이거나 `[k, n]`(정수, 0 ≤ k ≤ n, n ≥ 1)인지
- `songId`가 있으면 실제 곡 id이고 그 곡의 `artistId`가 같은지
- `sources[]`에 URL이 하나 이상 있는지
- 경고(색인 생성은 막지 않음): `lineup.json`에 있는데 세트리스트 항목이 없는 아티스트

테스트는 `test/validate.test.mjs`에 세트리스트 검사 규칙 테스트를 추가한다. 화면은 로컬 서버(`http://localhost`)에서 홈과 아티스트 화면 몇 개를 직접 열어 확인한다.

## 5. 조사 진행

- 서브에이전트 5개를 장르별로 나눠 병렬로 조사한다: J-ROCK 밴드, J-POP 솔로, 한국 팀, 아이돌·성우 밴드, 버추얼·보카로.
- 각 에이전트는 팀마다 다음을 `research/setlist-expected-<묶음>.md`에 쓴다.
  - 최근 페스·짧은 세트 목록 (날짜, 행사, 곡 수, 출처 URL)
  - 전체 곡 등장 빈도표
  - 예상 순서 초안과 등급
- 기존 `research/setlist-*.md`는 콜 후보곡만 집계했으므로 전체 빈도를 다시 본다. 다만 공연 목록과 URL은 출발점으로 넘긴다.
- 조사 결과를 `data/setlists.json`으로 옮기면서 등급 기준에 맞는지, `songId` 연결이 맞는지 검토한다.

## 범위 밖

- 세트리스트 원자료 저장과 자동 집계 도구
- 공연 후 실제 세트리스트 기록
- 세트리스트 곡의 한글 발음·번역
