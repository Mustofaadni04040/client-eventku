import React from "react";
import { Input as BaseInput } from "@/components/ui/input";
import moment from "moment";

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
        value={type === "date" ? moment(value).format("YYYY-MM-DD") : value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        accept={accept}
        id={name}
        onWheel={(e) => {
          if (type === "number") {
            (e.target as HTMLInputElement).blur();
          }
        }}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
