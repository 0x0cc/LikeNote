// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'scnu-user-8gq0p5390acf2a6c'
})

// 云函数入口函数
exports.main = async (event, context) => {
  var cmt = event.cmt;
  var id = event.id;
  const db = cloud.database();
  const _ = db.command;
  db.collection('posts').doc(id).update({
    data: {
      comment: _.push([cmt])
    }
  }).then(res=>{
    return res;
  })
  .catch(err=> {
    return err;
  })

  return 0;
}