import React from 'react';

const UserInputStats = (props) => {
    return (
        <div>
        {`Status: ${props.status}`}
        <br/>
        {`Total Data: ${props.dataLength}`}
        <br/>
        {props.loading ? <img src="https://thumbs.gfycat.com/HonoredExemplaryAmphibian-size_restricted.gif" />: null}
        </div>
    )
}

export default UserInputStats;