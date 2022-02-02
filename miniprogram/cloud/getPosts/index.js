// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-8gsiazug86a92de4'
})

// 云函数入口函数
exports.main = async (event, context) => {
  var acquire = event.acquire;
  if(acquire.length == 0) {
    return cloud.database().collection('posts').get();
  }
  else if(acquire == 'pass') {
    return cloud.database().collection('posts').where({
      pass: true
  }).get();
  }
  else if(acquire == 'verify') {
    return cloud.database().collection('posts').where({
      pass: false
  }).get();
  }
}