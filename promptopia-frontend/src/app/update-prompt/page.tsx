"use client"

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import PostForm from "@/components/PostForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { schemaPostForm } from "@/lib/schemas";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function EditPrompt() {
  const auth = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");

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

  useEffect(() => {
    const getPromptDetails = async () => {
      try {
        const response = await fetch(new URL(`/api/v1/post/${promptId}`, baseUrl), {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
          },
          cache: "no-cache",
        });

        if (response.ok) {
          const responseData = await response.json();
          form.reset({
            prompt: responseData.prompt,
            tag: responseData.tag,
          });
          
        } else {
          const responseData = await response.json();
          form.setError("root.serverError", {
            message: responseData.message || "Unexpected error occurred",
          });
        }

      } catch (error) {
        form.setError("root.serverError", {
          message: "An error occurred while searching for prompt.",
        });
      }
    }

    if (promptId) {
      getPromptDetails();
    }

  }, [promptId, form]);

  const updatePrompt = async (values: z.infer<typeof schemaPostForm>) => {
    setSubmitting(true);

    if (!promptId) {
      form.setError("root.serverError", {
        message: "Prompt ID not found",
      });
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(new URL(`/api/v1/post/update/${promptId}`, baseUrl), {
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
      });
  
      if (!response.ok) {
        const responseData = await response.json();
        form.setError("root.serverError", {
          message: responseData.message || "Failed to edit prompt",
        });
        setSubmitting(false);
        return;
      }
  
      router.push("/");
      form.reset();

    } catch (error) {
      form.setError("root.serverError", {
        message: "An error occurred while updating prompt.",
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
        type="Edit"
        submitting={submitting}
        onSubmit={updatePrompt}
      />}
    </>
  );
}

