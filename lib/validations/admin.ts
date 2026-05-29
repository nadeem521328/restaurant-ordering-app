import { z } from "zod";
import type { OrderStatus } from "@/types/order";
import type { RestaurantStatus } from "@/types/restaurant";

export const orderStatusSchema = z.object({
  status: z.enum([
    "Pending",
    "Accepted",
    "Out For Delivery",
    "Delivered",
    "Cancelled"
  ] satisfies OrderStatus[])
});

export const restaurantStatusSchema = z.object({
  status: z.enum(["OPEN", "CLOSED", "SOLD_OUT"] satisfies RestaurantStatus[])
});
