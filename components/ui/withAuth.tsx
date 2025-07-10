"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WithAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const protectedRoute = [
      "/dashboard",
      "/categories",
      "/events",
      "/transactions",
      "/payments",
      "/talents",
      "/participants",
    ]; // protected routes if user not logged in
    const token = localStorage.getItem("token");
    if (!token && protectedRoute.some((route) => pathname.startsWith(route))) {
      router.replace("/auth/signin");
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
