import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mock Shop Portal - IT Procurement",
  description: "Enterprise IT Procurement & Mock Shop Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50 text-gray-900 font-sans">
        {children}
      </body>
    </html>
  );
}
