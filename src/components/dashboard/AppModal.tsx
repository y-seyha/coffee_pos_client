"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

type AppModalProps = {
    open: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
};

export function AppModal({ open, title, children, onClose }: AppModalProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="rounded-2xl max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-4">{children}</div>
            </DialogContent>
        </Dialog>
    );
}