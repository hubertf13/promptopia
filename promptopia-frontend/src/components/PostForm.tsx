import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Errors } from "./custom/Errors";
import Link from "next/link";
import { schemaPostForm } from "@lib/schemas";
import { z } from "zod";

export default function PostForm({
    form, type, submitting, onSubmit
}: {
    form: UseFormReturn<{
        prompt: string;
        tag: string;
    }, any, undefined>;
    type: string;
    submitting: boolean;
    onSubmit: (values: z.infer<typeof schemaPostForm>) => Promise<void>;
}) {

    return (
        <section className="w-full max-w-full flex-start flex-col">
            <h1 className="head_text text-left">
                <span className="blue_gradient">{type} Post</span>
            </h1>
            <p className="desc text-left max-w-md">
                {type} and share amazing prompts with the world and let your imagination run wild with any AI-powered platform.
            </p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism">
                    {form.formState.errors.root?.serverError.message &&
                        <Errors error={form.formState.errors.root?.serverError.message} />
                    }
                    <Label>
                        <span className="font-satoshi font-semibold text-base text-gray-700">
                            Your AI Prompts
                        </span>
                        <FormField
                            control={form.control}
                            name="prompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write your prompt here..."
                                            className="form_textarea"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </Label>
                    <Label>
                        <span className="font-satoshi font-semibold text-base text-gray-700">
                            Tag {` `}
                            <span className="font-normal">(#product, #webdevelopment, #idea)</span>
                        </span>
                        <FormField
                            control={form.control}
                            name="tag"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="#tag"
                                            className="form_input"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </Label>
                    <div className="flex-end mx-3 mb-5 gap-4">
                        <Link href="/" className="text-gray-500 text-sm">
                            Cancel
                        </Link>
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white"
                        >
                            {submitting ? `${type}...` : type}
                        </Button>
                    </div>
                </form>
            </Form>

        </section>
    )
}