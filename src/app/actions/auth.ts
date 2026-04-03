"use server";

import { signOut } from "@/auth";
import { headers } from "next/headers";

export async function logoutAction() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");

  let redirectTo = "/";
  if (host) {
    const forwardedProto = h.get("x-forwarded-proto");
    const proto =
      forwardedProto ??
      (host.startsWith("localhost") || host.startsWith("127.0.0.1")
        ? "http"
        : "https");
    redirectTo = `${proto}://${host}/`;
  }

  await signOut({ redirectTo });
}
