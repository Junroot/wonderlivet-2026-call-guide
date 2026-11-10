# design.md 적대적 리뷰 — wonderlivet-call-guide

검토 범위: design.md, proposal.md, tasks.md, specs/{song-catalog,practice-player,timing-editor,song-data}/spec.md, research/final-songs.md.
저장소에 구현 코드가 없으므로(새 저장소) 코드 대조 대신 문서 간 정합성과 설계 논리를 검토했다.

### [높음] 콜의 `at.line` 이 0 기준인지 1 기준인지 문서끼리 어긋난다

- **위치**: design.md:69 (Decision 2), specs/song-data/spec.md:6-8, specs/practice-player/spec.md:19, specs/song-data/spec.md:25
- **설계 주장**: design.md 는 `{ line: 12, offset: 0.4 }` 를 "12번째 가사 줄 시간에 0.4초를 더한다"고 정의한다(서수, 1 기준). song-data 명세 시나리오도 "12번째 줄의 `t`에 0.4를 더한 값"이다. 반면 practice-player 명세는 계산식을 "`lines[line].t + offset`"으로 못 박는다. JS 배열 첨자로 읽으면 0 기준이고, `lines[12]` 는 13번째 줄이다.
- **무엇이 깨지나**: `src/cue-time.js`(tasks 2.1)를 명세 식대로 `lines[line]` 로 짜고, 콘텐츠 작성 단계(tasks 7.2/8.2/9.2)에서 research 자료의 "N번째 줄/이 가사 다음"을 서수로 세어 `line` 을 적으면, 56곡의 모든 줄 기준 콜이 한 줄씩 앞당겨진다(곡에 따라 2~5초). 반대 조합이면 한 줄씩 늦어진다. validate 의 범위 검사도 어느 기준이냐에 따라 경계가 달라진다. 0 기준이면 `line: 30`(30줄 곡)도 오류여야 하고, 1 기준이면 `line: 0` 이 오류여야 한다. 명세의 31 시나리오는 두 해석 모두에서 참이라 이 차이를 잡지 못한다. 어긋난 값은 형식상 유효한 데이터라 validate 로 검출할 수 없다. 사용자가 타이밍 검수(7.4 등)에서야 발견하게 되고, 그때는 56개 파일을 다시 써야 한다.
- **검증 근거**: design.md:69 "12번째 가사 줄 시간에 0.4초를 더한다" / specs/song-data/spec.md:8 "12번째 줄의 `t`에 0.4를 더한 값" / specs/practice-player/spec.md:19 "가사 줄 기준 콜의 시간은 `lines[line].t + offset`" / specs/song-data/spec.md:25 "가사가 30줄인 곡에 `"at": { "line": 31 }`". 데이터 파일 계약이고 56곡에 걸쳐 되돌리기 비싸므로 설계에서 기준(0 또는 1)을 하나로 정하고, 세 곳의 문구와 범위 검사 시나리오(경계값)를 그 기준에 맞춰야 한다.

### [높음] 대부분의 콜(줄 기준)은 오프셋이 귀로 확인되지 않은 초안인데, 보정 도구에 이를 고칠 경로가 없다. 시간 미정 절대 시간 콜의 표현도 정해지지 않았다

