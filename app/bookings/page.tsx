"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/components/UserProvider";
import { getBookingsByUser, updateBookingStatus } from "@/actions/booking";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { ClipboardList, ArrowRightLeft, Package } from "lucide-react";
import { format } from "date-fns";
import type { BookingStatus } from "@/types";

const STATUS_VARIANTS: Record<string, "warning" | "success" | "info" | "danger" | "default"> = {
    pending: "warning",
    approved: "success",
    returned: "info",
    rejected: "danger",
};

export default function BookingsPage() {
    const { currentUser, loading: userLoading } = useUser();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [borrowed, setBorrowed] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [lent, setLent] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"borrowed" | "lent">("borrowed");

    useEffect(() => {
        async function load() {
            if (!currentUser) return;
            const data = await getBookingsByUser(currentUser._id);
            setBorrowed(data.borrowed);
            setLent(data.lent);
            setLoading(false);
        }
        load();
    }, [currentUser]);

    async function handleStatusUpdate(bookingId: string, status: BookingStatus) {
        const result = await updateBookingStatus(bookingId, status);
        if (result.success && currentUser) {
            // Refresh
            const data = await getBookingsByUser(currentUser._id);
            setBorrowed(data.borrowed);
            setLent(data.lent);
        }
    }

    if (userLoading || loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
            </div>
        );
    }

    const bookings = activeTab === "borrowed" ? borrowed : lent;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
                <p className="text-sm text-zinc-500">Manage your lending and borrowing activity</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
                <button
                    onClick={() => setActiveTab("borrowed")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${activeTab === "borrowed"
                        ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        }`}
                >
                    <ArrowRightLeft className="h-4 w-4" />
                    Borrowed ({borrowed.length})
                </button>
                <button
                    onClick={() => setActiveTab("lent")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${activeTab === "lent"
                        ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        }`}
                >
                    <Package className="h-4 w-4" />
                    Lent Out ({lent.length})
                </button>
            </div>

            {/* Bookings List */}
            {bookings.length > 0 ? (
                <div className="space-y-3">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {bookings.map((b: any) => (
                        <div
                            key={b._id}
                            className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                                    <Package className="h-6 w-6 text-zinc-400" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-semibold truncate">{b.item?.title || "Item"}</h3>
                                    <p className="text-sm text-zinc-500">
                                        {format(new Date(b.startDate), "MMM d")} — {format(new Date(b.endDate), "MMM d, yyyy")}
                                    </p>
                                    {activeTab === "borrowed" && b.item?.owner && (
                                        <p className="text-xs text-zinc-400">Owner: {b.item.owner.name}</p>
                                    )}
                                    {activeTab === "lent" && b.borrower && (
                                        <p className="text-xs text-zinc-400">Borrower: {b.borrower.name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Badge variant={STATUS_VARIANTS[b.status] || "default"}>
                                    {b.status}
                                </Badge>

                                {/* Action buttons — only for lender */}
                                {activeTab === "lent" && b.status === "pending" && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="primary"
                                            onClick={() => handleStatusUpdate(b._id, "approved")}
                                            className="text-xs px-3 py-1.5"
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleStatusUpdate(b._id, "rejected")}
                                            className="text-xs px-3 py-1.5"
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                )}
                                {activeTab === "lent" && b.status === "approved" && (
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleStatusUpdate(b._id, "returned")}
                                        className="text-xs px-3 py-1.5"
                                    >
                                        Mark Returned
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 py-16 dark:border-zinc-800">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <ClipboardList className="h-7 w-7 text-zinc-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                        No {activeTab} items yet
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">
                        {activeTab === "borrowed"
                            ? "Browse items and send a borrow request!"
                            : "List an item and wait for requests."}
                    </p>
                </div>
            )}
        </div>
    );
}
