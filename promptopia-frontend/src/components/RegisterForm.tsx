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
import { ZodErrors } from "@/components/custom/ZodErrors";
import { Errors } from "./custom/Errors";
import { redirect } from "next/navigation";
import { useAuth } from "./AuthProvider";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const INITIAL_STATE = {
    data: null,
};

const schemaRegister = z.object({
    username: z.string().min(3).max(20, {
        message: "Username must be between 3 and 20 characters",
    }),
    password: z.string().min(6).max(100, {
        message: "Password must be between 6 and 100 characters",
    }),
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
});

export function RegisterForm() {
    const auth = useAuth();
    
    const registerUserAction = async (prevState: any, formData: FormData) => {

        const validatedFields = schemaRegister.safeParse({
            username: formData.get("username"),
            password: formData.get("password"),
            email: formData.get("email"),
        });

        if (!validatedFields.success) {
            console.log(validatedFields)
            return {
                ...prevState,
                zodErrors: validatedFields.error.flatten().fieldErrors,
                errors: null,
                message: "Missing Fields. Failed to Register.",
            };
        }

        const response = await fetch(new URL("/api/v1/auth/register", baseUrl), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...validatedFields.data }),
            cache: "no-cache",
        }).then(res => res.json());
        
        if (response.error) {
            return {
                ...prevState,
                zodErrors: null,
                errors: response.error,
                message: "Failed to register",
            };
        }
        
        localStorage.setItem("jwt", response.token);
        auth.setIsUserLoggedIn(true);
        redirect("/");
    }

    const [formState, formAction] = useFormState(
        registerUserAction,
        INITIAL_STATE
    );

    return (
        <div className="w-full max-w-md">
            <form action={formAction}>
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-3xl font-bold">Register</CardTitle>
                        <CardDescription>
                            Enter your details to create a new account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="username"
                            />
                            <ZodErrors error={formState?.zodErrors?.username} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
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
                        <button className="w-full">Create account</button>
                        <Errors error={formState.errors} />
                    </CardFooter>
                </Card>
                <div className="mt-4 text-center text-sm">
                    Have an account?
                    <Link className="underline ml-2" href="/login">
                        Log In
                    </Link>
                </div>
            </form>
        </div>
    );
}