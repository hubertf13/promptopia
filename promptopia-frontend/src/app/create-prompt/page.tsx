"use client"

import { useState } from "react";
import { useAuth } from "@components/AuthProvider";
import { useRouter } from "next/navigation";
import Form from "@components/Form";

export default function CreatePrompt() {
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    prompt: "", 
    tag: "", 
  });

  const createPrompt = async () => {

  };


  return (
    <></>
  );
}
