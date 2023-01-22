import { json, redirect } from "react-router";
import { userCookie } from "~/cookies";

export default async function verifyUser(request: Request) {
  const userId = await userCookie.parse(request.headers.get("Cookie") || "");
  if (!userId) throw redirect("/");

  return userId as string;
}
