const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const indexRouter = require("./routes/index");

const app = express();
require("dotenv").config(); // .env에 정의된 환경 변수를 process.env 에 로드
app.use(cors()); // cors 사용 규칙

// body-parser 사용 규칙
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", indexRouter);

const mongoURI = process.env.LOCAL_DB_ADDRESS;
mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => console.log("mongoose connected"))
  .catch((e) => console.log("DB connection fail", e));

app.listen(process.env.PORT || 5000, () => {
  console.log("server on");
});
