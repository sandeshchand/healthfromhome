"use client"

import type { UserSession } from "@/lib/types"

const TOKEN_KEY = "token"
const USER_KEY = "healthfromhome_user"

export function saveSession(session: UserSession) {
  localStorage.setItem(TOKEN_KEY, session.token)
  localStorage.setItem(USER_KEY, JSON.stringify(session))
  window.dispatchEvent(new Event("healthfromhome-auth-change"))
}

export function getSession(): UserSession | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as UserSession
  } catch {
    return null
  }
}

export function hasToken() {
  return Boolean(localStorage.getItem(TOKEN_KEY))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  window.dispatchEvent(new Event("healthfromhome-auth-change"))
}
