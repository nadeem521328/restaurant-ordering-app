import type { Metadata } from "next";
import "./globals.css";

const restaurantName =
  process.env.NEXT_PUBLIC_RESTAURANT_NAME ?? "Roast Biryani House";

export const metadata: Metadata = {
  title: restaurantName,
  description: "Fast roast biryani ordering for one restaurant."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
