// import React, { useRef } from 'react'

// const List = (props) => {
//     let input=useRef(null)
//     let url = 'http://localhost:3001' 
//     let [proj,setproj]=use
//   let addingproj=()=>{
//     let project=input.current.value
//     let username=props.username
//     fetch(`${url}/adding_proj`,{
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ username,project })
//     })
//     .then(response => response.json())
//     .then(data => {
//       console.log(data.msg)
//       console.log('added proj',project)
//   })




//     input.current.value=''
//   }
//     return (
//     <>
//     <input type='text' ref={input}></input>
//     <button onClick={addingproj}>+</button>
//     </>
//   )
// }

// export default List