import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Narula's Restaurant | Table Booking & Pre-order",
  description: "Book a table and pre-order food at Narula's Restaurant, Ashok Nagar, Bhubaneswar.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
