import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WishVerse — Make a Memory",
  description:
    "Create a beautiful interactive birthday and anniversary experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}