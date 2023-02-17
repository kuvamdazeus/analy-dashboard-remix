import { useEffect } from "react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import type { User, Project } from "@prisma/client";
import { client } from "~/prisma-client.server";
import useUserStore from "~/state/user";
import NavProject from "~/components/Dashboard/NavProject";
import { Box, Button, useColorMode } from "@chakra-ui/react";
import { ClientOnly } from "remix-utils";
import { userCookie } from "~/cookies";
import { GITHUB_OAUTH_URI } from "~/config";
import { FiMoon, FiSun } from "react-icons/fi";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await userCookie.parse(request.headers.get("Cookie") || "");

  if (!userId) {
    const user = {
      id: "",
      avatar_url: "",
      email: "johndoe@gmail.com",
      username: "johndoe_8734",
      name: "John Doe",
      projects: [],
    };

    return json(user as Data);
  } else {
    const user = await client.user.findUniqueOrThrow({ where: { id: userId }, include: { projects: true } });
    return json(user as Data);
  }
};

export type Data = User & {
  projects: Project[];
};

export type OutletContext = {
  user: Data;
};

export default function Dashboard() {
  const user = useLoaderData<typeof loader>();
  const location = useLocation();

  const { setUser } = useUserStore();

  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    setUser(user);
  }, []);

  const displayProjectName = /dashboard\/.+\-.+\-.+/.test(location.pathname);
  const projectId = location.pathname.split("/").at(-1);

  const color = colorMode === "light" ? "" : "dark";

  return (
    <div className={`${color} h-screen`}>
      <nav className="px-5 py-5 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-dashed border-gray-400 dark:border-gray-200">
        {displayProjectName && user.projects.filter((project) => project.id === projectId).length ? (
          <NavProject />
        ) : (
          <div />
        )}

        <div className="flex items-center">
          {user.id && (
            <div className="flex items-center">
              <div className="border border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded p-1 pr-3 -mr-2.5">
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
          )}

          {!user.id && (
            <Button
              bg="purple.500"
              w="24"
              className="text-white font-bold"
              onClick={() => (window.location.href = GITHUB_OAUTH_URI(window.location.href))}
            >
              Sign in
            </Button>
          )}

          <div
            onClick={toggleColorMode}
            className="text-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer rounded-full p-2 ml-3 transition-all duration-300"
          >
            {colorMode === "light" ? <FiSun className="" /> : <FiMoon className="" />}
          </div>
        </div>
      </nav>

      <ClientOnly>{() => <Outlet context={{ user }} />}</ClientOnly>
    </div>
  );
}
