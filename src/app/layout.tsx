import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spec Seeder",
  description: "Turn vague requests into spec-driven Markdown inputs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
