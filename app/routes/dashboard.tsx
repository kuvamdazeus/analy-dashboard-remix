import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { userCookie } from "~/cookies";
import { client } from "~/prisma-client";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await userCookie.parse(request.headers.get("Cookie") || "");

  const user = await client.user.findUniqueOrThrow({ where: { id: userId }, include: { projects: true } });

  return json(user, { status: userId ? 200 : 401 });
};

export default function Dashboard() {
  const user = useLoaderData<typeof loader>();

  return (
    <div>
      <p className="text-3xl">
        Dashboard
        <br />
        <img src={user.avatar_url} className="" />
      </p>
    </div>
  );
}
