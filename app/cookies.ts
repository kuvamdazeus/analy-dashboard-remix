import { createCookie } from "@remix-run/node";

export const userCookie = createCookie("user", {
  sameSite: "strict",
  secrets: [process.env.COOKIE_SECRET as string],
});
