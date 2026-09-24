import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./admin.css";

export const metadata: Metadata = {
  title: {
    default: "Кабінет ESOSH",
    template: "%s · Кабінет ESOSH",
  },
  description: "Адміністративний кабінет асоціації ESOSH",
  robots: { index: false, follow: false },
  icons: {
    icon: [{ url: "/favicon/admin-icon.svg", type: "image/svg+xml" }, { url: "/favicon/favicon-32.png", sizes: "32x32", type: "image/png" }],
  },
};

/** RU: HTML-оболочка админки вне locale layout. EN: Admin document shell outside locale layout. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body className="admin-body">{children}</body>
    </html>
  );
}
