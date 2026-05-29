"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RestaurantStatus } from "@/types/restaurant";

const statuses: { label: string; value: RestaurantStatus }[] = [
  { label: "Open", value: "OPEN" },
  { label: "Closed", value: "CLOSED" },
  { label: "Sold Out", value: "SOLD_OUT" }
];

export function StatusControls({
  status,
  loading,
  onChange
}: {
  status: RestaurantStatus;
  loading: boolean;
  onChange: (status: RestaurantStatus) => void;
}) {
  return (
    <section className="rounded-lg bg-white p-4 ring-1 ring-orange-100">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-gray-950">Restaurant status</h2>
        {loading ? <Loader2 className="animate-spin text-gray-500" /> : null}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {statuses.map((item) => (
          <Button
            key={item.value}
            className="px-2 text-sm"
            variant={status === item.value ? "primary" : "secondary"}
            disabled={loading}
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
