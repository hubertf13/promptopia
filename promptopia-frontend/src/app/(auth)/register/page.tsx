"use client"

import { useRouter } from "next/navigation";
import { useAuth } from "@components/AuthProvider";
import { RegisterForm } from "@components/RegisterForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaRegister } from "@lib/schemas";
import { z } from "zod";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Register() {
  const auth = useAuth();
  const router = useRouter();

  if (auth.isUserLoggedIn) {
    router.back();
  }

  const form = useForm<z.infer<typeof schemaRegister>>({
    resolver: zodResolver(schemaRegister),
    defaultValues: {
      username: "",
      password: "",
      passwordConfirm: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schemaRegister>) => {

    const response = await fetch(new URL("/api/v1/auth/register", baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: values.username,
        email: values.email,
        password: values.password
      }),
      cache: "no-cache",
    }).then(res => res.json());

    if (response.error) {
      form.setError("root.serverError", {
        message: response.error,
      });
      return;
    }

    localStorage.setItem("jwt", response.token);
    auth.setIsUserLoggedIn(true);
    router.back();
  }

  return (
    <RegisterForm form={form} onSubmit={onSubmit} />
  );
}