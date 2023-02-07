import type { Event } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { loader } from "~/routes/dashboard/$pid";

type TimeRange = {
  name: string;
  views: number;
}[];

export const useChartData = () => {
  const { chartData } = useLoaderData<typeof loader>();

  const [timeRangeData, setTimeRange] = useState<TimeRange>([]);

  const generate7DaysTimeRangeData = () => {
    const timeRange: TimeRange = [];

    for (let event of chartData) {
      const date = new Date(event.created_at);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const time = `${year}-${month}-${day}`;

      if (timeRange.find((item) => item.name === time)) {
        timeRange.find((item) => item.name === time)!.views += 1;
      } else {
        timeRange.push({
          name: time,
          views: 1,
        });
      }
    }

    setTimeRange(timeRange.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime()));
  };

  useEffect(() => {
    generate7DaysTimeRangeData();
  }, [chartData]);

  return { timeRangeData };
};

export const parseRealtimeData = (events: { [key: string]: string }[]) => {
  const realtimeDataMap = new Map<string, { pageViews: number; uniquePageVisits: number; events: number }>();
  for (let event of events) {
    const time = new Date(event.created_at).toTimeString().split(":").slice(0, 2).join(":");

    new Date().toTimeString();

    if (realtimeDataMap.has(time)) {
      const data = realtimeDataMap.get(time) as {
        pageViews: number;
        uniquePageVisits: number;
        events: number;
      };
      if (event.name === "page_load") {
        data.pageViews++;
      } else if (event.name === "user_init") {
        data.uniquePageVisits++;
      }

      data.events++;
    } else {
      realtimeDataMap.set(time, {
        pageViews: event.name === "page_load" ? 1 : 0,
        uniquePageVisits: event.name === "user_init" ? 1 : 0,
        events: 1,
      });
    }
  }

  return Array.from(realtimeDataMap);
};
