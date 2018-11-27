import React from 'react';

const UserInputStats = (props) => {
    return (
        <div>
        {`Status: `}
        <br/>
        {`${props.status}`}
        <br/> <br/>
        {`Total data found: ${props.dataLength}`}
        <br/>
        <br/>
        {props.loading ? <img src="https://thumbs.gfycat.com/HonoredExemplaryAmphibian-size_restricted.gif" alt="img not found"/>: null}
        </div>
    )
}

export default UserInputStats;