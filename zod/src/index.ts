import z from "zod";

export const signupSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export const updatePostSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  content: z.string().min(1),
  published: z.boolean(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
