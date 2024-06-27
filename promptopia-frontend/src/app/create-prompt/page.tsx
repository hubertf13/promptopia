"use client"

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import PostForm from "@/components/PostForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { schemaPostForm } from "@/lib/schemas";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function CreatePrompt() {
  const auth = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
      if (!auth.isUserLoggedIn && !auth.isLoading) {
          router.push("/login");
      }
  }, [auth.isUserLoggedIn, auth.isLoading, router]);

  const form = useForm<z.infer<typeof schemaPostForm>>({
    resolver: zodResolver(schemaPostForm),
    defaultValues: {
      prompt: "",
      tag: "",
    },
  });

  const createPrompt = async (values: z.infer<typeof schemaPostForm>) => {
    setSubmitting(true);

    try {
      const response = await fetch(new URL("/api/v1/post/add", baseUrl), {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: values.prompt,
          tag: values.tag,
        }),
        cache: "no-cache",
      });
  
      if (!response.ok) {
        form.setError("root.serverError", {
          message: "Failed to create prompt",
        });
        setSubmitting(false);
        return;
      }
  
      router.push("/");
      form.reset();

    } catch (error) {
      form.setError("root.serverError", {
        message: "Failed to create prompt",
      });
    }
  };

  if (auth.isLoading) {
      return <div>Loading...</div>;
  }

  return (
    <>
      {!auth.isUserLoggedIn ? null 
      : <PostForm
        form={form}
        type="Create"
        submitting={submitting}
        onSubmit={createPrompt}
      />}
    </>
  );
}

