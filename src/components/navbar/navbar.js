import React, { useState } from 'react'
import Add from './add'
import Req from './req'
import Friend from './friend'
import './navbar.css'
const Navbar = (props) => {
  let [add, setadd] = useState(false)
  let [req, setreq] = useState(false)

  let handleadd = () => {
    console.log('showing add')
    setadd(PRES => !PRES)
    setreq(false)
  }

  let handlereq = () => {
    console.log('showing req')
    setadd(false)
    setreq(PRES => !PRES)
  }
  return (
    <>
      <div className='nav'>
        <div>
          <button onClick={handleadd}>+</button>
          <button onClick={handlereq}>request</button>
        </div>
        <div>
          <Friend />
        </div>
        <div>{add && <Add username={props.username} />}
        {req && <Req username={props.username} />}</div>
        
      </div>
    </>
  )
}

export default Navbar