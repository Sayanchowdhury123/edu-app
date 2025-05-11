const express = require("express");
const cors = require("cors")
const authroutes = require("./routes/authroutes")
const course = require("./routes/courseroutes")
const uploadroutes = require("./routes/uploadrotes")
const enroll = require("./routes/enrollroutes")
const reviews = require("./routes/reviewroutes")
const profile = require("./routes/userroutes")
const progress = require("./routes/progressroutes")
const instructorroutes = require("./routes/instructorroutes")

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded());

app.use("/api/auth", authroutes);
app.use("/api/course", course);
app.use("/api", uploadroutes)
app.use("/api/enroll", enroll)
app.use("/api/r", reviews)
app.use("/api/users", profile)
app.use("/api/progress", progress)
app.use("/api/instructor", instructorroutes)



module.exports = app;
