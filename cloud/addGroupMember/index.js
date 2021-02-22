// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _ = cloud.database().command
  let openid = event.openid
  let _groupid = event.groupid
  return cloud.database().collection('group').doc(_groupid).update({
    data: {
      'member': _.push(openid),
    }
  })

}