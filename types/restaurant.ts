export type RestaurantStatus = "OPEN" | "CLOSED" | "SOLD_OUT";

export type RestaurantStatusRow = {
  id: number;
  status: RestaurantStatus;
  message: string | null;
  updated_at: string;
  updated_by_admin: string | null;
};
