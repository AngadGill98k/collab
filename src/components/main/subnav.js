import React, { useState } from 'react'
import './subnav.css'
import Add from './addfrnds'
const Subnav = (props) => {
    let [mem,setmem]=useState(false)
    let username=props.username
    let handleclick = () => { 
        setmem(prevs=>!prevs)
        
    }
    return (
        <>
            <div className='subnav'>
                <button onClick={handleclick}>search</button>
                {mem &&<Add username={username}/>}
            </div>
        </>
    )
}

export default Subnav