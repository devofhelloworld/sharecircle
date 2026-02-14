import mongoose from "mongoose";
import "@/types";

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_ATLAS_URI;

if (!MONGODB_URI) {
  throw new Error(
    "⚠️  Please define MONGODB_URI (or MONGODB_ATLAS_URI) in .env",
  );
}

/**
 * Global cache to prevent multiple connections during Next.js hot-reloads.
 * In production there is no hot-reload, so this simply keeps one connection alive.
 */
const cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
