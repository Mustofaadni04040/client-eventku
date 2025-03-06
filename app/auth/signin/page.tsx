"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import AxiosInstance from "@/utils/axiosInstance";
import { ToasterContext } from "@/context/ToasterContext";
import { useRouter } from "next/navigation";
import { config } from "@/configs";
import FormInput from "@/components/ui/FormField";
import AuthLayout from "@/components/layout/authLayout";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password harus lebih dari 6 karakter.",
  }),
});

export default function SigninPage() {
  const [error, setError] = useState<string>("");
  const { setToaster } = useContext(ToasterContext);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await AxiosInstance.post(
        `${config.api_host_dev}/cms/auth/signin`,
        {
          email: values.email,
          password: values.password,
        }
      );
      localStorage.setItem(
        "token",
        JSON.stringify(response?.data?.data?.token)
      );
      console.log(response);
      router.push("/dashboard");
      setToaster({
        variant: "success",
        message: "Login Success",
      });
    } catch (error: any) {
      console.log(error);
      setError(error?.response?.data?.msg || "Internal Server Error");
      setToaster({
        variant: "danger",
        message: error?.response?.data?.msg || "Internal Server Error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <AuthLayout
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        loading={loading}
        error={error}
        textButton="Masuk"
        textLink="Daftar"
        textForm="Belum punya akun?,"
        textTitle="Sign In"
      >
        <FormInput
          form={form}
          label="Email"
          name="email"
          type="email"
          placeholder="example@gmail.com"
        />
        <FormInput
          form={form}
          label="Password"
          name="password"
          type="password"
          placeholder="***********"
        />
      </AuthLayout>
    </div>
  );
}
