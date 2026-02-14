"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";

export async function createReview(formData: FormData) {
    try {
        await connectDB();

        const itemId = formData.get("itemId") as string | null;
        const reviewer = formData.get("reviewer") as string | null;
        const rating = formData.get("rating") as string | null;
        const comment = (formData.get("comment") as string) || "";

        if (!itemId || !reviewer || !rating) {
            return { success: false, error: "Missing required fields" };
        }

        const parsedRating = parseInt(rating, 10);
        if (parsedRating < 1 || parsedRating > 5) {
            return { success: false, error: "Rating must be between 1 and 5" };
        }

        await Review.create({
            item: itemId,
            reviewer,
            rating: parsedRating,
            comment: comment.trim(),
        });

        revalidatePath(`/items/${itemId}`);
        return { success: true };
    } catch (error) {
        console.error("createReview error:", error);
        // Handle duplicate review
        if (
            error instanceof Error &&
            error.message.includes("duplicate key")
        ) {
            return { success: false, error: "You already reviewed this item" };
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create review",
        };
    }
}

export async function getReviewsByItem(itemId: string) {
    try {
        await connectDB();
        const reviews = await Review.find({ item: itemId })
            .populate("reviewer", "name image")
            .sort({ createdAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(reviews));
    } catch (error) {
        console.error("getReviewsByItem error:", error);
        return [];
    }
}
