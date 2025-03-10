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
import { config } from "@/configs";
import { useRouter } from "next/navigation";
import axios from "axios";

const formSchema = z.object({
  name: z.string().min(6, {
    message: "Nama kategori harus lebih dari 6 karakter.",
  }),
});

export default function CreateCategoriesPage() {
  const { setToaster } = useContext(ToasterContext);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const token = localStorage.getItem("token")?.split('"')[1];
    setLoading(true);
    try {
      await axios.post(
        `${config.api_host_dev}/cms/categories`,
        {
          name: values.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push("/categories");
      setToaster({
        variant: "success",
        message: "Kategori berhasil ditambahkan",
      });
    } catch (error: any) {
      setError(error?.response?.data?.msg || "Internal Server Error");
      setToaster({
        variant: "danger",
        message: error?.response?.data?.msg || "Internal Server Error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto">
      <div className="my-5">
        <Breadcrumbs
          textSecond="categories"
          textThird="create"
          urlSecond="/categories"
        />
      </div>
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-2xl font-medium mb-4">Tambah Kategori</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="min-w-96 flex flex-col gap-3 p-5 border border-slate-200 rounded-xl"
          >
            <FormInput
              form={form}
              name="name"
              label="Nama Kategori"
              type="text"
              placeholder="Masukkan nama kategori"
            />
            {form.formState.errors && (
              <p className="text-xs text-red-500">
                {form.formState.errors.name?.message}
              </p>
            )}
            {error && !form.formState.errors && (
              <p className="text-xs text-red-500">{error}</p>
            )}
            <Button
              disabled={loading}
              type="submit"
              classname="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Tambah"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
