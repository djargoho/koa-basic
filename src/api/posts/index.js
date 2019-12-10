const Router = require('koa-router');
const posts = new Router();

//post 관련 function을 한 곳에서 관리 할 수 있도록 만듬
const printInfo = ctx => {
  ctx.body = {
    method: ctx.method,
    path: ctx.path,
    params: ctx.params,
  };
};

posts.get('/', printInfo);
posts.post('/:id', printInfo);
posts.get('/:id', printInfo);
posts.delete('/:id', printInfo);
posts.put('/:id', printInfo);
posts.patch('/:id', printInfo);

module.exports = posts;
