import { LoaderArgs, redirect } from "@remix-run/node";
import { client } from "~/prisma-client.server";
import { GH_CLIENT_ID } from "~/config";
import { userCookie } from "~/cookies";

export const loader = async ({ request }: LoaderArgs) => {
  const code = new URL(request.url).searchParams.get("code");
  const state = new URL(request.url).searchParams.get("state");

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

  if (state) return redirect(state, { headers: { "Set-Cookie": await userCookie.serialize(id) } });
  return redirect("/dashboard", { headers: { "Set-Cookie": await userCookie.serialize(id) } });
};
