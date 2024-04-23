"use client";

import { z } from "zod";

import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { Errors } from "./custom/Errors";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const schemaLogin = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters"
    }).max(100, {
        message: "Password cannot exceed 100 characters",
    }),
});

export function LoginForm() {
    const router = useRouter();
    const auth = useAuth();
    const form = useForm<z.infer<typeof schemaLogin>>({
        resolver: zodResolver(schemaLogin),
        defaultValues: {
            password: "",
            email: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof schemaLogin>) => {

        const response = await fetch(new URL("/api/v1/auth/authenticate", baseUrl), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: values.email,
                password: values.password
            }),
            cache: "no-cache",
        });

        if (!response.ok) {
            form.setError("root.serverError", {
                message: "Invalid email or password",
            });
            return;
        }

        const responseData = await response.json();
        localStorage.setItem("jwt", responseData.token);
        auth.setIsUserLoggedIn(true);
        router.back();
    }

    return (
        <div className="w-full max-w-md">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-3xl font-bold">Login</CardTitle>
                            <CardDescription>
                                Enter your details to log in to your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                        </CardContent>
                        <CardFooter className="flex flex-col">
                            <Button type="submit" className="w-full">Login</Button>
                            {form.formState.errors.root?.serverError.message &&
                                <Errors error={form.formState.errors.root?.serverError.message} />
                            }
                        </CardFooter>
                    </Card>
                    <div className="mt-4 text-center text-sm">
                        Do not have an account?
                        <Link className="underline ml-2" href="/register">
                            Register
                        </Link>
                    </div>
                </form>
            </Form>
        </div>
    );
}