# 디시 계열 가이드로 확인된 곡 추가 (2026-11-10)

처음 곡을 고를 때 "응원 정보 없음"으로 빠졌다가, 나중에 디시 이용자 제작 가이드(livet-call.pages.dev, My One Ticket, 콜렌, 어이어이바위게)나 디시 글에서 콜이 확인된 곡을 추가했다. 기준은 기존과 같다(응원 정보 있음 + 최근 셋리스트 40% 이상). 곡별 요약은 `content-status.md`의 "디시 계열 가이드로 추가한 곡" 표에 있다.

---

## natori-yama 묶음 보고


### natori (금 11/20)

공통 사항
- 콜 출처는 livet-call.pages.dev다. 가사 줄은 원문을 정규화해 맞췄고, 같은 영상이라 시간으로도 확인했다.
- sources 순서: ① livet-call 사이트 ② 디시 일본 가수 갤러리의 사이트 소개 글(no=860674).
- 영상은 Topic 음원을 찾지 못해 공식 MV를 썼다. livet-call과 같은 영상이고 offsetSec는 0이다.
- order: in-my-head가 1이고, 새 곡은 2~5.

| 곡 | 파일 | 영상 | LRCLIB | 콜 |
|---|---|---|---|---|
| セレナーデ | data/songs/natori/natori-serenade.json | gNg2Qw5R-Q4 (MV 3:38) | 35898569 동기화 61줄 | 떼창 7 |
| プロポーズ | data/songs/natori/natori-propose.json | VDdLF1YubI0 (MV 2:59) | 38923101 동기화 57줄 | 떼창 12, 박수 8 |
| Overdose | data/songs/natori/natori-overdose.json | H08YWE4CIFQ (MV 3:14) | 5903797 동기화 42줄 | 떼창 24 (그중 2개는 줄 일부) |
| 絶対零度 | data/songs/natori/natori-zettai-reido.json | LFoyXEFaz2Q (MV 3:19) | **12776025** 동기화 57줄 | 떼창 25 |

LRCLIB 고른 이유
- 세레나데와 프로포즈: 도구가 처음 고른 후보가 문제였다. 세레나데는 일반 가사(동기화 없음)였고, 프로포즈는 커버곡(9Lana)이었다. 그래서 아티스트를 「なとり」로 바꿔 다시 받았다.
- 절대영도: 도구가 고른 22747174는 5~19번째 줄에서 시간이 최대 6초 늦게 밀린다. livet-call 시간과 맞는 「シングル盤」 12776025로 줄을 교체했다.

