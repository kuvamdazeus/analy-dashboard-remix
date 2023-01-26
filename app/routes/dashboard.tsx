import { useEffect } from "react";
import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import type { User, Project } from "@prisma/client";
import { userCookie } from "~/cookies";
import { client } from "~/prisma-client.server";
import useUserStore from "~/state/user";
import verifyUser from "~/middlewares/verifyUser";
import NavProject from "~/components/Dashboard/NavProject";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await verifyUser(request);

  const user = await client.user.findUniqueOrThrow({ where: { id: userId }, include: { projects: true } });

  return json(user, { status: userId ? 200 : 401 });
};

export type OutletContext = {
  user: User & {
    projects: Project[];
  };
};

export default function Dashboard() {
  const user = useLoaderData<typeof loader>();
  const location = useLocation();

  const { setUser } = useUserStore();

  useEffect(() => {
    setUser(user);
  }, []);

  const displayProjectName = /dashboard\/.+\-.+\-.+/.test(location.pathname);

  return (
    <div className="h-screen">
      <nav className="px-5 py-5 flex items-center justify-between bg-white border-b border-dashed border-gray-400">
        {displayProjectName ? <NavProject /> : <div />}

        <div className="flex items-center">
          <div className="rounded p-1 pr-3 border bg-gray-100 -mr-2.5">
            <p className="text-sm font-bold">
              <span className="text-md text-gray-500 mr-0.5 font-bold">@</span>
              {user.username}
            </p>
          </div>

          <img
            src={user.avatar_url}
            className="h-12 w-12 object-contain rounded-full border-2 border-gray-500"
          />
        </div>
      </nav>

      <Outlet context={{ user }} />
    </div>
  );
}
