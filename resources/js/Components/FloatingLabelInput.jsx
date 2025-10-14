import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function FloatingLabelInput({
    id,
    type = 'text',
    label,
    value = '',
    onChange,
    error,
    disabled = false,
    autoComplete,
    isFocused = false,
    className = '',
    ...props
}) {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const hasValue = value && value.length > 0;
    const isFloating = focused || hasValue;
    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
        <div className={`relative ${className}`}>
            <input
                id={id}
                type={inputType}
                value={value}
                onChange={onChange}
                disabled={disabled}
                autoComplete={autoComplete}
                autoFocus={isFocused}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={`
                    peer w-full px-4 pt-6 pb-2 
                    bg-white border-2 rounded-lg
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-indigo-200
                    disabled:bg-gray-50 disabled:text-gray-500
                    ${error 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                        : focused 
                            ? 'border-indigo-500' 
                            : 'border-gray-300 hover:border-gray-400'
                    }
                    ${type === 'password' ? 'pr-12' : ''}
                `}
                placeholder=" "
                {...props}
            />
            
            <label
                htmlFor={id}
                className={`
                    absolute left-4 transition-all duration-200 pointer-events-none
                    ${isFloating 
                        ? 'top-2 text-xs' 
                        : 'top-1/2 -translate-y-1/2 text-base'
                    }
                    ${error 
                        ? 'text-red-600' 
                        : focused 
                            ? 'text-indigo-600 font-medium' 
                            : 'text-gray-500'
                    }
                `}
            >
                {label}
            </label>

            {type === 'password' && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 transition-colors rounded-md hover:bg-gray-100"
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <Eye className="w-5 h-5" />
                    ) : (
                        <EyeOff className="w-5 h-5" />
                    )}
                </button>
            )}

            {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}

