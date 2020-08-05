const connection = require("../mysql_connection");

//  책 데이터 불러오기
// GET/api/v1/book?offset=0
exports.getBook = async (req, res, next) => {
  let offset = req.query.offset;
  let query = `select * from book limit ${offset},25`;
  console.log(offset);

  try {
    [rows] = await connection.query(query);
    let count = rows.length;
    res.status(200).json({ success: true, book: rows, count: count });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};
