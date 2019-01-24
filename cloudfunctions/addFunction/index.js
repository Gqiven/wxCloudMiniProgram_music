const cloud = require('wx-server-sdk')
cloud.init();

const db = cloud.database()
exports.main = async (event, context) => {
  let _db_name = event.db_name;
  let _data = event.info;
  _data.time = new Date();
  try {
    return await db.collection(_db_name).add({
      // data 字段表示需新增的 JSON 数据
      data: _data
    })
  } catch (e) {
    console.error(e)
  }
}