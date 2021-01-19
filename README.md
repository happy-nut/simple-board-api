# Simple board api server(RESTful, GraphQL)

Typescript + Nest.js + RESTful + GraphQL

## Prerequisite

1. Check your Node version `>= v12.16.1`.

2. Install MySQL 5.7.

```bash
brew install mysql@5.7
```

3. Run MySQL and setup database.

```bash
brew services start mysql
mysql -u root -p < ./scripts/setUpDatabase.sql
```

## Run

```bash
yarn start
```

Local server URL: http://localhost:8000

### Swagger

Swagger Doc URL: http://localhost:8000/v1/docs/

### GraphQL Playground

graphql Playground URL: http://localhost:8000/graphql/


## Run test

```bash
yarn test
```

For test coverage:

```bash
yarn test:cov
```
