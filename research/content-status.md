# 곡 데이터 작업 현황

곡 파일을 만들 때 생긴 문제와 사용자 검수 때 확인할 점을 곡별로 적는다. "임베드" 열은 `http://127.0.0.1`에서 시험한 결과라 틀렸다. `http://localhost`와 공개 HTTPS 주소에서 다시 시험하니 **52곡 모두 재생된다**(2026-11-10). 표의 "막힘"은 무시해도 된다.

## 금요일 11/20

| 곡 | 영상 | 임베드 | 확인할 점 |
|---|---|---|---|
| ORAL 狂乱 Hey Kids!! | KVcWoDB35Bg Topic | 막힘 | 콜 offset 모두 눈대중 |
| ORAL カンタンナコト | 7aV95svG6Lw Topic | 막힘 | 콜 4개 (kyoonlife) |
| 스이세이 ビビデバ | 8ZP5eqm4JqM MV | 재생됨 | 조사 자료의 「ビビデバ」 콜·간주 박수는 출처를 다시 찾지 못해 뺐다. 한자 읽기 확인: 呪術秘中, 想通り, 解 |
| 스이세이 ソワレ | mRgslQ5Z-kU MV | 재생됨 | Star tail 콜 1개는 知恵袋 답변 근거. 다른 【Star tail】 줄도 콜일 수 있음. 읽기 확인: 静寂, 灯, 蒼穹 |
| ReoNa ANIMA | Qo_4XqKwrSM MV | 재생됨 | MV가 LRCLIB보다 6초 길어 offsetSec 맞춰야 함. 인트로 박수 시간 미정. U.O 위치 추정 |
| ReoNa GG | 1Epuw7MG0a8 MV | 재생됨 | MV가 8초 길어 offsetSec 맞춰야 함. 落ちサビ 점프 위치 추정. 읽기 확인: 全身全弹 |
| natori IN_MY_HEAD | 49tyOkJ0uLs 공식 | 재생됨 | **LRCLIB에 일본어 원문이 없어 로마자 가사로 들어감.** 로마자 오기 의심 줄 있음(6·8·23번째). 타월 위치 미기재라 첫 후렴에 붙임 |
| CLAN QUEEN 踊楽園 | BgX4BmERq5U MV | 막힘 | MV가 4초 김. 손가락 동작 2곳 위치 추정. 제목 읽기(요-라쿠엔) 확인 |
| Conton Candy ファジーネーブル | TSYtV4xa8Pw MV | 막힘 | MV가 4초 김. 대합창 1개 |
| nishina ケダモノのフレンズ | Jm1pa4nV24U Topic | 막힘 | 꼬리 흔들기 위치 미기재라 첫 후렴에 붙임 |
| jo0ji 条司 | (HjHogdC9izE MV 확인만) | - | **LRCLIB에 가사가 없어 곡 파일을 만들지 않음.** 콜: 후렴에서 팔을 들어 좌우로 흔들기 (thefirsttimes.jp). 가사를 직접 넣을지 결정 필요 |

## 토요일 11/21

