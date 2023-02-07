import { Box, HStack } from "@chakra-ui/react";
import { json, LoaderArgs } from "@remix-run/node";
import DashboardChart from "~/components/Dashboard/DashboardChart";
import RealtimeStats from "~/components/Dashboard/RealtimeStats";
import Summary from "~/components/Dashboard/Summary";
import TopPages from "~/components/Dashboard/TopPages";
import TopSources from "~/components/Dashboard/TopSources";
import { getChartData, getPagesSummaryData, getReferrerData, getSummaryData } from "~/helpers/data.server";
import verifyUser from "~/middlewares/verifyUser";

export const loader = async ({ request }: LoaderArgs) => {
  await verifyUser(request);

  const projectId = new URL(request.url).pathname.split("/").at(-1) as string;

  const [summaryData, pagesSummaryData, referrerData, chartData] = await Promise.all([
    getSummaryData(projectId),
    getPagesSummaryData(projectId),
    getReferrerData(projectId),
    getChartData(projectId),
  ]);

  return json({ summaryData, pagesSummaryData, referrerData, chartData }, { status: 200 });
};

export default function DashboardProject() {
  return (
    <Box className="p-5 bg-gray-100">
      <HStack spacing="5" mb="5" h="64">
        <Summary />

        <TopPages />

        <TopSources />
      </HStack>

      <DashboardChart />

      <HStack spacing="5" my="5">
        <RealtimeStats />
      </HStack>
    </Box>
  );
}
