import { Box, HStack } from "@chakra-ui/react";
import { json, LoaderArgs } from "@remix-run/node";
import { ClientOnly } from "remix-utils";
import DashboardChart from "~/components/Dashboard/DashboardChart";
import Summary from "~/components/Dashboard/Summary";
import TopPages from "~/components/Dashboard/TopPages";
import { get7DaysChartData, getPagesSummaryData, getTodaySummaryData } from "~/helpers/data.server";
import verifyUser from "~/middlewares/verifyUser";

export const loader = async ({ request }: LoaderArgs) => {
  await verifyUser(request);

  const projectId = new URL(request.url).pathname.split("/").at(-1) as string;

  const [summaryData, pagesSummaryData, chartData] = await Promise.all([
    getTodaySummaryData(projectId),
    getPagesSummaryData(projectId),
    get7DaysChartData(projectId),
  ]);

  return json({ summaryData, pagesSummaryData, chartData }, { status: 200 });
};

export default function DashboardProject() {
  return (
    <Box className="p-5 bg-gray-100 h-full">
      <HStack spacing="5" mb="5" h="64">
        <Summary />

        <TopPages />
      </HStack>

      <ClientOnly>{() => <DashboardChart />}</ClientOnly>
    </Box>
  );
}
