# 과제의 개요
운동 SNS 서비스 API 설계

# 문제 해결을 위한 아이디어 요약
## 프로세스 항목
1. User 회원가입
2. User 로그인
3. 운동 게시물 등록
4. 운동 게시물 조회

## 작업 리스트 항목
1. 개발환경 세팅
2. DB 연동
3. API 개발

## API 설계
Auth, Exercise Post, Comment 등으로 API를 작성하고 필요한 CRUD 작성

# 개발 환경
## FE
Swagger-ui

## BE
Node express,
MySql,
tsoa,
typescript,
Prisma,
Docker

## 환경 구성
Docker를 활용하여 Mysql을 올리고 이를 Prisma를 이용해 연동

# 프로젝트 빌드 & 테스트 & 실행 방법
1) docker-compose -f /Users/jade/fittrix/docker-compose.yml up -d
2) yarn install
3) yarn build
4) yarn dev
5) [http://localhost:3000/api-helper](http://localhost:3000/api-helper) 접속
6) 권한이 필요한 API의 경우에는 login에서 나온 auto tokent을 Swagger 우측 상단 Authorizate 팝업 클릭후 토큰을 넣은 다음 테스트 


# 미해결 이슈 정리
1) TC 미작성항목
2) docker를 통해 nginx, webapp을 올릴수 있게 설정 추가 필요
3) ssl 처리
