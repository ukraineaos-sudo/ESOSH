import type { ReactNode } from "react";
import "./admin.css";

/** RU: HTML-оболочка админки вне locale layout. EN: Admin document shell outside locale layout. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body className="admin-body">{children}</body>
    </html>
  );
}
