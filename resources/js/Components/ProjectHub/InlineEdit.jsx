import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';

export default function InlineEdit({
    value,
    onSave,
    className = '',
    placeholder = 'Enter title...',
    canEdit = true,
    disabled = false,
    showPencilOnHover = true,
    inputClassName = 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const [isHovered, setIsHovered] = useState(false);
    const inputRef = useRef(null);

    // Update edit value when value prop changes
    useEffect(() => {
        setEditValue(value);
    }, [value]);

    // Focus input when entering edit mode
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleStartEdit = () => {
        if (!canEdit || disabled) return;
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (editValue.trim() === value) {
            // No change, just exit edit mode
            setIsEditing(false);
            return;
        }

        if (editValue.trim() === '') {
            // Reset to original value if empty
            setEditValue(value);
            setIsEditing(false);
            return;
        }

        try {
            await onSave(editValue.trim());
            setIsEditing(false);
        } catch (error) {
            // Reset on error
            setEditValue(value);
            setIsEditing(false);
            console.error('Failed to save:', error);
        }
    };

    const handleCancel = () => {
        setEditValue(value);
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleCancel();
        }
    };

    const handleBlur = () => {
        // Auto-save on blur if value changed
        if (editValue.trim() !== value && editValue.trim() !== '') {
            handleSave();
        } else {
            handleCancel();
        }
    };

    if (isEditing) {
        return (
            <div className="flex items-center space-x-2 w-full">
                <input
                    ref={inputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className={`${inputClassName} ${className} w-full min-w-0`}
                    placeholder={placeholder}
                    disabled={disabled}
                />
                <button
                    type="button"
                    onClick={handleSave}
                    className="p-1 text-green-600 hover:text-green-800 transition-colors"
                    title="Save"
                >
                    <Check className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Cancel"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div
            className="group flex items-center cursor-pointer max-w-full w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleStartEdit}
        >
            <span className={`${className} w-full break-words`}>{value}</span>
            {canEdit && showPencilOnHover && isHovered && (
                <Pencil className="w-4 h-4 ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            )}
        </div>
    );
}
