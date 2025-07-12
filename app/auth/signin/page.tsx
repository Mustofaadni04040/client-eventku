"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { ToasterContext } from "@/context/ToasterContext";
import { useRouter } from "next/navigation";
import FormInput from "@/components/ui/FormField";
import AuthLayout from "@/components/layout/authLayout";
import { postData } from "@/utils/fetch";
import { useDispatch } from "react-redux";
import {
  setEmail,
  setRefreshToken,
  setRole,
  setToken,
} from "@/redux/auth/authSlice";
import { setAuth } from "@/utils/authStorage";

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
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const response = await postData("/cms/auth/signin", {
      email: values.email,
      password: values.password,
    });

    if (response?.status === 200) {
      router.push("/");
      setAuth({
        token: response?.data?.data?.token,
        refreshToken: response?.data?.data?.refreshToken,
        email: response?.data?.data?.email,
        role: response?.data?.data?.role,
      });

      dispatch(setEmail(response?.data?.data?.email));
      dispatch(setRefreshToken(response?.data?.data?.refreshToken));
      dispatch(setToken(response?.data?.data?.token));
      dispatch(setRole(response?.data?.data?.role));

      setToaster({
        variant: "success",
        message: "Login Success",
      });
    } else {
      console.log("error", error);
      setError(response?.response?.data?.msg ?? "Internal Server Error");
      setToaster({
        variant: "danger",
        message: response?.response?.data?.msg ?? "Internal Server Error",
      });
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
