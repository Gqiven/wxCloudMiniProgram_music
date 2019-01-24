const cloud = require('wx-server-sdk')
cloud.init();
// exports.main = async (event, context) => new Promise((resolve, reject) => {
//   const db = cloud.database();
//   let data = {
//     status: null,
//     msg: null
//   }
//   db.collection('userInfo').add({
//     // data 字段表示需新增的 JSON 数据
//     data: event,
//     success: res => {
//       resolve(res)
//     },
//     fail: error => {
//       resolve(error)
//     }
//   })
// })

const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('userInfo').where({
      nickName: event.nickName
    })
      .update({
        data: {
          count: _.inc(1),
          time: new Date()
        },
      })
  } catch (e) {
    console.error(e)
  }
}