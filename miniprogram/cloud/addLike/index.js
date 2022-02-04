// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'scnu-user-8gq0p5390acf2a6c'
})

// 云函数入口函数
exports.main = async (event, context) => {
  var openid = event.openid;
  var order = 1;
  var id = event.id;
  const _ = cloud.database().command;
  const db = cloud.database().collection('posts').doc(id);
  db.get().then(res=> {
    var data = res.data.like;
    for(var idx of data) {
      if(openid == idx) {
        order = -1;
        break;
      }
    }
    if(order == 1) {
      // 点赞
      db.update({
        data: {
          like: _.push(openid),
          like_count: _.inc(1)
        }
      })
    }
    else {
      // 取消赞
      db.update({
        data: {
          like: _.pull(openid),
          like_count: _.inc(-1)
        }
      })
    }
  })
  return 0;
}