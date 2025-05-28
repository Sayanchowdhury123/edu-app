const express = require("express")
const Message = require("../models/messages")
const { protect } = require("../middleware/auth")

const router = express.Router()


router.get("/:courseid", protect, async (req,res) => {
    try {
        
        //console.log(req.params.roomid);
        const messages = await Message.find({courseid: req.params.courseid}).populate("sender", "name")
        res.json(messages)
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"failed to fetch message"})
    }
})

module.exports = router;