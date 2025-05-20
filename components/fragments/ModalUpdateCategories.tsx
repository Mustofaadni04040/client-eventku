import React, { useContext, useState } from "react";
import Modal from "../layout/modalLayout";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import Button from "../ui/Button/index";
import FormInput from "../ui/FormField";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { putData } from "@/utils/fetch";
import { ToasterContext } from "@/context/ToasterContext";

const formSchema = z.object({
  name: z.string().min(6, {
    message: "Nama kategori harus lebih dari 6 karakter.",
  }),
});

type PropTypes = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCategories: { _id: string; name: string } | null;
  setData: React.Dispatch<React.SetStateAction<any>>;
};

export default function ModalUpdateCategories({
  openModal,
  setOpenModal,
  loading,
  setLoading,
  selectedCategories,
  setData,
}: PropTypes) {
  const { setToaster } = useContext(ToasterContext);
  const [error, setError] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedCategories?.name || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
          <FormInput
            form={form}
            name="name"
            label="Nama Kategori"
            type="text"
            placeholder="Update nama kategori"
          />
          {form?.formState?.errors && (
            <p className="text-xs text-red-500">
              {form?.formState?.errors?.name?.message}
            </p>
          )}
          {error && !form.formState.errors && (
            <p className="text-xs text-red-500">{error}</p>
          )}
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
