import React from "react";
import { router } from "@inertiajs/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderOpen } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AssignGroupDropdown({ workspace, groups = [], currentGroupId = null }) {
    const handleChange = (value) => {
        if (value === 'ungrouped') {
            // Unassign from group
            router.post(route('project-hub.workspaces.unassign', workspace.id), {}, {
                preserveScroll: true,
                onSuccess: () => toast.success('Workspace moved to ungrouped'),
                onError: () => toast.error('Failed to move workspace')
            });
        } else {
            // Assign to group
            router.post(route('project-hub.workspace-groups.assign', {
                workspaceGroup: value,
                workspace: workspace.id
            }), {}, {
                preserveScroll: true,
                onSuccess: () => toast.success('Workspace moved to group'),
                onError: () => toast.error('Failed to move workspace')
            });
        }
    };
    
    const currentValue = currentGroupId ? currentGroupId.toString() : 'ungrouped';
    
    return (
        <Select value={currentValue} onValueChange={handleChange}>
            <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    <SelectValue placeholder="Assign to group..." />
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ungrouped">Ungrouped</SelectItem>
                {groups.map(group => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                        {group.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

