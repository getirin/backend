/**
 * Given a database insert result, for mongo, converts it to response object.
 * @param insertResult
 */
module.exports = function({ _id, createdAt }){
  return { success: true, id: _id.toString(), createdAt };
};
