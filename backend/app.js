const express = require("express");
const cors = require("cors")
const authroutes = require("./routes/authroutes")

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded());

app.use("/api/auth", authroutes);

app.get("/", (req,res) => {
    res.send("udemy clone")
})

module.exports = app;
