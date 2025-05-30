import FormInput from "@/components/ui/FormField";
import React from "react";

export default function PaymentForm({ form, error }: any) {
  return (
    <>
      <FormInput
        form={form}
        name="type"
        label="Type Pembayaran"
        type="text"
        placeholder="Masukkan type pembayaran"
      />
      <FormInput
        form={form}
        name="image"
        label="Image Pembayaran"
        type="file"
      />
      {form?.formState?.errors && (
        <p className="text-xs text-red-500">
          {form?.formState?.errors?.type?.message?.toString() ||
            form?.formState?.errors?.image?.message?.toString()}
        </p>
      )}
      {error && !form.formState.errors && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </>
  );
}
