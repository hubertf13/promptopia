import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Errors } from "./custom/Errors";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { UseFormReturn, useForm } from "react-hook-form";
import Link from "next/link";
import { z } from "zod";
import { schemaLogin } from "@/lib/schemas";

export function LoginForm({
    form, onSubmit
}: {
    form: UseFormReturn<{
        email: string;
        password: string;
    }, any, undefined>;
    onSubmit: (values: z.infer<typeof schemaLogin>) => Promise<void>;
}) {

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