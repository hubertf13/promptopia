"use client"

import { useState } from "react";
import { useAuth } from "@components/AuthProvider";
import { useRouter } from "next/navigation";
import PostForm from "@components/PostForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { schemaPostForm } from "@lib/schemas";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function CreatePrompt() {
  const auth = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof schemaPostForm>>({
    resolver: zodResolver(schemaPostForm),
    defaultValues: {
      prompt: "",
      tag: "",
    },
  });

  const createPrompt = async (values: z.infer<typeof schemaPostForm>) => {

    setSubmitting(true);

    const response = await fetch(new URL("/api/v1/post", baseUrl), {
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
    }).then(res => res.json());

    if (response.error) {
      form.setError("root.serverError", {
        message: response.error,
      });
      setSubmitting(false);
    } else {
      router.push("/");
      setSubmitting(false);
    }
  };

  return (
    <PostForm
      form={form}
      type="Create"
      submitting={submitting}
      onSubmit={createPrompt}
    />
  );
}

