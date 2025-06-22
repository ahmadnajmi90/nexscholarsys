import React from 'react';
import { BookOpen } from 'lucide-react';

export default function PaperTaskBadge() {
    return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            <BookOpen className="w-3 h-3 mr-1" />
            Paper
        </span>
    );
} 