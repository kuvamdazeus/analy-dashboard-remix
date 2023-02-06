import { Box, Select } from "@chakra-ui/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useMemo } from "react";
import { loader } from "~/routes/dashboard/$pid";
import { useFetcher, useLoaderData } from "@remix-run/react";
import type { getChartData } from "~/helpers/data.server";
import { DURATIONS } from "~/constants";

export default function DashboardChart() {
  const chart = useFetcher<typeof getChartData>();

  const { chartData } = useLoaderData<typeof loader>();

  const data = chart.data || chartData;

  const options: Highcharts.Options = useMemo(
    () => ({
      title: {
        text: "",
      },
      series: [
        {
          data: data.map((item) => item._count._all),
          type: "line",
        },
      ],
      xAxis: {
        type: "category",
        title: {
          text: "Days",
        },
        categories: data.map((item) => item.date),
      },
      yAxis: {
        title: {
          text: "Views",
        },
      },
    }),
    [chartData, chart.data]
  );

  const fetchChartData = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    chart.load(`${window.location.pathname}/data?type=chart&duration=${e.target.value}`);
  };

  return (
    <Box border="1px" borderColor="gray.100" className="bg-white rounded-lg p-1">
      <Box className="p-5 w-full flex justify-end">
        <Select
          defaultValue="7d"
          size="sm"
          w="max"
          rounded="lg"
          borderColor="gray.500"
          onChange={fetchChartData}
        >
          {DURATIONS.map(
            ({ label, value }) =>
              value !== "today" && (
                <option key={value} value={value}>
                  {label}
                </option>
              )
          )}
        </Select>
      </Box>

      <Box flexGrow={1} borderTopColor="white" className="bg-white h-1/2">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>
    </Box>
  );
}
