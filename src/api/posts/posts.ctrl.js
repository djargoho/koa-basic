// let postId = 1; //id 초기값

// //posts 배열 초기 데이터 (우선 db가 없으니까..)
// const posts = [
//   {
//     id: 1,
//     title: '제목',
//     body: '내용',
//   },
// ];

// /*
//     포스트 작성
//     POST /posts
// */

// const write = ctx => {
//   //Rest API의 Request Body는 ctx.request.body에서 조회할 수 있습니다.
//   const { title, body } = ctx.request.body;

//   postId += 1;

//   const post = { id: postId, title, body };
//   posts.push(post);
//   ctx.body = post;
// };

// /*
//     포스트 목록 조회
//     GET /posts

// */
// const list = ctx => {
//   ctx.body = posts;
// };

// /*
//     특정 포스트 조회
//     GET /posts/:id

// */

// const read = ctx => {
//   const { id } = ctx.params;

//   //주어진 id 값으로 포스트를 찾는다.
//   //파라미터로 받아온 값은 문자열이므로 파라미터를 숫자로 변환하거나 비교할 p.id 값을 문자열로 바꿔야함.
//   const post = posts.find(p => p.id.toString() === id);

//   if (!post) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '포스트가 존재하지 않습니다.',
//     };
//     return;
//   }

//   ctx.body = post;
// };

// /*
//     특정 포스터 제거
//     DELETE posts/:id
// */

// const remove = ctx => {
//   const { id } = ctx.params;

//   const index = posts.findIndex(p => p.id.toString() === id);

//   if (index === -1) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '포스트가 존재하지 않습니다. ',
//     };

//     return;
//   }

//   posts.splice(index, 1);
//   ctx.status = 204; //No Content를 의미함
// };

// /*  포스트 수정(통째로 교체)
//     PUT /posts/:id

//     {title, body}
// */
// const replace = ctx => {
//   const { id } = ctx.params;

//   const index = posts.findIndex(p => p.id.toString() === id);

//   if (index === -1) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '해당 포스트가 존재하지 않습니다.',
//     };

//     return;
//   }

//   posts[index] = {
//     id,
//     ...ctx.request.body,
//   };

//   ctx.body = posts[index];
// };

// /* 포스트 일부 수정(일부분만 교체)
//     PATCH /posts/:id

//     {title, body}

// */
// const update = ctx => {
//   //PATCH 메서드는 주어진 필드만 교체한다.
//   const { id } = ctx.params;

//   const index = posts.findIndex(p => p.id.toString() === id);

//   if (index === -1) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '해당 포스트가 존재하지 않습니다.',
//     };

//     return;
//   }

//   posts[index] = {
//     ...posts[index],
//     ...ctx.request.body,
//   };

//   ctx.body = posts[index];
// };

// module.exports = {
//   write,
//   list,
//   read,
//   remove,
//   replace,
//   update,
// };

//위의 내용을 mongodb와 연결해서 해보자
const Post = require('models/post');
//put은 구현 안함

//joi 검증을 수월하게 해주는 라이브러리
const Joi = require('joi');

/*
코드를 중복시키지 않고 검증하는 방법은 바로 미들웨어를 만드는 것입니다.
 컨트롤러 코드 위쪽 에 Objectld를 불러온 후 checkObjectld 함수를 만들어 내보내세요.
*/
const { ObjectId } = require('mongoose').Types;

const checkObjectId = (ctx, next) => {
  const { id } = ctx.params;

  //검증 실패시

  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return null;
  }

  return next();
};

/*
    write 함수 
    POST
*/
const write = async ctx => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array()
      .items(Joi.string())
      .required(),
  });

  //첫번째 파라미터는 검증할 객체, 두번째는 스키마.
  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;

  //새 POST 인스턴스를 만든다.
  const post = new Post({
    title,
    body,
    tags,
  });

  try {
    await post.save(); //데이터 베이스에 등록한다. //저장된 결과를 반환

    // eslint-disable-next-line require-atomic-updates
    ctx.body = post;
  } catch (error) {
    ctx.throw(error, 500);
  }
};

/*
     
    GET
*/
// 이제 API를 사용하여 데이터들을 조회할 수 있다.. 데이터를 조회할 때는 .find()를 사용한다.
// find() 함수를 호출한 후에는 exec()를 붙여 주어야 서버에 쿼리를 요청합니다.
// 데이터를 조회할 때 특정 조건을 설정할 수 있으며，불러오는 제한도 설정할 수 있다.

