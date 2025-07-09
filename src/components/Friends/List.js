import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatename } from '../../redux/dostname/dostname.js';
import './list.css';
import { data } from 'react-router-dom';
import { useSelector } from 'react-redux';
const List = ({socket}) => {
  const [projects, setProjects] = useState([]);
  const input = useRef('');
  const dispatch = useDispatch();
  const url = 'http://localhost:3001';
let currentProjectId=useSelector((state) => state.dostname);
  const buttonclicked = async () => {
    const name = input.current.value.trim();
    await fetch(`${url}/add_project`, {
      method: 'POST',
      credentials: 'include', // important if using sessions
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ project: name }),
    })
      .then(res => res.json())
      .then(data => {
        setProjects(prev => [...prev,{name:data.name,id:data._id}]); // Add to list
        input.current.value = ''; // Clear input
      })

  };
 useEffect(() => {
  (async () => {
    await fetch(`${url}/get_projects`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(proj => ({
          name: proj.name,
          id: proj._id,
        }));
        setProjects(formatted);
      })
      .catch(err => {
        console.error('Error fetching saved projects:', err);
      });
  })();
}, []);

  
const handleClick = (project) => {
  
  // Leave the previous room first
  if (socket && currentProjectId.id) {
    socket.emit('leave_room', currentProjectId.id);
  }

  // Update the store with new project
  dispatch(updatename({ name: project.name, id: project.id }));
  console.log("Project clicked:", project);
};


  return (
    <div>
      <div id='search'>
        <input type='text' ref={input} placeholder='project' id='input' />
        <button id='add' onClick={buttonclicked}>+</button>
      </div>

      {projects.length === 0 ? (
        <p style={{ color: '#ccc', textAlign: 'center', marginTop: '10px' }}>
          No projects found
        </p>
      ) : (
        <ul className='list'>
          {projects.map((project, index) => (
            <li
              className='item'
              key={index}
              data-id={project.id}
              data-name={project.name}
              onClick={() => handleClick(project)}
            >
              {project.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default List;
