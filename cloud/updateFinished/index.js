// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let str = "finished." + event.openid
  return cloud.database().collection('data').doc(event.id).update({
    data: {
      [str]: event.value
    }
  })
}