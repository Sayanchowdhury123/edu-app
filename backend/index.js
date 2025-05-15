const app = require("./app");
const connectdb = require("./config/db");



connectdb();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server running ${PORT}`)
})