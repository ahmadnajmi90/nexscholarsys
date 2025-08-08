import React, { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import { router } from '@inertiajs/react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ArchivedTasksModal({ show, onClose, boardId }) {
    const [archivedTasks, setArchivedTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (show) {
            setIsLoading(true);
            axios.get(route('project-hub.boards.archived', boardId))
                .then(response => {
                    setArchivedTasks(response.data.data || []);
                })
                .catch(() => console.error('Failed to fetch archived tasks'))
                .finally(() => setIsLoading(false));
        }
    }, [show, boardId]);

    const handleUnarchive = (taskId) => {
        router.post(route('project-hub.tasks.archive', taskId), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Task restored to board!');
                setArchivedTasks(prev => prev.filter(task => task.id !== taskId));
                router.reload({ only: ['initialBoardData'] });
            },
            onError: () => toast.error('Failed to restore task.'),
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Archived Tasks</h2>
                <div className="mt-4 max-h-96 overflow-y-auto">
                    {isLoading && <p>Loading...</p>}
                    {!isLoading && archivedTasks.length === 0 && <p>No archived tasks.</p>}
                    <ul className="space-y-3">
                        {archivedTasks.map(task => (
                            <li key={task.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                                    <div className="text-xs text-gray-500 mt-1 flex items-center space-x-3">
                                        <span>
                                            Archived: {task.archived_at ? new Date(task.archived_at).toLocaleDateString() : ''}
                                        </span>
                                        <span className="font-bold">·</span>
                                        <span>
                                            In list: <span className="font-semibold">{task.list_name}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <button
                                        onClick={() => handleUnarchive(task.id)}
                                        className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-xs text-gray-700 hover:bg-gray-50"
                                    >
                                        Restore
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-xs text-gray-700 hover:bg-gray-50">Close</button>
                </div>
            </div>
        </Modal>
    );
}

