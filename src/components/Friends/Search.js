import React, { useState, useRef } from 'react';
import './search.css';

const Search = () => {
  const input = useRef('');
  const [foundUser, setFoundUser] = useState(null); // { name, email }

  const handlehover = (e) => {
    let btn = e.target;
    btn.style.filter = 'brightness(80%)';
    btn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
  };

  const handleout = (e) => {
    let btn = e.target;
    btn.style.backgroundColor = 'transparent';
    btn.style.filter = 'brightness(100%)';
  };

  const buttonclicked = () => {
    const dostname = input.current.value.trim();
    if (!dostname) return;
     console.log('name searched',dostname);
    fetch('http://localhost:3001/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ dostname }),
    })
      .then((res) => res.json())
      .then((data) => {
       
        
          console.log('found',data.user)
          setFoundUser({ name: data.user.name, id: data.user._id });
       
      })
      .catch((err) => {
        console.error(err);
        setFoundUser(null);
      });

    input.current.value = '';
  };

  const sendFriendRequest = (id) => {
    fetch('http://localhost:3001/send_request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.msg || 'Friend request sent!');
      })
      .catch((err) => {
        console.error('Request failed:', err);
      });
  };

  return (
    <>
      <div id="search">
        <input type="text" ref={input} placeholder="dost" id="input" />
        <button id="add" onMouseOver={handlehover} onMouseOut={handleout} onClick={buttonclicked}>
          +
        </button>
      </div>
      {foundUser === null && (
  <p style={{ color: '#ccc', padding: '10px' }}>No user found</p>
)}

      {foundUser && (
        <ul id="result-list">
          <li id={foundUser.id}>
            {foundUser.name} 
            <button
              className="add-btn"
              onClick={() => sendFriendRequest(foundUser.id)}
              onMouseOver={handlehover}
              onMouseOut={handleout}
              style={{ marginLeft: '10px' }}
            >
              Add
            </button>
          </li>
        </ul>
      )}
    </>
  );
};

export default Search;
