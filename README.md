# migration
/migration
  ├── extractBlog.js   (네이버 블로그 글 추출하는 코드)
  ├── saveToNotion.js  (Notion에 저장하는 코드)
  ├── migrate.js       (전체 실행 스크립트)
  ├── config.js        (API 키, Database ID 등 설정)
  ├── package.json     (npm 패키지 관리)


axios: HTTP 요청 (requests 같은 역할)
cheerio: HTML 파싱 (BeautifulSoup 같은 역할)
dotenv: 환경변수 관리 (API 키 안전하게)


node_modules (용량 큰 모듈 폴더)
.env (민감 정보)
.vscode (개인 에디터 설정)
*.log (로그파일)
.DS_Store (Mac 사용 시 자동 생성되는 파일)

migrate.js 실행
 → cleanDatabase() 실행 (기존 데이터 모두 삭제)
 → fetchBlogDataFromRSS() 실행 (링크 + 게시날짜 가져오기)
 → extractBlogContent() 실행 (본문 가져오기)
 → saveToNotion() 저장 (제목, 게시날짜, 실행날짜, URL 저장)
