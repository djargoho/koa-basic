let postId = 1; //id 초기값

//posts 배열 초기 데이터 (우선 db가 없으니까..)
const posts = [
  {
    id: 1,
    title: '제목',
    body: '내용',
  },
];

/*
    포스트 작성 
    POST /posts
*/

const write = ctx => {
  //Rest API의 Request Body는 ctx.request.body에서 조회할 수 있습니다.
  const { title, body } = ctx.request.body;

  postId += 1;

  const post = { id: postId, title, body };
  posts.push(post);
  ctx.body = post;
};

/*
    포스트 목록 조회 
    GET /posts

*/
const list = ctx => {
  ctx.body = posts;
};

/*
    특정 포스트 조회 
    GET /posts/:id

*/

const read = ctx => {
  const { id } = ctx.params;

  //주어진 id 값으로 포스트를 찾는다.
  //파라미터로 받아온 값은 문자열이므로 파라미터를 숫자로 변환하거나 비교할 p.id 값을 문자열로 바꿔야함.
  const post = posts.find(p => p.id.toString() === id);

  if (!post) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.',
    };
    return;
  }

  ctx.body = post;
};

/*
    특정 포스터 제거 
    DELETE posts/:id
*/

const remove = ctx => {
  const { id } = ctx.params;

  const index = posts.findIndex(p => p.id.toString() === id);

  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다. ',
    };

    return;
  }

  posts.splice(index, 1);
  ctx.status = 204; //No Content를 의미함
};

/*  포스트 수정(통째로 교체) 
    PUT /posts/:id

    {title, body}
*/
const replace = ctx => {
  const { id } = ctx.params;

  const index = posts.findIndex(p => p.id.toString() === id);

  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '해당 포스트가 존재하지 않습니다.',
    };

    return;
  }

  posts[index] = {
    id,
    ...ctx.request.body,
  };

  ctx.body = posts[index];
};

/* 포스트 일부 수정(일부분만 교체) 
    PATCH /posts/:id

    {title, body}

*/
const update = ctx => {
  //PATCH 메서드는 주어진 필드만 교체한다.
  const { id } = ctx.params;

  const index = posts.findIndex(p => p.id.toString() === id);

  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '해당 포스트가 존재하지 않습니다.',
    };

    return;
  }

  posts[index] = {
    ...posts[index],
    ...ctx.request.body,
  };

  ctx.body = posts[index];
};

module.exports = {
  write,
  list,
  read,
  remove,
  replace,
  update,
};