검수 때 볼 점
- 프로포즈 53~56줄, Overdose 30~41줄(마지막 사비): livet-call 자체가 "콜가이드 이미지에 없어 앞과 같게 추정"이라고 표시한 부분이다. 각 묶음의 첫 콜 note에 그렇게 적었다.
- Overdose 41줄(곡 끝 「Don't stop the music」): LRCLIB은 185.0초, livet-call은 174초다. 시간 확인이 필요하다.
- 절대영도 50줄 「なぁなぁなぁ、運命がなんだって」: livet-call에는 「運命がなんだって」만 떼창이라 줄 일부 콜로 넣었다. offset 1.2초는 대략 넣은 값이다.
- 읽기 확인할 곳:
  - 「罰×10」을 "바츠텐"으로 적었는데 실제 발음 확인이 필요하다.
  - 「弾いて 描いて」는 LRCLIB 로마자 판(Hajiite, kaite)을 따라 "하지이테 카이테"로 적었다.
  - 그 밖의 읽기: 「躊躇った」 타메랏타, 「最期」 사이고, 「共犯者」 쿄-한샤, 「前哨戦」 젠쇼-센, 「体裁」 테-사이, 「以って」 못테.
- 「勘違いだ」って는 "「칸치가이」닷테"로 적어 괄호 위치를 원문과 다르게 했다.

### yama (토 11/21, 14:50–15:30 WONDER)

#### 셋리스트 확인 (setlist.fm, curl)

최근 페스 8회(2026-08-01~09-23)를 기준으로 셌다.
- KOYABU SONIC 9/23: https://www.setlist.fm/setlist/yama/2026/intex-osaka-osaka-japan-2b7f84de.html
- ROCK IN JAPAN 9/19: https://www.setlist.fm/setlist/yama/2026/soga-sports-kouen-hillside-stage-chiba-japan-2b728802.html
- Anime NYC 8/21: https://www.setlist.fm/setlist/yama/2026/jacob-k-javits-convention-center-new-york-ny-6b7126ee.html
- SUMMER SONIC 8/16: https://www.setlist.fm/setlist/yama/2026/makuhari-messe-kokusai-tenjijou-hall-7-chiba-japan-1b75fd10.html
- RISING SUN 8/14: https://www.setlist.fm/setlist/yama/2026/tarukawa-dock-open-air-special-stages-earth-tent-ishikari-japan-53721bbd.html
- CMEF Taipei 8/8: https://www.setlist.fm/setlist/yama/2026/zepp-new-taipei-taipei-taiwan-73749645.html
- OSAKA GIGANTIC 8/2: https://www.setlist.fm/setlist/yama/2026/ookini-arena-maishima-osaka-japan-4b75fb36.html
- NUMBER SHOT 8/1: https://www.setlist.fm/setlist/yama/2026/seaside-momochi-kaihin-kouen-jigyouhama-fukuoka-japan-63759a5b.html

| 곡 | 최근 페스 8회 | 2026 페스 전체 13회 | 판단 |
|---|---|---|---|
| 春を告げる | 8/8 | 13/13 | 추가 |
| a.m.3:21 | 8/8 | 12/13 | 콜 정보가 없어 제외 |
| 飛ぼうよ | 8/8 | 12/13 | 콜 정보가 없어 제외 |
| 偽顔 | 4/8 | 5/13 (38%) | 추가 (40% 경계선) |
| 憧れのままに (livet-call에 없음) | 4/8 | 7/13 | 추가 (디시 가이드 있음) |

- 13회는 위 8회에 Japan Expo, 8FES, Sign's Fest, TAKASAKI, Tsuta Rock을 더한 것이다.
- 참고로 10월 호주 단독 공연 2회, 3·5월 단독 공연에도 春を告げる·a.m.3:21은 항상 있었다.
- 그 밖에 자주 한 곡: U and I 8/8, mountain 5/8, Remember 5/8. 응원 자료가 없다.

#### 중요: livet-call의 yama 4곡에는 콜이 0개다

livet-call은 yama 4곡(偽顔·春を告げる·飛ぼうよ·a.m.3:21)에 가사와 발음만 있고 `cues`가 하나도 없다. 그래서 디시를 따로 찾았고, **「yama(야마) 콜, 떼창 가이드 최종본」**(일본 가수 갤러리 no=337100, 2025-09-23)을 찾았다.
- 2025년 서울 단독 공연용 가이드 이미지 9장이다.
- 다루는 곡: 春を告げる, 偽顔, あるいは映画のような, 憧れのままに, BURN, ハロ, くびったけ, 麻痺, 色彩
- 가이드에 있는 곡 가운데 셋리스트 40% 이상인 3곡만 넣었다.
- a.m.3:21과 飛ぼうよ는 livet-call에도 이 가이드에도 콜이 없다. 飛ぼうよ는 2026년 곡이다.

#### 곡별

| 곡 | 파일 | 영상 | LRCLIB | 콜 | order |
|---|---|---|---|---|---|
| 春を告げる | data/songs/yama/yama-haru-wo-tsugeru.json | DC6JppqHkaM (공식 MV 3:17, offset 0) | 4420179 동기화 36줄 | 떼창 15 | 1 |
| 偽顔 | data/songs/yama/yama-nisegao.json | wA1LKdGwFgc (공식 MV 2:31, offset 0) | 6865618 동기화 43줄 | 떼창 12 | 2 |
| 憧れのままに | data/songs/yama/yama-akogare-no-mama-ni.json | yIncOcSN2aQ (yama 공식 채널 「KONA Collaboration Video」 3:35, offset 0) | **없음** → 콜만 있는 곡 | 12 (모두 시간 미정) | 3 |

- 春を告げる
  - sources: 가이드 글 337100.
  - 가이드를 이렇게 해석했다. 첫 후렴은 두 칸으로 나뉘어 있고 왼쪽은 표시가 없다. 그래서 인트로 후렴은 듣고, 1절 뒤 후렴(14~18줄)부터 떼창으로 봤다. 그리고 "간주 이후 후렴 두 번!"이 26~35줄이다.
  - 해석이 맞는지 검수가 필요하다.
  - livet-call 가사에는 인트로 후렴이 두 번 있지만, LRCLIB과 실제 음원은 한 번이다.
- 偽顔
  - sources: 가이드 337100, 서울 공연 후기 363997.
  - 가이드의 파란 표시 줄을 따랐다. 「All eyes on me ~ deepfaker」 줄과 「(Eyes, eyes on me) deepfaker」 줄이다.
  - 가이드의 "딥페이커만 해도 됨", "이하 눈치껏 반복"도 note에 옮겼다.
  - 후기에는 "전주 때 아이즈온미" 콜도 나온다. 하지만 가이드에는 표시가 없어 넣지 않았다.
- 憧れのままに
  - LRCLIB에 이 곡이 아예 없다(제목·로마자·아티스트로 모두 검색함). 그래서 `lines: []`, `lrclib: null`, 콜은 `{t:null}`로 만들었다.
  - 콜 내용:
    - 1절 박수
    - 「僕らがずっと抱いてきた あこがれのままに」·「恋に恋をした天使みたいに 君を見つめてる」 떼창
    - 「ただ僕は」·「まだ遠い」 앞부분 떼창
    - 간주 「어이!」 4번
    - 2절(키타니 타츠야 파트) 박수
    - 「Ah, ah-ah, ah」
  - 콜 문구와 한글 발음은 가이드 이미지를 보고 적었다.
  - Topic 음원과 공식 MV를 못 찾아 콜라보 영상을 썼다. 음원(약 3:27)보다 8초쯤 길다. 시간은 모두 보정 도구로 찍어야 한다.
  - 이 곡은 배정 목록(livet-call 4곡) 밖이다. 공통 선정 기준(디시 가이드 콜 + 셋리스트 40% 이상)을 충족해서 넣었다. 빼려면 파일 하나만 지우면 된다.

#### lineup.json

- `yama` 항목을 mygo 다음에 넣었다. id yama, name yama, nameKo 야마, date 2026-11-21, stage WONDER, start 14:50, end 15:30, rituals [].
- LRCLIB 아티스트 이름이 「yama」로 같아서 lrclibName은 넣지 않았다.
- 홈 화면은 start 기준으로 정렬하므로(src/views/home.js) 다른 필드는 필요 없다.

#### 참고할 반대 의견

- 디시 「야마 떼창 가이드 안외워도됨」(no=351041, 2025-10-01): "단콘·페스에서 하는 사람 본 적 없음"이라는 글이다.
- 디시 「니세가오 의외로 떼창 별로 업더라」(no=82571, 2024-11-11, 원더리벳 2024 뒤): 偽顔 떼창이 적었다는 글이다.
- 반대로 2025 서울 단독 공연 후기(363997)는 偽顔·ハロ·くびったけ 떼창이 잘 됐다고 한다.
- 디시에 「이번주내로 야마 콜가이드 꼭 만들어야겠다」(no=863290, 2026-11-03)라는 글이 있다. 원더리벳용 새 가이드가 올라올 수 있다.

---

## oral-clanqueen 묶음 보고 (THE ORAL CIGARETTES · CLAN QUEEN, 금 11/20)

참고: 오랄 아티스트 폴더는 `data/songs/oral/`이 아니라 `data/songs/oral-cigarettes/`(artistId `oral-cigarettes`)다.

### 추가한 곡 (6곡)

| 곡 | 파일 | 영상 | LRCLIB | 콜 | order |
|---|---|---|---|---|---|
| Red Criminal | data/songs/oral-cigarettes/oral-red-criminal.json | 3dDYdDvIRjs Topic (MARBLES 수록, 4:28), offset 0 | 10313582 동기화 (MARBLES, 267초, 67줄, 괄호 메아리 포함 판) | 34 | 3 |
| DUNK feat.Masato (coldrain) | data/songs/oral-cigarettes/oral-dunk.json | ZgoPZ_QXud8 공식 MV (4:28), offset 0 | 16778431 동기화 (AlterGeist0000, 256초, 82줄) | 33 | 4 |
| 無花果 | data/songs/clan-queen/clan-queen-ichijiku.json | m_2PIYki4A4 공식 MV (3:28), offset 0 | 없음 → 콜만 있는 곡 (`lines: []`, `lrclib: null`) | 6 | 2 |
| ゲルニカ | data/songs/clan-queen/clan-queen-guernica.json | hNXiij4kZPo 공식 MV (3:51), offset 0 | 31966108 일반 가사뿐 → 63줄 모두 `t: null` | 6 | 3 |
| 求世主 | data/songs/clan-queen/clan-queen-kyuseishu.json | GqkZ1-0eoPo 공식 MV (2:58), offset 0 | 16960864 동기화 (177초, 60줄) | 26 | 4 |
| 自白 | data/songs/clan-queen/clan-queen-jihaku.json | spt22NBTGBs 공식 MV (3:54), offset 0 | 24067247 일반 가사뿐 → 63줄 모두 `t: null` | 1 | 5 |

- 오랄 DUNK, CLAN QUEEN 4곡은 Topic 음원을 찾지 못했다. YouTube 검색, YT Music 검색, 오랄 Topic 채널 릴리스 목록까지 봤다. AlterGeist0000 앨범 재생목록에는 DUNK 자리에 공식 MV(ZgoPZ_QXud8)가 들어 있다.
- CLAN QUEEN 4곡은 livet-call과 같은 MV를 쓴다. 求世主는 livet-call 줄 시간이 LRCLIB 시간과 같아서 MV = 음원 시간(offset 0)이 맞다.

### 추가하지 않은 곡

- **ERASE (오랄)**: livet-call `oral-cigarettes/erase.json`에 가사 줄 34개만 있고 콜(`cues`)과 간주 지시(`note`)가 하나도 없다. 디시 검색(오랄 ERASE, 이레이즈 등), My One Ticket(오랄 아티스트 없음), kyoonlife(ERASE 없음)에서도 콜 정보를 찾지 못했다. "정보 있는 곡만" 원칙에 따라 만들지 않았다. 후보 자료: 공식 MV W-0djfZngXQ(3:49), LRCLIB 37131409 동기화(228초, 25줄).

### 출처

- 오랄 2곡: 디시 일본 가수 갤 no=860095 「리벳 뗴창,응원 가이드 정리 사이트(나토리,오랄시가렛 완료)」(2026-10-30, 오랄은 갤 자료 + 일본 웹 자료, SE 4번 박수 + 레드크리미널은 편집 영상을 가져다 씀) → livet-call → Red Criminal: 해마 콜가이드 영상(youtu.be/IyGgClk5fi4), kyoonlife(첫 곡으로 자주 연주) / DUNK: 공식 AlterGeist0000 라이브 영상(livet-call 기준 영상).
- CLAN QUEEN 4곡: 디시 일본 가수 갤 no=860674 「원더리벳 대비 응원 가이드 사이트(계속 추가중)」(2026-10-31) → livet-call. 추가로
  - 求世主: no=237042 「투메곡 스포) 클랜퀸 간단후기」(2025-06-27, "구세주 메데메데는 알았는데 모잇카이도 콜"), no=237086 「클랜퀸 기억나는거」(2025-06-27, "구세주 메이데이메이데이 모잇카이").
  - ゲルニカ: no=866229 「뭐야 클랜퀸 게르니카에 어이어이 하네?」(2026-11-06, 인스타 릴스 링크), no=237086(한국 공연에서 게르니카 때 「어이어이」).
