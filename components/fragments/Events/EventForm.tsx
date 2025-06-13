import { FormLabel } from "@/components/ui/form";
import FormInput from "@/components/ui/FormField";
import React from "react";
import { SelectComponent } from "@/components/ui/Select/index";
import {
  handleMinusKeyPoint,
  handleMinusTicket,
  handlePlusKeyPoint,
  handlePlusTicket,
} from "@/utils/handleEvent";
import Button from "../../ui/Button/index";

export default function EventForm({ form, dataCategories, dataTalents }: any) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <FormInput
          form={form}
          name="title"
          label="Judul Event"
          type="text"
          placeholder="Masukkan judul event"
        />
        <FormInput form={form} name="date" label="Waktu Event" type="date" />
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
      {form.watch("keyPoint")?.map((_: any, index: number) => (
        <div key={index}>
          <FormInput
            form={form}
            name={`keyPoint.${index}`}
            label="Key Point"
            type="text"
            placeholder={`Masukkan Key Point ${index + 1}`}
          />
          {/* Hapus key point logic*/}
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
      {/* Tambah key point logic*/}
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
      {form.watch("tickets")?.map((_: any, index: number) => (
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
          {/* Hapus tiket logic */}
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
      {/* Tambah tiket logic */}
      <Button
        type="button"
        onClick={() => handlePlusTicket(form)}
        classname="w-fit bg-transparent border border-green-500 text-greenborder-green-500 hover:bg-slate-100 flex items-center text-green-500"
      >
        Tambah Tiket <i className="bx bx-plus-circle text-lg" />
      </Button>
    </>
  );
}
