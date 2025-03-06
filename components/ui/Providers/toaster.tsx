"use client";

import { useContext } from "react";
import { ToasterContext } from "@/context/ToasterContext";
import Toaster from "../Toaster";

export default function ToasterComponent() {
  const { toaster } = useContext(ToasterContext);

  return Object.keys(toaster).length > 0 ? <Toaster /> : null;
}
