import mongoose, { Schema, models } from "mongoose";
import type { IReview } from "@/types";

const ReviewSchema = new Schema<IReview>(
    {
        item: {
            type: Schema.Types.ObjectId,
            ref: "Item",
            required: [true, "Item is required"],
        },
        reviewer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Reviewer is required"],
        },
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            default: "",
            trim: true,
        },
    },
    { timestamps: true }
);

// One review per user per item
ReviewSchema.index({ item: 1, reviewer: 1 }, { unique: true });

const Review = models.Review || mongoose.model<IReview>("Review", ReviewSchema);
export default Review;
