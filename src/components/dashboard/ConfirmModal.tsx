// components/ui/confirm-modal.tsx
"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmModalProps = {
    open: boolean;
    title?: string;
    description?: string;
    loading?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

export function ConfirmModal({
                                 open,
                                 title = "Are you sure?",
                                 description = "This action cannot be undone.",
                                 loading = false,
                                 onCancel,
                                 onConfirm,
                             }: ConfirmModalProps) {
    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent className="rounded-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">{description}</p>

                <DialogFooter className="flex gap-2 mt-4">
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>

                    <Button variant="destructive" onClick={onConfirm} disabled={loading}>
                        {loading ? "Processing..." : "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}