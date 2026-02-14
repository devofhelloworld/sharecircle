"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useUser } from "@/components/UserProvider";
import {
  CircleDot,
  Plus,
  ClipboardList,
  LogIn,
  LogOut,
  User,
  Info,
  BarChart,
  HelpCircle,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/#about", label: "About", icon: Info },
  { href: "/#impact", label: "Impact", icon: BarChart },
  { href: "/#faqs", label: "FAQs", icon: HelpCircle },
  { href: "/browse", label: "Browse", icon: CircleDot },
  { href: "/items/new", label: "List Item", icon: Plus },
  { href: "/bookings", label: "Bookings", icon: ClipboardList },
];

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, loading } = useUser();

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/75 shadow-sm shadow-zinc-200/20 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/75 dark:shadow-zinc-900/20">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 p-1 ring-1 ring-teal-200/50 transition-shadow group-hover:ring-teal-300/70 dark:from-teal-950/50 dark:to-emerald-950/50 dark:ring-teal-800/50">
            <Image
              src="/logo.png"
              alt="ShareCircle Logo"
              width={28}
              height={28}
              className="rounded-lg object-contain"
            />
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-teal-700 dark:text-teal-400">Share</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              Circle
            </span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden items-center gap-0.5 rounded-xl bg-zinc-100/60 p-1 dark:bg-zinc-800/40 md:flex">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-white text-teal-700 shadow-sm ring-1 ring-zinc-200/70 dark:bg-zinc-800 dark:text-teal-400 dark:ring-zinc-700/70"
                    : "text-zinc-500 hover:bg-white/60 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200",
                )}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5",
                    isActive
                      ? "text-teal-600 dark:text-teal-400"
                      : "text-zinc-400 dark:text-zinc-500",
                  )}
                />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="hidden space-y-1.5 sm:block">
                <div className="h-3 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-2.5 w-12 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/60" />
              </div>
            </div>
          ) : currentUser ? (
            <>
              {/* User info */}
              <div className="hidden items-center gap-2.5 rounded-xl bg-zinc-50 px-3 py-1.5 ring-1 ring-zinc-200/60 dark:bg-zinc-900 dark:ring-zinc-800/60 sm:flex">
                <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-sm font-semibold text-white shadow-sm ring-2 ring-white dark:ring-zinc-900">
                  {currentUser.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentUser.image}
                      alt={currentUser.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    currentUser.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="text-sm leading-tight">
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    <span className="font-medium text-teal-600 dark:text-teal-400">
                      {currentUser.credits}
                    </span>{" "}
                    credits
                  </p>
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-600 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition-all hover:from-teal-700 hover:to-emerald-700 hover:shadow-lg hover:shadow-teal-600/30 active:scale-[0.97]"
              >
                <User className="h-3.5 w-3.5" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="flex items-center justify-around border-t border-zinc-100/80 bg-white/50 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/50 sm:hidden">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-2 py-2 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-teal-600 dark:text-teal-400"
                  : "text-zinc-400 active:text-zinc-600 dark:text-zinc-500 dark:active:text-zinc-300",
              )}
            >
              {isActive && (
                <span className="absolute -top-px left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-teal-600 dark:bg-teal-400" />
              )}
              <Icon
                className={cn(
                  "h-[18px] w-[18px]",
                  isActive && "drop-shadow-sm",
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
