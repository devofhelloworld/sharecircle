import mongoose, { Schema, models } from "mongoose";
import type { IItem } from "@/types";

const ItemSchema = new Schema<IItem>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price must be a positive number"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },
        images: {
            type: [String],
            default: [],
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Owner is required"],
        },
        available: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Item = models.Item || mongoose.model<IItem>("Item", ItemSchema);
export default Item;
