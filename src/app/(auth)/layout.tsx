export const metadata = {
  title: "Authentication",
  description: "Sign in and sign up pages",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
