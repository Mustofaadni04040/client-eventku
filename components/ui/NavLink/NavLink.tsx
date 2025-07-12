import Link from "next/link";
import React from "react";

type PropTypes = {
  role?: string;
  roles?: string[];
  action?: string;
  children: React.ReactNode;
};

export default function NavLink({ action, children }: PropTypes) {
  return (
    <ul>
      <li className="text-slate-700 hover:text-slate-500 text-sm duration-300">
        <Link href={action || "#"}>{children}</Link>
      </li>
    </ul>
  );
}
