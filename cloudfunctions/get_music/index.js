const cloud = require('wx-server-sdk')
cloud.init();
const db = cloud.database()

exports.main = async (event) => {
  let _name = event.type;
  if(_name === 'detail') {
    try {
      return await db.collection(_name).where({
        i_id: event.id
      }).get()
    } catch (e) {
      console.error(e)
    }
  }else {
    try {
      return await db.collection(_name).get()
    } catch (e) {
      console.error(e)
    }
  }
}