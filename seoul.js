const API_KEY = '4853614d6979736836345255477a42';

const $nav = document.getElementById('gnb');
const $searchBtn = document.querySelector('.searchBtn');
const $inputArea = document.getElementById('searchInput');
const $dateInput = document.getElementById('dateInput');
const buttons = document.querySelectorAll('.btn-icon');

let eventList = [];
let pageSize = 9;
let page = 1;
let totalResults = 0;
let groupSize = 10;

let currentCategory = '전체';
let currentQuery = null;
let currentDate = null;

const fetchEvents = async (
  category = '전체',
  query = null,
  pageNum = 1,
  date = null
) => {
  const start = (pageNum - 1) * pageSize + 1;
  const end = pageNum * pageSize;

  let url;
  if (category === '전체') {
    url = new URL(
      `http://openapi.seoul.go.kr:8088/${API_KEY}/json/culturalEventInfo/${start}/${end}/`
    );
  } else {
    url = new URL(
      `http://openapi.seoul.go.kr:8088/${API_KEY}/json/culturalEventInfo/${start}/${end}/${category}/`
    );
  }

  if (query !== null) {
    url = new URL(
      `http://openapi.seoul.go.kr:8088/${API_KEY}/json/culturalEventInfo/${start}/${end}/%20/${query}/`
    );
    currentQuery = query;
    currentCategory = '전체';
  } else {
    // currentQuery = '%20'; 이렇게 하면 페이징할 때 전체 카테고리를 기준으로 들어감.
    currentQuery = null;
  }

  if (date !== null) {
    if (query)
      url = new URL(
        `http://openapi.seoul.go.kr:8088/${API_KEY}/json/culturalEventInfo/${start}/${end}/%20/${query}/${date}/`
      );
    else {
      url = new URL(
        `http://openapi.seoul.go.kr:8088/${API_KEY}/json/culturalEventInfo/${start}/${end}/%20/%20/${date}/`
      );
    }
    currentDate = date; // 현재 날짜를 저장
  } else {
    currentDate = null; // 날짜 초기화 (안하면 다음 검색 시 날짜가 계속 남아있음)
  }

  let res = await fetch(url);
  let data = await res.json();
  currentCategory = category;

  totalResults = data.culturalEventInfo.list_total_count;
  console.log(`총 개수: ${totalResults}`);

  let eventList = data.culturalEventInfo.row;

  renderEvents(eventList);
  pagination();
};

// 페이지 이동 함수
const movePage = (pageNum) => {
  page = pageNum;
  fetchEvents(currentCategory, currentQuery, pageNum, currentDate);
};

// 페이지네이션 UI 생성 함수
const pagination = () => {
  let pageGroup = Math.ceil(page / groupSize);
  let lastPage = Math.min(
    Math.ceil(totalResults / pageSize),
    pageGroup * groupSize
  );
  let firstPage = (pageGroup - 1) * groupSize + 1;
  let totalPage = Math.ceil(totalResults / pageSize);
  let prevGroup = (pageGroup - 2) * groupSize + 1;
  let nextGroup = pageGroup * groupSize + 1;

  // 페이지네이션 HTML 생성
  let paginationHtml = `<button class="next" ${
    pageGroup == 1 ? 'disabled' : ''
  } onClick='movePage(${prevGroup})'><<</button>`;

  paginationHtml += `<button class="next" ${
    page < 2 ? 'disabled' : ''
  } onClick='movePage(${page - 1})'><</button>`;

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHtml += `<button class='${
      i == page ? 'on' : ''
    }' onClick='movePage(${i})'>${i}</button>`;
  }

  // 수정- 조건 변경
  paginationHtml += `<button class="next" ${
    page >= totalPage ? 'disabled' : ''
  } onClick='movePage(${page + 1})'>></button>`;

  paginationHtml += `<button class="next" ${
    pageGroup * groupSize >= totalPage ? 'disabled' : ''
  } onClick='movePage(${nextGroup})'>>></button>`;

  // 페이지네이션 UI 업데이트
  document.querySelector('.pgCon').innerHTML = paginationHtml;
};

const createHtml = (events) => {
  let urlToImage = events.MAIN_IMG || './No_Image.jpg';
  let title = events.TITLE || '제목없음';
  let place = events.PLACE || '내용없음';
  let date = events.DATE || '날짜 없음';
  return `<li>
            <div class="eventsImg"><img src="${urlToImage}" alt="" /></div>
            <p class="title">${title}</p>
            <p class="place">${place}</p>
            <p class="date">${date}</p>
            <a class="more" href="${events.ORG_LINK}" target="_blank"></a> 
          </li>`;
};

// 행사 리스트 렌더링 함수
const renderEvents = (eventList) => {
  console.log(eventList);
  const eventsHtml = eventList.map((event) => createHtml(event)).join('');
  document.getElementById('listCon').innerHTML = eventsHtml;
};

// 네비게이션 카테고리 클릭 이벤트 리스너
$nav.addEventListener('click', (e) => {
  // 가장 가까운 button 요소를 찾음
  const button = e.target.closest('button');
  if (!button) return;

  let category = button.dataset.cate;

  page = 1;
  fetchEvents(category);
});

// 검색 함수
const searchFn = () => {
  const searchWord = $inputArea.value;
  const searchDate = $dateInput.value;
  console.log(`날짜: ${searchDate}`);
  $inputArea.value = '';
  $dateInput.value = '';
  page = 1;
  fetchEvents('전체', searchWord, 1, searchDate);

  buttons.forEach((btn) => btn.classList.remove('active'));
};
// 검색 버튼 클릭 이벤트 리스너
$searchBtn.addEventListener('click', () => {
  searchFn();
});

// 검색 input 엔터 이벤트 리스너
$inputArea.addEventListener('keyup', (e) => {
  if (e.key !== 'Enter') return;
  searchFn();
});

// 버튼 클릭 시 active 클래스 추가
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    // 현재 active 클래스를 가지고 있는 버튼을 찾아서 제거
    const activeButton = document.querySelector('.active');
    if (activeButton) {
      activeButton.classList.remove('active');
    }
    button.classList.add('active');
  });
});
// 햄버거 메뉴 토글
function toggleNav() {
  const navMenu = document.getElementById('hamburgerNav');
  if (navMenu.style.display === 'block') {
    navMenu.style.display = 'none';
  } else {
    navMenu.style.display = 'block';
  }
}

// 카테고리 선택 시 이벤트 처리
function fetchCategory(event) {
  event.preventDefault();
  const category = event.target.getAttribute('data-cate');
  fetchEvents(category); // 카테고리 값으로 이벤트를 가져오는 함수 호출
}
// 화면 크기 변경 감지 및 UI 업데이트
const updateSizes = () => {
  const currentWidth = window.innerWidth;
  let newPageSize, newGroupSize;

  if (currentWidth <= 900) {
    newPageSize = 3;
    newGroupSize = 5;
  } else {
    newPageSize = 9;
    newGroupSize = 10;
  }
  // 조건안주면 1px 움직일때마다 자꾸 값 불러옴.
  if (newPageSize !== pageSize || newGroupSize !== groupSize) {
    pageSize = newPageSize;
    groupSize = newGroupSize;

    // UI 업데이트 안하면 900보다 커져도 3개씩만 보임
    fetchEvents(currentCategory, currentQuery, page, currentDate);
  }
};

updateSizes();
window.addEventListener('resize', updateSizes);

fetchEvents();
