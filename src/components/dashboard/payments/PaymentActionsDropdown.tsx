import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    MoreHorizontal,
    Eye,
    CheckCircle,
    XCircle,
    RotateCcw,
} from "lucide-react";

import { Payment } from "@/types";

type Props = {
    payment: Payment;
    onView: () => void;
    onPaid: () => void;
    onFailed: () => void;
    onRefund: () => void;
};

export function PaymentActionsDropdown({
                                           onView,
                                           onPaid,
                                           onFailed,
                                           onRefund,
                                       }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">

                <DropdownMenuItem onClick={onView}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onPaid}>
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Mark Paid
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onFailed}>
                    <XCircle className="w-4 h-4 mr-2 text-red-600" />
                    Mark Failed
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onRefund}>
                    <RotateCcw className="w-4 h-4 mr-2 text-orange-600" />
                    Refund
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    );
}