import React from 'react';

const Theme_Time = (props) => {
    const p = ['ang','dawa','sherpa']
    return (
            <div className="theme_time">
            {Array.isArray(props.post)?
            props.post.map((item) => (
                <dl key={item._id}>
                <dt>{item.metadata.tags}</dt>
                <dd>{item.metadata.DateTime}</dd>
                </dl>
            ))
            :console.log('nein')}
        </div>
        ) 
}

export default Theme_Time;