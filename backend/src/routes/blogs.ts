import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createPostSchema, updatePostSchema } from "../../../zod/src";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const posts = await prisma.post.findMany();

    return c.json(posts);
  } catch (error) {
    return c.json({ error });
  }
});

blogRouter.use("/", async (c, next) => {
  const authHeader = c.req.header("authorization");
  if (!authHeader) {
    c.status(411);
    return c.json({ error: "Empty header" });
  }

  const token = authHeader.split(" ")[1];
  const success = await verify(token, c.env.JWT_SECRET);

  if (!success) {
    c.status(403);
    return c.json({ error: "Unauthorized" });
  }
  c.set("userId", success.id);
  await next();
});

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get("userId");
  const body = await c.req.json();
  const data = createPostSchema.safeParse(body);

  if (!data.success) {
    return c.json({ error: data.error });
  }

  const { title, content } = data.data;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userId,
      },
    });

    return c.json({ id: post.id });
  } catch (error) {
    return c.json({ error });
  }
});

blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get("userId");
  const body = await c.req.json();
  const data = updatePostSchema.safeParse(body);

  if (!data.success) {
    return c.json({ error: data.error });
  }

  const { title, content, id } = data.data;

  try {
    const post = await prisma.post.update({
      where: {
        id,
        authorId: userId,
      },
      data: {
        title,
        content,
      },
    });

    return c.json({ message: "Updated post: " + post.id });
  } catch (error) {
    return c.json({ error });
  }
});

blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("id");

  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    return c.json(post);
  } catch (error) {
    return c.json({ error });
  }
});
