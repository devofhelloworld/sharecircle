import { getUserProfile } from "@/actions/profile";
import { getUserReviews } from "@/actions/user-review";
import Image from "next/image";
import StarRating from "@/components/ui/StarRating";
import { notFound } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const profileData = await getUserProfile(params.id);

  if (!profileData) {
    notFound();
  }

  const { user, stats } = profileData;
  const { reviews, averageRating, totalReviews } = await getUserReviews(
    params.id,
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10 bg-white p-6 rounded-2xl shadow-sm border">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100">
          <Image
            src={user.image || `https://ui-avatars.com/api/?name=${user.name}`}
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500 mb-2">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
            <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
              <StarRating rating={Number(averageRating)} readonly />
              <span className="ml-2 font-semibold text-yellow-700">
                {averageRating}
              </span>
              <span className="ml-1 text-gray-400 text-sm">
                ({totalReviews} reviews)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t pt-4">
            <div className="text-center md:text-left">
              <span className="block font-bold text-xl text-blue-600">
                {stats.itemsCount}
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                Items Listed
              </span>
            </div>
            <div className="text-center md:text-left">
              <span className="block font-bold text-xl text-green-600">
                {stats.lendingCount}
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                Lent
              </span>
            </div>
            <div className="text-center md:text-left">
              <span className="block font-bold text-xl text-purple-600">
                {stats.borrowingCount}
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                Borrowed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-6">Reviews from Lenders</h2>

        {reviews.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-xl text-center text-gray-500">
            No reviews yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {reviews.map((review: any) => (
              <div
                key={review._id}
                className="bg-white p-4 rounded-xl border shadow-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={
                          review.reviewer?.image ||
                          `https://ui-avatars.com/api/?name=${review.reviewer?.name || "User"}`
                        }
                        alt={review.reviewer?.name || "Reviewer"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {review.reviewer?.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} readonly />
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
