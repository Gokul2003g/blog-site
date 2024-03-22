import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { signupSchema, signinSchema } from "../../../zod/src/index";
import { sign } from "hono/jwt";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    log: ["query", "info", "warn", "error"], // Enable desired log levels
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const data = signupSchema.safeParse(body);

  if (!data.success) {
    return c.json({ error: data.error });
  }

  const { name, email, password } = data.data;

  try {
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    });

    const token = await sign({ userId: user.id }, c.env.JWT_SECRET);

    return c.json({ token });
  } catch (error) {
    return c.json({ error });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const data = signinSchema.safeParse(body);

  if (!data.success) {
    return c.json({ error: data.error });
  }

  const { email, password } = data.data;

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
        password,
      },
    });

    if (!user) {
      c.status(404);
      return c.json({ error: "User not found." });
    }

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ token });
  } catch (error) {
    return c.json({ error });
  }
});
