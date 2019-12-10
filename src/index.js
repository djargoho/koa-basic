const Koa = require('koa');
const Router = require('koa-router');

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

//app 인스턴스에 router 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
  console.log('Listening to port 4000');
});
