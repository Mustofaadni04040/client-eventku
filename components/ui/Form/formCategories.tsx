import React from "react";
import FormInput from "../FormField";
import Button from "@/components/ui/Button/index";
import Modal from "@/components/layout/modalLayout";
import { Form } from "../form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(6, {
    message: "Nama kategori harus lebih dari 6 karakter.",
  }),
});

export default function FormCategories({ onClose }: any) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  return (
    <Modal onClose={onClose}>
      <h1 className="text-2xl font-medium mb-4">Tambah Kategori</h1>
      <Form {...form}>
        <form
          //   onSubmit={form.handleSubmit(onSubmit)}
          className="min-w-96 flex flex-col gap-3 p-5 border border-slate-200 rounded-xl"
        >
          <FormInput
            form={form}
            name="name"
            label="Nama Kategori"
            type="text"
            placeholder="Masukkan nama kategori"
          />
          <Button type="submit" classname="bg-primary hover:bg-primary/90">
            Tambah
          </Button>
        </form>
      </Form>
    </Modal>
  );
}
