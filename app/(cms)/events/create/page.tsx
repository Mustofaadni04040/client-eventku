"use client";

import React, { useContext, useEffect, useState } from "react";
import Button from "@/components/ui/Button/index";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormLabel } from "@/components/ui/form";
import FormInput from "@/components/ui/FormField";
import { ToasterContext } from "@/context/ToasterContext";
import Breadcrumbs from "@/components/fragments/Breadcrumb";
import { useRouter } from "next/navigation";
import { fetchOptions, postData } from "@/utils/fetch";
import { uploadImage } from "@/utils/uploadImage";
import { eventFormSchema } from "@/utils/formSchema";
import { SelectComponent } from "@/components/ui/Select/index";
import { CategoryType, TalentType } from "@/types/events.type";
import {
  handleMinusKeyPoint,
  handleMinusTicket,
  handlePlusKeyPoint,
  handlePlusTicket,
} from "@/utils/handleEvent";
import moment from "moment";

export default function CreateEventsPage() {
  const { setToaster } = useContext(ToasterContext);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const token = JSON.parse(localStorage.getItem("token") || "");
  const [dataCategories, setDataCategories] = useState<CategoryType[]>([]);
  const [dataTalents, setDataTalents] = useState<TalentType[]>([]);
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      date: moment().format("YYYY-MM-DD"),
      image: "",
      about: "",
      venueName: "",
      tagline: "",
      keyPoint: [""],
      tickets: [
        {
          type: "",
          statusTicketCategories: "",
          stock: "",
          price: "",
        },
      ],
      category: "",
      talent: "",
      statusEvent: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
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
      const response = await postData("/cms/events", payload, undefined, token);

      if (response?.data?.data) {
        setToaster({
          variant: "success",
          message: `Event berhasil ditambahkan`,
        });
        router.push("/events");
      }
    } catch (error: any) {
      setToaster({
        variant: "danger",
        message: error?.response?.data?.msg || "Terjadi kesalahan server",
      });
    } finally {
      setLoading(false);
    }
  };

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
    <div className="max-w-7xl mx-auto">
      <div className="mt-5 mb-16">
        <Breadcrumbs
          textSecond="events"
          textThird="create"
          urlSecond="/events"
        />
      </div>
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-2xl font-medium mb-4">Tambah Event</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="min-w-96 flex flex-col gap-3 p-5 border border-slate-200 rounded-xl"
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

            <div className="w-full flex justify-end">
              <Button
                loading={loading}
                disabled={loading}
                type="submit"
                classname="w-fit mt-5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tambah
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