- My One Ticket CLAN QUEEN에는 ゲルニカ 곡만 있고 가이드가 없어 출처에 넣지 않았다.
- 디시 no=867050(2026-11-07)은 최근 페스 7개 중 ゲルニカ·求世主·踊楽園·無花果·自白 각 7회라는 셋리 집계 글이다(콜 정보 없음, 출처에는 안 넣음).

### 곡별 메모와 검수 때 확인할 점

#### Red Criminal (34)
- 콜 구성: 인트로 4本打ち(시간 미정, afterLine -1), 1절 A멜로 박수 6줄(줄 0~2, 5~7), 후렴 괄호 메아리 콜 (gets life)/(in love)/(will fly)/(won't crying) 1·2절 8개 + 마지막 후렴 2개, 간주·아웃트로 「어이!×4」 3개(t 89.7 / 174.0 / 240.0), Get down 파트 떼창(「and」, 感情がないやつは, 意味がない) 6개, 마지막 후렴·끝 4줄 떼창 8개.
- **4本打ち**: livet-call은 곡 제목을 "SE(박수 4번치기) + Red Criminal"로 두고 SE 박수 1·2·3·4번을 곡 앞 줄로 넣었다. 우리 데이터에서는 lineup.json의 공연 의식과 같은 내용이라 인트로 시간 미정 콜 하나로만 넣고 note에 "이 곡이 첫 곡일 때, 음원에는 없음, 아티스트 화면 공연 의식 참고"라고 적었다. 음원에 없는 동작이라 보정 도구로 시간을 찍을 대상이 아니다. 빼도 된다.
- 메아리 콜의 offset은 줄 길이로 어림잡은 값이다(note에 "위치 추정").
- 간주 「어이!」 3개는 livet-call 영상 시간을 환산했다. livet-call 영상은 MV 음원 기준이라 2절 뒤에 Topic 음원보다 약 35초 긴 구간이 있다(MV 5:02 vs 음원 4:28). 앞부분 차이 44.7초, 뒷부분 차이 79.2~80.4초로 갈라서 환산했다. 174.0은 1초 정도 틀릴 수 있다.
- 한자 읽기: 幻想の永遠を(에-엔/토와), 誠実平等(세-지츠 뵤-도-).

#### DUNK feat.Masato (coldrain) (33)
- **MV(4:28)가 LRCLIB(4:16)보다 약 12초 길다. offsetSec 보정이 꼭 필요하다**(지금 0). 소리를 직접 들을 수 없어서 어느 쪽(앞 인트로/끝)이 긴지 판단하지 못했다.
- 콜: 인트로 「어이!×4」(t 16.9), 1·2절 뒤 간주 콜 2개(t 95.0, 176.7, livet-call에 **문구 없이** 콜 표시만 있어 "문구 확인 필요"), 「fly, fly high」 3개, 「real, real, real, real」·「dunk, dunk!」·「Whoa-whoa」 떼창, 마지막 후렴 「real」 4개. 간주 콜 시간은 livet-call 라이브 영상과 LRCLIB의 일정한 차이(1345.7초)로 환산했다.
- 부분 떼창 offset(0.3~1.3초)은 모두 어림값이다.
- 노래 제목은 공식 표기 "DUNK feat.Masato (coldrain)"로 했다.

#### 無花果 (6, 콜만)
- **LRCLIB에 가사가 없다**(트랙명·일반 검색 모두 결과 없음). 그래서 sweet-steady-dash처럼 콜만 있는 곡으로 만들었다.
- livet-call이 같은 MV(m_2PIYki4A4)를 쓰므로 콜 시간(47.9 / 50.5 / 53.1, 175.7 / 178.2 / 180.6)을 그대로 썼다. 뒤쪽 3개는 livet-call에 문구(라라라)만 있고 콜 종류 표시가 없지만 앞쪽과 같은 부분이라 넣었다(note에 적음).
- 라라라 부분은 livet-call 분류대로 `call`로 두었다. 사실상 떼창이라 `singalong`이 더 맞을 수 있다.

#### ゲルニカ (6)
- 줄 63개 모두 `t: null`. 보정 도구로 전부 찍어야 한다. livet-call은 같은 MV에 줄 시간을 갖고 있어(가사 줄 구분은 조금 다름) 참고할 수 있다. 지시대로 가져오지는 않았다.
- 콜: LRCLIB 「Whoa, whoa」 줄 6개(18, 20, 39, 41, 57, 59)에 「워어~ 워어~ 워어~ 워어~」. 첫 콜 note에 디시의 「어이어이」 이야기(위치 미기재)를 적었다. livet-call은 이 부분을 "워어~"로 적었고 디시 글은 "어이어이"라고 한다. 같은 부분인지 확인 필요.
- 한자 읽기: 他人(타닌/히토), 焼べられ(쿠베라레), 戯けた(오도케타), 痛んで(이탄데).

#### 求世主 (26)
- 콜: A멜로 박수 8줄(6~9, 25~28), 후렴 「メーデー メーデー」 12개, 「もう一回」 3개(offset 2.4~2.5, 위치 추정), 3절 「メーデー」 줄 3개(42~44)는 livet-call 표시대로 박수.
- 디시 2025-06-27 후기 두 개가 「메데메데」·「모잇카이」 콜을 확인해 준다.
- 제목 읽기는 큐-세-슈로 봤다(id `clan-queen-kyuseishu`; livet-call id는 guseju). 가사 37번째 줄은 「救世主」 표기다.

#### 自白 (1)
- LRCLIB 일반 가사가 121줄로 아주 잘게 끊겨 있어서(두 판 24067247·22380822 모두 같다), **글자는 바꾸지 않고 MV 프레이즈 단위(livet-call 줄 구분과 비슷하게)로 63줄로 묶었다.** 마지막 줄 끝의 `"`(LRCLIB 오기)는 지웠다. 줄 63개 모두 `t: null`.
- 39~40번째 줄: livet-call은 「…そうです / か人類が…」로 끊었지만 LRCLIB대로 「…そうですか / 人類が…」로 두었다.
- 콜은 livet-call의 「짝짝!」 박수 하나(21번째 줄 「でも感情の…」 직전)뿐이다. 디시 글에도 自白의 콜 언급은 없다.
- 한자 읽기: 間にも(아이다/마), 客観(캿칸), 奇怪·眩暈卒倒는 LRCLIB 가사에 읽기가 괄호로 같이 들어 있다.

### 공통
- `review.pronunciation`·`review.timing` 모두 false(無花果는 가사가 없어 pronunciation true).
- 한글 발음은 직접 적은 초안이다(livet-call 발음은 가져오지 않음). 영어 줄은 `ko: null`.

---

## 곡 추가 보고: kyary-frederic-sambo-chevon

새로 만든 파일은 7개다. 배정된 곡 중 3곡은 콜 정보가 없어서 만들지 않았다.

### 추가한 곡

| 파일 | 영상 (videoId, 종류, offsetSec) | LRCLIB | 콜 수 | 출처 |
|---|---|---|---|---|
| data/songs/kyary/kyary-ninjarebangbang.json (order 2) | teMdjJ3w9iM, 공식 MV(Warner Music Japan), 0 | 31158936, 동기화 47줄 | 18 | 디시 no=860674 → livet-call |
| data/songs/sambomaster/sambomaster-future-is-yours.json (order 5) | 097wEI39if4, 공식 MV, 3.9 | 5903723, 동기화 46줄 | 2 | 디시 삼보 갤 no=41 / 일본 가수 갤 no=796982 콜가이드 → 디시 no=860674 → livet-call |
| data/songs/sambomaster/sambomaster-seishun-kyousoukyoku.json (order 6) | B8TClXpFbC4, Topic 음원, 0 | 5904177, 동기화 73줄 | 5 (시간 미정 1) | 디시 삼보 콜가이드(no=41, 796982) |
| data/songs/sambomaster/sambomaster-kagayakidashite.json (order 7) | KM0SrqFBt38, 공식 MV, **0 (확인 필요)** | 14059857, 동기화 49줄 | 2 | 디시 삼보 콜가이드(no=41, 796982) |
| data/songs/chevon/chevon-meimei.json (order 2) | cJSttNbgqJI, 공식 MV, 0 | 없음 → 콜만 있는 곡 | 28 | 디시 no=860674 → livet-call |
| data/songs/chevon/chevon-judenchu.json (order 3) | orGJfJ2cEG4, 공식 MV (2026 Ver.), 0 | 없음 → 콜만 있는 곡 | 19 | 디시 no=860674 → livet-call |
| data/songs/chevon/chevon-flash-back.json (order 4) | 9qevjbq4ELM, 공식 MV, 0 | 없음 → 콜만 있는 곡 | 26 | 디시 no=860674 → livet-call |

#### 곡별 내용
- **にんじゃりばんばん**: livet-call과 같은 MV를 쓴다. MV 길이가 음원과 같고(264초), 줄 시간 차이도 0.1초 이내라서 offsetSec는 0이다. 콜은 후렴마다 「ばんばん」 뒤 짝짝(5번)과 「変えたら」 뒤 짝짝(1번)이고, 후렴 3번에 걸쳐 모두 18개다.
- **Future is Yours**: livet-call과 같은 MV다. livet-call 줄 시간과 LRCLIB 시간의 차이가 곡 전체에서 3.7~4.2초로 일정해서 offsetSec를 3.9로 잡았다. MV가 음원보다 12초 길고, 나머지 약 8초는 곡 끝에 있다. 콜은 디시 콜표와 livet-call이 같다. 전주 박수와 「君はいたほうがいいよ」 6번 반복 구간 박수다.
- **青春狂騒曲**: 디시 콜표를 따랐다.
  - 전주 박수
  - 하이라이트 3곳(줄 13~21, 36~44, 52~60)에서 손을 좌우로 흔들기
  - 간주에서 드럼(키우치)을 따라 「어이! 어이!」
- **輝きだして走ってく**: 디시 콜표를 따랐다. 첫머리 「もしもキミが~見失いそうになっても」 박수(줄 0)와, 두 번째 「負けないで」 떼창(줄 37)이다.
- **Chevon 3곡**: LRCLIB를 여러 방식으로 다시 찾았다.
  - 아티스트+제목 검색, 일반 검색(Chevon/シェボン, 冥冥/銃電中/FLASH BACK, 로마자 Meimei/Juudenchu/Flashback)을 모두 해 봤다.
  - Chevon 이름으로 나오는 곡은 Banquet, ダンス・デカダンス 등뿐이고 세 곡은 여전히 없다.
  - 그래서 `lines: []`, `lrclib: null`, `review.pronunciation: true`로 DASH!!!처럼 만들었다.
  - livet-call의 youtubeId는 세 곡 모두 Chevon 공식 채널 MV다(oEmbed로 확인). 그래서 그 영상을 쓰고, livet-call 줄 시간 `t`를 그대로 콜 시간으로 썼다.
  - livet-call에서 콜이 있는 줄마다 콜을 하나씩 만들었다. 떼창 콜에는 짧은 문구(冥冥, まずまずでした, ジューデン、ジューデンチュー, FLASH BACK!! 등)만 넣었고 가사·발음·번역 전체는 가져오지 않았다.
- `lines[].ko`는 모두 새로 쓴 한글 발음 초안이다. 영어만 있는 줄(Future is yours, Let's get it…, Play that, Oh baby…, Oh yeah)은 `ko: null`이다.

### 추가하지 못한 곡
- **きゃりーぱみゅぱみゅ キミに100パーセント**: livet-call 곡 파일(kimi-ni-100-percent)의 48줄 어디에도 `cues`가 없다. 줄에는 ja·pron·ko·t만 있다. 디시 검색(캬리 응원법/100퍼센트/떼창)에서도 콜 자료가 나오지 않았다.
- **FREDERIC Happiness / ナンセンスナンセンス**: livet-call 곡 파일 둘 다 `cues`가 하나도 없다(ja·pron·t만 있음). 디시 「프레데릭 응원법」 이미지 콜표(no=775298, 원본 no=149231)도 확인했지만, 이 콜표가 다루는 곡은 오도루프·온리원더·정키·KITAKU BEATS·스파클댄서·煌舟뿐이다. 원본 글 본문도 떼창 곡으로 오도루프·온리원더·키라부네·표표 에모숀만 꼽는다. 디시 검색(해피네스/넌센스)에서는 셋리스트 글만 나온다.
→ 세 곡 모두 "정보 있는 곡만" 원칙에 따라 파일을 만들지 않았다.

### 검수 때 확인할 점
1. **輝きだして走ってく 영상 offsetSec**
   - 공식 Topic 음원을 찾지 못해 공식 MV(KM0SrqFBt38, 350초)를 넣었다. MV가 음원(269초)보다 81초 길다.
   - 설명란에 출연진이 있는 드라마형 MV라서, 늘어난 부분이 앞인지 중간인지 알 수 없다. offsetSec를 0으로 둔 상태이니 반드시 보정해야 한다.
   - YouTube 자막으로 시점을 찾으려던 시도는 권한 문제로 하지 못했다.
   - 중간에 드라마 장면이 끼어 있으면 평행 이동만으로는 맞지 않는다. 그때는 외부 재생 모드를 쓰거나 다른 공식 영상을 찾아야 한다.
2. **にんじゃりばんばん**
   - 짝짝 위치는 줄 시작 기준 offset 어림값이다. 「ばんばん」은 다음 줄 시작 0.5초 전, 「たら」는 +2.2초로 잡았다.
   - LRCLIB에는 4번째 후렴(줄 37~46, 207초~)이 있지만 livet-call에는 후렴이 3번뿐이라 4번째 후렴에는 콜을 넣지 않았다. 같은 패턴으로 넣을지 판단이 필요하다.
3. **青春狂騒曲**
   - 간주 「어이! 어이!」는 시간 미정(afterLine 46)이다.
   - 콜표는 「溶け合うのよ 溶け合うのよ」 다음 간주라고만 적었고, LRCLIB의 줄 47~51(Oh baby…, 吹き抜ける…, Oh yeah)은 콜표에 없다. 176~185초 간주인지 190~201초 간주인지 확인해야 한다.
4. **Chevon 3곡**
   - 冥冥 (워-어)는 「超えてくれよ」 다음이라 줄 시간 +1.3초(「肥えてゆく(け)エゴ」 줄은 +1.6초)로 어림했다.
   - livet-call 시간은 0.1초 단위로 거칠다.
   - 銃電中 영상은 「2026 Ver.」 MV다(livet-call과 같다).
5. **읽기 확인 한자**: 頬(호-, 「호-오 츠탓테」로 적음), 廃墟(하이쿄), 苛立ち(이라다치), 一筋(히토스지), 心臓(신조-), 定め(サダメ, 사다메).
6. **오기 의심 줄**
   - Future is Yours 줄 42 「I love you あなたに幸せふりそそげ (ah ずっと)」의 (ah ずっと)는 LRCLIB 원문 그대로다.
   - 青春狂騒曲 줄 26 「なんだってだろ？」도 LRCLIB 원문 그대로다(콜표는 「なんだってんだろ？」).

---

## 묶음 m1t 보고 (My One Ticket 기반 곡 추가)

새 파일 8개를 만들었다.
전체 검증은 다른 묶음이 작업 중인 파일 5개 때문에 아직 실패한다: clan-queen 3곡과 oral-dunk, oral-red-criminal의 `sources[]`가 비어 있다. 그래서 index.json은 아직 갱신되지 않았다.

콜은 모두 My One Ticket API(`songs[].guides[]` → `/guides/<urlCode>`)의 표시(marks)를 옮겼다. 표시 종류는 이렇게 옮겼다.
- 어이! → call
- 박수 → clap
- 떼창 → singalong
- 응원봉 흔들기·들기 → motion
- 점프 → jump
- 응원봉 색 → MyGO 상징색 penlight

연속된 줄에 같은 표시가 있으면 콜 하나로 합치고, note에 「첫 줄」부터 「끝 줄」까지 몇 줄인지 적었다.
가사가 없는 가이드 줄(어이 묶음, 전주·간주)은 시간 `t`로 옮겼다. 시간은 바로 옆 가사 줄의 (가이드 시간 − 우리 시간) 차이로 환산했다.
가사 줄 중간에 오는 표시(괄호 Hey! 등)의 offset은 발음 글자 위치 비율로 어림했다.

출처: 각 곡 My One Ticket 가이드 → 디시 소개 글.
- CHiCO: 일본 가수 갤 no=859624
- 유즈: 일본 가수 갤 no=846872
- MyGO: 뱅드림 갤 no=6631482

### MyGO 셋리스트 확인 (research/setlist-idol.md 10공연)

setlist.fm에서 1~9번 공연은 받았다. 10번(LuckyFes'26)은 빈 응답(202)이 왔고, 다시 받는 요청은 권한 분류기가 막았다. 9공연 기준 집계는 아래와 같다.

| 곡 | 공연 수 | 결과 |
|---|---|---|
| 聿日箋秋 (Ichijitsu Senshuu) | 6/9 (1,2,3,7,8,9) | 추가 |
| 掌心正銘 (Shoushin Shoumei) | 5/9 (3,5,6,8,9) | **추가 못 함**: My One Ticket에 이 곡이 없다 |
| 砂寸奏 (Sasurai) | 5/9 (3,5,6,8,9) | 추가 |
| 孤壊牢 (Kokoro) | 4/9 (3,5,6,9) | 추가 |
| 歌いましょう鳴らしましょう | 4/9 (5,6,8,9) | 추가 |
| 証命讃歌 (Shoumei Sanka) | 2/9 (8,9) | **제외**: 10번 공연에 있어도 최대 3/10 |

- 「Shoushin Shoumei」의 실제 제목은 **掌心正銘**(LRCLIB 확인)이다. My One Ticket의 「증명찬가」는 **証命讃歌(Shoumei Sanka)**라는 다른 곡이라, 배정 메모의 대응 관계가 틀렸다.
- 디시 뱅드림 갤 「마이고 콜표 v1.0」(no=6582806)에도 掌心正銘은 없다. 디시 계열 콜 자료가 없어서 추가하지 않았다.
- 셋리스트 5번(K-Arena)과 6번(타이베이)의 곡 목록이 완전히 같다. research 표의 링크를 다시 확인하면 좋겠다. 집계 결과는 바뀌지 않는다.

### 곡별

#### CHiCO with HoneyWorks
세 가이드 모두 Zepp tour 2026 라이브 영상이 기준이다. 다만 가이드 시간은 LRC 시간을 일정하게 민 값이었다(프라이드 +0.5, 결전 약 +2.8, 전장 +10.0초). 그래서 가사 줄은 원문으로 맞추고, 어이 묶음 시간은 그 차이를 빼서 옮겼다.

| 파일 | 영상 | LRCLIB | 줄 | 콜 |
|---|---|---|---|---|
| data/songs/chico-honeyworks/chico-pride-kakumei.json (order 3) | EYiNo2kLAHw (Sony Music 공식 MV, 3:58), offsetSec 0 | 27806895 동기화 | 50 | 20 |
| data/songs/chico-honeyworks/chico-kessen-spirit.json (order 4) | ErqUUYWfOBo (공식 MV, 4:33), offsetSec 0 | 13698118 동기화 | 57 | 38 |
| data/songs/chico-honeyworks/chico-senjou-no-hana.json (order 5) | 7XmUY7kqnTI (공식 MV, 3:09), offsetSec 0 | 24881315 동기화 | 53 | 17 |

- Topic 음원은 검색되지 않아 공식 MV를 썼다. MV의 인트로 길이가 음원과 다를 수 있으니 offset 0이 맞는지 확인이 필요하다.
- 어이 묶음(4번씩)
  - 프라이드: 인트로 4, 1절 뒤 4, 대사 뒤 6
  - 결전: 인트로 4, 1절 뒤 4, 브리지 뒤 4
  - 전장: 인트로 2, 1절 뒤 3, 마지막 후렴 직전 4(마지막 묶음은 3번)
- 戦場の華의 박수 4번째 줄(「リアルとフェイク…」「ずるいやつらを…」)은 가이드에서 앞부분만 표시돼 있어 note에 적었다.
- 읽기 확인
  - 決戦: 「強き風」를 카제로 읽었는데, 가이드는 후-로 읽었다
  - 決戦: 「涙やって」 표기
  - 戦場: 「i」를 아이로 읽음
  - プライド: 22번 줄 「ぶつかれ」って

#### ゆず 栄光の架橋 — data/songs/yuzu/yuzu-eikou-no-kakehashi.json (order 4)
- 영상: PRJoAPH0ZGo (공식 MV, 5:24), offsetSec 0. 가이드와 같은 영상이다. 다만 가이드 시간은 손으로 찍은 값이라 LRC와 0.2~1.1초 차이가 난다.
- LRCLIB: 11406196 (ゆずイロハ 수록, 323초, 동기화), 20줄
- 콜 3개, 모두 떼창
  - 1절 후렴 3줄
  - 2절 「悲しみや…」 2줄
  - 마지막 후렴 2줄
- 가이드 메모 「시작 전 / 사비 직전에 불러달라고 하면 부르기」는 note에 넣었다.

#### MyGO!!!!!
모든 곡의 첫 콜은 기존 MyGO 곡과 같은 상징색 penlight(#2f8fd8, t 0)다. 어이/응원봉 흔들기/점프 묶음도 기존 파일처럼 콜 3개로 나눴다.

| 파일 | 영상 | LRCLIB | 줄 | 콜 |
|---|---|---|---|---|
| data/songs/mygo/mygo-ichijitsusenshu.json (order 5) | MaogbGr8Qhg (공식 MV, 4:00), offsetSec 0 | 39141467 동기화 | 43 | 9 |
| data/songs/mygo/mygo-kokoro.json (order 6) | 4Dz3pcgg_Mo (**Topic 음원**, 3:35), offsetSec 0 | 16047634 동기화 | 36 | 35 |
| data/songs/mygo/mygo-sasurai.json (order 7) | uiWLU577gYY (공식 MV, 3:47), **offsetSec 2.1** | 21830447 동기화 | 40 | 33 |
| data/songs/mygo/mygo-utaimashou.json (order 8) | _0FI8xSgI1s (공식 MV, 3:01), **offsetSec −0.4** | 4142050 동기화 | 33 | 19 |

- 聿日箋秋
  - 가이드 영상은 애니 삽입곡 클립(lQuWN0biOBU)이라 줄로 맞췄다. 차이는 약 0.3초로 일정하다.
  - 「瞬間」은 토키로 읽었다(읽기 확인).
- 孤壊牢
  - 가이드 영상은 8th LIVE 라이브 영상이다. 차이는 1.4초로 일정하다.
  - Hey! 16번은 「Hey!」 jump 콜로 합쳤다(가이드: 떼창+점프, 3-2-2 패턴).
  - 우리 22번 줄은 가이드의 두 줄을 합친 줄이라, Hey! 5번을 가이드 줄 길이로 다시 계산했다.
  - Hey! offset은 모두 어림값이다.
  - 「鈍色」은 니비이로로 읽었다(가이드는 니부이로).
- 砂寸奏
  - 가이드와 같은 MV다. 가이드 시간 = LRC + 2.1초로 일정해서 offsetSec 2.1로 두었다.
  - LRCLIB 가사는 「(Ooh-whoa, ooh-whoa)」인데, 떼창 텍스트는 가이드대로 「Uh Wow wow Uh Wow wow」(↗↗ 구분)로 적었다.
  - 기타 솔로 「어이! 하지 않기」(other, t 33.4)를 추가했다.
  - 「宇宙」는 소라로 읽었다(가이드도 소라).
- 歌いましょう鳴らしましょう
  - LRCLIB 동기화본이 이것 하나뿐이다. 앞의 제목·작사·작곡 크레딧 3줄은 지웠다.
  - 가이드와 같은 MV이고 가이드 시간 = LRC − 0.4초라 offsetSec −0.4로 두었다. MV가 LRC보다 5초 길어서 아웃트로 차이일 수 있다.
  - 「마쇼!」「데쇼!」 점프 위치는 추정값이다.

### 검수 때 확인할 점
- CHiCO MV 3곡과 聿日箋秋 MV의 offsetSec 0이 맞는지(인트로 길이)
- 歌いましょう의 offsetSec −0.4와 砂寸奏의 offsetSec 2.1
- 시간 `t`로 옮긴 어이 묶음 위치. 특히 결전 인트로 3.91초 ~ 11.61초
- 孤壊牢 Hey! 점프 위치, 歌いましょう 점프 2번
- 발음 초안 전체(review.pronunciation false)

### 추가하지 못한 곡
- 掌心正銘 (MyGO): My One Ticket과 디시 콜표에 콜 자료가 없다
- 証命讃歌 (MyGO): My One Ticket에 가이드는 있지만 셋리스트 기준(≥4/10)에 못 미친다

---

## 새 곡 추가 보고: qwer-candytune 묶음 (일 11/22)

5곡을 모두 추가했다.

### QWER

#### 눈물참기 (Dear): data/songs/qwer/qwer-dear.json (order 4)
- 영상: SUx0-btw2nQ, "QWER - Topic" 음원(202초), offsetSec 0. 어이어이바위게도 같은 영상을 쓴다.
- LRCLIB: 32997934, 동기화 가사 38줄. 줄 시간이 어이어이바위게와 완전히 같다.
- 가사 보정: LRCLIB 원본에서 줄 4·5·16·17 뒷부분이 빠져 있었다(「세상이」, 「여전히」, 「말해줘」, 「도와줘」만 있음). 어이어이바위게 표기대로 줄 전체를 채웠다(예: 「세상이 아직은 무섭고」).
- 콜 14개
  - 네임콜과 「눈물참기! QWER!」: 인트로와 아웃트로에 2개씩
  - 떼창 9개: 세상이, 여전히, 눈물, 비가, 말해줘, 도와줘, 눈물, 비가, 이젠 잘 지낼게요
  - 간주 「어이! ×12」 1개
  - 모두 사이트 시간을 그대로 옮겼다.
- 출처: 디시 no=1775080(어이어이바위게 소개), 어이어이바위게 /songs/dear(OFFICIAL, 위버스 공식 응원법 기반), 디시 no=1769899(「눈물참기! QWER!」 순서), 디시 no=1631918(공식 응원법 영상 공유).
- 검수할 점: 떼창은 모두 줄 앞부분이라 offset 0이다. 큰 문제는 없다.

#### Our Voyage: data/songs/qwer/qwer-our-voyage.json (order 5)
- 영상: 3ZZxM2iCe60, "QWER - Topic" 음원(187초), offsetSec 0. 검색으로는 나오지 않았고, YouTube Music에서 앨범 재생목록의 공식 음원 버전으로 찾았다. MV(FifVV3t38Vk)는 3:52라서 쓰지 않았다.
- LRCLIB: 33337990, 동기화 가사 42줄.
- **어이어이바위게에 이 곡이 없다**(사이트 곡 목록 25곡에 없음). 그래서 콜은 디시 글 댓글로만 만들었다.
  - no=2090330 「근데 보야지 떼창 어디 말하는 거임???」(2026-09-09): 브리지 뒤 쵸단 파트 다음, 「이야기가 네게 닿기 전엔 끝낼 수 없어 / 긴긴 여정 끝에 네가 웃을 때까지」를 큰 박수 칠 때 부른다. 쵸단이 스틱으로 신호를 준다.
  - no=2066525(2026-08-24): 시연이 「다같이!」라고 하는 부분이고, 원래 멘트가 「박수」라 박수 치면서 떼창한다. 「어이!어이! 하는 부분」도 있다고 한다.
  - no=2058169(2026-08-17): 따로 응원법은 없고 박수 치는 구간이 떼창 파트다.
- 콜 4개
  - 박수(줄 34)
  - 떼창 2개(줄 34, 35)
  - 「어이! 어이!」 1개: `{t:null, afterLine:15}`
- 검수할 점
  - 「어이! 어이!」는 위치와 횟수를 디시 자료에서 찾지 못했다. 1절 뒤 간주로 추정했을 뿐이라 지워도 된다.
  - 떼창이 뒤의 반복(줄 36~37)까지 이어지는지 확인해야 한다.

#### CEREMONY: data/songs/qwer/qwer-ceremony.json (order 6)
- 영상: uXgk1YLRIN0, "QWER - Topic" 음원(197초), offsetSec 0. 어이어이바위게와 같은 영상이다.
- LRCLIB: 39048882(아티스트 표기 "QWER (최애의 아이들)"), 동기화 가사 54줄. 다른 항목은 일반 가사뿐이었다. 줄 시간은 어이어이바위게보다 0.05~0.35초 이르다. 콜 위치는 줄마다 차이를 빼서 환산했다.
- 콜 28개
  - 인트로: One! Two! Q! W! E! R!, 네임콜, 허밍 「따라라따…」, 「세레머니!」
  - 「억지!」
  - 떼창: This is not me, 백팔십도 다, 두고 봐, 이제부터 다, 지켜봐
  - 「어이!」 2개(후렴 직전)
  - 후렴 끝 떼창: Ceremony / déjà vu / 거라구 / for me
  - 브리지 뒤 함성
  - 디시에서 멤버들이 외친다고 한 줄 39 「Ceremony for me」(선택)
- 출처: 디시 no=1874102(텍스트 응원법, 2026-04-28), no=1873937(공식 응원법 영상 공유), no=1775080, 어이어이바위게 /songs/ceremony(OFFICIAL), 공식 응원법 영상 vqfSealefyQ.
- 검수할 점
  - 후렴 줄 끝 떼창(Ceremony, déjà vu, 거라구, 있었다구, for me) 14개는 어이어이바위게에 줄 안 위치가 없어서 offset을 1.5~1.7초로 어림했다. 노트에 "위치 추정"을 적었다.
  - 「어이!」는 어이어이바위게 값(startTimeOffset 4.15·4.2)을 바로 앞 가사 줄 기준으로 해석해 「걸어볼까」 직후에 놓았다. 디시 텍스트와 공식 영상 제목 「걸어볼까, 어이?」와 맞는 해석이다.

### CANDY TUNE

#### 備えあれば無問題 (모-만타이): data/songs/candy-tune/candy-tune-sonaereba-moumantai.json (order 4)
- 제목 확인: 콜렌 ct-sonae의 title이 「備えあれば無問題」다. 가사에서 무문제는 「モウマンタイ」로 읽는다.
- 영상: JSCsrCL3NGY, 공식 MV(KAWAII LAB., 238초), offsetSec 0. Topic 음원이 없다(YouTube Music에도 없음). **MV가 LRCLIB(234초)보다 4초 길다.** 이 사이트에서는 자동 자막을 받을 수 없어서 offset을 정하지 못했다. 보정 도구에서 확인해야 한다. 같은 아티스트의 기존 곡도 MV에 offset 0이다.
- LRCLIB: 24445854, 동기화 가사 69줄. 첫 가사가 32초에 나오고 인트로가 길다.
- 콜렌: ct-sonae(Kアリーナ横浜 2026/2/11 라이브 Kl1C-JV-qV0)
  - **평행 이동량 -4.75초**: 콜렌 시간에 4.75초를 더했다. 라이브가 스튜디오보다 이르다.
  - 기준점: 「ぐる×4」(1절·2절 「ぐるぐるぐるぐる」 줄과 -4.71·-4.74초 차이), 「うぇい」 3번(「うえい/うぇい」 줄과 -4.69~-4.82초), 멤버 콜 시작이 다음 줄 시작과 맞음.
  - korshift 자동 점수는 -8.25~-6.3초를 가리켰지만, 기준점이 더 확실해서 그쪽을 따랐다.
  - 73개 콜을 39개 cue로 적용했다(korapply).
- 발음(ko): 69줄을 초안으로 넣었다. 中·佛 구절은 「이, 얼, 싼」, 「앙, 되, 트루아」로 적었다.
- 출처: 콜렌 /song/ct-sonae(라벨에 라이브 영상과 4.75초 이동 표기), 디시 큐티 스트릿 갤러리 no=165079.
- 검수할 점
  - MV offset(0~4초).
  - 오기가 의심되는 줄: 25·62 「可愛いくなりましょ」(可愛く의 오기로 보임), 39 「うえい」와 43 「うぇい」의 표기가 다르다.
  - 「伸ばすよー！」는 줄 4 안에 들어간다.

#### スペシャル感謝祭: data/songs/candy-tune/candy-tune-special-kanshasai.json (order 5)
- 제목 확인: 콜렌 ct-kanshasai의 title이 「スペシャル感謝祭」다.
- **LRCLIB에 이 곡이 없다**(q, track_name, 아티스트 목록 검색 모두 없음). 그래서 sweet-steady-dash처럼 콜만 있는 곡으로 만들었다(`lines: []`, `lrclib: null`, review.pronunciation true).
- 영상: lrgQ4OEsHYw, 콜렌이 쓴 공식 라이브 영상(代々木第一体育館 2026/7/11, 249초), offsetSec 0. 이동량은 0이고 콜렌 시간을 그대로 썼다. 콜 전용 곡이라 라이브 영상을 쓰는 예외에 해당한다.
- 콜 27개
  - 인트로·간주 MIX는 「ウリャ！オイ！×4 👏×5 きゃん ちゅー 行くよ！」와 멤버 7명 이름 연호의 두 cue로 나눴다.
  - 후렴 「スペシャルでプレシャスです！」 5개
  - 仲間/我が家 6개, Do Dance 4개, プレシャス/スペシャル 7개, 마지막 「スペシャル感謝！」
- 출처: 콜렌 /song/ct-kanshasai, 디시 no=165079, 공식 Cheering Guide auCjmRD47nM(대조용).
- 검수할 점: 후렴 콜 위치는 영상만 보고는 가사 위치를 알 수 없다. 공식 Cheering Guide와 대조하면 좋다.

