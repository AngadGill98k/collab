import './App.css';
import Friends from './components/Friends/Friends.js';
import Chat from './components/Chat/Chat.js';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

function App() {
  const socket = useRef();
  const userid=useRef()
  const username=useRef()
  const url = 'http://localhost:3001';
  const selectedDost = useSelector((state) => state.dostname);
  console.log("teha ctive is",selectedDost.name, selectedDost.id);
 const isActive = selectedDost?.id && selectedDost?.name

useEffect(() => {
  fetch("http://localhost:3001/user", {
    method: "GET",
    credentials: "include" // 👈 IMPORTANT: Send cookies!
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("User:", data.user); // ✅ Now you can use user ID to join a room
      userid.current=data.user
      username.current=data.name
    });
  socket.current = io("http://localhost:3001", {
      withCredentials: true
    });

  socket.current.on('connect', () => {
      console.log('Connected:', socket.current.id);
    });
     return () => {
    socket.current.disconnect();
    console.log('Socket disconnected');
  };
}, [])


 

  return (
    <div className='chats'>
      <Friends socket={socket.current}/>
      {isActive && <Chat user_name={username.current} projectname={selectedDost.name} projectid={selectedDost.id} socket={socket.current} />}  
     
    </div>
  ); 
}

export default App;
