"use server";

import { redirect } from "next/navigation";
import { API_URL } from "@/lib/config";
import { setSession } from "@/lib/session";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password }),
    cache: "no-store",
  }).catch(() => null);

  if (!res) return { error: "Cannot reach the API. Is the backend running?" };
  if (res.status === 400)
    return {
      error: "Enter your phone in international format, e.g. +923001234567",
    };
  if (res.status === 401) return { error: "Invalid phone or password" };
  if (!res.ok) return { error: `Login failed (${res.status})` };

  const data = await res.json();
  if (data.user?.role !== "ADMIN")
    return { error: "This account is not an admin" };

  await setSession(data.accessToken, data.refreshToken);
  redirect("/"); // redirect() throws, so it must stay outside any try/catch
}
