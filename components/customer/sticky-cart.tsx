"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";

export function StickyCart({
  quantity,
  totalPrice,
  disabled
}: {
  quantity: number;
  totalPrice: number;
  disabled: boolean;
}) {
  if (quantity === 0) {
    return null;
  }

  if (disabled) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-20 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] safe-bottom">
        <div className="mx-auto max-w-xl rounded-lg bg-gray-300 px-4 py-4 text-center font-extrabold text-gray-700">
          Ordering stopped
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] safe-bottom">
      <Link
        href="/checkout"
        className="mx-auto flex min-h-14 max-w-xl items-center justify-center gap-2 rounded-lg bg-red-700 px-5 text-lg font-extrabold text-white active:bg-red-800"
      >
        <ShoppingBag size={22} aria-hidden />
        View Cart ({quantity}) - {formatCurrency(totalPrice)}
      </Link>
    </div>
  );
}
