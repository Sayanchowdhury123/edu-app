const express = require("express")
const router = express.Router()
const {AccessToken} = require("livekit-server-sdk")

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

router.post("/token", async (req,res) => {
     const {identity,roomName} = req.body;

     if(!identity || !roomName){
        return res.status(400).json({message:"identity and roomname are required"})
     }

     try {
        const token = new AccessToken(LIVEKIT_API_KEY,LIVEKIT_API_SECRET,{
            identity,
        })

        token.addGrant({
            room: roomName,
            roomJoin: true,
            canPublish: true,
            canSubscribe: true
        })


        const jwt = token.toJwt();

        res.json({token: jwt})
     } catch (error) {
        console.log(error);
        res.status(500).json({message:"token generation failed"})
     }
})


module.exports = router;