"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import Item from "@/models/Item";

// ─── Create ─────────────────────────────────────────────
export async function createItem(formData: FormData) {
    try {
        await connectDB();

        const title = formData.get("title") as string | null;
        const description = formData.get("description") as string | null;
        const price = formData.get("price") as string | null;
        const category = formData.get("category") as string | null;
        const owner = formData.get("owner") as string | null;
        const images = formData.getAll("images").filter(Boolean) as string[];

        if (!title || !description || !price || !category || !owner) {
            return {
                success: false,
                error: "Missing required fields: title, description, price, category, owner",
            };
        }

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            return { success: false, error: "Price must be a valid positive number" };
        }

        const item = await Item.create({
            title: title.trim(),
            description: description.trim(),
            price: parsedPrice,
            category: category.trim(),
            images,
            owner,
        });

        revalidatePath("/");
        return { success: true, itemId: item._id.toString() };
    } catch (error) {
        console.error("createItem error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create item",
        };
    }
}

// ─── Read (list) ────────────────────────────────────────
export async function getItems(category?: string, search?: string) {
    try {
        await connectDB();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filter: Record<string, any> = {};

        if (category && category !== "All") {
            filter.category = category;
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const items = await Item.find(filter)
            .populate("owner", "name email image")
            .sort({ createdAt: -1 })
            .lean();

        // Serialize MongoDB documents for client consumption
        return JSON.parse(JSON.stringify(items));
    } catch (error) {
        console.error("getItems error:", error);
        return [];
    }
}

// ─── Read (single) ──────────────────────────────────────
export async function getItemById(id: string) {
    try {
        await connectDB();

        const item = await Item.findById(id)
            .populate("owner", "name email image credits")
            .lean();

        if (!item) return null;
        return JSON.parse(JSON.stringify(item));
    } catch (error) {
        console.error("getItemById error:", error);
        return null;
    }
}

// ─── Delete ─────────────────────────────────────────────
export async function deleteItem(id: string) {
    try {
        await connectDB();
        await Item.findByIdAndDelete(id);
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("deleteItem error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete item",
        };
    }
}
