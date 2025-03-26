import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Mystery Message",
  description: "Write Messages Anonymously",
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
