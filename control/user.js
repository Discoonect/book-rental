const connection = require("../mysql_connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// @desc  회원가입
// @route POST/api/v1/bookuser/
// @parameters   email, password, age
exports.createUser = async (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  let age = req.body.age;

  const hashedPassword = await bcrypt.hash(password, 8);

  let query = `insert into book_user(user_email,user_password,user_age) values (?,?,?)`;
  let data = [email, hashedPassword, age];

  try {
    [rows] = await connection.query(query, data);
    res.status(200).json({ success: true, message: "성공" });
  } catch (e) {
    if (e.errno == 1062) {
      res
        .status(400)
        .json({ success: false, errno: e.errno, message: e.message });
      return;
    } else {
      res.status(500).json({ success: false, error: e });
      return;
    }
  }
};

// 로그인
// POST/api/v1/bookuser/login
// email, password
exports.loginUser = async (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;

  let query = `select * from book_user where user_email = ?`;
  let data = [email];

  try {
    [rows] = await connection.query(query, data);
    let storedPassword = rows[0].user_password;

    let match = await bcrypt.compare(password, storedPassword);

    if (!match) {
      res
        .status(400)
        .json({ success: false, result: match, message: "비밀번호 틀림" });
      return;
    }

    let token = jwt.sign({ id: rows[0].id }, process.env.ACCESS_TOKEN_SECRET);
    query = `insert into book_user_token(user_id,token) values(?,?)`;
    data = [rows[0].id, token];

    try {
      [result] = await connection.query(query, data);
      res.status(200).json({ success: true, result: match, token: token });
    } catch (e) {
      res
        .status(502)
        .json({ success: false, error: e, message: "토큰저장실패" });
      return;
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

// @desc     로그아웃   api : db에서 해당유저의 현재 토큰값을 삭제
// @url      POST /api/v1/user/allLogout
// @request
// @response
exports.logout = async (req, res, next) => {
  let user_id = req.user.id;
  let query = `delete from book_user_token where user_id = ${user_id}`;

  console.log(user_id);
  try {
    [result] = await connection.query(query);
    console.log(result);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};
