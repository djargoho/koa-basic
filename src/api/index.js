const Router = require('koa-router');
const api = new Router();

//바로도 사용가능하나 이런식으로 api directory를 빼서도 사용이 가능하다.

api.get('/test', ctx => {
  ctx.body = 'TEST 성공';
});

api.get('/', ctx => {
  ctx.body = '안뇽하세요';
});

//param 을 받기 위한 것
api.get('/about/:name?', ctx => {
  const { name } = ctx.params;

  ctx.body = name ? name : 'name이 없어요';
});

//query를 위한 것
api.get('/posts', ctx => {
  const { id = 'post ID가 없어요' } = ctx.query;

  ctx.body = id;
});

module.exports = api;
