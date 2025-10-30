import React, { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, FolderOpen, Edit2, Trash2, GripVertical } from "lucide-react";
import { Link, router, usePage } from "@inertiajs/react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-hot-toast";

export default function WorkspaceGroupSection({ 
    group, 
    workspaces = [], 
    isUngrouped = false,
    allGroups = [],
    onEdit, 
    onDelete,
}) {
    const [isOpen, setIsOpen] = useState(true);
    
    // Ensure workspaces is always an array (handle ResourceCollection format)
    const workspacesArray = Array.isArray(workspaces) 
        ? workspaces 
        : (workspaces?.data || []);
    
    // Make this section a droppable zone
    const { setNodeRef, isOver } = useDroppable({
        id: isUngrouped ? 'ungrouped' : `group-${group?.id}`,
        data: {
            type: 'group',
            groupId: isUngrouped ? null : group?.id,
            isUngrouped
        }
    });
    
    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg bg-white shadow-sm">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-t-lg">
                <div className="flex items-center gap-3">
                    {isOpen ? (
                        <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                    <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {isUngrouped ? 'Ungrouped' : group.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({workspacesArray.length})</span>
                </div>
                {!isUngrouped && (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onEdit(group)} 
                            className="h-8 w-8 p-0"
                        >
                            <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onDelete(group)} 
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div 
                    ref={setNodeRef}
                    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 transition-colors ${
                        isOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                >
                    {workspacesArray.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                            {isOver ? 'Drop workspace here' : 'No workspaces in this group'}
                        </div>
                    ) : (
                        workspacesArray.map(workspace => (
                            <WorkspaceCard 
                                key={workspace.id} 
                                workspace={workspace}
                                allGroups={allGroups}
                                currentGroupId={isUngrouped ? null : group?.id}
                            />
                        ))
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

function WorkspaceCard({ workspace, allGroups, currentGroupId }) {
    const { auth } = usePage().props;
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `workspace-${workspace.id}`,
        data: {
            type: 'workspace',
            workspace: workspace
        }
    });
    
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;
    
    // Get owner's full name from their profile
    const ownerProfile = workspace.owner?.academician || workspace.owner?.postgraduate || workspace.owner?.undergraduate;
    const ownerName = ownerProfile?.full_name || workspace.owner?.name || 'Unknown';
    const ownerDisplay = auth.user.id === workspace.owner_id ? 'You' : ownerName;
    
    // Check if current user is the owner
    const isOwner = auth.user.id === workspace.owner_id;
    
    const handleDeleteWorkspace = () => {
        if (confirm(`Delete workspace "${workspace.name}"? This action cannot be undone and will delete all boards and tasks.`)) {
            router.delete(route('project-hub.workspaces.destroy', workspace.id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Workspace deleted successfully'),
                onError: () => toast.error('Failed to delete workspace')
            });
        }
    };
    
    const handleAssignToGroup = (groupId) => {
        const targetGroupId = groupId === 'ungrouped' ? null : groupId;
        
        if (targetGroupId === null) {
            // Unassign from group
            router.post(route('project-hub.workspaces.unassign', workspace.id), {}, {
                preserveScroll: true,
                onSuccess: () => toast.success('Workspace moved to ungrouped'),
                onError: () => toast.error('Failed to move workspace')
            });
        } else {
            // Assign to group
            router.post(route('project-hub.workspace-groups.assign', {
                workspaceGroup: targetGroupId,
                workspace: workspace.id
            }), {}, {
                preserveScroll: true,
                onSuccess: () => toast.success('Workspace moved to group'),
                onError: () => toast.error('Failed to move workspace')
            });
        }
    };
    
    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative border rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow ${
                isDragging ? 'opacity-50 shadow-xl' : ''
            }`}
        >
            {/* Drag Handle */}
            <div 
                {...listeners} 
                {...attributes}
                className="absolute top-2 left-2 p-1 cursor-move hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                title="Drag to move"
            >
                <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            
            {/* Delete Button (Owner Only) */}
            {isOwner && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteWorkspace();
                    }}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Delete workspace"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
            
            {/* Main Card Content */}
            <Link
                href={route('project-hub.workspaces.show', workspace.id)}
                className="block p-4 pl-10"
            >
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {workspace.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span>Owner: {ownerDisplay}</span>
                    <span>{workspace.members_count || 0} members</span>
                </div>
            </Link>
            
            {/* Assign to Group Dropdown */}
            <div className="px-4 pb-3" onClick={(e) => e.stopPropagation()}>
                <Select 
                    value={currentGroupId?.toString() || 'ungrouped'} 
                    onValueChange={handleAssignToGroup}
                >
                    <SelectTrigger className="w-full h-8 text-xs">
                        <SelectValue placeholder="Move to..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ungrouped">
                            <span className="flex items-center gap-2">
                                <FolderOpen className="w-3 h-3" />
                                Ungrouped
                            </span>
                        </SelectItem>
                        {allGroups.map(group => (
                            <SelectItem key={group.id} value={group.id.toString()}>
                                <span className="flex items-center gap-2">
                                    <FolderOpen className="w-3 h-3" />
                                    {group.name}
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

