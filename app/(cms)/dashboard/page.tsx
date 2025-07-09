"use client";

import Breadcrumbs from "@/components/fragments/Breadcrumb";
import Button from "@/components/ui/Button/index";
import React from "react";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto my-10">
      <Breadcrumbs />

      <div className="my-5">
        <div className="w-full flex justify-between items-center mb-5">
          <h1 className="text-2xl font-medium">
            Selamat Datang di Dashboard Eventku
          </h1>
        </div>
      </div>
    </div>
  );
}
