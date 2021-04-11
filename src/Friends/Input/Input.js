import React from 'react';
import './Input.css';
import * as RiIcons from 'react-icons/ri'



const Input = ({ message , setMessage , sendMessage }) =>(
    <div className ="message-box">
        <input

            type = "text"
            value= {message}
            placeholder="type a message"
            value={message}
            onChange={(event)=> setMessage(event.target.value)}
            onKeyPress={event => event.key ==='Enter' ? sendMessage(event) : null}
        />
        <button className = "sendButton  waves-effect waves-light" onClick={ (event) => sendMessage(event)}>
            <RiIcons.RiSendPlaneFill style={{'fontSize':'2rem'}}/>
            </button>
    </div>
    
)

export default Input