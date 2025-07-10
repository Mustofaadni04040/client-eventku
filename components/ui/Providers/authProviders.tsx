"use client";

import { setRole, setToken } from "@/redux/auth/authSlice";
import { getAuth } from "@/utils/authStorage";
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
      const { token, role } = getAuth();

      if (token && role) {
        dispatch(setToken(token));
        dispatch(setRole(role));
      }
    }
  }, [dispatch]);

  return <>{children}</>;
}
