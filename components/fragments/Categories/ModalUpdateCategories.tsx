import React, { useContext, useEffect, useState } from "react";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../../ui/form";
import { putData } from "@/utils/fetch";
import { ToasterContext } from "@/context/ToasterContext";
import { ModalCategories } from "@/types/modalCategories.type";
import { categoryFormSchema } from "@/utils/formSchema";
import CategoriesForm from "./CategoriesForm";
import Modal from "@/components/layout/modalLayout";
import Button from "../../ui/Button/index";

export default function ModalUpdateCategories({
  openModal,
  setOpenModal,
  loading,
  setLoading,
  selectedCategories,
  setData,
}: ModalCategories) {
  const { setToaster } = useContext(ToasterContext);
  const [error, setError] = useState<string>("");
  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: selectedCategories?.name,
    },
  });

  useEffect(() => {
    if (openModal) {
      form.reset({ name: selectedCategories?.name });
    }
  }, [openModal, selectedCategories, form]);

  async function onSubmit(values: z.infer<typeof categoryFormSchema>) {
    setLoading(true);

    try {
      const token = JSON.parse(localStorage.getItem("token") || "");
      const res = await putData(
        `/cms/categories/${selectedCategories?._id}`,
        { name: values.name },
        token
      );

      if (res?.data?.data) {
        setOpenModal(false);
        setData((prev: any) =>
          prev.map((item: { _id: string; name: string }) =>
            item._id === selectedCategories?._id
              ? { ...item, name: values.name }
              : item
          )
        );
        setToaster({
          variant: "success",
          message: "Kategori berhasil diupdate",
        });
      }
    } catch (err: any) {
      console.log(err);
      setError(err?.response?.data?.msg || "Internal Server Error");
      setToaster({
        variant: "danger",
        message: err?.response?.data?.msg || "Internal Server Error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      openModal={openModal}
      setOpenModal={setOpenModal}
      title="Update Categories"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CategoriesForm form={form} error={error} />

          <DialogFooter className="sm:justify-end mt-5">
            <DialogClose asChild>
              <Button
                classname="bg-transparent border border-primary text-primary hover:bg-slate-100"
                type="button"
                onClick={() => setOpenModal(!openModal)}
              >
                Close
              </Button>
            </DialogClose>
            <Button
              type="submit"
              classname="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Updating..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </Modal>
  );
}
