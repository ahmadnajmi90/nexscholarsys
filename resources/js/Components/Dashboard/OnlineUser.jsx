import React from 'react';

const OnlineUser = ({ onlineUsers }) => {
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold">Online Users</h2>
            <p className="text-3xl font-bold">{onlineUsers}</p>
        </div>
    );
};

export default OnlineUser;