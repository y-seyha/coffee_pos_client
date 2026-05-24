"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
    open: boolean;
    title?: string;
    description?: string;

    confirmText?: string;
    cancelText?: string;

    onCancel: () => void;
    onConfirm: () => void;

    loading?: boolean;
}

export default function ConfirmModal({
                                         open,
                                         title = "Are you sure?",
                                         description = "This action cannot be undone.",
                                         confirmText = "Confirm",
                                         cancelText = "Cancel",
                                         onCancel,
                                         onConfirm,
                                         loading = false,
                                     }: ConfirmModalProps) {
    return (
        <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
            <DialogContent className="sm:max-w-[400px]">

                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex gap-2 sm:justify-end">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : confirmText}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}