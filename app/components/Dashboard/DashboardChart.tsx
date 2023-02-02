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
    <>
      <Box
        flexGrow={1}
        border="1px"
        borderColor="gray.100"
        borderTopColor="white"
        className="bg-white rounded-lg p-3 h-1/2"
      >
        {/* <ResponsiveContainer className="mb-5">
          <LineChart data={timeRangeData}>
            <XAxis dataKey="name" />
            <YAxis dataKey="views" />
            <Line type="monotone" dataKey="views" stroke="#1e1896" />
          </LineChart>
        </ResponsiveContainer> */}

        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>
    </>
  );
}
