"use client";

import Link from "next/link";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Browse", icon: CircleDot },
  { href: "/items/new", label: "List Item", icon: Plus },
  { href: "/bookings", label: "Bookings", icon: ClipboardList },
];

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, loading } = useUser();

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white">
            <CircleDot className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-teal-700">Share</span>
            <span className="text-emerald-600">Circle</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          ) : currentUser ? (
            <>
              {/* User info */}
              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white font-semibold text-sm">
                  {currentUser.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentUser.image}
                      alt={currentUser.name}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    currentUser.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="text-sm">
                  <p className="font-medium leading-none">{currentUser.name}</p>
                  <p className="text-xs text-zinc-400">
                    {currentUser.credits} credits
                  </p>
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
              >
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="flex items-center justify-around border-t border-zinc-100 py-1 sm:hidden dark:border-zinc-800">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs font-medium transition-colors",
                isActive ? "text-teal-600" : "text-zinc-500 dark:text-zinc-400",
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
