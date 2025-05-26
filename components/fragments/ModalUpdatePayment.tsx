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
import { ModalPayments } from "@/types/modalPayments.type";

const formSchema = z.object({
  type: z.string().min(2, {
    message: "Type pembayaran harus lebih dari 2 karakter.",
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

export default function ModalUpdatePayment({
  openModal,
  setOpenModal,
  loading,
  setLoading,
  selectedPayment,
  setData,
}: ModalPayments) {
  const { setToaster } = useContext(ToasterContext);
  const [error, setError] = useState<string>("");
  const token = JSON.parse(localStorage.getItem("token") || "");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: selectedPayment?.type,
      image: "",
    },
  });

  useEffect(() => {
    // reset form setiap select talent
    if (selectedPayment) {
      form.reset({ type: selectedPayment?.type });
    }
  }, [selectedPayment, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
        type: values.type,
        image: imageId,
      };

      const response = await putData(
        `/cms/payments/${selectedPayment?._id}`,
        payload,
        token
      );

      if (response?.data?.data) {
        setOpenModal(false);
        setData((prev: any) =>
          prev.map(
            (item: {
              _id: string;
              type: string;
              image: { name: string; _id: string };
            }) =>
              item._id === selectedPayment?._id
                ? {
                    ...item,
                    type: values.type,
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
          message: "Payment berhasil diupdate",
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
      title="Update Payment"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
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
