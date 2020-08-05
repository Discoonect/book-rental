const connection = require("../mysql_connection");

// 대여하기
// POST/api/v1/rental
// book_id
exports.bookRental = async (req, res, next) => {
  let user_id = req.user.id;
  let user_age = req.user.user_age;
  let book_id = req.body.book_id;

  let query = `select * from book where id = ${book_id}`;

  try {
    [rows] = await connection.query(query);
    let limit_age = rows[0].limit_age;
    if (user_age < limit_age) {
      res.status(502).json({ message: "대여를 할 수 없는 책입니다." });
      return;
    }
  } catch (e) {
    res.status(501).json({ error: e });
  }

  let date = new Date();
  date.setDate(date.getDate() + 7);

  let limit_time = date.toLocaleDateString();

  query = `insert into book_rental(user_id,book_id,limit_date) values(?,?,?)`;
  data = [user_id, book_id, limit_time];

  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true, message: "대여에 성공했습니다." });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

// 대여목록
// GET/api/v1/rental?offset=0
// offset
exports.indexRental = async (req, res, next) => {
  let user_id = req.user.id;
  let offset = req.query.offset;

  let query = `select * from book_rental where user_id = ${user_id} limit ${offset},25`;

  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, rows: rows });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

// 반납하기
// POST/api/v1/rental/return
// book_id
exports.returnRental = async (req, res, next) => {
  let user_id = req.user.id;
  let book_id = req.body.book_id;

  let query = `delete from book_rental where book_id = ${book_id} and user_id = ${user_id}`;

  try {
    [result] = await connection.query(query);
    if (result.affectedRows == 0) {
      res.status(500).json({
        success: false,
        message: "대여 목록에 해당 책이 없습니다.",
      });
    } else {
      res.status(200).json({ success: true, result: result });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};
