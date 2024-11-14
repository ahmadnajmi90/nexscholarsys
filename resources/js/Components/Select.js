import React, { useState } from 'react';

// Main Select Component
export function Select({ children, value, onValueChange }) {
    return (
        <div className="relative">
            {React.Children.map(children, (child) => {
                return React.cloneElement(child, { value, onValueChange });
            })}
        </div>
    );
}

// SelectTrigger Component
export function SelectTrigger({ children, onClick }) {
    return (
        <button
            type="button"
            className="w-full bg-white border rounded-md p-2 cursor-pointer"
            onClick={onClick}
        >
            {children}
        </button>
    );
}

// SelectValue Component
export function SelectValue({ placeholder, value }) {
    return (
        <span className="text-gray-700">
            {value || placeholder}
        </span>
    );
}

// SelectContent Component
export function SelectContent({ children, isOpen }) {
    return (
        isOpen && (
            <div className="absolute bg-white border rounded-md shadow-lg mt-1 w-full z-10">
                {children}
            </div>
        )
    );
}

// SelectItem Component
export function SelectItem({ children, value, onClick }) {
    return (
        <div
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => onClick(value)}
        >
            {children}
        </div>
    );
}
