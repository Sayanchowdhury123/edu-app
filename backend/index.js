const app = require("./app");
const connectdb = require("./config/db");




connectdb();


const http = require("http")
const socketIo = require("socket.io")
const Message = require("./models/messages");
const server = http.createServer(app)

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET","POST"]
    }
})

io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    socket.on("join-room", (roomid) => {
        socket.join(roomid)

    })

    socket.on("send-message", async (data) => {
       
        const {sender,message,courseid} = data.data;
        //console.log(sender,instructorid,roomid,message);
         
         const newmessage = new Message({
            sender: sender,
             message: message,
             courseid: courseid
           
         })

      

         await newmessage.save();
          await newmessage.populate("sender","name")

         io.to(courseid).emit("receive-message", {
            sender: newmessage.sender,
            message: newmessage.message,
            timestamp: newmessage.timestamp
         })
    })


    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
    })
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`server running ${PORT}`)
})


