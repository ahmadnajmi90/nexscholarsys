import React from 'react';

const RegisteredUser = ({ totalUsers }) => {
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold">Total Registered Users</h2>
            <p className="text-3xl font-bold">{totalUsers}</p>
        </div>
    );
};

export default RegisteredUser;