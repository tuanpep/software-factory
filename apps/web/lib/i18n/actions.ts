"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { isLocale, localeCookie } from "./config";

export async function setLocale(locale: string) {
  if (!isLocale(locale)) {
    throw new Error("Unsupported locale");
  }
  const store = await cookies();
  store.set(localeCookie, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}
