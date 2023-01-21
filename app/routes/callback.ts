import { createCookie, LoaderArgs, redirect } from "@remix-run/node";
import { json } from "react-router";
import { client } from "~/prisma-client";
import { GH_CLIENT_ID } from "~/config";

export const loader = async ({ request, params, context }: LoaderArgs) => {
  const code = new URL(request.url).searchParams.get("code");

  const { access_token } = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: GH_CLIENT_ID,
      client_secret: process.env.GH_CLIENT_SECRET,
      code,
    }),
  }).then((res) => res.json());

  // get github user data from the access token
  const { login, avatar_url, email, name } = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${access_token}`,
    },
  }).then((res) => res.json());

  const { id } = await client.user.upsert({
    where: { email },
    update: {},
    create: {
      username: login,
      email,
      name,
      avatar_url,
    },
  });

  const cookie = createCookie("user", { sameSite: "strict", secrets: [process.env.COOKIE_SECRET as string] });

  return redirect("/dashboard", { headers: { "Set-Cookie": await cookie.serialize(id) } });
};
