import React from 'react';

const UserInput = (props) => {
    return (
        <div>
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
        </div>
        </div>
    )
}

export default UserInput;