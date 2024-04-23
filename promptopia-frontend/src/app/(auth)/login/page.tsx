"use client"

import { useRouter } from "next/navigation";
import { useAuth } from "@components/AuthProvider";
import { LoginForm } from "@components/LoginForm";

export default function Login() {
  const auth = useAuth();
  const router = useRouter();

  if (auth.isUserLoggedIn) {
    router.back();
  }

  return (
    <LoginForm />
  );
}