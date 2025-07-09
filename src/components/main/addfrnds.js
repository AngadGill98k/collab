import React, { useEffect, useRef, useState } from 'react'
import './addf.css'
import { useSelector } from 'react-redux'

const Add = (props) => {
    let input=useRef(null)
    let [friend,setfriend]=useState('')
    let username=props.username
    let url='http://localhost:3001'
    let projectname=useSelector((state)=>state.actp.value)
    let id=useSelector((state)=>state.actp.id)
    let handleclick=()=>{
        let friendname=input.current.value
        console.log('searching name i.e',friendname,username)
        
        fetch(`${url}/collab_srch`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({username,friendname})
        })
        .then(response=>response.json())
        .then(data=>{
            console.log(data.msg)
            setfriend(friendname)
        })
        console.log('act is',projectname)
    }

    let adding=(e)=>{
        console.log('clcikeing button')
        let btn =e.currentTarget
        let li=btn.parentElement

        let friendname=li.getAttribute('name')
        console.log('clcikeing button',friendname)
        fetch(`${url}/collab`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({username,friendname,projectname,id})
        })
        .then(response=>response.json())
        .then(data=>{
            console.log(data.msg)
            
        })
    }


    return (
    <>
   <div id='mem'>
        <input type='text' ref={input}></input>
        <button onClick={handleclick}>srchFfrffeinds</button>
        <ul>
        {friend ? (<>
        
        <li name={friend} >{friend}<button onClick={adding}>+</button></li></>
        
    ) : (
        <li>No friends found</li>
    )}
        </ul>
    </div>
    </>
  )
}

export default Add