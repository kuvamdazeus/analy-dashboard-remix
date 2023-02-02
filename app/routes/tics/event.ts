import { ActionArgs, json } from "@remix-run/node";
import { isDynamicPath } from "~/helpers/general";
import { client } from "~/prisma-client.server";

export const action = async ({ request }: ActionArgs) => {
  const { session, event } = await request.json();
  if (!session || !event || !session.project_key)
    return json({ message: "Malformed request" }, { status: 400 });

  const windowUrl = new URL(event.window_url);
  let parsedUrl = windowUrl.origin;
  windowUrl.pathname.split("/").forEach((path) => {
    if (path) parsedUrl += isDynamicPath(path) ? "/[...]" : `/${path}`;
  });

  await client.session.upsert({
    where: {
      id: session.id,
    },
    create: session,
    update: {},
  });

  await client.event.create({
    data: { ...event, parsed_url: parsedUrl },
  });

  return json({ message: "OK" });
};
