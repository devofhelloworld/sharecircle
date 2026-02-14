"use server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";

const DEMO_USERS = [
    {
        name: "Alice Johnson",
        email: "alice@sharecircle.dev",
        image: "",
        credits: 50,
    },
    {
        name: "Bob Smith",
        email: "bob@sharecircle.dev",
        image: "",
        credits: 50,
    },
    {
        name: "Carol Lee",
        email: "carol@sharecircle.dev",
        image: "",
        credits: 50,
    },
];

/**
 * Seed demo users if none exist. Safe to call multiple times.
 */
export async function seedDemoUsers() {
    try {
        await connectDB();
        const count = await User.countDocuments();
        if (count === 0) {
            await User.insertMany(DEMO_USERS);
        }
        return { success: true };
    } catch (error) {
        console.error("seedDemoUsers error:", error);
        return { success: false };
    }
}

export async function getUsers() {
    try {
        await connectDB();
        const users = await User.find().sort({ name: 1 }).lean();
        return JSON.parse(JSON.stringify(users));
    } catch (error) {
        console.error("getUsers error:", error);
        return [];
    }
}

export async function getUserById(id: string) {
    try {
        await connectDB();
        const user = await User.findById(id).lean();
        if (!user) return null;
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error("getUserById error:", error);
        return null;
    }
}
