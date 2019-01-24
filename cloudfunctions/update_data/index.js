const cloud = require('wx-server-sdk')
cloud.init();

const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  let db_name = event.db_name;
  let filter_obj = event.filters;
  let update_data = event.new_data;
  try {
    return await db.collection(db_name).where(filter_obj)
      .update({
        data: update_data,
      })
  } catch (e) {
    console.error(e)
  }
}