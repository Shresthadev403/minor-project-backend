const express = require("express");
const morgan = require("morgan");
const dotEnv = require("dotenv");
const cors=require('cors');
// getting enviroment variables
dotEnv.config({ path: "./config/.env" });
// import db
const sequelize=require('./config/database');

// get routes
const courseRoutes = require("./routes/courseRoutes");
const modelSchemaRoutes = require("./routes/modelSchemaRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const noteRoutes = require("./routes/noteRoutes");
const courseSyllabusRoutes = require("./routes/courseSyllabusRoutes");
const jointRoutes = require("./routes/jointRoutes");
const errorMiddleware = require("./middlewares/error");
const cookieParser = require("cookie-parser");

const app = express();



const port = process.env.PORT;

// middlewares
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/", courseRoutes);
app.use("/", modelSchemaRoutes);
app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", subjectRoutes);
app.use("/", deviceRoutes);
app.use("/", noteRoutes);
app.use("/", courseSyllabusRoutes);
app.use("/", jointRoutes);

// custom middleware
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
