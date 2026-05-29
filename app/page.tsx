import { CustomerHome } from "@/components/customer/customer-home";
import { getAvailableMenuItems } from "@/services/menu-service";
import { getRestaurantStatus } from "@/services/restaurant-service";
import type { MenuItem } from "@/types/menu";
import type { RestaurantStatusRow } from "@/types/restaurant";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const restaurantName =
    process.env.NEXT_PUBLIC_RESTAURANT_NAME ?? "Roast Biryani House";
  let menuItems: MenuItem[] = [];
  let restaurant: RestaurantStatusRow | null = null;
  let setupError = false;

  try {
    [menuItems, restaurant] = await Promise.all([
      getAvailableMenuItems(),
      getRestaurantStatus()
    ]);
  } catch {
    setupError = true;
  }

  if (setupError || !restaurant) {
    return (
      <main className="min-h-screen px-4 py-10">
        <div className="mx-auto max-w-xl rounded-lg bg-white p-5 ring-1 ring-orange-100">
          <h1 className="text-2xl font-black text-gray-950">
            {restaurantName}
          </h1>
          <p className="mt-3 text-gray-700">
            Supabase is not connected yet. Add environment variables and run the
            database schema to start taking orders.
          </p>
        </div>
      </main>
    );
  }

  return (
    <CustomerHome
      restaurantName={restaurantName}
      initialMenuItems={menuItems}
      initialRestaurant={restaurant}
    />
  );
}
