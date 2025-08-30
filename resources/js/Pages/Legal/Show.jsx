import React from 'react';
import LegalLayout from '../../Layouts/LegalLayout';

export default function Show({ title, content }) {
    // Extract headings from content for table of contents
    const headings = [];
    let headingIndex = 0;

    // Find all ## headings in the content
    const headingMatches = content.match(/^## (.*$)/gm);
    if (headingMatches) {
        headingMatches.forEach((match) => {
            const headingText = match.replace(/^## /, '').trim();
            const slug = headingText
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/-+/g, '-') // Replace multiple hyphens with single
                .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

            const uniqueSlug = slug || `section-${headingIndex + 1}`;
            headings.push({
                text: headingText,
                id: uniqueSlug
            });
            headingIndex++;
        });
    }

    return (
        <LegalLayout headings={headings}>
            <div className="p-8">
                {/* Title */}
                <div className="mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                    <div className="w-16 h-1 bg-indigo-600 rounded"></div>
                </div>

                {/* Content */}
                <div className="prose prose-gray max-w-none">
                    <div
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: content
                                // First, handle markdown headings (must be before newline replacement)
                                .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
                                .replace(/^## (.*$)/gm, (match, headingText) => {
                                    // Find the corresponding heading in our headings array
                                    const heading = headings.find(h => h.text === headingText.trim());
                                    const id = heading ? heading.id : '';
                                    return `<h2 id="${id}" class="text-xl font-semibold text-gray-900 mt-4 mb-4">${headingText}</h2>`;
                                })
                                .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium text-gray-900 mt-4 mb-2">$1</h3>')
                                // Handle markdown-style links [text](/path) -> <a href="/path">text</a>
                                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-indigo-600 hover:text-indigo-800 underline">$1</a>')
                                // Then handle bold and italic text
                                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                                // Remove newlines that come immediately after headings
                                .replace(/(<h[1-3][^>]*>.*?<\/h[1-3]>)\s*\n/g, '$1')
                                // Handle newlines more carefully - don't add <br /> after headings
                                .replace(/\n(?=## )/g, '') // Remove newlines before ## headings
                                .replace(/\n(?=### )/g, '') // Remove newlines before ### headings
                                .replace(/\n(?=# )/g, '') // Remove newlines before # headings
                                .replace(/\n/g, '<br />') // Convert remaining newlines to <br />
                        }}
                    />
                </div>

                {/* Last Updated */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Last updated: 28 August 2025
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        This document is subject to change. Please check back regularly for updates.
                    </p>
                </div>
            </div>
        </LegalLayout>
    );
}
