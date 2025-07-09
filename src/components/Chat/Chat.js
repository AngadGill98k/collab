import React, { useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Delta from 'quill-delta';
import { useSelector } from 'react-redux';

const Chat = ({ user_name, projectname, projectid, socket }) => {
  const addFriendInput = useRef(null);
  const quillRef = useRef(null);
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [content, setContent] = useState('');
  const url = 'http://localhost:3001';

  // 🟢 Fetch saved content on project switch
  useEffect(() => {
    if (!projectid) return;
    fetch(`${url}/get_project/${projectid}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setContent(data.content?.ops ? data.content : ''); // expects delta
      });
  }, [projectid]);

  // 🟢 Join Room on mount or project change
  useEffect(() => {
    if (socket && projectid) {
      socket.emit('join_room', projectid);
    }
    return () => {
      if (socket && projectid) socket.emit('leave_room', projectid);
    };
  }, [socket, projectid]);

  // 🟢 Emit changes as Deltas (not HTML)
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill || !socket || !projectid) return;

    const handleChange = (delta, oldDelta, source) => {
      if (source === 'user') {
        socket.emit('delta_update', {
          roomId: projectid,
          delta,
        });
      }
    };

    quill.on('text-change', handleChange);
    return () => {
      quill.off('text-change', handleChange);
    };
  }, [socket, projectid]);

  // 🟢 Apply incoming Deltas from others
  useEffect(() => {
    if (!socket) return;

    const handleRemoteUpdate = (delta) => {
      const quill = quillRef.current?.getEditor();
      quill.updateContents(delta, 'api');
    };

    socket.on('delta_update', handleRemoteUpdate);
    return () => socket.off('delta_update', handleRemoteUpdate);
  }, [socket]);

  // 🟢 Update content in React state to keep Quill synced
  const handleEditorChange = (value, delta, source, editor) => {
    setContent(editor.getContents());
  };

  // 🔍 Friend Search
  const handleSearch = () => {
    const value = addFriendInput.current.value.trim().toLowerCase();
    if (!value) return setSearchResults([]);

    const matches = friends.filter(friend =>
      friend.name.toLowerCase().includes(value)
    );
    setSearchResults(matches);
  };

  // 👥 Load Friends
  useEffect(() => {
    fetch(`${url}/dost_list`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        const friendData = data.dost_list.map(friend => ({
          id: friend._id,
          name: friend.name,
          mail: friend.mail,
        }));
        setFriends(friendData);
      });
  }, []);

  // ➕ Add Friend
  const handleAddClick = async (friend) => {
    const res = await fetch(`${url}/add_member_to_project`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectid, user_id: friend.id }),
    });
    const result = await res.json();
    if (result.msg === 'success') {
      alert(`Added ${friend.name}`);
      setSearchResults([]);
    } else {
      alert(result.msg);
    }
  };

  return (
    <div className='chat'>
      <h2>Project: {projectname}</h2>
      <h4>Project ID: {projectid}</h4>

      <div className='add-friend'>
        <input
          type='text'
          placeholder='Search friend by name'
          ref={addFriendInput}
          onChange={handleSearch}
        />
      </div>

      {searchResults.length > 0 && (
        <ul className="friend-results">
          {searchResults.map(friend => (
            <li key={friend.id}>
              {friend.name}
              <button onClick={() => handleAddClick(friend)}>Add</button>
            </li>
          ))}
        </ul>
      )}

      <div className='quill-editor' style={{ marginTop: '30px' }}>
        <ReactQuill
          ref={quillRef}
          theme='snow'
          value={content}
          onChange={handleEditorChange}
          placeholder='Start collaborating...'
        />
      </div>
    </div>
  );
};

export default Chat;
