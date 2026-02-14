"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Item from "@/models/Item";
import type { BookingStatus } from "@/types";

// ─── Create Booking ─────────────────────────────────────
export async function createBooking(formData: FormData) {
    try {
        await connectDB();

        const itemId = formData.get("itemId") as string | null;
        const borrower = formData.get("borrower") as string | null;
        const startDate = formData.get("startDate") as string | null;
        const endDate = formData.get("endDate") as string | null;

        if (!itemId || !borrower || !startDate || !endDate) {
            return { success: false, error: "Missing required booking fields" };
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end <= start) {
            return { success: false, error: "End date must be after start date" };
        }

        // Check the item exists and is available
        const item = await Item.findById(itemId);
        if (!item) return { success: false, error: "Item not found" };
        if (!item.available) return { success: false, error: "Item is not available" };

        // Prevent owner from borrowing their own item
        if (item.owner.toString() === borrower) {
            return { success: false, error: "You cannot borrow your own item" };
        }

        await Booking.create({
            item: itemId,
            borrower,
            startDate: start,
            endDate: end,
            status: "pending",
        });

        // Mark item as unavailable
        await Item.findByIdAndUpdate(itemId, { available: false });

        revalidatePath("/");
        revalidatePath("/bookings");
        return { success: true };
    } catch (error) {
        console.error("createBooking error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create booking",
        };
    }
}

// ─── Update Booking Status ──────────────────────────────
export async function updateBookingStatus(
    bookingId: string,
    status: BookingStatus
) {
    try {
        await connectDB();

        const booking = await Booking.findById(bookingId);
        if (!booking) return { success: false, error: "Booking not found" };

        booking.status = status;
        await booking.save();

        // If returned, make the item available again
        if (status === "returned") {
            await Item.findByIdAndUpdate(booking.item, { available: true });
        }

        revalidatePath("/");
        revalidatePath("/bookings");
        return { success: true };
    } catch (error) {
        console.error("updateBookingStatus error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update booking",
        };
    }
}

// ─── Get Bookings for a User ────────────────────────────
export async function getBookingsByUser(userId: string) {
    try {
        await connectDB();

        // Bookings where user is the borrower
        const borrowedBookings = await Booking.find({ borrower: userId })
            .populate({
                path: "item",
                populate: { path: "owner", select: "name email" },
            })
            .sort({ createdAt: -1 })
            .lean();

        // Bookings where user owns the item (lent out)
        const items = await Item.find({ owner: userId }).select("_id");
        const itemIds = items.map((i) => i._id);

        const lentBookings = await Booking.find({ item: { $in: itemIds } })
            .populate("item")
            .populate("borrower", "name email")
            .sort({ createdAt: -1 })
            .lean();

        return {
            borrowed: JSON.parse(JSON.stringify(borrowedBookings)),
            lent: JSON.parse(JSON.stringify(lentBookings)),
        };
    } catch (error) {
        console.error("getBookingsByUser error:", error);
        return { borrowed: [], lent: [] };
    }
}
