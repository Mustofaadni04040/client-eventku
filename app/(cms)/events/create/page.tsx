"use client";

import React, { useContext, useEffect, useState } from "react";
import Button from "@/components/ui/Button/index";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { ToasterContext } from "@/context/ToasterContext";
import Breadcrumbs from "@/components/fragments/Breadcrumb";
import { useRouter } from "next/navigation";
import { fetchOptions, postData } from "@/utils/fetch";
import { uploadImage } from "@/utils/uploadImage";
import { eventFormSchema } from "@/utils/formSchema";
import { CategoryType, TalentType } from "@/types/events.type";
import moment from "moment";
import EventForm from "@/components/fragments/Events/EventForm";

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
            <EventForm
              form={form}
              dataCategories={dataCategories}
              dataTalents={dataTalents}
            />

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
