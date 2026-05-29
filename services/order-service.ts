import { createServiceSupabaseClient } from "@/lib/supabase/service";
import type { CheckoutInput } from "@/lib/validations/checkout";
import type { Order } from "@/types/order";
import { getMenuItemById } from "./menu-service";
import { getRestaurantStatus } from "./restaurant-service";

function buildOrderNumber() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `RB${date}${suffix}`;
}

export async function createOrder(input: CheckoutInput): Promise<Order> {
  const [restaurant, menuItem] = await Promise.all([
    getRestaurantStatus(),
    getMenuItemById(input.menuItemId)
  ]);

  if (restaurant.status !== "OPEN") {
    throw new Error("Ordering is closed right now.");
  }

  if (!menuItem || !menuItem.availability) {
    throw new Error("This item is not available right now.");
  }

  const quantity = input.quantity;
  const totalPrice = menuItem.price * quantity;
  const supabase = createServiceSupabaseClient();

  const { data, error } = await supabase
    .from("orders")
    .insert({
      order_number: buildOrderNumber(),
      customer_name: input.customerName,
      phone: input.phone,
      address: input.address,
      notes: input.notes || null,
      item_name: menuItem.name,
      quantity,
      total_price: totalPrice,
      payment_method: "COD",
      status: "Pending"
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
