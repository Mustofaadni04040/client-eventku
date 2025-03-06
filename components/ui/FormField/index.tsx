import React from "react";
import { FormControl, FormField, FormItem, FormLabel } from "../form";
import Input from "../Input/index";

export default function FormInput({
  form,
  name,
  label,
  type,
  placeholder,
}: any) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              className="text-sm"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
