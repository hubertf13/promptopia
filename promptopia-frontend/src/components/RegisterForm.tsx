"use client";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Errors } from "./custom/Errors";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useForm } from "react-hook-form";
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const schemaRegister = z.object({
    username: z.string().min(3, {
        message: "Username must be at least 3 characters"
    }).max(20, {
        message: "Username cannot exceed 20 characters",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters"
    }).max(100, {
        message: "Password cannot exceed 100 characters",
    }),
    passwordConfirm: z.string(),
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
}).refine((data) => {
    return data.password === data.passwordConfirm;
}, {
    message: "Passwords do not match",
    path: ["passwordConfirm"]
});

export function RegisterForm() {
    const router = useRouter();
    const auth = useAuth();
    const form = useForm<z.infer<typeof schemaRegister>>({
        resolver: zodResolver(schemaRegister),
        defaultValues: {
            username: "",
            password: "",
            passwordConfirm: "",
            email: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof schemaRegister>) => {

        const response = await fetch(new URL("/api/v1/auth/register", baseUrl), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: values.username,
                email: values.email,
                password: values.password
            }),
            cache: "no-cache",
        }).then(res => res.json());

        if (response.error) {
            form.setError("root.serverError", {
                message: response.error,
            });
            return;
        }

        localStorage.setItem("jwt", response.token);
        auth.setIsUserLoggedIn(true);
        router.back();
    }

    return (
        <div className="w-full max-w-md">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-3xl font-bold">Register</CardTitle>
                            <CardDescription>
                                Enter your details to create a new account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="username"
                                                type="username"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="example@mail.com"
                                                type="email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="password"
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="passwordConfirm"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password Confirm</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="password confirm"
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="flex flex-col">
                            <Button type="submit" className="w-full">Create account</Button>
                            {form.formState.errors.root?.serverError.message &&
                                <Errors error={form.formState.errors.root?.serverError.message} />
                            }
                        </CardFooter>
                    </Card>
                    <div className="mt-4 text-center text-sm">
                        Have an account?
                        <Link className="underline ml-2" href="/login">
                            Log In
                        </Link>
                    </div>
                </form>
            </Form>
        </div>
    );
}