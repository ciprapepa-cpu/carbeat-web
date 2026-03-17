import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin | CarBeat",
    template: "%s | Admin | CarBeat",
  },
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-bg">
      {children}
    </div>
  );
}
