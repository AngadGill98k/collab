import React, { useEffect, useRef, useState } from 'react';

const Request = () => {
  const [requests, setRequests] = useState([]); // array of user objects (name + id)
  const url = 'http://localhost:3001';
  const input = useRef('');

  useEffect(() => {
    // Step 1: Fetch the list of incoming request user IDs
    fetch(`${url}/request`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(async data => {
        const ids = data.request; // array of user _id

        // Step 2: Fetch user details for each ID
        const userPromises = ids.map(id =>
          fetch(`${url}/user_by_id/${id}`, {
            method: 'GET',
            credentials: 'include',
          })
            .then(res => res.json())
            .then(user => ({ id: user._id, name: user.name }))
        );

        const users = await Promise.all(userPromises);
        setRequests(users);
      })
      .catch(err => console.error('Failed to fetch requests:', err));
  }, []);

  const buttonclicked = () => {
    const dostname = input.current.value;
    console.log('name searched', dostname);
  };

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

  const accept = (id) => {
    fetch(`${url}/accept_request`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.msg);
        setRequests(requests.filter(user => user.id !== id)); // remove from list
      });
  };

  const reject = (id) => {
    fetch(`${url}/reject_request`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.msg);
        setRequests(requests.filter(user => user.id !== id)); // remove from list
      });
  };

  return (
    <>
      <div id="search">
        <input type="text" ref={input} placeholder="dost" id="input" />
        <button id="add" onMouseOver={handlehover} onMouseOut={handleout} onClick={buttonclicked}>+</button>
      </div>

      <ul>
        {requests.map((user, index) => (
          <li key={user.id}>
            {user.name}
            <button onClick={() => accept(user.id)} onMouseOver={handlehover} onMouseOut={handleout}>+</button>
            <button onClick={() => reject(user.id)} onMouseOver={handlehover} onMouseOut={handleout}>x</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Request;
