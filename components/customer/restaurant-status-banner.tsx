import type { RestaurantStatus } from "@/types/restaurant";

const statusText: Record<RestaurantStatus, string> = {
  OPEN: "Open now",
  CLOSED: "Closed",
  SOLD_OUT: "Sold out"
};

const statusStyle: Record<RestaurantStatus, string> = {
  OPEN: "bg-green-100 text-green-800 ring-green-200",
  CLOSED: "bg-gray-100 text-gray-700 ring-gray-200",
  SOLD_OUT: "bg-red-100 text-red-800 ring-red-200"
};

export function RestaurantStatusBanner({
  status,
  message
}: {
  status: RestaurantStatus;
  message?: string | null;
}) {
  return (
    <div
      className={`rounded-lg px-4 py-3 text-sm font-bold ring-1 ${statusStyle[status]}`}
    >
      <div>{statusText[status]}</div>
      {message ? <p className="mt-1 text-sm font-normal">{message}</p> : null}
    </div>
  );
}
