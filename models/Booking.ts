import mongoose, { Schema, models } from "mongoose";
import type { IBooking } from "@/types";

const BookingSchema = new Schema<IBooking>(
    {
        item: {
            type: Schema.Types.ObjectId,
            ref: "Item",
            required: [true, "Item is required"],
        },
        borrower: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Borrower is required"],
        },
        startDate: {
            type: Date,
            required: [true, "Start date is required"],
        },
        endDate: {
            type: Date,
            required: [true, "End date is required"],
        },
        status: {
            type: String,
            enum: ["pending", "approved", "returned"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Booking =
    models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
export default Booking;
