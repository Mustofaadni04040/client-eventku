"use client";

import { setRole, setToken } from "@/redux/auth/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const roleLocalStorage = localStorage.getItem("role");
      const role = roleLocalStorage
        ? JSON.parse(roleLocalStorage) 
        : null;

      if (token && role) {
        dispatch(setToken(token));
        dispatch(setRole(role));
      }
    }
  }, [dispatch]);

  return <>{children}</>;
}
