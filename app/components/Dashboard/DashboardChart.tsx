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

  const getCategories = () => {
    if (!chart.data) return [];

    const categories = new Set<string>();
    chart.data.pageViewsChartData.forEach((item) => categories.add(item.date));
    chart.data.uniqueVisitsChartData.forEach((item) => categories.add(item.date));
    chart.data.sessionChartData.forEach((item) => categories.add(item.date));

    return Array.from(categories).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  };

  const getSeriesData = (series: { date: string; _count: { _all: number } }[]) => {
    const categories = getCategories();

    const seriesData = categories.map((category) => {
      const seriesItem = series.find((item) => item.date === category);

      if (seriesItem) {
        return seriesItem._count._all;
      } else {
        return 0;
      }
    });

    return seriesData;
  };

  const options: Highcharts.Options = useMemo(
    () => ({
      title: {
        text: "",
      },
      series: [
        {
          data: chart.data ? getSeriesData(chart.data.pageViewsChartData) : [],
          type: "line",
          name: "Page Views",
        },
        {
          data: chart.data ? getSeriesData(chart.data.uniqueVisitsChartData) : [],
          type: "line",
          name: "Unique Page Views",
        },
        {
          data: chart.data ? getSeriesData(chart.data.sessionChartData) : [],
          type: "line",
          name: "Sessions",
        },
      ],

      xAxis: {
        type: "category",
        title: {
          text: "",
        },
        categories: getCategories(),
      },
      yAxis: {
        title: {
          text: "",
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
    <Box
      border="1px"
      borderColor="gray.100"
      _dark={{
        borderColor: "gray.700",
      }}
      className="bg-white dark:bg-gray-800 rounded-lg p-1"
    >
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
              value !== "1d" && (
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
