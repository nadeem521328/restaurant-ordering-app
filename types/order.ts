export type PaymentMethod = "COD" | "UPI" | "RAZORPAY" | "PHONEPE";

export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "Out For Delivery"
  | "Delivered"
  | "Cancelled";

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  address: string;
  notes: string | null;
  item_name: string;
  quantity: number;
  total_price: number;
  payment_method: PaymentMethod;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  updated_by_admin: string | null;
};

export type CartItem = {
  menuItemId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
};
