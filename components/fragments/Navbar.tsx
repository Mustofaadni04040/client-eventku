"use client";

import Image from "next/image";
import React from "react";
import NavLink from "../ui/NavLink/NavLink";
import { useSelector } from "react-redux";
import {
  accessCategories,
  accessEvents,
  accessOrders,
  accessParticipant,
  accessPayments,
  accessTalents,
} from "@/utils/access";
import Button from "../ui/Button/index";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { usePathname } from "next/navigation";
import { isHasAccess } from "@/utils/hasAccess";

export default function Navbar() {
  const { role, token } = useSelector((state: any) => state.auth);
  const pathname = usePathname();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/auth/signin";
  };

  if (pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <div className="h-14 bg-white border-b-[1px] border-slate-200">
      <div className="max-w-7xl h-full container flex items-center justify-between mx-auto">
        <Image
          src={"/EventKu.svg"}
          width={0}
          height={0}
          alt="logo"
          className="w-[100px] h-auto"
          priority
        />

        <div className="flex items-center gap-20">
          <nav className="flex items-center gap-8">
            {isHasAccess(accessCategories.lihat, role) && (
              <NavLink action="/" role={role} roles={accessCategories.lihat}>
                Home
              </NavLink>
            )}
            {isHasAccess(accessCategories.lihat, role) && (
              <NavLink
                action="/categories"
                role={role}
                roles={accessCategories.lihat}
              >
                Categories
              </NavLink>
            )}
            {isHasAccess(accessTalents.lihat, role) && (
              <NavLink
                action="/talents"
                role={role}
                roles={accessTalents.lihat}
              >
                Talents
              </NavLink>
            )}
            {isHasAccess(accessPayments.lihat, role) && (
              <NavLink
                action="/payments"
                role={role}
                roles={accessPayments.lihat}
              >
                Payments
              </NavLink>
            )}
            {/* {isHasAccess(accessEvents.lihat, role) && (
               <NavLink
              action="/organizers"
              role={role}
              roles={accessOrganizers.lihat}
            >
              Organizer
            </NavLink> 
            )} */}
            {isHasAccess(accessEvents.lihat, role) && (
              <NavLink action="/events" role={role} roles={accessEvents.lihat}>
                Events
              </NavLink>
            )}
            {isHasAccess(accessParticipant.lihat, role) && (
              <NavLink
                action="/participants"
                role={role}
                roles={accessParticipant.lihat}
              >
                Participants
              </NavLink>
            )}
            {isHasAccess(accessOrders.lihat, role) && (
              <NavLink
                action="/transactions"
                role={role}
                roles={accessOrders.lihat}
              >
                Transactions
              </NavLink>
            )}
          </nav>

          <Popover>
            <PopoverTrigger>
              <Image
                src="/default.jpeg"
                width={50}
                height={50}
                alt="profile"
                className="rounded-full w-8 h-auto object-cover"
              />
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
              <PopoverClose asChild>
                {token ? (
                  <Button
                    type="button"
                    classname="bg-transparent text-primary hover:bg-slate-100"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    type="button"
                    classname="bg-transparent border border-primary text-primary hover:bg-slate-100"
                  >
                    Sign In
                  </Button>
                )}
              </PopoverClose>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
