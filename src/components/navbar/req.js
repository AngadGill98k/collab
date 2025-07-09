import React, { useEffect, useState } from 'react'

const Req = (props) => {
    let url = 'http://localhost:3001'
    let [req, setreq] = useState([])
    let username = props.username
    useEffect(() => {
        console.log('retriving req')
        fetch(`${url}/req`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.msg)
                console.log('req retrivedd', data.req)
                setreq(data.req)
            })

    }, [])
    let handleclick = (e) => {
        let btn = e.target
        let li = btn.parentElement
        let friendname = li.getAttribute('data-value')
        console.log('addingf friend', friendname)
        fetch(`${url}/accept_req`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, friendname })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.msg)
                li.remove()
            })

        
    }

    let reject = (e) => {
        let btn = e.target
        let li = btn.parentElement
        let friendname = li.getAttribute('data-value')
        console.log('addingf friend', friendname)
        fetch(`${url}/reject_req`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, friendname })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.msg)
                li.remove()
            })

        
    }
    return (
        <>
            <div>
                <ul>
                    {req.map((value, index) => {
                        return (
                            <li key={index} data-value={value}>
                                {value}
                                <button onClick={handleclick}>+</button>
                                <button onClick={reject}>x</button>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </>
    )
}

export default Req