// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'scnu-user-8gq0p5390acf2a6c'
})

// 云函数入口函数
exports.main = async (event, context) => {
  var acquire = event.acquire;
  if(acquire.length == 0) {
    return cloud.database().collection('posts').get();
  }
  else if(acquire == true || acquire == false) {
    return cloud.database().collection('posts').where({
      pass: acquire
  }).get();
  }
  else if(acquire == 'hottest') {
    return cloud.database().collection('posts')
    .orderBy('like_count','asc')
    .orderBy('cmt_count','asc')
    .where({
      pass: true
    }).get();
  }
}