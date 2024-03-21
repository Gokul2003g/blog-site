import { Hono } from "hono";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.post("/", (c) => {
  return c.text("Blog Route");
});

blogRouter.put("/", (c) => {
  return c.text("Signup Route");
});

blogRouter.get("/:id", (c) => {
  const id = c.req.param("id");
  console.log(id);
  return c.text("get blog route");
});

blogRouter.get("/bulk", (c) => {
  return c.text("Get blogs in Bulk");
});
