import React from 'react';

export default function Elements() {
    return (
        <div>
            <h1>{process.env.REACT_APP_API_URL}</h1>
        </div>
    )
}