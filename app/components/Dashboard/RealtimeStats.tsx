import { Badge, Box } from "@chakra-ui/react";
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
    let interval: any = null;

    stats.load(`${window.location.pathname}/data?type=realtime`);

    // set a minute interval to load stats only when the window is in focus
    interval = setInterval(() => {
      if (document.hasFocus()) {
        stats.load(`${window.location.pathname}/data?type=realtime`);
      }
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [location]);

  return (
    <Box
      border="1px"
      borderColor="gray.100"
      _dark={{
        borderColor: "gray.700",
      }}
      className="bg-white dark:bg-gray-800 rounded-lg p-3 w-1/2"
    >
      <div className="flex items-center mb-5">
        <p className="text-xl font-bold mr-2">Realtime Stats</p>

        <div>
          <Badge colorScheme="red">Live</Badge>
        </div>
      </div>

      <Box flexGrow={1} borderTopColor="white" className="bg-white">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>
    </Box>
  );
}
