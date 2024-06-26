"use client"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PostForm from "@components/PostForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { schemaPostForm } from "@lib/schemas";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function EditPrompt() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const promptId = searchParams.get('id');

  const form = useForm<z.infer<typeof schemaPostForm>>({
    resolver: zodResolver(schemaPostForm),
    defaultValues: {
      prompt: "",
      tag: "",
    },
  });

  useEffect(() => {
    const getPromptDetails = async () => {
        const response = await fetch(new URL(`/api/v1/post/${promptId}`, baseUrl), {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("jwt")}`
            },
            cache: "no-cache",
        }).then(res => res.json());
        
        form.reset({
            prompt: response.prompt, 
            tag: response.tag
        });
    };

    if (promptId) {
        getPromptDetails();
    }
  }, [promptId, form]);

  const updatePrompt = async (values: z.infer<typeof schemaPostForm>) => {

    setSubmitting(true);

    if (!promptId)
        return alert("Prompt ID not found")

    const response = await fetch(new URL(`/api/v1/post`, baseUrl), {
        method: "PATCH",
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
      type="Edit"
      submitting={submitting}
      onSubmit={updatePrompt}
    />
  );
}

