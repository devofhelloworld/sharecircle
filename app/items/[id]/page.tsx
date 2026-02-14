"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/components/UserProvider";
import { getItemById } from "@/actions/item";
import { createBooking } from "@/actions/booking";
import { createReview, getReviewsByItem } from "@/actions/review";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
    ArrowLeft,
    Package,
    Calendar,
    User,
    CreditCard,
    CheckCircle2,
    Star,
    MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function ItemDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { currentUser } = useUser();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [item, setItem] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Review form state
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState("");
    const [reviewSuccess, setReviewSuccess] = useState(false);

    useEffect(() => {
        async function load() {
            const [data, revs] = await Promise.all([
                getItemById(params.id as string),
                getReviewsByItem(params.id as string),
            ]);
            setItem(data);
            setReviews(revs);
            setLoading(false);
        }
        load();
    }, [params.id]);

    async function handleBooking(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!currentUser) return;

        setBooking(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        formData.set("itemId", params.id as string);
        formData.set("borrower", currentUser._id);

        const result = await createBooking(formData);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => router.push("/bookings"), 1500);
        } else {
            setError(result.error || "Failed to create booking");
            setBooking(false);
        }
    }

    async function handleReview(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!currentUser) return;

        setReviewLoading(true);
        setReviewError("");

        const formData = new FormData();
        formData.set("itemId", params.id as string);
        formData.set("reviewer", currentUser._id);
        formData.set("rating", reviewRating.toString());
        formData.set("comment", reviewComment);

        const result = await createReview(formData);

        if (result.success) {
            setReviewSuccess(true);
            const revs = await getReviewsByItem(params.id as string);
            setReviews(revs);
            setReviewComment("");
        } else {
            setReviewError(result.error || "Failed to post review");
        }
        setReviewLoading(false);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <h2 className="text-xl font-semibold">Item not found</h2>
                <Link href="/">
                    <Button variant="secondary">Back to Browse</Button>
                </Link>
            </div>
        );
    }

    const isOwner = currentUser?._id === item.owner?._id;
    const avgRating =
        reviews.length > 0
            ? (reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : null;

    return (
        <div className="space-y-8">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-300"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Browse
            </Link>

            <div className="grid gap-8 lg:grid-cols-5">
                {/* Image */}
                <div className="lg:col-span-3">
                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                        {item.images?.length > 0 ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={item.images[0]}
                                alt={item.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <Package className="h-20 w-20 text-zinc-300" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Details + Booking */}
                <div className="space-y-6 lg:col-span-2">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Badge variant="info">{item.category}</Badge>
                            <Badge variant={item.available ? "success" : "danger"}>
                                {item.available ? "Available" : "Borrowed"}
                            </Badge>
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight">{item.title}</h1>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-2xl font-bold text-orange-500">
                                <CreditCard className="h-5 w-5" />
                                {item.price === 0 ? "Free" : `${item.price} credits/day`}
                            </div>
                            {avgRating && (
                                <div className="flex items-center gap-1 text-sm text-amber-500">
                                    <Star className="h-4 w-4 fill-amber-500" />
                                    <span className="font-medium">{avgRating}</span>
                                    <span className="text-zinc-400">({reviews.length})</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {item.description}
                    </p>

                    {/* Owner info */}
                    <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/40">
                            <User className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">{item.owner?.name}</p>
                            <p className="text-xs text-zinc-500">{item.owner?.email}</p>
                        </div>
                    </div>

                    {/* Booking Form */}
                    {success ? (
                        <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                            <CheckCircle2 className="h-5 w-5 shrink-0" />
                            <span className="text-sm font-medium">
                                Booking request sent! Redirecting...
                            </span>
                        </div>
                    ) : item.available && !isOwner ? (
                        <form
                            onSubmit={handleBooking}
                            className="space-y-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                        >
                            <h3 className="flex items-center gap-2 font-semibold">
                                <Calendar className="h-4 w-4" />
                                Request to Borrow
                            </h3>

                            {error && (
                                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-zinc-500">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        required
                                        min={new Date().toISOString().split("T")[0]}
                                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-zinc-500">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        required
                                        min={new Date().toISOString().split("T")[0]}
                                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                    />
                                </div>
                            </div>

                            <Button type="submit" loading={booking} className="w-full">
                                Send Borrow Request
                            </Button>
                        </form>
                    ) : isOwner ? (
                        <div className="rounded-lg bg-zinc-50 p-4 text-center text-sm text-zinc-500 dark:bg-zinc-800/50">
                            This is your item
                        </div>
                    ) : (
                        <div className="rounded-lg bg-amber-50 p-4 text-center text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                            This item is currently borrowed
                        </div>
                    )}
                </div>
            </div>

            {/* ─── Reviews Section ───────────────────────────────── */}
            <section className="space-y-6 border-t border-zinc-200 pt-8 dark:border-zinc-800">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                    <MessageSquare className="h-5 w-5" />
                    Reviews
                    {reviews.length > 0 && (
                        <span className="text-sm font-normal text-zinc-400">
                            ({reviews.length})
                        </span>
                    )}
                </h2>

                {/* Review Form */}
                {!isOwner && !reviewSuccess && (
                    <form
                        onSubmit={handleReview}
                        className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                    >
                        <h3 className="text-sm font-semibold">Leave a Review</h3>

                        {reviewError && (
                            <p className="text-sm text-red-600">{reviewError}</p>
                        )}

                        {/* Star selector */}
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setReviewRating(star)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`h-6 w-6 ${star <= reviewRating
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-zinc-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={2}
                            placeholder="Share your experience..."
                            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 resize-none"
                        />

                        <Button type="submit" loading={reviewLoading} className="text-sm">
                            Post Review
                        </Button>
                    </form>
                )}

                {reviewSuccess && (
                    <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Review posted!
                    </div>
                )}

                {/* Reviews List */}
                {reviews.length > 0 ? (
                    <div className="space-y-4">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {reviews.map((review: any) => (
                            <div
                                key={review._id}
                                className="rounded-lg border border-zinc-100 p-4 dark:border-zinc-800"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                            <User className="h-4 w-4 text-zinc-500" />
                                        </div>
                                        <span className="text-sm font-medium">
                                            {review.reviewer?.name || "Anonymous"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-3.5 w-3.5 ${i < review.rating
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-zinc-200"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                        {review.comment}
                                    </p>
                                )}
                                <p className="mt-2 text-xs text-zinc-400">
                                    {format(new Date(review.createdAt), "MMM d, yyyy")}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-zinc-400">No reviews yet.</p>
                )}
            </section>
        </div>
    );
}
