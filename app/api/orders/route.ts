import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validations/checkout";
import { createOrder } from "@/services/order-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid order." },
        { status: 400 }
      );
    }

    const order = await createOrder(parsed.data);

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.order_number
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not place order right now."
      },
      { status: 400 }
    );
  }
}