//내용을 전부다 보여줄 필요 없으니 페이지 네이션 적용 ㄱ!
// 페이지 기능은 mongoose-pagination (https://www.npmjs.com/package/mongoose-pagination)
// 라이브러리를 사용하면 매우 간편하게 구현할 수 있습니다.
// 하지만 직접 구현도 가능
const list = async ctx => {
  try {
    //page query가 주어지지 않으면 1로 간주
    //query는 문자열 형태로 받아오므로 숫자로 변환
    const page = parseInt(ctx.query.page || 1, 10);

    //잘못된 페이지면 오류 발생
    if (page < 1) {
      ctx.status = 400;
      return;
    }

    //sort => key 기준  1 오름차 순 , -1 내림차 순
    //limit 갯수 제한
    //skip 앞에 몇개의 인자들을 그냥 넘길 것인지 정한다.
    //앞에 20을 넣으면 첫 20개를 제외하고 데이터 10개를 불러온다
    const posts = await Post.find()
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean()  //데이터를 조회할 때 .exec() 전 부분에 .lean()을 삽입하 면 반환 형식이 JSON 형태가 됩니다.
      .exec();

    //내용길이 제한하기
    /*
      이제 body 길이가 200자 이상이면 뒤에 ...을
      붙이고 문자열을 자르는 기능을 구현해 보겠습니다. 
      배열의 map 함수를 사용하여 배열 원소를 전체적으로 바꾸면 됩니다. 
      하지만 mongoose 조회 결과로 반환된 배열을 다음과 같이 처리한다면
      원치 않는 데이터들도 함께 들어갑니다.
    */
    const limitBodyLength = post => ({
      ...post, //(이렇게 하면 그냥 mongoose로 조회한 데이터들은 mongoose의 문서 인스턴스로
      // Getter,Setter 등 내장 함수들을 지니고 있기 때문에 다른 변수들도 따라온다.
      // 이를 막기 위해 조회한 데이터 객체를 toJSON 함수를 이용하여 처음부터 JSON 형태로 조회하는 방법이 있다. )
      //다른 하나는 쿼리를 할 때 lean 함수를 사용하여 처음부터 JSON 형태로 조회하는 방법이 있다.
      // ...post.toJSON(),
      body:
        post.body.length < 100 ? post.body : `${post.body.slice(0, 200)}...`,
    });

    //마지막 페이지를 알수 있는 방법
    //1) 새로운 필드를 설정하는 방법
    //2) Response 헤더 중 Link를 설정하는 방법
    //3) 커스텀 헤더를 설정하는 방법
    //할 것은 커스텀 헤더 설정 방법으로
    const postCount = await Post.countDocuments().exec();
    //마지막 페이지 알려주기
    //ctx.set은 response header를 설정
    ctx.set('Last-Page', Math.ceil(postCount / 10));
    ctx.body = posts.map(limitBodyLength);
  } catch (error) {
    ctx.throw(error, 500);
  }
};

/*
  특정 포스트 조회 

*/
const read = async ctx => {
  const { id } = ctx.params;

  try {
    const post = await Post.findById(id).exec();

    if (!post) {
      ctx.status = 404;
      return;
    } else {
      ctx.body = post;
    }
  } catch (error) {
    ctx.throw(error, 500);
  }
};

/*

  • remove： 특정 조건을 만족하는 데이터들을 모두 지읍니다.
  • findByldAndRemove: id를 찾아서 지읍니다.
  • findOneAndRemove： 특정 조건을 만족하는 데이터 하나를 찾아서 제거합니다.




*/
const remove = async ctx => {
  const { id } = ctx.params;

  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (error) {
    ctx.throw(error, 500);
  }
};

/*
  데이터 수정 (일부수정)
*/
const update = async ctx => {
  const { id } = ctx.params;

  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true, //이 값을 설정해야 업데이트 된 객체를 반환 설정하지 않으면 업데이트 되기 전 객체 반환
    }).exec();

    if (!post) {
      ctx.status = 404;
      return;
    } else {
      ctx.body = post;
    }
  } catch (error) {
    ctx.throw(error, 500);
  }
};

module.exports = { write, list, read, remove, update, checkObjectId };
