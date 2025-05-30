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
import { categoryFormSchema } from "@/utils/formSchema";
import CategoriesForm from "@/components/fragments/Categories/CategoriesForm";

export default function CreateCategoriesPage() {
  const { setToaster } = useContext(ToasterContext);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof categoryFormSchema>) {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("token") || "");
      const response = await postData(
        `/cms/categories`,
        {
          name: values.name,
        },
        undefined,
        token
      );

      if (response?.status === 201) {
        router.push("/categories");
        setToaster({
          variant: "success",
          message: "Kategori berhasil ditambahkan",
        });
      }
    } catch (error: any) {
      console.log(error);
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
    <div className="max-w-7xl mx-auto">
      <div className="mt-5 mb-16">
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
            <CategoriesForm form={form} error={error} />
            <Button
              loading={loading}
              disabled={loading}
              type="submit"
              classname="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Simpan
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
