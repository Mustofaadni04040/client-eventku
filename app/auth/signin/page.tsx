"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button/index";
import Input from "@/components/ui/Input/index";
import AxiosInstance from "@/utils/axiosInstance";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password harus lebih dari 6 karakter.",
  }),
});

export default function SigninPage() {
  const [error, setError] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await AxiosInstance.post("/auth/signin", {
        email: values.email,
        password: values.password,
      });

      console.log(response);
    } catch (error: any) {
      console.log(error.response.data.msg);
      setError(error.response.data.msg);
    }
  }

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="min-w-96 flex flex-col gap-3 p-5 border border-slate-200 rounded-xl"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@gmail.com"
                    {...field}
                    className="text-sm"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="***********"
                    {...field}
                    className="text-sm"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {form.formState.errors && (
            <p className="text-xs text-red-500">
              {form.formState.errors.password?.message}
            </p>
          )}
          {error && !form.formState.errors && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          <Button type="submit" classname="w-full mt-3">
            Sign in
          </Button>
        </form>
      </Form>
    </div>
  );
}
