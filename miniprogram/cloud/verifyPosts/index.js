// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-8gsiazug86a92de4'
})

// 云函数入口函数
exports.main = async (event, context) => {
  let pass = event.pass;
  let notPass = event.notPass;
  if(pass.length != 0) {
    cloud.database().collection('posts').doc(pass).update({
      data: {
        pass: true
      }
    })
  }
  if(notPass.length != 0) {
    cloud.database().collection('posts').doc(notPass).remove();
  }
  return;
}