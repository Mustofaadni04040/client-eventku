import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <div className="w-full h-14 bg-white border-b-[1px] border-slate-200">
      <div className="h-full container flex items-center justify-between mx-auto">
        <Image
          src={"/EventKu.svg"}
          width={100}
          height={50}
          alt="logo"
          className="w-[100px] h-auto"
          priority
        />

        <div>
          <ul className="flex items-center gap-8 ">
            <li className="text-slate-700 hover:text-slate-600 text-sm">
              <Link href="/dashboard">Home</Link>
            </li>
            <li className="text-slate-700 hover:text-slate-600 text-sm">
              <Link href="/categories">Categories</Link>
            </li>
            <li className="text-slate-700 hover:text-slate-600 text-sm">
              <Link href="#">Talents</Link>
            </li>
            <li className="text-slate-700 hover:text-slate-600 text-sm">
              <Link href="#">Events</Link>
            </li>
            <li className="text-slate-700 hover:text-slate-600 text-sm">
              <Link href="#">Participants</Link>
            </li>
            <li className="text-slate-700 hover:text-slate-600 text-sm">
              <Link href="#">Transactions</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
