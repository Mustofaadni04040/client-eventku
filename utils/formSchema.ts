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

export const PaymentFormSchema = z.object({
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

export type TalentFormSchema = z.infer<typeof talentFormSchema>;
export type PaymentFormSchema = z.infer<typeof PaymentFormSchema>;
