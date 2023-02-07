import { Box, Select } from "@chakra-ui/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useEffect, useMemo } from "react";
import { useFetcher, useLocation } from "@remix-run/react";
import type { getChartData } from "~/helpers/data.server";
import { DURATIONS } from "~/constants";

export default function DashboardChart() {
  const location = useLocation();
  const chart = useFetcher<typeof getChartData>();

  const options: Highcharts.Options = useMemo(
    () => ({
      title: {
        text: "",
      },
      series: [
        {
          data: chart.data ? chart.data.map((item) => item._count._all) : [],
          type: "line",
        },
      ],
      xAxis: {
        type: "category",
        title: {
          text: "Days",
        },
        categories: chart.data ? chart.data.map((item) => item.date) : [],
      },
      yAxis: {
        title: {
          text: "Views",
        },
      },
    }),
    [chart.data]
  );

  const fetchChartData = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    chart.load(`${window.location.pathname}/data?type=chart&duration=${e.target.value}`);
  };

  useEffect(() => {
    chart.load(`${window.location.pathname}/data?type=chart&duration=7d`);
  }, [location]);

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
