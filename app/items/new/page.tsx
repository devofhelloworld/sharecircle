"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/UserProvider";
import { createItem } from "@/actions/item";
import Button from "@/components/ui/Button";
import { ArrowLeft, ImagePlus } from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["Tools", "Electronics", "Kitchen", "Garden", "Sports", "Books", "Other"];

export default function NewItemPage() {
    const router = useRouter();
    const { currentUser } = useUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!currentUser) return;

        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        formData.set("owner", currentUser._id);

        const result = await createItem(formData);

        if (result.success) {
            router.push("/");
        } else {
            setError(result.error || "Something went wrong");
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    href="/"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">List an Item</h1>
                    <p className="text-sm text-zinc-500">Share something with your community</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                        {error}
                    </div>
                )}

                <div className="space-y-1.5">
                    <label htmlFor="title" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Title
                    </label>
                    <input
                        id="title"
                        name="title"
                        required
                        placeholder="e.g. Power Drill, Stand Mixer..."
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="description" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        required
                        rows={4}
                        placeholder="Describe the item, its condition, and any usage notes..."
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 resize-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label htmlFor="price" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Price (credits/day)
                        </label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            min="0"
                            required
                            placeholder="0 for free"
                            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="category" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            required
                            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                        >
                            <option value="">Select...</option>
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="images" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Image URL (optional)
                    </label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <ImagePlus className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            <input
                                id="images"
                                name="images"
                                type="url"
                                placeholder="https://example.com/photo.jpg"
                                className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <Button type="submit" loading={loading} className="flex-1">
                        List Item
                    </Button>
                    <Link href="/">
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
