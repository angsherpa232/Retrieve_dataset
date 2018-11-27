import React from 'react';

const Theme_Time = (props) => {
    return (
            <div className="theme_time">
            <table>
                <caption>Available data.</caption>
                <thead>
                <tr>
                    <th>Theme</th>
                    <th>Date</th>
                </tr>
                </thead>
            </table>
            {Array.isArray(props.post)?
            props.post.map((item) => (
                <table key={item._id}>
                    <tbody>
                <tr key={item._id}>
                    <td>{item.metadata.tags}</td>
                    <td>{item.metadata.DateTime}</td>
                </tr>
                </tbody>
                </table>
            ))
            :console.log('nein')}
        </div>
        ) 
}

export default Theme_Time;