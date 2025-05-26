"use client";

import React, { useContext, useState } from "react";
import Button from "@/components/ui/Button/index";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/ui/FormField";
import { ToasterContext } from "@/context/ToasterContext";
import Breadcrumbs from "@/components/fragments/Breadcrumb";
import { useRouter } from "next/navigation";
import { postData } from "@/utils/fetch";
import { uploadImage } from "@/utils/uploadImage";
import { PaymentFormSchema } from "@/utils/formSchema";

export default function CreateTalentsPage() {
  const { setToaster } = useContext(ToasterContext);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const token = JSON.parse(localStorage.getItem("token") || "");
  const form = useForm<z.infer<typeof PaymentFormSchema>>({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      type: "",
      image: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof PaymentFormSchema>) => {
    setLoading(true);
    try {
      const file = values.image[0];
      const sizeMB = file.size / 1024 / 1024;

      if (sizeMB > 3) {
        setToaster({
          variant: "danger",
          message: "Ukuran file melebihi 3MB",
        });
        setLoading(false);
        return;
      }

      const imageRes = await uploadImage(file, token, "/cms/images", "avatar");
      const imageId = imageRes?.data?.data?._id;

      const payload = {
        type: values.type,
        image: imageId,
      };

      const response = await postData(
        "/cms/payments",
        payload,
        undefined,
        token
      );

      console.log(response);

      if (response?.data?.data) {
        setToaster({
          variant: "success",
          message: `Payment ${response?.data?.data?.type} berhasil ditambahkan`,
        });
        router.push("/payments");
      }
    } catch (error: any) {
      setError(error?.response?.data?.msg || "Internal Server Error");
      setToaster({
        variant: "danger",
        message: error?.response?.data?.msg || "Terjadi kesalahan server",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mt-5 mb-16">
        <Breadcrumbs
          textSecond="payments"
          textThird="create"
          urlSecond="/payments"
        />
      </div>
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-2xl font-medium mb-4">Tambah Metode Pembayaran</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="min-w-96 flex flex-col gap-3 p-5 border border-slate-200 rounded-xl"
          >
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
            <Button
              loading={loading}
              disabled={loading}
              type="submit"
              classname="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tambah
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
