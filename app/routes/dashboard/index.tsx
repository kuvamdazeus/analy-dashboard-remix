import { Divider, HStack, useColorMode } from "@chakra-ui/react";
import { LoaderArgs, json, ActionArgs, redirect } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import { SHA256 } from "crypto-js";
import CreateProject from "~/components/Dashboard/CreateProject";
import Project from "~/components/Dashboard/Project";
import verifyUser from "~/middlewares/verifyUser";
import { client } from "~/prisma-client.server";
import type { OutletContext } from "../dashboard";

export const loader = async ({ request }: LoaderArgs) => {
  await verifyUser(request);
  return json(null);
};

export const action = async ({ request }: ActionArgs) => {
  const user_id = await verifyUser(request);

  const form = await request.formData();
  const errors: any = {};

  const name = form.get("name")?.toString() as string;
  const url = form.get("url")?.toString() as string;

  if (Object.keys(errors).length) return json(errors as { name?: string; url?: string }, { status: 422 });

  const { id: projectId } = await client.project.create({
    data: {
      name,
      url,
      key: SHA256((Date.now() + Math.random()).toString()).toString(),
      user_id,
    },
  });

  return redirect(`/dashboard/${projectId}`);
};

export default function Index() {
  const { user } = useOutletContext<OutletContext>();

  const { colorMode } = useColorMode();

  const color = colorMode === "light" ? "" : "dark";

  return (
    <section className={`${color} p-5`}>
      <HStack flexWrap="wrap" alignItems="center" spacing={5}>
        {user.projects.map((project) => (
          <Project key={project.id} project={project} />
        ))}
      </HStack>

      <Divider className="my-5" />

      <CreateProject />
    </section>
  );
}
