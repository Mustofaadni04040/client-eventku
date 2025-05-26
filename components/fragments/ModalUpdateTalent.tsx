import React, { useContext, useEffect, useState } from "react";
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
import { uploadImage } from "@/utils/uploadImage";
import { ModalTalents } from "@/types/modalTalents.type";
import { talentFormSchema } from "@/utils/formSchema";

export default function ModalUpdateTalent({
  openModal,
  setOpenModal,
  loading,
  setLoading,
  selectedTalent,
  setData,
}: ModalTalents) {
  const { setToaster } = useContext(ToasterContext);
  const [error, setError] = useState<string>("");
  const token = JSON.parse(localStorage.getItem("token") || "");
  const form = useForm<z.infer<typeof talentFormSchema>>({
    resolver: zodResolver(talentFormSchema),
    defaultValues: {
      name: selectedTalent?.name,
      role: selectedTalent?.role,
      image: "",
    },
  });

  useEffect(() => {
    // reset form setiap select talent
    if (selectedTalent) {
      form.reset({ name: selectedTalent?.name, role: selectedTalent?.role });
    }
  }, [selectedTalent, form]);

  async function onSubmit(values: z.infer<typeof talentFormSchema>) {
    setLoading(true);

    try {
      const file = values.image[0];
      const sizeMB = file.size / 1024 / 1024;
      let payload;

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
      const imageName = imageRes?.data?.data?.name;

      payload = {
        name: values.name,
        role: values.role,
        image: imageId,
      };

      const response = await putData(
        `/cms/talents/${selectedTalent?._id}`,
        payload,
        token
      );

      if (response?.data?.data) {
        setOpenModal(false);
        setData((prev: any) =>
          prev.map(
            (item: {
              _id: string;
              name: string;
              role: string;
              image: { name: string; _id: string };
            }) =>
              item._id === selectedTalent?._id
                ? {
                    ...item,
                    name: values.name,
                    role: values.role,
                    image: {
                      _id: imageId,
                      name: imageName,
                    },
                  }
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
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
