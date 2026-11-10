# design.md 적대적 리뷰 — wonderlivet-call-guide (라운드 2)

검토 범위: design.md, proposal.md, tasks.md, specs/{song-catalog,practice-player,timing-editor,song-data}/spec.md, design-review-decisions.md, research/final-songs.md, research/research-idol-virtual.md.
저장소에는 구현 코드가 없다(새 저장소, 검증 사실 캐시 참조). 그래서 코드 대조 대신 문서 간 정합성과 설계 논리를 검토했다.

라운드 1의 두 지적은 결정 원장대로 반영됐는지 확인했다. 확인한 곳은 `at.line` 0 기준 첨자, `{ t: null }` 허용·경고, 보정 도구의 줄 기준 콜 offset 기록·조정이다. design.md Decision 2·5·7, specs/song-data·practice-player·timing-editor, tasks.md 2.1·2.2·5.1·5.2·7.2 사이에 어긋남은 없다. timing-editor 시나리오의 산술(48.30−2.0=46.30, 50.10−2.0−46.30=1.80, 85.20−2.0=83.20, 15.40−12.00=3.40)과 첨자 표기(5번째 줄 = `lines[4]`)도 맞는다.

검증 통과한 치명·높음 지적 없음.

## 기각한 후보

- **보정 결과를 "덮어쓰고 커밋"하면 `index.json`이 오래된 상태로 남는다(design.md:107)**: `index.json`에는 검수 상태가 들어가고 목록 화면이 이를 표시한다. 그래서 보정 도구로 내보낸 파일만 커밋하면 목록에 "검수 전"이 남는다는 의심이었다. 하지만 이후 작업 흐름에서 `validate`가 반복 실행된다(tasks 8.3·9.3의 "validate 통과, 배포", 11.2의 전체 validate). 그때마다 모든 곡 파일로 색인이 다시 생성된다. 연습 화면은 곡 파일을 직접 읽으므로 타이밍 자체는 바로 반영된다. 생기는 문제는 다음 validate 실행까지 목록 배지가 잠시 늦게 바뀌는 정도다. 계속 깨지는 경로가 아니므로 반증됐다.
- **YouTube IFrame API에는 "탐색(seek)" 이벤트가 없다(design.md:143, practice-player "일시정지와 탐색" 시나리오)**: API 이벤트는 onReady, onStateChange, onPlaybackRateChange, onError 등이고 seek 전용 이벤트는 없다. 하지만 Decision 4의 보간은 "마지막으로 받은 값과 그 시각"을 기준으로 삼는다. 그래서 `getCurrentTime()`이 새 값을 돌려줄 때마다 기준값을 다시 잡게 된다. 사이트가 직접 하는 탐색(가사 줄 클릭, 보정 도구의 1초 전 재생)은 `seekTo`를 호출하는 쪽이 이미 알고 있다. YouTube 자체 컨트롤로 탐색하는 경우에도 값이 다음에 갱신될 때 기준값이 바로잡힌다. 설계가 서는 데 문제가 없으므로 반증됐다.
- **0.75배 재생에서 1.5초 예고가 가사 시간 기준인지 실제 시간 기준인지 모호하다**: 강조 계산이 모두 보간된 가사 시간을 기준으로 하므로 일관되게 동작한다. practice-player "느리게 연습" 시나리오는 어느 해석이든 만족된다. 반증됐다.

판정: 진입 가능 — 라운드 1의 첨자 기준·시간 미정 콜·offset 보정 경로가 design·specs·tasks에 일관되게 반영됐고, 새로 검증을 통과한 치명·높음 지적이 없다
