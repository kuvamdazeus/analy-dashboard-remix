import { Box } from "@chakra-ui/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useChartData } from "~/helpers/data.client";
import { useMemo } from "react";

export default function DashboardChart() {
  const { timeRangeData } = useChartData();

  const options: Highcharts.Options = useMemo(
    () => ({
      title: {
        text: "",
      },
      series: [
        {
          data: timeRangeData.map((item) => item.views),
          type: "line",
        },
      ],
      xAxis: {
        type: "category",
        title: {
          text: "Days",
        },
        categories: timeRangeData.map((item) => item.name),
      },
      yAxis: {
        title: {
          text: "Views",
        },
      },
    }),
    [timeRangeData]
  );

  return (
    <Box border="1px" borderColor="gray.100" className="bg-white rounded-lg p-1">
      <Box flexGrow={1} borderTopColor="white" className="bg-white h-1/2">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>
    </Box>
  );
}
