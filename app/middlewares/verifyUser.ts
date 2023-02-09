import { redirect } from "react-router";
import { userCookie } from "~/cookies";

export default async function verifyUser(request: Request) {
  const userId = await userCookie.parse(request.headers.get("Cookie") || "");
  console.log(request.headers.get("Cookie"));
  if (!userId) throw redirect("/");

  return userId as string;
}

export async function verifyUserNoRedirect(request: Request) {
  const userId = await userCookie.parse(request.headers.get("Cookie") || "");
  if (!userId) return null;

  return userId as string;
}
