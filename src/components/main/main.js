import React, { useState, useRef, useEffect } from 'react'
import Add from './addfrnds'
import './main.css'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import {updatep,updatepid} from '../../redux/actp.js'
import Subnav from './subnav.js'
import Quill from '../quill/quill.js';
const Main = (props) => {


  
    let [docid,setdoc]=useState('')
   // let id=useSelector((state)=>state.actp.id)   doc id
    let projectname=useSelector((state)=>state.actp.value)
    let input = useRef(null)
    let [list, setlist] = useState([])
    let url = 'http://localhost:3001'
 
    let dispatch=useDispatch()
    let [proj, setproj] = useState('')
    let adding = () => {
        let project = input.current.value
        fetch(`${url}/adding_proj`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({  project })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.msg)
                console.log('added proj', project)
                setlist([...list, project])
            })




        input.current.value = ''
    }
    useEffect(() => {
        fetch(`${url}/ret_proj`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify()
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.msg)
                console.log(data.project)
                
                setlist(data.project)
            })
    }, [])
    let handleclick = (e) => {
     
        let project = e.currentTarget.innerText
        console.log('active proj', project)
        setproj(project)
        dispatch(updatep(e.currentTarget.innerText))
        let div=e.currentTarget 
        let id=div.getAttribute('id')
        console.log('id is',id)
        setdoc(id)
        dispatch(updatepid(id))
    }
    let remove=(e)=>{
        let div=e.target.parentElement
        let item=div.querySelector('li')
        let project=item.getAttribute("data-name")
        console.log("asdasd",project)
        fetch(`${url}/del_proj`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({project })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.msg)
                console.log(data.proj)
                setlist(data.proj)
            })
    }
    // let abc=()=>{
    //     console.log("act id is",id)      doc id code
    // }
    return (
        <>
            <div className='main'>
                <div className='project'>

                    <div className='add'>
                        <input id='inp' type='text' ref={input} placeholder='project'></input>
                        <button id='btn' onClick={adding}>+</button>
                    </div>
                    <div>
                    {list.map((value, index,array) => {
                       
                        
                        return (
                            <div id={value.id} data-name={value.name} className='item'><li data-name={value.name} id={value.id} className='proj' onClick={handleclick} key={index}>{value.name}</li><button id='btn1' onClick={remove}>x</button></div>
                        )
                    })}
                    </div>
                </div>
                <div className='work'>
                    <Subnav />
                    
                </div>
                    {/* <button onClick={abc}>id</button> */}
            </div>
            
        </>
    )
}

export default Main