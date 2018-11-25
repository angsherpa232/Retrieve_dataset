import React from 'react';

const Theme_Time = (props) => {
    return (
            <div className="theme_time">
            <table>
                <caption>Available data.</caption>
                <tr>
                    <th>Theme</th>
                    <th>Date</th>
                </tr>
            </table>
            {Array.isArray(props.post)?
            props.post.map((item) => (
                <table>
                <tr key={item._id}>
                    <td>{item.metadata.tags}</td>
                    <td>{item.metadata.DateTime}</td>
                </tr>
               
                </table>
            ))
            :console.log('nein')}
        </div>
        ) 
}

export default Theme_Time;