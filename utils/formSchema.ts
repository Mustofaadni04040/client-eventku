import { z } from "zod";

export const talentFormSchema = z.object({
  name: z.string().min(6, {
    message: "Nama talent harus lebih dari 6 karakter.",
  }),
  role: z.string().min(4, {
    message: "Role talent harus lebih dari 4 karakter.",
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

export const paymentFormSchema = z.object({
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

export const categoryFormSchema = z.object({
  name: z.string().min(6, {
    message: "Nama kategori harus lebih dari 6 karakter.",
  }),
});

export const eventFormSchema = z.object({
  title: z.string().min(2, {
    message: "Nama event harus lebih dari 2 karakter.",
  }),
  date: z.string(),
  image: z
    .any()
    .refine((file) => file?.length === 1, {
      message: "Wajib upload satu file.",
    })
    .refine((file) => file?.[0]?.type?.startsWith("image/"), {
      message: "File harus berupa gambar.",
    }),
  about: z.string().min(10, {
    message: "Deskripsi event harus lebih dari 10 karekter.",
  }),
  venueName: z.string().min(4, {
    message: "Nama venue harus lebih dari 4 karakter.",
  }),
  tagline: z.string().min(4, {
    message: "Tagline harus lebih dari 4 karakter.",
  }),
  keyPoint: z.array(z.string()),
  tickets: z.array(
    z.object({
      type: z.string().min(2, {
        message: "Tipe tiket harus lebih dari 2 karakter.",
      }),
      statusTicketCategories: z.any(),
      stock: z.any(),
      price: z.any(),
    })
  ),
  category: z.any(),
  talent: z.any(),
  statusEvent: z.string().min(1, {
    message: "Status Event harus diisi.",
  }),
});

export type TalentFormSchema = z.infer<typeof talentFormSchema>;
export type paymentFormSchema = z.infer<typeof paymentFormSchema>;
export type categoryFormSchema = z.infer<typeof categoryFormSchema>;
export type eventFormSchema = z.infer<typeof eventFormSchema>;
