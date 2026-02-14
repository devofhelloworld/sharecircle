"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { createReview } from "@/actions/review";

interface ReviewModalProps {
    itemId: string;
    itemTitle: string;
    userId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ReviewModal({
    itemId,
    itemTitle,
    userId,
    onClose,
    onSuccess,
}: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hoveredRating, setHoveredRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        setSubmitting(true);
        setError("");

        const formData = new FormData();
        formData.append("itemId", itemId);
        formData.append("reviewer", userId);
        formData.append("rating", rating.toString());
        formData.append("comment", comment);

        try {
            const result = await createReview(formData);
            if (result.success) {
                onSuccess();
                onClose();
            } else {
                setError(result.error || "Failed to submit review");
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl dark:bg-zinc-900 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                        Review Item
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-zinc-500 hover:bg-zinc-100 rounded-full transition-colors dark:hover:bg-zinc-800"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            How was your experience with:
                        </p>
                        <p className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                            {itemTitle}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Rating
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= (hoveredRating || rating)
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-zinc-300 dark:text-zinc-700"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="comment"
                            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                        >
                            Comment (Optional)
                        </label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 transition-all outline-none resize-none"
                            placeholder="Share your experience..."
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                            {error}
                        </p>
                    )}

                    <div className="flex gap-3 justify-end pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" loading={submitting}>
                            Submit Review
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
