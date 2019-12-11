const mongoose = require('mongooses');

const { Schema } = mongoose;

const Post = new Schema({
  title: String,
  body: String,
  tags: [String],
  publishDate: {
    type: Date,
    default: new Date(),
  },
});

//이렇게 다른 스키마 내부에 스키마를 내장시킬 수도 있다.
// const Author = new Schema({ name: String, email: String });

// const Book = new Schema({
//   title: String,
//   description: String,
//   authors: [Author],
//   meta: {
//     likes: Number,
//   },
//   extra: Schema.Types.Mixed,
// });

//모델을 만들 때는 mongoose.model 함수를 시용합니다.
//기본적으로 model() 함수에는 두개의 파라미터가 필요. 
//첫 번쨰 파라미터는 스키마 이름 , 다른 스키마에서 현재 스키마를 참조하는 상황에도 쓰임
//두 번째 파라미터는 스키마 객체
//데이터 베이스는 스키마 이름을 정해주면 이름의 복수 형태로 데이터베이스 컬렉션 이름을 만듬.
// ex) Post => posts
// 이 컬렉션에 따르기 싫으면 세번쨰 파라미터에 커스텀 이름을 지어주면 됌
module.exports = mongoose.model('Post', Post);
