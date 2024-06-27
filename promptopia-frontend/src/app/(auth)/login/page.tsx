"use client"

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { LoginForm } from "@/components/LoginForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaLogin } from "@/lib/schemas";
import { useEffect } from "react";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Login() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isUserLoggedIn && !auth.isLoading) {
      router.push("/");
    }
  }, [auth.isUserLoggedIn, auth.isLoading, router]);

  const form = useForm<z.infer<typeof schemaLogin>>({
    resolver: zodResolver(schemaLogin),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schemaLogin>) => {
    try {
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
          message: "Invalid email or/and password",
        });

      } else {
        const responseData = await response.json();
        if (responseData.token) {
          localStorage.setItem("jwt", responseData.token);
          auth.setIsUserLoggedIn(true);
          router.back();
        } else {
          form.setError("root.serverError", {
            message: responseData.message || "Unexpected error occurred",
          });
        }
      }

    } catch (error) {
      form.setError("root.serverError", {
        message: "An error occurred while logging. Please try again",
      });
    }
  }

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {auth.isUserLoggedIn ? null
        : <LoginForm form={form} onSubmit={onSubmit} />}
    </>
  );
}