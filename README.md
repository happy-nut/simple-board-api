# Simple board api server

Web Application Server를 구현하세요. nodejs 환경에서 실행되는 게시판 API를 제공하는 서버를 구현합니다.
스펙에 정의되지 않은 부분은 일반적인 웹사이트 게시판의 백앤드를 상상하며 개발하면 됩니다.

프레임워크는 express/koa 등 node 환경에서 동작한다면 어떤 것을 골라도 좋습니다.

작업 중 스펙에 관련된 모호한 부분이 생긴다면 즉시 이야기 해주세요.

같은 데이터 모델에 대해 RESTful과 GraphQL을 **동시**에 사용하여 API 레이어를 구현합니다. RESTful의 규칙을 최대한 지켜주세요. RESTful Endpoint(n개)와 GraphQL Endpoint(1개; /graphql)를 구현하세요.

DB는 RDB/NoSQL 어떤 것을 이용해도 됩니다. firebase처럼 serverless DB를 사용하여도 됩니다. 굳이 DB를 사용하지 않는다면 fake용 파일을 만들어 API가 호출되었을 때 의도적으로 외부 I/O를 만드세요.

## Specs

모델은 User(작성자), Post(게시물), Comment(댓글)가 존재합니다. 모든 모델은 기본적으로 CRUD가 가능해야 합니다.
이하의 모델에 따라 임의의 데이터를 미리 DB에 적재하여 사용하세요. 필요한 경우 모델을 수정하거나 추가하세요.

1. Post는 여러 Comment를 가질 수 있습니다. (1:N). ID, 작성자, 제목, 내용, 작성일을 가집니다.
2. Comment는 ID, 작성자, 내용, 작성일을 가집니다.
3. User는 여러 Post를 가질 수 있습니다 (1:N), 여러 Comment를 가질 수 있습니다. (1:N), ID, 이름, 가입일을 가집니다.
4. User는 삭제/업데이트가 불가능 합니다.
5. 특정 User가 작성한 모든 Post를 조회할 수 있어야 합니다.
6. 특정 User가 작성한 모든 Comment를 조회할 수 있어야 합니다.
7. 특정 Post에 달린 Comment를 조회할 수 있어야 하며, 페이지네이션이 가능하여야 합니다.
8. Post와 Comment는 생성할 때, User ID를 받아 작성자를 저장하고 현재 시간을 작성일로 저장합니다.
