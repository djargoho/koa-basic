// const Router = require('koa-router');
// const posts = new Router();
// const { list, read, remove, replace, update, write } = require('./posts.ctrl');

// //post 관련 function을 한 곳에서 관리 할 수 있도록 만듬 (이런식으로도 할 수 이똬라는 의미)
// const printInfo = ctx => {
//   ctx.body = {
//     method: ctx.method,
//     path: ctx.path,
//     params: ctx.params,
//   };
// };

// posts.get('/', list);
// posts.get('/:id', read);
// posts.post('/', write);
// posts.delete('/:id', remove);
// posts.put('/:id', replace);
// posts.patch('/:id', update);

// module.exports = posts;

//mongoDB 사용

const Router = require('koa-router');
const posts = new Router();
const {
  list,
  read,
  remove,
  update,
  write,
  checkObjectId,
} = require('./posts.ctrl');

posts.get('/', list);
posts.get('/:id', checkObjectId, read);
posts.post('/', write);
posts.delete('/:id', checkObjectId, remove);
posts.patch('/:id', checkObjectId, update);

module.exports = posts;
