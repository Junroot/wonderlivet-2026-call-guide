## ADDED Requirements

### Requirement: 곡 데이터 형식
각 곡은 `data/songs/<artist-id>/<song-id>.json` 파일 하나로 저장해야 한다(SHALL). 필수 필드는 `id`, `artistId`, `title`, `youtube.videoId`, `youtube.offsetSec`, `durationSec`, `lines[]`, `cues[]`, `sources[]`, `review`다. 콜의 `type`은 `call`, `clap`, `jump`, `singalong`, `motion`, `penlight`, `other` 중 하나여야 한다(SHALL). 콜의 `at`은 `{ line, offset? }`, `{ t }`, `{ t: null }` 중 하나여야 한다(SHALL). `line`은 `lines[]`의 0 기준 첨자다. `{ t: null }`은 시간 미정 절대 시간 콜이다.

#### Scenario: 가사 줄 기준 콜
- **WHEN** 콜이 `"at": { "line": 12, "offset": 0.4 }`이다
- **THEN** 그 콜의 가사 시간은 `lines[12]`(13번째 줄)의 `t`에 0.4를 더한 값이다

#### Scenario: 절대 시간 콜
- **WHEN** 콜이 `"at": { "t": 83.2 }`이다
- **THEN** 그 콜의 가사 시간은 83.2초다

#### Scenario: 시간 미정 절대 시간 콜
- **WHEN** 콜이 `"at": { "t": null }`이다
- **THEN** 그 콜은 시간이 없는 콜로 취급되고, 검증 스크립트는 오류가 아닌 경고를 출력한다

### Requirement: 라인업 데이터
`data/lineup.json`은 곡 데이터가 있는 아티스트마다 `id`, 원문 이름, 한글 이름, 공연 일자, 스테이지, 시작·종료 시간, `rituals[]`를 담아야 한다(SHALL). 공연 의식 항목은 이름, 설명, 출처 URL을 가져야 한다(SHALL).

#### Scenario: 아티스트 참조 무결성
- **WHEN** 곡 파일의 `artistId`가 `lineup.json`에 없다
- **THEN** 검증 스크립트가 오류를 보고하고 0이 아닌 종료 코드로 끝난다

### Requirement: 데이터 검증과 색인 생성
`tools/validate.mjs`는 모든 곡 파일을 검사해 오류와 경고를 출력하고, 오류가 없을 때만 `data/songs/index.json`을 생성해야 한다(SHALL). 오류는 필수 필드 누락, 빈 `sources[]`, 허용되지 않은 콜 종류, 범위를 벗어난 가사 줄 참조, `id` 중복, `lineup.json`에 없는 `artistId`다. 경고는 가사 줄 시간 역전, 시간이 없는 줄, 시간이 없는 콜(`{ t: null }`), 검수 미완료다. `youtube.durationSec`(보정 화면이 기록한 영상 길이)가 있으면 `durationSec + youtube.offsetSec`와 비교해 2초 넘게 차이 날 때도 경고한다.

#### Scenario: 범위 밖 줄 참조
- **WHEN** 가사가 30줄인 곡에 `"at": { "line": 30 }` 콜이 있다
- **THEN** 검증 스크립트가 파일 경로와 콜 위치를 담은 오류를 출력하고 색인을 생성하지 않는다

#### Scenario: 마지막 줄 참조
- **WHEN** 가사가 30줄인 곡에 `"at": { "line": 29 }` 콜이 있다
- **THEN** 범위 오류가 아니다(마지막 줄 참조)

#### Scenario: 시간 없는 콜은 색인을 막지 않음
- **WHEN** 오류는 없고 `"at": { "t": null }` 콜만 있다
- **THEN** 검증 스크립트가 "시간이 없는 콜" 경고를 출력하고 `index.json`을 생성한다

#### Scenario: 정상 데이터
- **WHEN** 모든 곡 파일에 오류가 없다
- **THEN** `index.json`에 모든 곡의 `id`, `artistId`, `title`, 파일 경로, 콜 종류 목록, 검수 상태가 기록된다

### Requirement: LRCLIB 가져오기
`tools/fetch-lrclib.mjs`는 아티스트 이름, 곡 제목, 선택 인자인 길이로 LRCLIB를 검색해야 한다(SHALL). 동기화 가사가 있는 결과 중 길이가 가장 가까운 것을 골라 `lines[]`(`t`, `text`, `ko: null`)와 `durationSec`, `lrclib.id`를 채운 곡 JSON 뼈대를 만들어야 한다(SHALL). 이미 있는 파일은 덮어쓰지 말아야 한다(SHALL NOT).

#### Scenario: 동기화 가사 있음
- **WHEN** `fetch-lrclib.mjs "THE ORAL CIGARETTES" "狂乱 Hey Kids!!" 251`을 실행한다
- **THEN** 줄마다 시간과 원문이 채워진 곡 JSON 뼈대가 만들어지고 선택된 LRCLIB id가 출력된다

#### Scenario: 동기화 가사 없음
- **WHEN** 검색 결과에 동기화 가사가 없다
- **THEN** 일반 가사가 있으면 `t`가 null인 줄로 뼈대를 만들고 "보정 도구로 줄 시간을 모두 찍어야 함" 경고를 출력한다. 일반 가사도 없으면 파일을 만들지 않고 실패로 끝난다

#### Scenario: 기존 파일 보호
- **WHEN** 대상 곡 파일이 이미 있다
- **THEN** 파일을 바꾸지 않고 "이미 존재함" 메시지와 함께 0이 아닌 종료 코드로 끝난다

### Requirement: 곡 수록 기준
곡은 기존 자료에 곡 단위 응원 정보가 있고, 최근 공연 셋리스트의 40% 이상에서 연주된 경우에만 추가해야 한다(SHALL). 근거는 `research/` 아래 문서에 기록해야 한다(SHALL). 곡 파일의 `sources[]`에는 응원 정보 출처를 최소 하나 넣어야 한다(SHALL).

#### Scenario: 출처 없는 곡
- **WHEN** 곡 파일의 `sources[]`가 비어 있다
- **THEN** 검증 스크립트가 오류를 보고한다
