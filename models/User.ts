import mongoose, { Schema, models } from "mongoose";
import type { IUser } from "@/types";

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            select: false, // Don't return password by default in queries
        },
        image: {
            type: String,
            default: "",
        },
        credits: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const User = models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
