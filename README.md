# 📄 Project Name: 서울 문화행사 정보 제공

이 프로젝트는 서울 열린데이터 광장 API와 연동하여 서울에서 열리는 문화행사를 표시하는 웹 입니다. 사용자는 카테고리별로 행사를 필터링하고, 제목이나 날짜로 검색하며, 페이지 단위로 결과를 탐색할 수 있습니다. 행사 정보에는 공연/행사명, 공연 장소, 날짜, 행사 대표 이미지를 포함합니다. 해당 card를 클릭하면 공식 사이트로 이동합니다.

## :white_check_mark: 학습 목표

- 수업 시간에 배웠던 `fetch` 활용하기
- `api`를 받아와 원하는 방식으로 `url` 작성하기
- css를 활용하여 이쁜 웹 만들기
- `pagination()` 활용하기

## :mag:주요 함수 및 기능

- 서울 열린데이터 광장 API를 사용해 문화 행사 데이터를 검색하고 출력하는 `fetchEvents()` 함수를 구현
- `movePage()` 함수를 통해 사용자가 페이지 번호를 클릭할 때 해당 페이지로 이동
- `pagination()` 함수는 페이지네이션 UI를 동적으로 생성하고 관리
- `searchFn()` 함수는 사용자가 입력한 검색어와 날짜를 기준으로 데이터를 필터링하여 화면에 표시
- 모바일 환경에서 카테고리 네비게이션 메뉴를 표시하고 숨길 수 있는 `toggleNav()` 함수를 구현
- 화면 크기 변경 시 UI를 적절히 조정하기 위해 `updateSizes()` 함수를 구현

## 기획 및 구현

### 피그마를 활용한 와이어프레임 기획

![image](https://github.com/user-attachments/assets/e5eddaa2-b4e3-448e-bf45-b2600a7ac820)

### 실제 구현

- 웹 기준
  ![image](https://github.com/user-attachments/assets/c64bcada-8db9-4bb1-b116-0c85b3d1bb71)
- maxWidth-900px 이하
  ![image](https://github.com/user-attachments/assets/919d3294-4e84-489c-81fe-b37892879fc3)

### 서울 열린데이터 광장 API

- https://data.seoul.go.kr/dataList/OA-15486/S/1/datasetView.do
