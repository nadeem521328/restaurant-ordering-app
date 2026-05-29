import type { RestaurantStatus } from "@/types/restaurant";

const statusText: Record<RestaurantStatus, string> = {
  OPEN: "Open now",
  CLOSED: "Closed",
  SOLD_OUT: "Sold out"
};

const defaultMessage: Record<RestaurantStatus, string> = {
  OPEN: "Fresh roast biryani available today",
  CLOSED: "We are currently closed. Please check back later.",
  SOLD_OUT: "All items sold out for today. Thank you!"
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
  const displayMessage = message || defaultMessage[status];

  return (
    <div
      className={`rounded-lg px-4 py-3 text-sm font-bold ring-1 ${statusStyle[status]}`}
    >
      <div>{statusText[status]}</div>
      <p className="mt-1 text-sm font-normal">{displayMessage}</p>
    </div>
  );
}
