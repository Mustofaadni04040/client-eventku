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

const formSchema = z.object({
  name: z.string().min(6, {
    message: "Nama talent harus lebih dari 6 karakter.",
  }),
  role: z.string().min(4, {
    message: "Role talent harus lebih dari 4 karakter.",
  }),
  image: z
    .any()
    .refine((file) => file?.length === 1, {
      message: "Wajib upload satu file.",
    })
    .refine((file) => file?.[0]?.type?.startsWith("image/"), {
      message: "File harus berupa gambar.",
    }),
});

export default function CreateTalentsPage() {
  const { setToaster } = useContext(ToasterContext);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const token = JSON.parse(localStorage.getItem("token") || "");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      image: "",
    },
  });

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    return await postData("/cms/images", formData, "multipart", token);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

      const imageRes = await uploadImage(file);
      const imageId = imageRes?.data?.data?._id;

      const payload = {
        name: values.name,
        role: values.role,
        image: imageId,
      };

      const response = await postData(
        "/cms/talents",
        payload,
        undefined,
        token
      );

      if (response?.data?.data) {
        setToaster({
          variant: "success",
          message: `Talent ${response?.data?.data?.name} berhasil ditambahkan`,
        });
        router.push("/talents");
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
          textSecond="talents"
          textThird="create"
          urlSecond="/talents"
        />
      </div>
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-2xl font-medium mb-4">Tambah Talent</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="min-w-96 flex flex-col gap-3 p-5 border border-slate-200 rounded-xl"
          >
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
            <FormInput
              form={form}
              name="image"
              label="Profile Talent"
              type="file"
            />
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
