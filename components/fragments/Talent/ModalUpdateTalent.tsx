import React, { useContext, useEffect, useState } from "react";
import Modal from "../../layout/modalLayout";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import Button from "../../ui/Button/index";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../../ui/form";
import { putData } from "@/utils/fetch";
import { ToasterContext } from "@/context/ToasterContext";
import { uploadImage } from "@/utils/uploadImage";
import { ModalTalents } from "@/types/modalTalents.type";
import { talentFormSchema } from "@/utils/formSchema";
import TalentForm from "./TalentForm";
import { getAuth } from "@/utils/authStorage";

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
  const { token } = getAuth();
  const safeToken = token || "";
  const form = useForm<z.infer<typeof talentFormSchema>>({
    resolver: zodResolver(talentFormSchema),
    defaultValues: {
      name: selectedTalent?.name,
      role: selectedTalent?.role,
      image: "",
    },
  });

  useEffect(() => {
    // reset form setiap open modal
    if (openModal) {
      form.reset({ name: selectedTalent?.name, role: selectedTalent?.role });
    }
  }, [openModal, selectedTalent, form]);

  async function onSubmit(values: z.infer<typeof talentFormSchema>) {
    setLoading(true);

    const file = values.image?.[0];
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
        name: values.name,
        role: values.role,
        image: imageId,
      };
    } else {
      payload = {
        name: values.name,
        role: values.role,
        image: selectedTalent?.image?._id,
      };
    }

    const response = await putData(
      `/cms/talents/${selectedTalent?._id}`,
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
                    name: imageName || item.image.name,
                  },
                }
              : item
        )
      );
      setToaster({
        variant: "success",
        message: "Kategori berhasil diupdate",
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
      title="Update Categories"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <TalentForm error={error} form={form} />
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
