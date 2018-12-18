import React from 'react';

const UserInputStats = (props) => {
    return (
        <div>
        {`Status: `}
        <br/>
        {props.status === "OK" ? "OK" : "Error: Check for spelling mistakes or extra whitespace in the parameters."}
        <br/> <br/>
        {`Total datasets found: ${props.dataLength}`}
        <br/>
        <br/>
        {props.loading ? <img src="https://thumbs.gfycat.com/HonoredExemplaryAmphibian-size_restricted.gif" alt="img not found"/>: null}
        </div>
    )
}

export default UserInputStats;