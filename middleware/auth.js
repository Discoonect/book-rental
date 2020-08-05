const jwt = require("jsonwebtoken");
const connection = require("../mysql_connection");

const auth = async (req, res, next) => {
  let token;

  try {
    token = req.header("Authorization").replace("Bearer ", "");
  } catch (e) {
    res.status(401).json({ error: e, message: "Please authenticate!" });
    return;
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  let user_id = decoded.id;

  let query =
    "select bu.id, bu.user_email,bu.user_age,bt.token \
      from book_user_token as bt \
      join book_user as bu \
      on bt.user_id = bu.id \
      where bt.user_id = ? and bt.token = ? ";
  let data = [user_id, token];

  try {
    [rows] = await connection.query(query, data);
    if (rows.length == 0) {
      res.status(401).json({ error: "Please authenticate!" });
    } else {
      req.user = rows[0];
      console.log(req.user);
      next();
    }
  } catch (e) {
    console.log(e);
    res.status(401).json({ error: "Please authenticate!", error: e });
  }
};

module.exports = auth;
