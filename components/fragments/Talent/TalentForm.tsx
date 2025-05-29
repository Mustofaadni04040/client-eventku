import FormInput from "@/components/ui/FormField";
import React from "react";

export default function TalentForm({ form, error }: any) {
  return (
    <>
      <FormInput
        form={form}
        name="name"
        label="Nama Talent"
        type="text"
        placeholder="Masukkan nama talent"
      />
      <FormInput
        form={form}
        name="role"
        label="Role Talent"
        type="text"
        placeholder="Masukkan role talent"
      />
      <FormInput form={form} name="image" label="Profile Talent" type="file" />
      {form?.formState?.errors && (
        <p className="text-xs text-red-500">
          {form?.formState?.errors?.name?.message?.toString() ||
            form?.formState?.errors?.role?.message?.toString() ||
            form?.formState?.errors?.image?.message?.toString()}
        </p>
      )}
      {error && !form.formState.errors && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </>
  );
}
