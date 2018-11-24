import React from 'react';

const UserInput = (props) => {
    return (
        <div className="user_input">
        <form onSubmit={props.onSubmit}> 
            <input 
            type="text"
            value={props.postvalue}
            onChange={props.handleChange}
            />
            <button type="submit">Submit</button>
        </form>
        </div>
    )
}

export default UserInput;