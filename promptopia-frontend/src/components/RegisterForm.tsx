import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Errors } from "./custom/Errors";
import { UseFormReturn } from "react-hook-form";
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import Link from "next/link";
import { schemaRegister } from "@/lib/schemas";

export function RegisterForm({
    form, onSubmit
}: {
    form: UseFormReturn<{
        email: string;
        password: string;
        username: string;
        passwordConfirm: string;
    }, any, undefined>
    onSubmit: (values: z.infer<typeof schemaRegister>) => Promise<void>;
}) {

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