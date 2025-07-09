import React, { useEffect, useRef, useState } from 'react'

const Add = (props) => {
    let input=useRef(null)
    let [friend,setfriend]=useState(null)
    let username=props.username
    let url='http://localhost:3001'

    let handleclick=()=>{
        let friendname=input.current.value
        
        fetch(`${url}/searchfrnd`,{
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
    }

    let adding=()=>{
        let friendname=input.current.value
        console.log('searching name i.e',friendname)
        fetch(`${url}/addfrnd`,{ 
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({username,friendname})
        })
        .then(response=>response.json())
        .then(data=>{
            console.log(data.msg)
            
        })
    } 


    return (
    <>
   <div>
        <input type='text' ref={input}></input>
        <button onClick={handleclick}>srch</button>
        <ul>
            {friend && <div>
                <li >{friend}</li>
                <button onClick={adding}>+</button>
                </div>}
        </ul>
    </div>
    </>
  )
}

export default Add