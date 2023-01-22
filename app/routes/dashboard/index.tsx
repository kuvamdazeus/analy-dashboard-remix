import { LoaderArgs, json } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import verifyUser from "~/middlewares/verifyUser";
import type { OutletContext } from "../dashboard";

export const loader = async ({ request }: LoaderArgs) => {
  await verifyUser(request);
  return json(null);
};

export default function Index() {
  const { user } = useOutletContext<OutletContext>();

  return <div>Projects: {user.projects.length}</div>;
}
