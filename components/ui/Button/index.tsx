import React from "react";
import { Button as BaseButton } from "@/components/ui/button";

type PropTypes = {
  type: "button" | "submit" | "reset" | undefined;
  classname: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean | undefined;
  loading?: string;
};

export default function Button({
  onClick,
  children,
  disabled,
  loading,
  type,
  classname,
}: PropTypes) {
  return (
    <BaseButton
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={classname}
    >
      {loading ? "Loading..." : children}
    </BaseButton>
  );
}
