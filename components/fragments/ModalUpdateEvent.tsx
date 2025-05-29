import React, { useContext, useEffect, useState } from "react";
import Modal from "../layout/modalLayout";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import Button from "../ui/Button/index";
import FormInput from "../ui/FormField";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormLabel } from "../ui/form";
import { fetchOptions, putData } from "@/utils/fetch";
import { ToasterContext } from "@/context/ToasterContext";
import { uploadImage } from "@/utils/uploadImage";
import { EventType } from "@/types/events.type";
import { eventFormSchema } from "@/utils/formSchema";
import {
  handleMinusKeyPoint,
  handleMinusTicket,
  handlePlusKeyPoint,
  handlePlusTicket,
} from "@/utils/handleEvent";
import { SelectComponent } from "@/components/ui/Select/index";
import moment from "moment";

export default function ModalUpdateEvent({
  openModal,
  setOpenModal,
  loading,
  setLoading,
  selectedEvent,
  setData,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEvent: EventType;
  setData: React.Dispatch<React.SetStateAction<any>>;
}) {
  const { setToaster } = useContext(ToasterContext);
  const token = JSON.parse(localStorage.getItem("token") || "");
  const [dataCategories, setDataCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [dataTalents, setDataTalents] = useState<
    { value: string; label: string }[]
  >([]);
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: selectedEvent?.title,
      date: moment(selectedEvent?.date).format("YYYY-MM-DD"),
      image: "",
      about: selectedEvent?.about,
      venueName: selectedEvent?.venueName,
      tagline: selectedEvent?.tagline,
      keyPoint: selectedEvent?.keyPoint,
      tickets: selectedEvent?.tickets?.map((item: any) => ({
        type: item?.type,
        statusTicketCategories: item?.statusTicketCategories,
        stock: item?.stock,
        price: item?.price,
      })) || [
        {
          type: "",
          statusTicketCategories: "",
          stock: "",
          price: "",
        },
      ],
      category: selectedEvent?.category?._id || "",
      talent: selectedEvent?.talent?._id || "",
      statusEvent: selectedEvent?.statusEvent,
    },
  });

  useEffect(() => {
    // reset form setiap open modal
    if (openModal) {
      form.reset({
        title: selectedEvent?.title,
        date: selectedEvent?.date,
        about: selectedEvent?.about,
        venueName: selectedEvent?.venueName,
        tagline: selectedEvent?.tagline,
        keyPoint: selectedEvent?.keyPoint,
        tickets: selectedEvent?.tickets?.map((item: any) => ({
          type: item?.type,
          statusTicketCategories: item?.statusTicketCategories,
          stock: item?.stock,
          price: item?.price,
        })),
        category: selectedEvent?.category?._id,
        talent: selectedEvent?.talent?._id,
        statusEvent: selectedEvent?.statusEvent,
      });
    }
  }, [form, openModal, selectedEvent]);

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
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

      const imageRes = await uploadImage(file, token, "/cms/images", "avatar");
      const imageId = imageRes?.data?.data?._id;
      const updatedCategory = dataCategories.find(
        (item) => item.value === form.getValues("category")
      );
      const updatedTalent = dataTalents.find(
        (item) => item.value === form.getValues("talent")
      );

      const payload = {
        date: values.date,
        image: imageId,
        title: values.title,
        about: values.about,
        venueName: values.venueName,
        tagline: values.tagline,
        keyPoint: values.keyPoint,
        category: form.getValues("category"),
        talent: form.getValues("talent"),
        statusEvent: values.statusEvent,
        tickets: values.tickets,
      };

      console.log("payload", payload);

      const response = await putData(
        `/cms/events/${selectedEvent?._id}`,
        payload,
        token
      );

      if (response?.data?.data) {
        setOpenModal(false);
        setData((prev: any) =>
          prev.map((item: EventType) =>
            item._id === selectedEvent?._id
              ? {
                  ...item,
                  title: values.title,
                  date: values.date,
                  venueName: values.venueName,
                  category: {
                    _id: form.getValues("category"),
                    name: updatedCategory?.label,
                  },
                  talent: {
                    _id: form.getValues("talent"),
                    name: updatedTalent?.label,
                  },
                }
              : item
          )
        );
        setToaster({
          variant: "success",
          message: "Event berhasil diupdate",
        });
      }
    } catch (err: any) {
      console.log(err);
      setToaster({
        variant: "danger",
        message: err?.response?.data?.msg || "Internal Server Error",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token") || "");
        const [categoriesResponse, talentsResponse] = await Promise.all([
          fetchOptions(`/cms/categories`, token),
          fetchOptions(`/cms/talents`, token),
        ]);

        setDataCategories(categoriesResponse);
        setDataTalents(talentsResponse);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDropdownData();
  }, []);

  return (
    <Modal
      openModal={openModal}
      setOpenModal={setOpenModal}
      title="Update Event"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              form={form}
              name="title"
              label="Judul Event"
              type="text"
              placeholder="Masukkan judul event"
            />
            <FormInput
              form={form}
              name="date"
              label="Waktu Event"
              type="date"
            />
            <FormInput
              form={form}
              name="about"
              label="Deskripsi Event"
              type="text"
              placeholder="Masukkan deskripsi event"
            />
            <FormInput
              form={form}
              name="venueName"
              label="Lokasi Event"
              type="text"
              placeholder="Masukkan Lokasi Event"
            />
            <div className="flex flex-col gap-2">
              <FormLabel htmlFor="category-select">Kategori Event</FormLabel>
              <SelectComponent
                id="category-select"
                value={form.getValues("category")} // mendapatkan value keyword params
                placeholder="Select kategori event"
                options={dataCategories}
                handleChange={(e: string) => {
                  form.setValue("category", e);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <FormLabel htmlFor="talent-select">Talent Event</FormLabel>
              <SelectComponent
                id="talent-select"
                value={form.getValues("talent")} // mendapatkan value keyword params
                placeholder="Select talent event"
                options={dataTalents}
                handleChange={(e: string) => {
                  form.setValue("talent", e);
                }}
              />
            </div>
          </div>
          <FormInput
            form={form}
            name="tagline"
            label="Tagline Event"
            type="text"
            placeholder="Masukkan Tagline Event"
          />
          {form.watch("keyPoint")?.map((_, index) => (
            <div key={index}>
              <FormInput
                form={form}
                name={`keyPoint.${index}`}
                label="Key Point"
                type="text"
                placeholder={`Masukkan Key Point ${index + 1}`}
              />

              {index > 0 && (
                <Button
                  type="button"
                  onClick={() => handleMinusKeyPoint(index, form)}
                  classname="mt-2 bg-transparent border border-red-500 text-red-500 hover:bg-slate-100 flex items-center"
                >
                  Hapus Key Point {index + 1}
                  <i className="bx  bx-minus-circle text-lg" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            onClick={() => handlePlusKeyPoint(form)}
            classname="w-fit bg-transparent border border-green-500 text-greenborder-green-500 hover:bg-slate-100 flex items-center text-green-500"
          >
            Tambah Key Point <i className="bx  bx-plus-circle text-lg" />
          </Button>

          <FormInput
            form={form}
            name="statusEvent"
            label="Status Event"
            type="text"
            placeholder="[Published, Draft]"
          />
          <FormInput
            form={form}
            name="image"
            label="Banner Event"
            type="file"
            placeholder="Masukkan banner event"
          />
          {form.watch("tickets")?.map((_, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-2">
                <FormInput
                  form={form}
                  name={`tickets.${index}.type`}
                  label={`Tipe Tiket ${index + 1}`}
                  type="text"
                  placeholder="Masukkan tipe tiket"
                />
                <FormInput
                  form={form}
                  name={`tickets.${index}.statusTicketCategories`}
                  label={`Status Tiket ${index + 1}`}
                  type="text"
                  placeholder="Masukkan status tiket"
                />
                <FormInput
                  form={form}
                  name={`tickets.${index}.stock`}
                  label={`Stok Tiket ${index + 1}`}
                  type="number"
                  placeholder="Masukkan stok tiket"
                />
                <FormInput
                  form={form}
                  name={`tickets.${index}.price`}
                  label={`Harga Tiket ${index + 1}`}
                  type="number"
                  placeholder="Masukkan harga tiket"
                />
              </div>
              {index > 0 && (
                <Button
                  type="button"
                  onClick={() => handleMinusTicket(index, form)}
                  classname="mt-2 bg-transparent border border-red-500 text-red-500 hover:bg-slate-100 flex items-center"
                >
                  Hapus Tiket {index + 1}
                  <i className="bx bx-minus-circle text-lg" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            onClick={() => handlePlusTicket(form)}
            classname="w-fit bg-transparent border border-green-500 text-greenborder-green-500 hover:bg-slate-100 flex items-center text-green-500"
          >
            Tambah Tiket <i className="bx bx-plus-circle text-lg" />
          </Button>

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
