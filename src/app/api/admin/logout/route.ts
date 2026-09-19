import { NextResponse } from "next/server";
import { logoutAdmin } from "@/lib/admin/auth";

/** RU: Выход из админки. EN: Admin logout endpoint. */
export async function POST(request: Request) {
  await logoutAdmin();
  return NextResponse.redirect(new URL("/admin/login", request.url), 303);
}
