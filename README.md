# Simple board api server

Web Application Server를 구현하세요. nodejs 환경에서 실행되는 게시판 API를 제공하는 서버를 구현합니다.
스펙에 정의되지 않은 부분은 일반적인 웹사이트 게시판의 백앤드를 상상하며 개발하면 됩니다.

프레임워크는 express/koa 등 node 환경에서 동작한다면 어떤 것을 골라도 좋습니다.

작업 중 스펙에 관련된 모호한 부분이 생긴다면 즉시 이야기 해주세요.

같은 데이터 모델에 대해 RESTful과 GraphQL을 **동시**에 사용하여 API 레이어를 구현합니다. RESTful의 규칙을 최대한 지켜주세요. RESTful Endpoint(n개)와 GraphQL Endpoint(1개; /graphql)를 구현하세요.

DB는 RDB/NoSQL 어떤 것을 이용해도 됩니다. firebase처럼 serverless DB를 사용하여도 됩니다. 굳이 DB를 사용하지 않는다면 fake용 파일을 만들어 API가 호출되었을 때 의도적으로 외부 I/O를 만드세요.

## Specs

모델은 User(작성자), Post(게시물), Comment(댓글)가 존재합니다. 모든 모델은 기본적으로 CRUD가 가능해야 합니다. 이하의 모델에 따라 임의의 데이터를 미리 DB에 적재하여 사용하세요. 필요한 경우 모델을 수정하거나 추가하세요.

1. Post는 여러 Comment를 가질 수 있습니다. (1:N). ID, 작성자, 제목, 내용, 작성일을 가집니다.
2. Comment는 ID, 작성자, 내용, 작성일을 가집니다.
3. User는 여러 Post를 가질 수 있습니다 (1:N), 여러 Comment를 가질 수 있습니다. (1:N), ID, 이름, 가입일을 가집니다.
4. User는 삭제/업데이트가 불가능 합니다.
5. 특정 User가 작성한 모든 Post를 조회할 수 있어야 합니다.
6. 특정 User가 작성한 모든 Comment를 조회할 수 있어야 합니다.
7. 특정 Post에 달린 Comment를 조회할 수 있어야 하며, 페이지네이션이 가능하여야 합니다.
8. Post와 Comment는 생성할 때, User ID를 받아 작성자를 저장하고 현재 시간을 작성일로 저장합니다.

## Specs 진행 상황

### Model Specs

- [x] Post는 ID, 작성자, 제목, 내용, 작성일을 가집니다.
- [ ] Post는 여러 Comment를 가질 수 있습니다. (1:N).
- [ ] Comment는 ID, 작성자, 내용, 작성일을 가집니다.
- [x] User는 이름, 가입일을 가집니다.
- [x] User는 여러 Post를 가질 수 있습니다. (1:N)
- [ ] User는 여러 Comment를 가질 수 있습니다. (1:N)
- [x] Post는 생성할 때, User ID를 받아 작성자를 저장하고 현재 시간을 작성일로 저장합니다.
- [ ] Comment는 생성할 때, User ID를 받아 작성자를 저장하고 현재 시간을 작성일로 저장합니다.

### API Specs

#### REST

- [x] User CR 가능
- [x] Post CRUD 가능
- [ ] Comment CRUD 가능
- [ ] 특정 User가 작성한 모든 Post를 조회할 수 있어야 합니다.
- [ ] 특정 User가 작성한 모든 Comment를 조회할 수 있어야 합니다.
- [ ] 특정 Post에 달린 Comment를 조회할 수 있어야 하며, 페이지네이션이 가능하여야 합니다.

#### GraphQL API

- [x] User CR 가능
- [ ] Post CRUD 가능
- [ ] Comment CRUD 가능
- [ ] 특정 User가 작성한 모든 Post를 조회할 수 있어야 합니다.
- [ ] 특정 User가 작성한 모든 Comment를 조회할 수 있어야 합니다.
- [ ] 특정 Post에 달린 Comment를 조회할 수 있어야 하며, 페이지네이션이 가능하여야 합니다.

## Prerequisite - 필수 요구 사항

0. Node 버전 확인
   
   개발 환경의 Node 버전은 `v12.16.1` 입니다. 버전 호환을 위해 가급적 실행환경에서 Node 버전을 맞춰주세요.


1. MySQL 5.7 버전 설치 (명령어는 Mac OS 기준)

```bash
brew install mysql@5.7
```

2. MySQL 실행

```bash
brew services start mysql
```

3. `setUpDatabase.sql` SQL 실행

```bash
mysql -u root -p < ./scripts/setUpDatabase.sql
```

## Run - 실행

로컬 환경에서 다음 명령어로 서버를 실행시킬 수 있습니다.

```bash
yarn start
```

로컬 서버 주소: http://localhost:8000

### Swagger

Swagger 를 통해 `curl` 같은 CLI를 이용하지 않고 브라우저에서 간편하게 API를 테스트 해보실 수 있습니다.

Swagger 도큐먼트 주소: http://localhost:8000/v1/docs/

### GraphQL Playground

GraphQL Playground 를 통해 `curl` 같은 CLI를 이용하지 않고 브라우저에서 간편하게 API를 테스트 해보실 수 있습니다.

graphql Playground 주소: http://localhost:8000/graphql/


## Run test - 테스트 실행

```bash
yarn test
```

테스트 커버리지 검사

```bash
yarn test:cov
```
