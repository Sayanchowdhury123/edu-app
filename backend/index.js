const app = require("./app");
const connectdb = require("./config/db");
const Course = require("./models/course");

connectdb();

const http = require("http");
const socketIo = require("socket.io");
const Message = require("./models/messages");
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: ["https://edu-app-pied.vercel.app"],
    methods: ["GET","POST","PUT","PATCH","DELETE"],
  },
});

const PORT = process.env.PORT ;
server.listen(PORT, () => {
  console.log(`server running ${PORT}`);
});


io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("join-update", (courseid) => {
    socket.join(courseid);
  });

  socket.on("add-update", ({ adata, courseid }) => {
    socket.to(courseid).emit("got-update", adata);
  });

  socket.on("join-room", (roomid) => {
    socket.join(roomid);
  });

  socket.on("edit", async ({ courseid, textupdated }) => {
    const message = await Message.findById(textupdated._id).populate(
      "sender",
      "name"
    );
    console.log(message);
    io.to(courseid).emit("r-edit", message);
  });

  socket.on("del", ({ messageid, courseid }) => {
    io.to(courseid).emit("r-del", messageid);
  });
  socket.on("send-message", async (data) => {
    const { sender, message, courseid } = data.data;
    const newmessage = new Message({
      sender: sender,
      message: message,
      courseid: courseid,
    });

    await newmessage.save();
    await newmessage.populate("sender", "name role");

    io.to(courseid).emit("receive-message", newmessage);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});
