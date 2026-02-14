// app/page.tsx
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Leaf,
  Heart,
  ArrowRight,
  CheckCircle,
  Shield,
  MessageCircle,
  Clock,
  Headphones,
  Scale,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import FAQ from "@/components/ui/FAQ";

/* ─────────────────────── DATA ─────────────────────── */

const STATS = [
  { value: "2.5K+", label: "Active Members" },
  { value: "5.8K+", label: "Items Shared" },
  { value: "$120K", label: "Saved Together" },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Save Money",
    description:
      "Borrow instead of buy. Access tools and equipment at a fraction of the cost.",
    accent: {
      bg: "bg-teal-100 dark:bg-teal-950",
      text: "text-teal-600 dark:text-teal-400",
    },
  },
  {
    icon: Leaf,
    title: "Reduce Waste",
    description:
      "Keep items in use longer. Less consumption means less waste in landfills.",
    accent: {
      bg: "bg-emerald-100 dark:bg-emerald-950",
      text: "text-emerald-600 dark:text-emerald-400",
    },
  },
  {
    icon: Heart,
    title: "Build Community",
    description:
      "Connect with neighbors, create friendships, and strengthen your local community.",
    accent: {
      bg: "bg-rose-100 dark:bg-rose-950",
      text: "text-rose-600 dark:text-rose-400",
    },
  },
];

const STEPS = [
  {
    step: 1,
    title: "Create Your Profile",
    description:
      "Sign up and tell us about yourself. Build trust with a verified profile.",
  },
  {
    step: 2,
    title: "Browse or List",
    description:
      "Find items to borrow or list your own. Set your lending terms and prices.",
  },
  {
    step: 3,
    title: "Connect & Share",
    description:
      "Message neighbors, arrange pickups, and enjoy sharing resources.",
  },
];

const BENEFITS = [
  { icon: Shield, text: "Verified member profiles and reviews" },
  { icon: MessageCircle, text: "Secure messaging and payment options" },
  { icon: CheckCircle, text: "Item protection and insurance" },
  { icon: Headphones, text: "24/7 community support" },
  { icon: Scale, text: "Easy dispute resolution" },
  { icon: Calendar, text: "Flexible booking and cancellation" },
];

const FAQ_ITEMS = [
  {
    question: "How do I get started with ShareCircle?",
    answer:
      "Simply create an account, complete your profile, and you're ready to browse items or list your own. It takes less than 5 minutes to join our community!",
  },
  {
    question: "Is it safe to share items with strangers?",
    answer:
      "Yes! ShareCircle has built-in safety features including verified member profiles, community reviews, messaging, and optional insurance coverage for high-value items. We also have a dispute resolution system to ensure both parties are protected.",
  },
  {
    question: "How much does it cost to use ShareCircle?",
    answer:
      "Creating an account and browsing items is completely free. Lenders set their own prices, and ShareCircle charges a small service fee only when a booking is completed. We keep fees transparent with no hidden charges.",
  },
  {
    question: "What happens if a borrowed item gets damaged?",
    answer:
      "ShareCircle offers optional item protection insurance for valuable items. If an item is damaged, you can file a claim through our platform. The insurance covers accidental damage up to the item's declared value.",
  },
  {
    question: "How do I cancel a booking?",
    answer:
      "You can cancel a booking anytime before the rental period starts with a full refund. Cancellations made within 24 hours of the start date may be subject to a cancellation fee.",
  },
  {
    question: "Can I list items that I don't own?",
    answer:
      "No, you can only list items that you own. This helps maintain trust and safety in our community. All items should be in good condition and accurately described.",
  },
  {
    question: "How do payments work?",
    answer:
      "ShareCircle uses secure payment processing. Money is held in escrow until both the borrower receives the item and confirms satisfaction. Lenders receive payments after successful bookings.",
  },
  {
    question: "Can I earn money by lending items?",
    answer:
      "Absolutely! Many members use ShareCircle to earn extra income by renting out items they don't use frequently. You set your own rental prices and availability.",
  },
];

/* ─────────────────────── PAGE ─────────────────────── */