| 곡 | 영상 | 임베드 | 확인할 점 |
|---|---|---|---|
| [Alexandros] 閃光 | xfG6L9I7N8I MV | 막힘 | 떼창 위치 추정. 33번째 줄 LRCLIB 원문이 이상함 |
| [Alexandros] ワタリドリ | O_DLtVuiqhI MV | 막힘 | **MV가 54초 김, offsetSec 필수.** 「Wow oh oh」는 가사에 없어 시간 미정(16번째 줄 뒤). 故郷 읽기(코쿄-/후루사토) |
| [Alexandros] starrrrrrr | GT0DynBJrUc Topic | 막힘 | 대합창 1개 |
| [Alexandros] Kick & Spin | SBMlkYYtLls MV | 막힘 | 싱어롱 위치 추정. 「光の下」 읽기(시타/모토) |
| [Alexandros] ENDROLL | lwyeuCgx8Uo MV | 막힘 | MV가 4초 김 |
| Roselia FIRE BIRD | ac66DA0pDbg Topic | 재생됨 | 콜 21개 (dcinside 요약 + seesaa 콜표). 읽기: 背負う(츠바사), 天(소라/텐), 行きたい |
| Roselia BLACK SHOUT | 7DTKwnWHFQE Topic | 재생됨 | 콜 53개. 2절 일부 콜은 dcinside에만 있음 |
| Roselia PASSIONATE ANTHEM | 68Gwwqp1DK4 Topic | 재생됨 | 인트로 박수 시간 미정 |
| Roselia Neo-Aspect | 03iVXFZ8jrs Topic | 재생됨 | 출처 dcinside 하나, 펜라이트 색 정보 없음 |
| Roselia Song I am. | Kohn9PRanoY Topic | 재생됨 | 運命 읽기(운메-/사다메) |
| Roselia R | ZqdMPCDsCeE Topic | 재생됨 | 「R」 콜 한글 표기 임시, 펜라이트 색 정보 없음 |
| SAMBOMASTER 世界はそれを愛と呼ぶんだぜ | HcuB_kpX3tc Topic | 막힘 | 후렴 시작 위치 추정 |
| SAMBOMASTER できっこないを やらなくちゃ | ry_8lmQHzWY Topic | 재생됨 | |
| SAMBOMASTER ヒューマニティ！ | SJKwDb3JWJM MV | 재생됨 | **MV가 16초 김, offsetSec 필수** |
| SAMBOMASTER 花束 | v03zRqF3o0U MV | 재생됨 | **LRCLIB가 일반 가사뿐이라 46줄 시간을 모두 찍어야 함.** 29번째 줄 원문 오기 의심 |
| FREDERIC オドループ | PCp2iXA1uLE MV | 막힘 | 「たんたん」 박수 offset 추정 |
| FREDERIC スパークルダンサー | CSaaKLSmeyU MV | 막힘 | 往来 읽기(오-라이) |
| MyGO!!!!! 影色舞 | iFIXi6zzCls MV | 재생됨 | 박수·와이퍼 위치 추정, dcinside 콜표 이미지 미확인 |
| MyGO!!!!! 迷星叫 | w-Gvclnnfpc MV | 재생됨 | MV가 5초 김. 간주 하이! 콜 2개 시간 미정 |
| MyGO!!!!! 壱雫空 | CPA86QguiHY 공식 instrumental | 재생됨 | **보컬 없는 반주 영상.** 원곡은 외부 재생 모드로 |
| MyGO!!!!! 往欄印 | KVsLvO_kvGo MV | 재생됨 | My One Ticket 가이드로 콜 21개 |
| CHiCO 私、アイドル宣言 | m7ddbml_vkY 공식 | 재생됨 | 콜 23개, 출처는 팬 글 1건. 「○○!」를 「CHiCO!」로 적음 |
| CHiCO 今日もサクラ舞う暁に | dnJ4BQCW2ZY MV | 재생됨 | 타월 위치 미기재라 첫 후렴에 붙임 |
| 캬리 PONPONPON | yzC4hFK5P3g MV | 막힘 | MV가 17초 김. 춤 구간 위치 추정, 출처 신뢰도 낮음 |

## 일요일 11/22

