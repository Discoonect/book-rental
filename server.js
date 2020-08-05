const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: `./config/config.env` });

const morgan = require("morgan");

const user = require("./route/user");
const book = require("./route/book");
const rental = require("./route/rental");

const app = express();
app.use(express.json());

app.use(morgan("dev"));

app.use("/api/v1/bookuser", user);
app.use("/api/v1/book", book);
app.use("/api/v1/rental", rental);

const PORT = process.env.PORT;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} node on part ${PORT}`)
);
