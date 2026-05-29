import { CheckoutForm } from "@/components/customer/checkout-form";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen px-4 py-5">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-5 text-3xl font-black text-gray-950">Checkout</h1>
        <CheckoutForm />
      </div>
    </main>
  );
}
