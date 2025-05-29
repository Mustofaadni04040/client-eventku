import FormInput from "@/components/ui/FormField";
import React from "react";

export default function CategoriesForm({ form, error }: any) {
  return (
    <>
      <FormInput
        form={form}
        name="name"
        label="Nama Kategori"
        type="text"
        placeholder="Masukkan nama kategori"
      />
      {form?.formState?.errors && (
        <p className="text-xs text-red-500">
          {form?.formState?.errors?.name?.message}
        </p>
      )}
      {error && !form.formState.errors && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </>
  );
}
