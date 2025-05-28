const mongoose = require("mongoose")

const newmessageschema = new mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId,ref:"User"},
 courseid: {type: mongoose.Schema.Types.ObjectId, ref:"Course"},
    message: {type: String, required: true},
    timestamp: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Message",newmessageschema)