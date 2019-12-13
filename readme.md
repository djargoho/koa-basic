![KOA](imgs/koa.jpg)

# KOA 백엔드 프레임워크를 통한 백엔드 개발 with MongoDB :rocket:

Express - 미들웨어, 라우팅, 템플릿 파일 호스팅 등 다양한 기능이 내장. 
KOA - 미들웨어 기능만 갖추고 나머지는 라이브러리를 적용하여 사용. (그때 그때 필요한 기능 붙여서)


&nbsp;

## 파일 크기

Express(무겁다) < KOA(가볍다)

## **특징**

- async/await 문법을 정식으로 지원. (비동기 작업이 편해짐)
- 미들웨어의 배열로 구성되어 있음.

## 참고

Nodejs로 서버를 개발 시, Express or KOA는 개인 취향.  

## Router 

Koa는 따로 Router를 내장하고 있지 않으므로, 추가적으로 라이브러리를 추가해줘야 한다. 

```shell
    yarn add koa-router
```
## Controller 파일 작성

라우트 처리 함수들을 다른 파일로 따로 분리해서 관리할 수 있음.  
이런 라우트 처리 함수만 모아 놓은 파일을 **컨트롤러**라 한다.

> ex) 만들어 놓은 posts 폴더에 있는 post.ctrl.js 가 다음과 같다.


## KOA Bodyparser

API 기능을 본격적으로 구현하기 전에 먼저 koa-bodyparser 미들웨어를 적용해야 함.  
Request Body에 JSON 형식으로 데이터를 넣어주면 이를 파싱하여 서버에서 사용할 수 있게 해줌.

```shell

    yarn add koa-bodyparser

```


## 계획 

Nodejs를 통한 서버 개발을 할 예정. (블로그를 만들기위해 진행할 예정이다.)


## 잡다한 팁들, 실수한 것. 

- Prettier에서 관리하는 코드 스타일을 ESLint에서 관리하지 않도록 eslint-config-prettier을 설치하면 문제가 해결된다. 그리고 설치 후 .eslintrc.json에서 extends에서 배열형태로 이를 추가시켜 준다. 

```json

    {
        "env": {
            "node": true,
            "commonjs": true,
            "es6": true
        },
        "extends": ["eslint:recommended", "prettier"],
        "globals": {
            "Atomics": "readonly",
            "SharedArrayBuffer": "readonly"
        },
        "parserOptions": {
            "ecmaVersion": 2018
        },
        "rules": {
        }
    }
```

- 미들 웨어 함수의 구조 

```javascript

    // ctx(context의 줄임말): 웹 요청, 응답에 관한 정보를 가지고 있음
    // next 처리중인 미들웨어의 다음 미들웨어를 호출하는 함수
    // 사용안하면 그 다음 미들웨어를 처리하지 않는다. 
    test(ctx, next)=> {

    }


```

- nodemon  
nodemon dependency는 코드를 변경할 때마다 서버를 자동으로 재시작해준다.

```bash

    yarn add -D nodemon

```

```json
    // in package.json
    // src directory를 주시하고 있다가 안에 파일이 변화가 일어나면 이를 감지해서 src/index.js 파일을 재시작 함.
    
    "scripts": {
        "start:dev" : "nodemon  watch src/ src/index.js
    }


```

- Rest API 적용 규칙 및 틀 

| 메서드      |      설명      |
| -------- | :----------: |
| `GET`    |    데이터 조회    |
| `POST`   |    데이터 등록    |
| `DELETE` |   데이터 지우기    |
| `PUT`    | 데이터 정보 통째 수정 |
| `PATCH`  |  데이터 일부 수정   |


- Rest API 테스트 
>  
> REST API 테스트 할때는 POSTMAN이나  
> 구글  Extension RestAPI Test Tool을 이용하여 테스트 할 것 

- dotenv dependency

```shell
    yarn add dotenv
```

> 환경변수들을 파일에 넣고 사용할 수 있게하는 개발 도구  
> 민감한 정보를 코드에 직접 작성하지 않고, 환경변수로 설정하는 것이 좋다.  

- mongoose dependency

```shell
    yarn add mongoose
```

> Node.js 환경에서 사용하는 MongoDB 기반 ODM(Object Data Modeling) 라이브러리.  
> 데이터 문서들을 자바스크립트 객체처럼 사용할 수 있게 해준다.

-mongoose Schema에서 지원해주는 데이터 형식들 

 | 타입                               | 설명                         |
 | -------------------------------- | -------------------------- |
 | String                           | 문자열                        |
 | Number                           | 숫자                         |
 | Date                             | 날짜                         |
 | Buffer                           | 파일을 담을 수 있는 버퍼             |
 | Boolean                          | true 또는 false값             |
 | Mixed(Schema.Types.Mixed)        | 어떤 데이터도 넣을 수 있는 형식         |
 | Obj ectld(Schema.Types.Objectld) | 객체 아이디, 주로 다른 객체를 참조할 때 넣음 |
 | Array                            | 배열 형태의 값으로 [ I로 감싸서 사용     |
