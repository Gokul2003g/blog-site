import { Hono } from "hono";

const app = new Hono();

app.post("/api/v1/user/signup", (c) => {
  return c.text("Signup Route");
});

app.post("/api/v1/user/signin", (c) => {
  return c.text("Signin Route");
});

app.post("/api/v1/blog", (c) => {
  return c.text("Blog Route");
});

app.put("/api/v1/blog", (c) => {
  return c.text("Signup Route");
});

app.get("/api/v1/blog/:id", (c) => {
  const id = c.req.param("id");
  console.log(id);
  return c.text("get blog route");
});

app.get("/api/v1/blog/bulk", (c) => {
  return c.text("Get blogs in Bulk");
});

export default app;
