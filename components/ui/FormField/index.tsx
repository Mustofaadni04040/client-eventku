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
  const isFile = type === "file";

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {isFile ? (
              <div className="flex flex-col">
                <input
                  type="file"
                  onChange={(e) => field.onChange(e.target.files)}
                  className="flex h-9 w-fit rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            ) : (
              <Input
                type={type}
                placeholder={placeholder}
                {...field}
                className="text-sm"
              />
            )}
          </FormControl>
        </FormItem>
      )}
    />
  );
}
