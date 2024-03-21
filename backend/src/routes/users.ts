import { Hono } from "hono";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", (c) => {
  return c.text("Signup Route");
});

userRouter.post("/signin", (c) => {
  return c.text("Signin Route");
});
