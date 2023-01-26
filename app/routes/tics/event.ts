import { ActionArgs, json } from "@remix-run/node";
import { client } from "~/prisma-client.server";

export const action = async ({ request }: ActionArgs) => {
  const { session, event } = await request.json();
  if (!session || !event || !session.project_key)
    return json({ message: "Malformed request" }, { status: 400 });

  await client.session.upsert({
    where: {
      id: session.id,
    },
    create: session,
    update: {},
  });

  await client.event.create({
    data: event,
  });

  return json({ message: "OK" });
};