| 곡 | 영상 | 임베드 | 확인할 점 |
|---|---|---|---|
| Chevon ダンス・デカダンス | nJ_jkiYmDR0 공식 가사 영상 | 재생됨 | **LRCLIB가 일반 가사뿐이라 56줄 시간을 모두 찍어야 함.** durationSec는 영상 길이(202초). 相対 읽기(소-타이/아이타이) |
| Chevon Banquet | VIp-TisW7L4 MV | 재생됨 | MV가 9초 김, offsetSec 필요. C파트 「おーお」 위치 추정 |
| Chevon 冥冥 | (SIaP-ebqtTw Topic 확인만) | - | **LRCLIB에 가사 없음, 곡 파일 없음.** 콜: 「めいめい」「うぉーお」, 2절 뒤 간주 허밍 |
| Chevon 銃電中 | (N-QIvyimvF8 Topic 확인만) | - | **LRCLIB에 가사 없음.** 콜: B파트 「まずまずでした」, 후렴 「ジューデンジューデンチュー」, 마지막 후렴·아웃트로 점프 |
| Chevon FLASH BACK!!!!!!!! | (eKo5lAT9WQI Topic 확인만) | - | **LRCLIB에 가사 없음.** 콜: 「3！2！1！FLASH BACK！」, C파트 박수 |
| QWER 고민중독 | ImuWa3SJulY MV | 재생됨 | **MV가 55초 김, offsetSec 필수.** 「좋아해!」 offset 추정 |
| QWER 내 이름 맑음 | AlirzLFEHUI MV | 재생됨 | MV가 8초 김. 콜 3개 모두 시간 미정, 위치 추정 |
| QWER Discord | WGm2HmXeeRI MV | 재생됨 | **콜 0개.** 글로 된 출처 없음. 응원법 영상(egR0PFeT2gw) 6:14 구간 보고 채워야 함 |
| 유즈 夏色 | hhDzDL9Y2Lo MV | 재생됨 | MV가 14초 김. 「もう1回!」는 라이브 전용 구간 |
| 유즈 サヨナラバス | 8NePZ_c2bPs Topic | 재생됨 | back number 협업 재녹음판(가사가 이 판에만 있음) |
| 유즈 ビューティフル | AFFWL8AjKQQ 공식 Visualizer | 재생됨 | 따라 부르기 위치 추정. 運命 읽기 |
| SWEET STEADY Call me, Tell me | aCsHzjGt_QU 공식 스페셜 영상 | 재생됨 | **LRCLIB가 일반 가사뿐이라 62줄 시간을 모두 찍어야 함.** 팡 MIX 위치 추정 |
| SWEET STEADY カワイイコレクション | PXMessDoNeo MV | 재생됨 | 「OK!」 위치 추정. 避けちゃって 읽기 |
| SWEET STEADY SWEET STEP | YtpbG4bnaYA 공식 라이브 | 재생됨 | **가사 없이 콜만** (콜렌 시간 데이터, 39묶음) |
| SWEET STEADY ハートの魔法 | hRseb2KsyHk 공식 라이브 | 재생됨 | **가사 없이 콜만** (콜렌, 102묶음) |
| SWEET STEADY DASH!!! | ihhoXKr6ku0 공식 라이브 | 재생됨 | **가사 없이 콜만** (콜렌, 66묶음) |
| CANDY TUNE 総意♡So Free | mnf87lhGgqE MV | 재생됨 | MV가 6초 김. A멜로 응답 「So Free」/「総意！」 확인 필요 |
| CANDY TUNE 倍倍FIGHT! | 9HKbo1FstOE MV | 재생됨 | Topic(6mTKPDwzoRM)이 막혀 MV로 바꿈(길이 같음). 콜 22개 |
| CANDY TUNE キス・ミー・パティシエ | esPFCP4arBc MV | 재생됨 | Topic이 막혀 MV로 바꿈(+2초). 콜 15개 |
| 오오츠카 아이 さくらんぼ | upODO6OuOOk avex 공식 | 재생됨 | Topic이 막혀 바꿈. **영상이 7초 김, offsetSec 필요.** 6번째 줄 원문 오기 의심 |
| eill フィナーレ。 | 1lYb9nLO_FY MV | 막힘 | 근거가 익명 후기 1건. 대체 공식 스튜디오 영상 없음 |

## 디시 재조사 반영 (2026-11-10)

자세한 내용은 `extra-calls-dcinside.md`. 디시 이용자 제작 가이드 3곳(응원 가이드 사이트, My One Ticket, 콜렌)으로 21곡의 콜을 바꾸거나 새로 만들었다. 가이드 줄과 맞추지 못한 콜은 "위치 확인 필요" 메모와 함께 시간 미정 콜로 들어 있다. Chevon 冥冥·銃電中·FLASH BACK!!!!!!!!과 jo0ji 条司는 여전히 곡 파일이 없다(콜이 대부분 가사 떼창이라 가사 없이는 쓸모가 적음).

## 콜이 적던 곡 재조사 (2026-11-10)

| 곡 | 콜 수 | 새 근거 |
|---|---|---|
| [Alexandros] Kick & Spin | 2 → 13 | 디시 일본 가수 갤러리 「알렉산드로스 콜가이드」 이미지 콜표 (no=813923): 인트로 박수, 「down」 외치기, 「Stay alight, stay alive」 떼창, 「어이!」, 마지막 일본어 떼창 |
| [Alexandros] ENDROLL | 1 → 2 | Real Sound·ぴあ 리포트: 후렴 함께 부르기 (구간 미기재) |
| FREDERIC オドループ | 3 → 6 | adorehack, Billboard JAPAN 무도관 리포트, 디시 "리벳 대비 외울 춤 리스트": 2절·마지막 후렴 떼창, 오도루프 춤 |
| nishina ケダモノのフレンズ | 1 → 3 | LiveFans·ぴあ·Rolling Stone 리포트: 인트로 박수, 후렴 함께 부르기 |
| Conton Candy ファジーネーブル | 1 → 5 | LiveFans 투어 리포트: 박수, 점프, 간주 「ワン・ツー!」, 落ちサビ 함께 부르기 |
| eill フィナーレ。 | 1 → 3 | THE FIRST TIMES 5주년 리포트: 후렴 대합창 |
| 大塚愛 さくらんぼ | 6 (변경 없음) | 박수 위치를 적은 출처를 찾지 못함 |

새로 넣은 콜 중 리포트 근거인 것은 구간이 적혀 있지 않아 위치가 추정이다. 디시 알렉산드로스 콜표에는 閃光·ワタリドリ·Starrrrrrr 페이지도 있어, 응원 가이드 사이트 콜과 대조하면 박수 구간을 보강할 수 있다.
