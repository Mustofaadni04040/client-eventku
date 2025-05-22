import React from "react";
import { Input as BaseInput } from "@/components/ui/input";

type PropTypes = {
  type: string;
  name: string;
  value: any;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  accept?: string;
};

const Input = React.forwardRef<HTMLInputElement, PropTypes>(
  ({ type, name, value, onChange, placeholder, className, accept }, ref) => {
    return (
      <BaseInput
        ref={ref}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        accept={accept}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
