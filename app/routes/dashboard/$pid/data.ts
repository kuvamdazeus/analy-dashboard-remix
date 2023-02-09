import { json, LoaderArgs, redirect } from "@remix-run/node";
import {
  getChartData,
  getCountryData,
  getPagesSummaryData,
  getRealtimeData,
  getReferrerData,
  getSummaryData,
} from "~/helpers/data.server";
import { verifyUserNoRedirect } from "~/middlewares/verifyUser";
import { client } from "~/prisma-client.server";
import { Duration, RequestDataType } from "~/types";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await verifyUserNoRedirect(request);
  const projectId = new URL(request.url).pathname.split("/").at(-2) as string;

  if (!userId) {
    const project = await client.project.findUniqueOrThrow({ where: { id: projectId } });

    if (!project.is_public) return redirect("/");
  }

  const type = new URL(request.url).searchParams.get("type") as RequestDataType;
  const duration = new URL(request.url).searchParams.get("duration") as Duration;

  switch (type) {
    case "summary":
      return json(await getSummaryData(projectId, duration));
    case "chart":
      return json(await getChartData(projectId, duration));
    case "pages":
      return json(await getPagesSummaryData(projectId, duration));
    case "referrer":
      return json(await getReferrerData(projectId));
    case "country":
      return json(await getCountryData(projectId));
    case "realtime":
      return json(await getRealtimeData(projectId));
  }
};
