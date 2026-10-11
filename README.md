# 제주 해군기지 위기 커뮤니케이션 · HTML 발표 자료

남성주·황성욱(2013), 「웹페이지와 트위터 메시지에 나타난 이미지 회복 전략 비교연구: 제주 해군기지 건설 사례를 중심으로」를 다룬 조민성의 15장 발제 자료.

## 사용
- `index.html`을 브라우저로 열면 오프라인에서도 동작합니다.
- 방향키/Space: 이동, G: 목차, N: 발표자 노트, D: 원자료·출처, F: 전체 화면.
- 모바일 세로 화면은 문서형 배치, 가로 화면은 16:9 발표 배치입니다.
- 브라우저 인쇄에서 배경 그래픽을 켜면 15장 슬라이드로 출력합니다.

## 구성
- `content.js`: 원고에서 옮긴 표5~11 데이터, 발표자 노트, 원자료 표.
- `slides.js`: 15장 화면과 편집 가능한 SVG/HTML 차트.
- `styles.css`: 1920×1080 발표 화면, 모바일 및 인쇄 배치.
- `app.js`: anime.js 전환, 키보드·터치 이동, 원자료 및 노트 패널.
- `assets/`: 로컬 폰트, 사진, anime.js 및 해당 라이선스.
- `tools/`: 원고 데이터 추출과 브라우저 검증 스크립트. `qa/`는 비공개 로컬 검증 출력으로 Git 제외.

## 자료 정확성
주논문은 사용자 제공 PDF를 확인했으며 인쇄 쪽수를 인용합니다. n은 표에 따른 코딩 주제 수이고 포스팅 수가 아닙니다. 트위터 주제 수 197/198, 표7 합계행, 본문/표 비율의 불일치를 임의로 고치지 않고 해당 슬라이드와 원자료 패널에 기록했습니다. 표11의 72.9%는 97/133을 계산한 파생 지표입니다.

관찰 결과, 논문 저자의 해석, 발제자의 비평을 구분했습니다. 공중의 이미지 회복 효과나 매체의 순수 인과효과를 검증한 연구가 아닙니다.

## 사진과 의존성
- [Gangjeong in 2012](https://commons.wikimedia.org/wiki/File:Gangjeong_in_2012.jpg), OneTheHuman, 2012.05.02.
- [Gangjeong Protest at Jeju CCI in 2012](https://commons.wikimedia.org/wiki/File:Gangjeong_Protest_at_Jeju_CCI_in_2012.jpg), OneTheHuman, 2012.05.01.
- 두 사진은 [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)이며 표시 비율에 맞추어 크롭했습니다.
- anime.js 3.2.2: MIT. Pretendard 1.3.9: SIL Open Font License 1.1. 라이선스 전문은 assets에 있습니다.
- 논문 PDF와 추출 전문은 저장소 및 배포에 포함하지 않습니다.

## 검증
`python tools/validate.py`는 Chromium에서 15장 전체 렌더링, 경계 검사, 수치 대조, 인터랙션, 모바일, 오프라인 검사를 수행합니다. Python 패키지 `playwright`, `pillow`와 Playwright Chromium이 필요합니다.
