// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'scnu-user-8gq0p5390acf2a6c'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let openid = wxContext.OPENID;
  return {
    openid
  }
}