"use client";

import { useEffect, useState } from "react";
import { getUserHistory } from "@/actions/profile";
import Image from "next/image";
import Link from "next/link";
import UserReviewModal from "@/components/UserReviewModal";
import Button from "@/components/ui/Button";

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<"borrowed" | "lent">("borrowed");
  const [history, setHistory] = useState<{
    borrowed: any[];
    lent: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // For review modal
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    bookingId: "",
    targetUserId: "",
    targetUserName: "",
  });

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getUserHistory();
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading history...</div>;
  if (!history)
    return (
      <div className="p-8 text-center">Please log in to view history.</div>
    );

  const openReviewModal = (booking: any) => {
    setReviewModal({
      isOpen: true,
      bookingId: booking._id,
      targetUserId: booking.borrower._id,
      targetUserName: booking.borrower.name,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My History</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-6 py-3 font-medium ${activeTab === "borrowed" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("borrowed")}
        >
          Borrowed Items
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === "lent" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("lent")}
        >
          Lent Items
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {activeTab === "borrowed" ? (
          history.borrowed.length === 0 ? (
            <p className="text-gray-500">
              You haven&apos;t borrowed any items yet.
            </p>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            history.borrowed.map((booking: any) => (
              <div
                key={booking._id}
                className="bg-white p-4 rounded-xl border flex flex-col md:flex-row gap-4 items-start md:items-center"
              >
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {booking.item.images?.[0] && (
                    <Image
                      src={booking.item.images[0]}
                      alt={booking.item.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{booking.item.title}</h3>
                  <p className="text-sm text-gray-500">
                    Owner:{" "}
                    <Link
                      href={`/profile/${booking.item.owner._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {booking.item.owner.name}
                    </Link>
                  </p>
                  <div className="flex gap-2 text-xs mt-1 text-gray-500">
                    <span>
                      From: {new Date(booking.startDate).toLocaleDateString()}
                    </span>
                    <span>
                      To: {new Date(booking.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-medium">
                    Total: ${booking.totalPrice}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      booking.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "returned"
                          ? "bg-blue-100 text-blue-700"
                          : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))
          )
        ) : history.lent.length === 0 ? (
          <p className="text-gray-500">You haven&apos;t lent any items yet.</p>
        ) : (
          history.lent.map((booking) => (
            <div
              key={booking._id}
              className="bg-white p-4 rounded-xl border flex flex-col md:flex-row gap-4 items-start md:items-center"
            >
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {booking.item.images?.[0] && (
                  <Image
                    src={booking.item.images[0]}
                    alt={booking.item.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{booking.item.title}</h3>
                <p className="text-sm text-gray-500">
                  Borrowed by:{" "}
                  <Link
                    href={`/profile/${booking.borrower._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {booking.borrower.name}
                  </Link>
                </p>
                <div className="flex gap-2 text-xs mt-1 text-gray-500">
                  <span>
                    From: {new Date(booking.startDate).toLocaleDateString()}
                  </span>
                  <span>
                    To: {new Date(booking.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    booking.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "returned"
                        ? "bg-blue-100 text-blue-700"
                        : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                  }`}
                >
                  {booking.status}
                </span>

                {booking.status === "returned" && (
                  <Button size="sm" onClick={() => openReviewModal(booking)}>
                    Rate Borrower
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <UserReviewModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal((curr) => ({ ...curr, isOpen: false }))}
        bookingId={reviewModal.bookingId}
        targetUserId={reviewModal.targetUserId}
        targetUserName={reviewModal.targetUserName}
      />
    </div>
  );
}
