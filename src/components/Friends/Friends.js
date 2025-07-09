import React, { useRef, useState } from 'react';
import List from './List.js';
import Search from './Search.js';
import Request from './Request.js';
import './friend.css'

const Friends = ({socket}) => {

  let input = useRef(null);

  let [istrue, settrue] = useState(true);
  let [istrue2, settrue2] = useState(false);
  let [istrue3, settrue3] = useState(false);

  function project_list() {
    settrue(true);
    settrue2(false);
    settrue3(false);
  }
 const search = () => {
    
    
    settrue(false);
    settrue2(true);
    settrue3(false);
  };

  const request = () => {
    
    settrue(false);
    settrue2(false);
    settrue3(true);
  };
  let handlehover=(e)=>{
    let btn=e.target
     btn.style.filter = "brightness(80%)"
     btn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    console.log('hover ')
  }
  let handleout=(e)=>{
   let btn=e.target
   btn.style.backgroundColor = "transparent";
     btn.style.filter = "brightness(100%)"
  }
  return (
    <div id='friend'>
      <div id='listhead'>
      <div id='option'>
        <button className='btn' onMouseOver={handlehover} onMouseOut={handleout} onClick={project_list}>list</button>
          <button className='btn' onMouseOver={handlehover} onMouseOut={handleout} onClick={search}>search</button>
          <button className='btn' onMouseOver={handlehover} onMouseOut={handleout} onClick={request}>req</button>
       </div>
      
      </div>
      {istrue && <List socket={socket}/>}
      {istrue2 &&<Search />}
      {istrue3 && < Request/>}
    </div> 
  );
};

export default Friends;
