import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import axios from 'axios';
import FormData from 'form-data';

const PORT=5000;

const app = express();

const formdata = new FormData();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

const server = createServer(app);
const io = new Server(server,{origin:["http://localhost:5173"],method:["GET","POST"]});

io.on('connection',(socket)=>{
  console.log("User connected :", socket.id)

  socket.on('user_message',async(msg)=>{
    console.log('Message from user:',msg);

    try{
      formdata.append("question", msg);
      const resp = await axios.post("http://127.0.0.1:8000/ask", formdata, {
        headers: formdata.getHeaders(),
      });
      socket.emit('bot_reply',resp.data.answer);
    }
    catch(err){
      console.error('Error fetching bot reply:',err);
      socket.emit('bot_reply',"Sorry, I am having trouble responding right now.");
    }

  });


  socket.on('disconnect',()=>{
    console.log(`User disconnected: ${socket.id}`);
  });

});

server.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
});