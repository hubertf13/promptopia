"use client"

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@components/AuthProvider";
import { LoginForm } from "@components/LoginForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaLogin } from "@lib/schemas";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Login() {
  const auth = useAuth();
  const router = useRouter();

  if (auth.isUserLoggedIn) {
    router.back();
  }
  
  const form = useForm<z.infer<typeof schemaLogin>>({
      resolver: zodResolver(schemaLogin),
      defaultValues: {
          password: "",
          email: "",
      },
  });

  const onSubmit = async (values: z.infer<typeof schemaLogin>) => {

      const response = await fetch(new URL("/api/v1/auth/authenticate", baseUrl), {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              email: values.email,
              password: values.password
          }),
          cache: "no-cache",
      });

      if (!response.ok) {
          form.setError("root.serverError", {
              message: "Invalid email or password",
          });
          return;
      }

      const responseData = await response.json();
      localStorage.setItem("jwt", responseData.token);
      auth.setIsUserLoggedIn(true);
      router.back();
  }

  return (
    <LoginForm form={form} onSubmit={onSubmit} />
  );
}