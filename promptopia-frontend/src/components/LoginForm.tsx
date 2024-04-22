"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { z } from "zod";

import {
    CardTitle,
    CardDescription,
    CardHeader,
    CardContent,
    CardFooter,
    Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "./AuthProvider";
import { redirect } from "next/navigation";
import { ZodErrors } from "./custom/ZodErrors";
import { Errors } from "./custom/Errors";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const INITIAL_STATE = {
    data: null,
};

const schemaLogin = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    password: z.string().min(6).max(100, {
        message: "Password must be between 6 and 100 characters",
    }),
});

export function LoginForm() {
    const auth = useAuth();

    const loginUserAction = async (prevState: any, formData: FormData) => {

        const validatedFields = schemaLogin.safeParse({
            email: formData.get("email"),
            password: formData.get("password"),
        });

        if (!validatedFields.success) {
            return {
                ...prevState,
                zodErrors: validatedFields.error.flatten().fieldErrors,
                errors: null,
                message: "Missing Fields. Failed to login.",
            };
        }

        const response = await fetch(new URL("/api/v1/auth/authenticate", baseUrl), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...validatedFields.data }),
            cache: "no-cache",
        });
        
        if (!response.ok) {
            return {
                ...prevState,
                zodErrors: null,
                errors: "Invalid email or password",
                message: "Failed to login",
            };
        }

        const responseData = await response.json();
        localStorage.setItem("jwt", responseData.token);
        auth.setIsUserLoggedIn(true);
        redirect("/");
    }

    const [formState, formAction] = useFormState(
        loginUserAction,
        INITIAL_STATE
    );

    return (
        <div className="w-full max-w-md">
            <form action={formAction}>
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-3xl font-bold">Log In</CardTitle>
                        <CardDescription>
                            Enter your details to log in to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="text"
                                placeholder="example@mail.com"
                            />
                            <ZodErrors error={formState?.zodErrors?.email} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="password"
                            />
                            <ZodErrors error={formState?.zodErrors?.password} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <button className="w-full">Log In</button>
                        <Errors error={formState.errors} />
                    </CardFooter>
                </Card>
                <div className="mt-4 text-center text-sm">
                    Do not have an account?
                    <Link className="underline ml-2" href="/register">
                        Register
                    </Link>
                </div>
            </form>
        </div>
    );
}