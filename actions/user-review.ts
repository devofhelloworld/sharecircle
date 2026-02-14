"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import UserReview from "@/models/UserReview";
import Booking from "@/models/Booking";
import { auth } from "@/auth";

export async function submitUserReview(formData: FormData) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { success: false, error: "Unauthorized" };
    }
    const reviewerId = session.user.id;
    const targetUserId = formData.get("targetUserId") as string; // The borrower
    const bookingId = formData.get("bookingId") as string;
    const rating = parseInt(formData.get("rating") as string);
    const comment = formData.get("comment") as string;

    if (!reviewerId || !targetUserId || !bookingId || !rating) {
      return { success: false, error: "Missing required fields" };
    }

    await connectDB();

    // Verify that the booking exists and the reviewer is indeed the owner of the item (Lender)
    // or ensure that the reviewer is part of this transaction.
    // The prompt specifically asks for "lenders can also rate and review borrowers".
    const booking = await Booking.findById(bookingId).populate("item");

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    // Ensure the current user is the owner of the item involved in the booking
    // booking.item is populated, so we check item.owner
    // However, population might return an object. We need to handle type safety if possible or trust mongoose.

    // Since we didn't populate in the findById call above (I'll fix that), let's fetch it properly.
    // Actually I can just check if I am the item owner.
    // But wait, `Booking` model has `item` as ObjectId by default.
    // Let's populate 'item' to get the owner.

    // Re-fetch with populate
    const fullBooking = await Booking.findById(bookingId).populate<{
      item: unknown;
    }>("item");

    if (!fullBooking) {
      return { success: false, error: "Booking not found" };
    }

    // Check if the current user is the owner of the item
    if (fullBooking.item.owner.toString() !== reviewerId) {
      return {
        success: false,
        error: "You are not authorized to review this transaction",
      };
    }

    // Check if status is returned
    if (fullBooking.status !== "returned") {
      return {
        success: false,
        error: "Can only review after item is returned",
      };
    }

    // Create the review
    await UserReview.create({
      reviewer: reviewerId,
      targetUser: targetUserId,
      booking: bookingId,
      rating,
      comment,
    });

    // Revalidate the history page
    revalidatePath("/history");

    return { success: true };
  } catch (error) {
    console.error("Error submitting user review:", error);
    return { success: false, error: "Failed to submit review" };
  }
}

export async function getUserReviews(userId: string) {
  try {
    await connectDB();
    const reviews = await UserReview.find({ targetUser: userId })
      .populate("reviewer", "name image")
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating =
      reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    return {
      reviews: JSON.parse(JSON.stringify(reviews)),
      averageRating,
      totalReviews: reviews.length,
    };
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return { reviews: [], averageRating: 0, totalReviews: 0 };
  }
}