- **위치**: design.md:17 (Context), design.md:24 (Goals), design.md:69 (Decision 2), design.md:96 (Decision 5), specs/timing-editor/spec.md:4, specs/song-data/spec.md:5,22, tasks.md 7.3→7.4
- **설계 주장**: "콜을 가사 줄에 붙여 두면 시간이 자동으로 정해지게 한다. 가사가 없는 구간의 콜만 시간을 직접 찍는다"(Goals). 보정 도구의 "다음 대상"은 "시간이 없는 가사 줄 또는 절대 시간 콜"이다(Decision 5, timing-editor 명세). 그리고 "곡당 몇 분 안에 타이밍을 검수할 수 있는 보정 도구"가 목표다.
- **무엇이 깨지나**:
  1. "줄 기준 콜은 시간이 자동으로 정해진다"는 결정은 `offset` 이 맞다는 전제 위에 서 있다. 그런데 Context 는 "Claude는 소리를 들을 수 없으므로 타이밍은 초안까지만" 만든다고 하고, 원자료는 "이 가사 다음"처럼 위치만 준다(design.md:14). 그래서 `offset` 은 전부 눈대중(대개 0)이 된다. "이 가사 다음"에 외치는 콜이나 줄 중간의 아이돌 콜(合いの手)은 줄 시작보다 수 초 뒤에 나온다. 그런데 offset 0이면 줄 시작에 "지금"으로 바뀐다. 그러면 1.5초 예고와 0.2초 강조 오차 요구(practice-player 명세)가 의미를 잃는다. 이 오차를 고칠 경로가 명세에 없다. timing-editor 명세의 기록·조정 대상 정의(다음 대상 = 시간 없는 줄·절대 시간 콜, 시나리오는 모두 가사 줄)에 줄 기준 콜의 `offset` 을 Space나 ←/→로 바꾸는 동작이 없다. 사용자가 콜마다 JSON을 손으로 고쳐야 하므로 "곡당 몇 분 검수" 목표가 깨진다. 그런데도 "타이밍 검수 완료" 체크로 `review.timing=true` 가 되어 검수된 것처럼 표시된다.
  2. 절대 시간 콜(간주 박수, 인트로 점프)도 Claude 는 시간을 모르므로 초안은 "시간 없음" 상태여야 한다. 그래야 Decision 5 의 "다음 대상"이 된다. 그러나 song-data 명세는 `at` 을 `{ line, offset? }` 또는 `{ t }` 로만 정의한다. validate 경고 목록에는 "시간이 없는 줄"만 있고 "시간이 없는 콜"은 없다. `{ t: null }` 을 필수 필드 누락 오류로 처리하면, 오류가 있을 때 색인을 만들지 않는 규칙 때문에 tasks 7.3 "validate 통과 뒤 배포"(사용자 검수 7.4보다 먼저)가 막힌다. 그런 콜이 하나라도 있으면 사이트 전체 색인이 생성되지 않는다. 허용한다면 연습 화면이 시간 없는 콜을 어떻게 처리할지 정해야 한다.
- **검증 근거**: design.md:17 "Claude는 소리를 들을 수 없으므로 타이밍과 발음은 초안까지만 만든다" / design.md:24 "콜을 가사 줄에 붙여 두면 시간이 자동으로 정해지게 한다" / design.md:69 "대부분의 콜이 이 형식이다" / specs/timing-editor/spec.md:4 "다음 대상은 목록 순서상 아직 시간이 없는 첫 가사 줄 또는 절대 시간 콜이다" / specs/song-data/spec.md:5 "`at`은 `{ line, offset? }` 또는 `{ t }` 형식" / specs/song-data/spec.md:22 "경고는 가사 줄 시간 역전, 시간이 없는 줄, 검수 미완료" + "오류가 없을 때만 `data/songs/index.json`을 생성". 이것은 데이터 계약(시간 미정 콜의 형식과 그 검증 등급)과 명세 요구사항(보정 도구가 줄 기준 콜의 offset 을 기록·조정하는지)의 문제다. 구현자가 국소적으로 정할 일이 아니므로 설계에서 정해야 한다.

## 기각한 후보

- **곡 수·팀 수 불일치**: tasks 7~9장의 대상 곡은 11+24+21=56곡, 22팀이다. research/final-songs.md 의 확정 43곡과 추가 확정 13곡을 합한 수와 곡명이 일치한다. 42팀 = 22팀 + 응원 정보 없는 20팀(Non-Goals)으로 합계도 맞다. 반증됨.
- **`#/song/<id>` 의 id 충돌**: 파일 경로는 아티스트별 디렉터리지만 라우트는 곡 id만 쓴다. 그러나 song-data 명세가 `id` 중복을 validate 오류로 규정하고 index.json 이 id와 경로를 매핑하므로 충돌하지 않는다. 반증됨.
- **해시 라우팅과 GitHub Pages 브랜치 배포의 정합성**: 빌드가 없고 `index.json` 은 validate 가 생성해 커밋하는 산출물이다. "Deploy from a branch"(Actions 없음)와 모순되지 않는다. 반증됨.

판정: 조건부(치명·높음 2건 선해결) — `at.line` 의 첨자 기준(0/1)을 하나로 정해 design·명세 세 곳과 범위 검사 경계를 맞추고, 시간 미정 콜(`{t:null}`)의 형식·검증 등급과 보정 도구에서 줄 기준 콜 offset 을 기록·조정하는 경로를 정해야 한다
