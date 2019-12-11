//dot env를 사용하면 이렇게 환경변수로 빼낼 수가 있다.
require('dotenv').config();
const { PORT: port = 4000, MONGO_URI: mongoURI } = process.env;

//********mongodb section *********
const mongoose = require('mongoose');

//Node의 Promise를 사용하도록 설정
mongoose.Promise = global.Promise;

/*
  mongoose에서 데이터베이스에 요청할 때，
  이를 Promise 기반으로 처리할 수 있다. 
  이때 어떤 형식의 Promise를 사용할지 정해야 한다. 
  (Node v7 이전에는 공식적인 Promise가 없어 bluebird,
     Promise/A+ 등 여러 구현체가 있었습니다. 
     이제는 Node.js 자체에 Promise를 내장하고 있으므로, 
     내장된 Promise를 사용하도록 설정해 주어야 합니다.)

*/
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log('connected to mongoDB'))
  .catch(e => {
    console.error(e);
  });

//********mongodb section end *****
const Koa = require('koa');
const Router = require('koa-router');

//JSON 형식의 데이터를 파싱할 수 있도록 도와주는 라이브러라이자 KOA middleware
// router를 적용하는 코드의 윗부분에서 해야줘야 한다.
const bodyParser = require('koa-bodyparser');

//root router
const api = require('./api');
const posts = require('./api/posts');

const app = new Koa();
const router = new Router();

// middle ware 단위
// app.use(async (ctx, next) => {
//   console.log(ctx.url);
//   console.log(1, 'first');
//   //쿼리로 authorized에 1을 줘야함
//   if (ctx.query.authorized !== '1') {
//     ctx.status = 401; //Unauthorized 허가가 안남
//     return;
//   }

//   //next 함수를 주석 처리하면 다음 middle ware가 실행이 안된다.
//   //함수를 호출하면 Promise를 반환한다. express와 다른 점.
//   //   next().then(() => {
//   //     console.log('END');
//   //   });

//   //await/async도 지원한다.

//   await next();
//   console.log('END');
// });

// app.use((ctx, next) => {
//   console.log(2);
//   next();
// });

// app.use(ctx => {
//   ctx.body = 'hello, Koa world';
// });

//라우터 설정
//바로도 사용가능하나 이런식으로 api directory를 빼서도 사용이 가능하다.
router.use('/api', api.routes());

router.use('/posts', posts.routes());

//라우터 적용 전에 bodyParser를 적용시킨다.
app.use(bodyParser());

//app 인스턴스에 router 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
