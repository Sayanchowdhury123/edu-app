require("dotenv").config()
const express = require("express");
const cors = require("cors")
const fileupload = require("express-fileupload")
const authroutes = require("./routes/authroutes")
const course = require("./routes/courseroutes")
const uploadroutes = require("./routes/uploadrotes")
const enroll = require("./routes/enrollroutes")
const reviews = require("./routes/reviewroutes")
const profile = require("./routes/userroutes")
const progress = require("./routes/progressroutes")
const cloudinary = require("cloudinary").v2;
const instructorroutes = require("./routes/instructorroutes")
const livekitroute = require("./routes/livekit")
const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded());
app.use(fileupload({useTempFiles: true}))

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


app.use("/api/auth", authroutes);
app.use("/api/course", course);
app.use("/api", uploadroutes)
app.use("/api/enroll", enroll)
app.use("/api/r", reviews)
app.use("/api/users", profile)
app.use("/api/progress", progress)
app.use("/api/instructor", instructorroutes)
app.use("/api/chat", require("./routes/chatroutes"))
app.use("/api/certificate", require("./routes/certificate"))
app.use("/api/lecture", require("./routes/lectureroutes"))
app.use("/api/livekit", livekitroute)


module.exports = app;
