"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MenuItem } from "@/types/menu";
import { formatCurrency } from "@/utils/format-currency";

export function MenuItemCard({
  item,
  quantity,
  disabled,
  onChangeQuantity
}: {
  item: MenuItem;
  quantity: number;
  disabled: boolean;
  onChangeQuantity: (quantity: number) => void;
}) {
  const imageUrl = item.image_url || "/roast-biryani.png";

  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-orange-100">
      <div className="relative aspect-[4/3] w-full bg-orange-50">
        <Image
          src={imageUrl}
          alt={item.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 480px"
          className="object-cover"
        />
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-gray-950">{item.name}</h2>
            <p className="mt-1 text-lg font-bold text-red-700">
              {formatCurrency(item.price)}
            </p>
          </div>
          <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-bold text-green-700">
            COD
          </span>
        </div>

        {quantity === 0 ? (
          <Button
            className="w-full"
            disabled={disabled}
            onClick={() => onChangeQuantity(1)}
          >
            <Plus size={20} aria-hidden />
            Add
          </Button>
        ) : (
          <div className="grid grid-cols-[56px_1fr_56px] items-center gap-3">
            <Button
              aria-label="Decrease quantity"
              className="px-0"
              variant="secondary"
              onClick={() => onChangeQuantity(quantity - 1)}
            >
              <Minus size={22} aria-hidden />
            </Button>
            <div className="min-h-12 rounded-lg bg-orange-50 px-3 py-3 text-center text-xl font-extrabold text-gray-950">
              {quantity}
            </div>
            <Button
              aria-label="Increase quantity"
              className="px-0"
              disabled={disabled}
              onClick={() => onChangeQuantity(quantity + 1)}
            >
              <Plus size={22} aria-hidden />
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
