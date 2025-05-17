import Link from "next/link";
import React from "react";

export default function NavLink({
  action,
  children,
}: {
  role?: string;
  roles?: string[];
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <ul>
      <li className="text-slate-700 hover:text-slate-500 text-sm duration-300">
        <Link href={action || "#"}>{children}</Link>
      </li>
    </ul>
  );
}
