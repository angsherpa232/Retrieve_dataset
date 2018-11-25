import React from 'react';
import UserInputStats from './userInputExtended';

const UserInput = (props) => {
    return (
        <div className="user_input">
        <p>Enter your query here</p>
        <form onSubmit={props.onSubmit}> 
            <input 
            type="text"
            value={props.postvalue}
            onChange={props.handleChange}
            />
            <button type="submit">Submit</button>
        </form>
        <br/>
        <UserInputStats {...props}/>
        </div>
    )
}

export default UserInput;