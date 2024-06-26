import { z } from "zod";

export const schemaLogin = z.object({
  email: z.string().email({
      message: "Please enter a valid email address",
  }),
  password: z.string().min(6, {
      message: "Password must be at least 6 characters"
  }).max(100, {
      message: "Password cannot exceed 100 characters",
  }),
});

export const schemaRegister = z.object({
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

export const schemaPostForm = z.object({
    prompt: z.string().min(3, {
        message: "Prompt must be at least 3 characters"
    }),
    tag: z.string().min(2, {
        message: "Tag must be at least 2 characters"
    }),
});