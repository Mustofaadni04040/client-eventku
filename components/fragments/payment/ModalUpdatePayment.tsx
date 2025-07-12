import React, { useContext, useEffect, useState } from "react";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import Button from "../../ui/Button/index";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { putData } from "@/utils/fetch";
import { ToasterContext } from "@/context/ToasterContext";
import { uploadImage } from "@/utils/uploadImage";
import { ModalPayments } from "@/types/modalPayments.type";
import { paymentFormSchema } from "@/utils/formSchema";
import PaymentForm from "./PaymentForm";
import Modal from "@/components/layout/modalLayout";
import { Form } from "@/components/ui/form";
import { getAuth } from "@/utils/authStorage";

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
  const { token } = getAuth();
  const safeToken = token || "";
  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      type: selectedPayment?.type,
      image: "",
    },
  });

  useEffect(() => {
    // reset form setiap open modal
    if (openModal) {
      form.reset({ type: selectedPayment?.type });
    }
  }, [openModal, selectedPayment, form]);

  async function onSubmit(values: z.infer<typeof paymentFormSchema>) {
    setLoading(true);

    const file = values?.image?.[0];
    let payload;
    let imageId: string | undefined;
    let imageName: string | undefined;

    if (file) {
      const sizeMB = file.size / 1024 / 1024;

      if (sizeMB > 3) {
        setToaster({
          variant: "danger",
          message: "Ukuran file melebihi 3MB",
        });
        setLoading(false);
        return;
      }
      const imageRes = await uploadImage(
        file,
        safeToken,
        "/cms/images",
        "avatar"
      );
      imageId = imageRes?.data?.data?._id;
      imageName = imageRes?.data?.data?.name;
      payload = {
        type: values.type,
        image: imageId,
      };
    } else {
      payload = {
        type: values.type,
        image: selectedPayment?.image?._id, // use existing image if no new file is uploaded
      };
    }

    const response = await putData(
      `/cms/payments/${selectedPayment?._id}`,
      payload,
      token
    );

    if (response?.status === 200) {
      setOpenModal(false);
      setLoading(false);
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
                    name: imageName || item.image.name, // use new image name if available
                  },
                }
              : item
        )
      );
      setToaster({
        variant: "success",
        message: "Payment berhasil diupdate",
      });
    } else {
      setOpenModal(false);
      setLoading(false);
      setError(response?.response?.data?.msg || "Internal Server Error");
      setToaster({
        variant: "danger",
        message: response?.response?.data?.msg || "Internal Server Error",
      });
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
          <PaymentForm form={form} error={error} />
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
