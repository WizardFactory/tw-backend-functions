## Setup

```
npm install -g serverless
npm install -a awscli
```
add credential to ~/.aws/credentials
```
npm install
serverless dynamodb install
serverless offline start
serverless dynamodb migrate (this imports schema)
```

## Run service offline
```
npm run offline
```

## Remove
```
sls remove
sls remove -s production
```
## 주의
rest api 구조가 변경되면 삭제하고 다시 배포해야 한다.
serverless offline start가 비정상 종료되면, port를 변경해야 할 수도 있다.
production 배포시에 cloudfront로 연결하기 위해서, endpoint type은 regional로 해주어야 한다.

