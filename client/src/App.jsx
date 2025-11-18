import { useState,useEffect, use } from "react"
import {io} from "socket.io-client"
import clip from './assets/clip.png'
import sendbutton from './assets/send_button.svg'

const socket=io("http://localhost:5000",{
  transports: ["websocket"], // ✅ force WebSocket mode
  withCredentials: true,
});


const App = () => {

const [messages, setMessages]=useState([{sender:"bot",text:"Hello! How can I assist you today?"}]);

const [input, setInput] = useState("");
const [file, setFile]=useState(null);
const [loading, setLoading]=useState(false);

useEffect(()=>{
  socket.on("connect", () => {
    console.log("✅ Connected to backend:", socket.id);
  });

  socket.on("bot_reply",(msg)=>{
    setMessages((prev)=>[...prev,{sender:"bot",text:msg}]);
  })

  return () => {
    socket.off("connect");
    socket.off("bot_reply");
  };

},[]);

const uploadPdf = async(selectedFile)=>{
    const formdata = new FormData();
    formdata.append("file", selectedFile);
    setLoading(true);

    try{
      const res = await fetch("http://127.0.0.1:8000/upload_pdf",{
        method:"POST",
        body: formdata,
      });

      const data = await res.json();
      setMessages((prev)=>[...prev,{sender:"bot",text:data.message||"File uploaded successfully."},]);
    }
    catch(err){
      console.error(err);
      setMessages((prev)=>[...prev,{sender:"bot",text:"Error uploading file."},]);
    }
    setLoading(false);
}

const askPDF = async(query)=>{
  const formdata = new FormData();
  formdata.append("question", query);
  setLoading(true);

  try{
    const res=await fetch("http://127.0.0.1:8000/ask",{
      method:"POST",
      body: formdata,
    });
    const data = await res.json();
    setMessages((prev)=>[...prev,{sender:"bot",text:data.answer||"No answer found."},]);
  }
  catch(err){
    console.error(err);
    setMessages((prev)=>[...prev,{sender:"bot",text:"Error getting answer from PDF."},]);
  }
  setLoading(false);
}

const sendMessage = ()=>{
  if(input.trim() === "")
    return;

  setMessages((prev)=>[...prev,{sender:"user",text:input}]);

  if(file){
    askPDF(input)
  }else{
    socket.emit("user_message",input);
  }
  setInput("");
};

const handleFileChange=(e)=>{
  const selected = e.target.files[0];
  if(!selected)
    return 

  setFile(selected);
  uploadPdf(selected);
}

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <h1 className='text-2xl font-bold mb-4 text-center'>Doc-Bot</h1>

      <div className="flex-1 overflow-y-auto border rounded-lg bg-white p-4 shadow-md">
        {messages.map((msg, ind) => (
          <div
            key={ind}
            className={`flex mb-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"} `}
          >
            <div
              className={`max-w-xs p-3 rounded-2xl ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div> 


      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={
            file
              ? "Ask something about your uploaded PDF..."
              : "Type a general question..."
          }
          className="flex-1 border rounded-lg p-2 outline-none"
        />
        <input type="file" id="document" hidden accept="application/pdf" onChange={handleFileChange}></input>
        <label htmlFor="document">
          <img src={clip} className={`w-10 cursor-pointer mt-2 ${ loading ? "opacity-50" : ""}`} title="Upload PDF" />
        </label>
        <button
          onClick={sendMessage} disabled={loading}>
          <img src={sendbutton} className={`w-10 cursor-pointer mt-2 ${ loading ? "opacity-50" : "" }`} title="Send Message" />
        </button>
      </div>
    </div>
  )
}

export default App