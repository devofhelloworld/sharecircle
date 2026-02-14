import { getItems } from "@/actions/item";
import ItemCard from "@/components/ui/ItemCard";
import { Search, Sparkles } from "lucide-react";

const CATEGORIES = ["All", "Tools", "Electronics", "Kitchen", "Garden", "Sports", "Books", "Other"];

interface HomeProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const activeCategory = params.category || "All";
  const searchQuery = params.search || "";
  const items = await getItems(activeCategory, searchQuery);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 px-6 py-12 text-white sm:px-12 sm:py-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium text-teal-200">Community Sharing Platform</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Borrow from neighbors,<br />
            <span className="text-teal-200">not from stores.</span>
          </h1>
          <p className="max-w-lg text-teal-100">
            ShareCircle connects you with neighbors who have the tools and equipment you need.
            Save money, reduce waste, build community.
          </p>
        </div>
      </section>

      {/* Search + Filter */}
      <div className="space-y-4">
        <form className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            name="search"
            defaultValue={searchQuery}
            placeholder="Search items..."
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          {activeCategory !== "All" && (
            <input type="hidden" name="category" value={activeCategory} />
          )}
        </form>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href={`/?category=${cat}${searchQuery ? `&search=${searchQuery}` : ""}`}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${activeCategory === cat
                ? "bg-teal-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                }`}
            >
              {cat}
            </a>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {items.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {items.map((item: any) => (
            <ItemCard
              key={item._id}
              id={item._id}
              title={item.title}
              description={item.description}
              price={item.price}
              category={item.category}
              images={item.images}
              available={item.available}
              ownerName={item.owner?.name}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 py-16 dark:border-zinc-800">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <Search className="h-7 w-7 text-zinc-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            No items yet
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Be the first to list an item for your community!
          </p>
        </div>
      )}
    </div>
  );
}
