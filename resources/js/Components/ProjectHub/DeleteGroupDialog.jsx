import React from "react";
import { router } from "@inertiajs/react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";

export default function DeleteGroupDialog({ isOpen, onClose, group }) {
    const handleDelete = () => {
        if (!group) return;
        
        router.delete(route('project-hub.workspace-groups.destroy', group.id), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                toast.success('Group deleted successfully. Workspaces moved to ungrouped.');
            },
            onError: () => {
                toast.error('Failed to delete group');
            }
        });
    };
    
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Workspace Group</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete "{group?.name}"? All workspaces in this group will be moved to ungrouped. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

