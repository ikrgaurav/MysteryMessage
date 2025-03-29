import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Onest Feedback",
  description: "Write Messages Anonymously",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
