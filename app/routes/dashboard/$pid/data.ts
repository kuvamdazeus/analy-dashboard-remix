import { json, LoaderArgs, LoaderFunction, TypedResponse } from "@remix-run/node";
import {
  getChartData,
  getCountryData,
  getPagesSummaryData,
  getReferrerData,
  getSummaryData,
} from "~/helpers/data.server";
import verifyUser from "~/middlewares/verifyUser";
import { Duration, RequestDataType } from "~/types";

export const loader = async ({ request }: LoaderArgs) => {
  await verifyUser(request);

  const projectId = new URL(request.url).pathname.split("/").at(-2) as string;
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
  }
};
