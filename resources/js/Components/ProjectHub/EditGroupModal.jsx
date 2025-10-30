import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

export default function EditGroupModal({ isOpen, onClose, group }) {
    const { data, setData, put, processing, errors, reset } = useForm({ 
        name: group?.name || '' 
    });
    
    useEffect(() => {
        if (group) {
            setData('name', group.name);
        }
    }, [group]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!group) return;
        
        put(route('project-hub.workspace-groups.update', group.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
                toast.success('Group updated successfully');
            },
            onError: (errors) => {
                if (errors.name) {
                    toast.error(errors.name);
                } else {
                    toast.error('Failed to update group');
                }
            }
        });
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Workspace Group</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Group Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="e.g., DSPD1573 Student Groups"
                                className="w-full"
                                autoFocus
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={processing || !data.name.trim()}
                        >
                            {processing ? 'Updating...' : 'Update Group'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