export default function Home() {
  return (
    <div className="space-y-24 pb-20">
      {/* ───── Hero ───── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 px-6 py-16 text-white sm:px-12 sm:py-24 lg:py-32">
        {/* decorative dots */}
        <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        {/* glow blobs */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 animate-pulse rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 animate-pulse rounded-full bg-teal-400/10 blur-3xl [animation-delay:2s]" />

        <div className="relative mx-auto max-w-4xl space-y-10">
          {/* badge */}
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-teal-100 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Welcome to ShareCircle
          </span>

          {/* headline */}
          <div className="space-y-5">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Borrow from neighbors,
              <br />
              <span className="bg-gradient-to-r from-teal-200 to-emerald-200 bg-clip-text text-transparent">
                not from stores.
              </span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-teal-50/90 sm:text-xl">
              ShareCircle connects you with neighbors who have the tools and
              equipment you need. Save money, reduce waste, and build a stronger
              community — all with a few clicks.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-teal-700 shadow-lg shadow-teal-900/20 transition-all hover:scale-[1.04] hover:shadow-xl active:scale-95"
            >
              <Sparkles className="h-5 w-5" />
              Start Browsing
            </Link>
            <Link
              href="/items/new"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/70 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              <Zap className="h-5 w-5" />
              List Your Item
            </Link>
          </div>

          {/* stats */}
          <div
            id="impact"
            className="grid scroll-mt-28 grid-cols-3 gap-6 border-t border-white/15 pt-10 sm:gap-12"
          >
            {STATS.map((s) => (
              <div key={s.label} className="space-y-1">
                <p className="text-2xl font-bold sm:text-3xl">{s.value}</p>
                <p className="text-sm text-teal-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Features ───── */}
      <section id="about" className="scroll-mt-28 space-y-14">
        <SectionHeading
          title="Why ShareCircle?"
          subtitle="We are making community sharing easier, safer, and more rewarding than ever."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-zinc-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${f.accent.bg} transition-transform duration-300 group-hover:scale-110`}
              >
                <f.icon className={`h-6 w-6 ${f.accent.text}`} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-zinc-900 dark:text-white">
                {f.title}
              </h3>
              <p className="mt-2 leading-relaxed text-zinc-600 dark:text-zinc-400">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── How It Works ───── */}
      <section className="space-y-14">
        <SectionHeading
          title="How It Works"
          subtitle="Getting started is simple. Just follow these three steps."
        />

        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.step} className="relative">
              <div className="group h-full rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 p-8 transition-all duration-300 hover:shadow-md dark:from-teal-950/40 dark:to-emerald-950/40">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-emerald-600 font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                  {s.step}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-zinc-900 dark:text-white">
                  {s.title}
                </h3>
                <p className="mt-2 leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {s.description}
                </p>
              </div>

              {i < STEPS.length - 1 && (
                <div className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 md:block">
                  <ArrowRight className="h-6 w-6 animate-pulse text-teal-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ───── Benefits / Trust ───── */}
      <section className="space-y-8 rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100/60 p-8 dark:from-zinc-900 dark:to-zinc-900/60 sm:p-12">
        <SectionHeading title="Trusted by Our Community" align="left" />

        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <div key={b.text} className="flex items-start gap-3">
              <b.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-600 dark:text-teal-400" />
              <p className="text-lg leading-snug text-zinc-700 dark:text-zinc-300">
                {b.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section id="faqs" className="scroll-mt-28 space-y-14">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about ShareCircle and how it works."
        />

        <div className="mx-auto max-w-3xl">
          <FAQ items={FAQ_ITEMS} />
        </div>
      </section>

      {/* ───── Final CTA ───── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 px-6 py-14 text-center text-white sm:px-12 sm:py-20">
        {/* glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-2xl space-y-8">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to Join ShareCircle?
          </h2>
          <p className="text-lg leading-relaxed text-emerald-50">
            Start sharing today and be part of a community that values
            sustainability, savings, and solidarity.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 font-semibold text-emerald-700 shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.04] hover:shadow-xl active:scale-95"
            >
              Explore Items Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/items/new"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/70 px-8 py-3.5 font-semibold backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              <Sparkles className="h-5 w-5" />
              List Your First Item
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────────────── INLINE COMPONENTS ─────────────── */

function SectionHeading({
  title,
  subtitle,
  align = "center",
}: {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  const alignment = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`space-y-3 ${alignment}`}>
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-lg text-zinc-600 dark:text-zinc-400 ${
            align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
