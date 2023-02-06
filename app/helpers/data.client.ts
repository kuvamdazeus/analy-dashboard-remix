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
