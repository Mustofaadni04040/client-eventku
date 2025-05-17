import React, { useEffect, useState } from "react";
import { Form } from "../ui/form";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button/index";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  form,
  children,
  onSubmit,
  loading,
  error,
  textButton,
  textLink,
  textForm,
  textTitle,
}: any) {
  const [redirect, setRedirect] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (token && token !== "undefined" && token !== "null") {
      router.push("/dashboard");
    } else {
      setRedirect(false);
    }
  }, [router]);

  if (redirect) return;

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="min-w-96 flex flex-col gap-3 p-5 border border-slate-200 rounded-xl"
        >
          <div className="my-3 flex flex-col items-center space-y-1">
            <Image
              src={"/EventKu.svg"}
              width={150}
              height={50}
              priority
              alt="logo"
              className="mx-auto w-36 h-auto"
            />
            <p className="text-lg">{textTitle}</p>
          </div>
          {children}
          {form.formState.errors && (
            <p className="text-xs text-red-500">
              {form.formState.errors.password?.message}
            </p>
          )}
          {error && !form.formState.errors && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          <Button
            disabled={loading}
            loading={loading}
            type="submit"
            classname="w-full mt-3 disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-white hover:bg-primary/90"
          >
            {textButton}
          </Button>
          <p className="text-center text-sm">
            {textForm}{" "}
            <Link href="/auth/signup" className="text-primary">
              {textLink}
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
