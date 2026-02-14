import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { Package } from "lucide-react";

interface ItemCardProps {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    available: boolean;
    ownerName?: string;
}

export default function ItemCard({
    id,
    title,
    description,
    price,
    category,
    images,
    available,
    ownerName,
}: ItemCardProps) {
    return (
        <Link
            href={`/items/${id}`}
            className="group block rounded-xl border border-zinc-200 bg-white transition-all hover:shadow-lg hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-900"
        >
            {/* Image / placeholder */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-zinc-100 dark:bg-zinc-800">
                {images.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={images[0]}
                        alt={title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Package className="h-12 w-12 text-zinc-400" />
                    </div>
                )}

                {/* Availability dot */}
                <div className="absolute right-3 top-3">
                    <span
                        className={`inline-block h-3 w-3 rounded-full ring-2 ring-white ${available ? "bg-emerald-500" : "bg-red-500"
                            }`}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-zinc-900 line-clamp-1 dark:text-zinc-100">
                        {title}
                    </h3>
                    <span className="shrink-0 font-bold text-orange-500">
                        {price === 0 ? "Free" : `${price} credits`}
                    </span>
                </div>

                <p className="text-sm text-zinc-500 line-clamp-2 dark:text-zinc-400">
                    {description}
                </p>

                <div className="flex items-center justify-between pt-1">
                    <Badge variant="info">{category}</Badge>
                    {ownerName && (
                        <span className="text-xs text-zinc-400">by {ownerName}</span>
                    )}
                </div>
            </div>
        </Link>
    );
}
