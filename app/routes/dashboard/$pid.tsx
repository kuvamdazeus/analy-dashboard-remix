import { Box, HStack } from "@chakra-ui/react";
import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import DashboardChart from "~/components/Dashboard/DashboardChart";
import RealtimeStats from "~/components/Dashboard/RealtimeStats";
import Summary from "~/components/Dashboard/Summary";
import TopPages from "~/components/Dashboard/TopPages";
import TopSources from "~/components/Dashboard/TopSources";
import { getChartData, getPagesSummaryData, getReferrerData, getSummaryData } from "~/helpers/data.server";
import verifyUser from "~/middlewares/verifyUser";
import { client } from "~/prisma-client.server";

export const loader = async ({ request }: LoaderArgs) => {
  const projectId = new URL(request.url).pathname.split("/").at(-1) as string;

  const [summaryData, pagesSummaryData, referrerData, chartData] = await Promise.all([
    getSummaryData(projectId),
    getPagesSummaryData(projectId),
    getReferrerData(projectId),
    getChartData(projectId),
  ]);

  return json({ summaryData, pagesSummaryData, referrerData, chartData }, { status: 200 });
};

export const action = async ({ request }: ActionArgs) => {
  await verifyUser(request);

  const projectId = new URL(request.url).pathname.split("/").at(-1) as string;
  const { isPublic } = await request.json();

  if (!projectId) throw new Error("Project ID is required");

  await client.project.update({
    where: { id: projectId },
    data: { is_public: isPublic },
  });

  return json(null, { status: 200 });
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
