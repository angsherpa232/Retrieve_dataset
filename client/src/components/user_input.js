import React from 'react';
import UserInputStats from './userInputExtended';

const UserInput = (props) => {
    return (
        <div className="user_input">
        <form onSubmit={props.onSubmit}> 
            <label>
                Enter your query here:
            <input type="text"
            placeholder="aa"
            value={props.postvalue}
            onChange={props.handleChange} 
            />
            </label> 
            <label>
                <input type="submit" value="Submit"/>
            </label>
        </form>
        <br/>
        <UserInputStats {...props}/>
        </div>
    )
}

export default UserInput;