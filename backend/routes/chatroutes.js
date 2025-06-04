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


router.put("/:messageid", protect, async (req,res) => {
    const {newmessage} = req.body;
    try {
        const message = await Message.findById(req.params.messageid)
        message.message = newmessage;
        await message.save()
         res.status(200).json(message)
    } catch (error) {
          console.log(error);
        res.status(500).json({msg:"failed to edit message"})
    }
})


router.delete("/:messageid", protect, async (req,res) => {
    try {
      const messagedel = await Message.findByIdAndDelete(req.params.messageid)
      res.status(200).json({msg:"message deleted"})
         
    } catch (error) {
        console.log(error);
          res.status(500).json({msg:"failed to delete message"})
    }
})

module.exports = router;