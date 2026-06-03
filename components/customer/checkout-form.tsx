"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { onlyDigits } from "@/utils/phone";
import { formatCurrency } from "@/utils/format-currency";

type FormState = {
  customerName: string;
  phone: string;
  address: string;
};

const initialForm: FormState = {
  customerName: "",
  phone: "",
  address: ""
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

export function CheckoutForm() {
  const router = useRouter();
  const cart = useCart();
  const [form, setForm] = useState<FormState>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const firstItem = cart.items[0];

  function validateRequiredFields() {
    const nextErrors: FieldErrors = {};

    if (!form.customerName.trim()) {
      nextErrors.customerName = "Name is required.";
    } else if (form.customerName.trim().length < 2) {
      nextErrors.customerName = "Enter your full name.";
    }

    if (!form.phone) {
      nextErrors.phone = "Phone number is required.";
    } else if (form.phone.length !== 10) {
      nextErrors.phone = "Enter a valid 10 digit phone number.";
    }

    if (!form.address.trim()) {
      nextErrors.address = "Address is required.";
    } else if (form.address.trim().length < 3) {
      nextErrors.address = "Enter landmark or address.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function updateField<FieldName extends keyof FormState>(
    fieldName: FieldName,
    value: FormState[FieldName]
  ) {
    setForm((current) => ({ ...current, [fieldName]: value }));
    setFieldErrors((current) => ({ ...current, [fieldName]: undefined }));
  }

  async function placeOrder() {
    setError("");

    if (!firstItem) {
      setError("Cart is empty.");
      return;
    }

    if (!validateRequiredFields()) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerName: form.customerName.trim(),
          phone: form.phone,
          address: form.address.trim(),
          menuItemId: firstItem.menuItemId,
          quantity: firstItem.quantity
        })
      });

      const result = (await response.json()) as {
        orderNumber?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Order failed. Try again.");
      }

      cart.clearCart();
      router.replace(`/success?order=${result.orderNumber ?? ""}`);
    } catch (orderError) {
      setError(
        orderError instanceof Error
          ? orderError.message
          : "Order failed. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (cart.ready && !firstItem) {
    return (
      <div className="rounded-lg bg-white p-5 text-center ring-1 ring-orange-100">
        <p className="text-lg font-bold text-gray-900">Your cart is empty.</p>
        <Link
          href="/"
          className="mt-4 inline-flex min-h-12 items-center justify-center rounded-lg bg-red-700 px-4 font-bold text-white"
        >
          Go to menu
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-2 rounded-lg px-1 font-bold text-gray-700"
      >
        <ArrowLeft size={20} aria-hidden />
        Menu
      </Link>

      {firstItem ? (
        <section className="rounded-lg bg-white p-4 ring-1 ring-orange-100">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-gray-950">
                {firstItem.name}
              </h2>
              <p className="text-sm text-gray-600">Qty {firstItem.quantity}</p>
            </div>
            <p className="text-xl font-black text-red-700">
              {formatCurrency(cart.totalPrice)}
            </p>
          </div>
        </section>
      ) : (
        <section className="rounded-lg bg-white p-4 ring-1 ring-orange-100">
          Loading cart...
        </section>
      )}

      <section className="space-y-4 rounded-lg bg-white p-4 ring-1 ring-orange-100">
        <label className="block">
          <span className="text-sm font-bold text-gray-800">Name</span>
          <input
            className="mt-2 min-h-12 w-full rounded-lg border border-gray-200 px-3 text-lg outline-none focus:border-red-700"
            autoComplete="name"
            aria-invalid={Boolean(fieldErrors.customerName)}
            aria-describedby={
              fieldErrors.customerName ? "customer-name-error" : undefined
            }
            required
            value={form.customerName}
            onChange={(event) =>
              updateField("customerName", event.target.value)
            }
          />
          {fieldErrors.customerName ? (
            <p
              id="customer-name-error"
              className="mt-2 text-sm font-bold text-red-700"
            >
              {fieldErrors.customerName}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-bold text-gray-800">Phone number</span>
          <input
            className="mt-2 min-h-12 w-full rounded-lg border border-gray-200 px-3 text-lg outline-none focus:border-red-700"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            autoComplete="tel"
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
            required
            value={form.phone}
            onChange={(event) =>
              updateField(
                "phone",
                onlyDigits(event.target.value).slice(0, 10)
              )
            }
          />
          {fieldErrors.phone ? (
            <p id="phone-error" className="mt-2 text-sm font-bold text-red-700">
              {fieldErrors.phone}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-bold text-gray-800">
            Landmark / Address
          </span>
          <textarea
            className="mt-2 min-h-24 w-full resize-none rounded-lg border border-gray-200 px-3 py-3 text-lg outline-none focus:border-red-700"
            aria-invalid={Boolean(fieldErrors.address)}
            aria-describedby={
              fieldErrors.address ? "address-error" : undefined
            }
            required
            value={form.address}
            onChange={(event) =>
              updateField("address", event.target.value)
            }
          />
          {fieldErrors.address ? (
            <p
              id="address-error"
              className="mt-2 text-sm font-bold text-red-700"
            >
              {fieldErrors.address}
            </p>
          ) : null}
        </label>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
            {error}
          </p>
        ) : null}

        <Button
          className="w-full"
          disabled={!firstItem || submitting}
          onClick={placeOrder}
        >
          {submitting ? <Loader2 className="animate-spin" size={20} /> : null}
          Place COD Order
        </Button>
      </section>
    </div>
  );
}
