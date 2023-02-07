import { Box } from "@chakra-ui/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useFetcher, useLocation } from "@remix-run/react";
import type { getRealtimeData } from "~/helpers/data.server";
import { useEffect, useMemo } from "react";
import { parseRealtimeData } from "~/helpers/data.client";

export default function RealtimeStats() {
  const location = useLocation();
  const stats = useFetcher<typeof getRealtimeData>();

  const options: Highcharts.Options = useMemo(() => {
    const statsData = parseRealtimeData(stats.data || []);

    return {
      title: {
        text: "",
      },
      series: [
        {
          name: "Unique Page Visits",
          data: stats.data ? statsData.map(([, data]) => data.uniquePageVisits) : [],
          type: "line",
          marker: {
            enabled: false,
          },
        },
        {
          name: "Events",
          data: stats.data ? statsData.map(([, data]) => data.events) : [],
          type: "line",
          marker: {
            enabled: false,
          },
        },
        {
          name: "Page Views",
          data: stats.data ? statsData.map(([, data]) => data.pageViews) : [],
          type: "line",
          marker: {
            enabled: false,
          },
        },
      ],
      xAxis: {
        type: "category",
        categories: stats.data ? statsData.map(([label]) => label) : [],
      },
      yAxis: {
        title: {
          text: "",
        },
      },
    };
  }, [stats.data]);

  useEffect(() => {
    stats.load(`${window.location.pathname}/data?type=realtime`);
  }, [location]);

  return (
    <Box border="1px" borderColor="gray.100" className="bg-white rounded-lg p-3 w-2/3">
      <p className="text-xl font-bold mb-5">Realtime Stats</p>

      <Box flexGrow={1} borderTopColor="white" className="bg-white">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>
    </Box>
  );
}
