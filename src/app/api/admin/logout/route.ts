import { NextResponse } from "next/server";
import { logoutAdmin } from "@/lib/admin/auth";
import { assertSameOrigin } from "@/lib/http/same-origin";

/** RU: Выход из админки. EN: Admin logout endpoint. */
export async function POST(request: Request) {
  const originBlock = assertSameOrigin(request);
  if (originBlock) return originBlock;
  await logoutAdmin();
  return NextResponse.redirect(new URL("/admin/login", request.url), 303);
}
