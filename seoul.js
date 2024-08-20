const API_KEY = '4853614d6979736836345255477a42';

const $nav = document.getElementById('gnb');
const $searchBtn = document.querySelector('.searchBtn');
const $inputArea = document.querySelector('.inputArea input');

let eventList = []; // 수정 - renderEvents 함수에서 이 배열을 사용하여 뉴스 목록을 렌더링 하도록 전역에서 관리
let pageSize = 9;
let page = 1;
let totalResults = 0;
let groupSize = 10;

// 수정 - currentPage는 사용하지 않겠습니다. page로 통일
// 페이지네이션을 위한 변수
let currentCategory = '뮤지컬';
let currentQuery = null;

const fetchNews = async (
  category = currentCategory,
  query = currentQuery,
  pageNum = 1
) => {
  const start = (pageNum - 1) * pageSize + 1;
  const end = pageNum * pageSize;

  // API 요청 URL 생성
  let url = new URL(
    `http://openapi.seoul.go.kr:8088/${API_KEY}/json/culturalEventInfo/${start}/${end}/`
  );

  // 검색어 또는 카테고리에 따른 파라미터 설정
  if (query) {
    url.searchParams.set('q', query);
    currentQuery = query;
    currentCategory = null;
  } else {
    url.searchParams.set('category', category);
    currentQuery = null;
    currentCategory = category;
  }

  let res = await fetch(url);
  let data = await res.json();
  //console.log(data);

  totalResults = data.culturalEventInfo.list_total_count;
  //console.log(`총 개수: ${totalResults}`);

  eventList = data.culturalEventInfo.row;
  renderEvents(eventList);
  pagination();
};

// 페이지 이동 함수
const movePage = (pageNum) => {
  page = pageNum;
  fetchNews(currentCategory, currentQuery, pageNum);
};

// 페이지네이션 UI 생성 함수
const pagination = () => {
  let pageGroup = Math.ceil(page / groupSize);
  let lastPage = Math.min(
    Math.ceil(totalResults / pageSize),
    pageGroup * groupSize
  );
  let firstPage = (pageGroup - 1) * groupSize + 1;
  //   let totalPage = totalResults;
  let totalPage = Math.ceil(totalResults / pageSize);
  let prevGroup = (pageGroup - 2) * groupSize + 1;
  let nextGroup = pageGroup * groupSize + 1;

  // 페이지네이션 HTML 생성
  let paginationHtml = `<button class="next" ${
    pageGroup == 1 ? 'disabled' : ''
  } onClick='movePage(${prevGroup})'>이전페이지그룹</button>`;

  paginationHtml += `<button class="next" ${
    pageGroup == 1 ? 'disabled' : ''
  } onClick='movePage(${page - 1})'>이전</button>`;

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHtml += `<button class='${
      i == page ? 'on' : ''
    }' onClick='movePage(${i})'>${i}</button>`;
  }

  // 수정- 조건 변경
  paginationHtml += `<button class="next" ${
    page >= totalPage ? 'disabled' : ''
  } onClick='movePage(${page + 1})'>다음</button>`;

  paginationHtml += `<button class="next" ${
    pageGroup * groupSize >= totalPage ? 'disabled' : ''
  } onClick='movePage(${nextGroup})'>다음페이지그룹</button>`;

  // 페이지네이션 UI 업데이트
  document.querySelector('.pgCon').innerHTML = paginationHtml;
};

const createHtml = (news) => {
  let urlToImage = news.MAIN_IMG || './No_Image.jpg';
  let title = news.TITLE || '제목없음';
  let description = news.PLACE || '내용없음';
  let author = news.DATE || '날짜 없음';
  return `<li>
            <div class="newsImg"><img src="${urlToImage}" alt="" /></div>
            <p class="title">${title}</p>
            <p class="desc">${description}</p>
            <p class="source">${author}</p>
            <a class="more" href="${news.ORG_LINK}" target="_blank"></a> 
          </li>`;
};

// 뉴스 리스트 렌더링 함수
const renderEvents = (eventList) => {
  console.log(eventList);
  const newsHtml = eventList.map((news) => createHtml(news)).join('');
  document.getElementById('listCon').innerHTML = newsHtml;
};

// 네비게이션 카테고리 클릭 이벤트 리스너
$nav.addEventListener('click', (e) => {
  console.log(e.target.dataset.cate);
  if (e.target.tagName !== 'BUTTON') return;
  let category = e.target.dataset.cate;

  fetchNews(category);
});

// 검색 함수
const searchFn = () => {
  const searchWord = $inputArea.value;
  $inputArea.value = '';

  fetchNews(null, searchWord);
};

$searchBtn.addEventListener('click', () => {
  searchFn();
});

$inputArea.addEventListener('keyup', (e) => {
  if (e.key !== 'Enter') return;
  searchFn();
});

// 초기 뉴스 로드
fetchNews();
