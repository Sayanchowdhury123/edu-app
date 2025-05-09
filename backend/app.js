const express = require("express");
const cors = require("cors")
const authroutes = require("./routes/authroutes")
const course = require("./routes/courseroutes")
const uploadroutes = require("./routes/uploadrotes")

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded());

app.use("/api/auth", authroutes);
app.use("/api/course", course);
app.use("/api", uploadroutes)



module.exports = app;
