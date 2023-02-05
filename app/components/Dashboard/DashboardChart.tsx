import { Box } from "@chakra-ui/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useChartData } from "~/helpers/data.client";
import { useMemo } from "react";
import { loader } from "~/routes/dashboard/$pid";
import { useLoaderData } from "@remix-run/react";

export default function DashboardChart() {
  // const { timeRangeData } = useChartData();
  const { chartData } = useLoaderData<typeof loader>();

  const options: Highcharts.Options = useMemo(
    () => ({
      title: {
        text: "",
      },
      series: [
        {
          data: chartData.map((item) => item._count._all),
          type: "line",
        },
      ],
      xAxis: {
        type: "category",
        title: {
          text: "Days",
        },
        categories: chartData.map((item) => item.date),
      },
      yAxis: {
        title: {
          text: "Views",
        },
      },
    }),
    [chartData]
  );

  return (
    <Box border="1px" borderColor="gray.100" className="bg-white rounded-lg p-1">
      <Box flexGrow={1} borderTopColor="white" className="bg-white h-1/2">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>
    </Box>
  );
}
