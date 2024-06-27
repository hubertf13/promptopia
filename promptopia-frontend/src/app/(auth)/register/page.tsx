"use client"

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { RegisterForm } from "@/components/RegisterForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaRegister } from "@/lib/schemas";
import { z } from "zod";
import { useEffect } from "react";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Register() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
      if (auth.isUserLoggedIn && !auth.isLoading) {
          router.push("/");
      }
  }, [auth.isUserLoggedIn, auth.isLoading, router]);

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
    try {
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

      if (response.token) {
        localStorage.setItem("jwt", response.token);
        auth.setIsUserLoggedIn(true);
        router.back();
      } else {
        form.setError("root.serverError", {
          message: response.message || "Unexpected error occurred",
        });
      }

    } catch (error) {
      form.setError("root.serverError", {
        message: "An error occurred while registering. Please try again",
      });
    }
  }

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {auth.isUserLoggedIn ? null
      : <RegisterForm form={form} onSubmit={onSubmit} />}
    </>
  );
}