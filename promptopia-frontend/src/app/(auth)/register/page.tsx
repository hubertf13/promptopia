"use client"

import { useRouter } from "next/navigation";
import { useAuth } from "@components/AuthProvider";
import { RegisterForm } from "@components/RegisterForm";

export default function Register() {
  const auth = useAuth();
  const router = useRouter();

  if (auth.isUserLoggedIn) {
    router.back();
  }

  return (
    <RegisterForm />
  );
}