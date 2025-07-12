import React, { useContext, useEffect, useState } from "react";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../../ui/form";
import { fetchOptions, putData } from "@/utils/fetch";
import { ToasterContext } from "@/context/ToasterContext";
import { uploadImage } from "@/utils/uploadImage";
import { EventType } from "@/types/events.type";
import { eventFormSchema } from "@/utils/formSchema";
import moment from "moment";
import EventForm from "./EventForm";
import Modal from "@/components/layout/modalLayout";
import Button from "../../ui/Button/index";
import { getAuth } from "@/utils/authStorage";

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
  selectedEvent: EventType | null;
  setData: React.Dispatch<React.SetStateAction<any>>;
}) {
  const { setToaster } = useContext(ToasterContext);
  const { token } = getAuth();
  const safeToken = token || "";
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

    const file = values.image?.[0];
    let imageId: string | undefined;
    let payload;

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

      payload = {
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
    } else {
      payload = {
        date: values.date,
        image: selectedEvent?.image?._id, // use existing image if no new file is uploaded
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
    }

    const updatedCategory = dataCategories.find(
      (item) => item.value === form.getValues("category")
    );
    const updatedTalent = dataTalents.find(
      (item) => item.value === form.getValues("talent")
    );

    const response = await putData(
      `/cms/events/${selectedEvent?._id}`,
      payload,
      token
    );

    if (response?.data?.data) {
      setLoading(false);
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
    } else {
      setLoading(false);
      setOpenModal(false);
      console.log(response?.response?.data?.msg);
      setToaster({
        variant: "danger",
        message: response?.response?.data?.msg || "Internal Server Error",
      });
    }
  }

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const { token } = getAuth();
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
          <EventForm
            form={form}
            dataCategories={dataCategories}
            dataTalents={dataTalents}
          />

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
