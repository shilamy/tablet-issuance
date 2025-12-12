// lib/auth.ts
"use client";

import { useState } from "react";

let _user: { email: string } | null = null;

export function useAuth() {
  const [user, setUser] = useState(_user);

  function login(email: string) {
    _user = { email };
    setUser(_user);
  }

  function logout() {
    _user = null;
    setUser(null);
  }

  return { user, login, logout };
}
