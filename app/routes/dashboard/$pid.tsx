import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import verifyUser from "~/middlewares/verifyUser";
import { client } from "~/prisma-client.server";

export const loader = async ({ request }: LoaderArgs) => {
  await verifyUser(request);

  const projectId = new URL(request.url).pathname.split("/").at(-1);

  const project = await client.project.findUniqueOrThrow({
    where: { id: projectId },
    include: {
      user: true,
      sessions: {
        take: 100,
      },
    },
  });

  return json(project);
};

export default function DashboardProject() {
  const project = useLoaderData<typeof loader>();

  return (
    <div>
      <p>Project: {project.key}</p>
    </div>
  );
}
