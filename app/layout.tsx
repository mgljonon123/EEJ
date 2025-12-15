import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Эмчийн Цаг Захиалгын Систем",
  description: "Эмч, өвчтөний цаг бүртгэл удирдах систем",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
