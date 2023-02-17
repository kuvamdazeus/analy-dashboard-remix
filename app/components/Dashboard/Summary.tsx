import { Box, Select } from "@chakra-ui/react";
import { useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import { DURATIONS } from "~/constants";
import type { getSummaryData } from "~/helpers/data.server";
import { useEffect } from "react";

export default function Summary() {
  const location = useLocation();
  const summary = useFetcher<typeof getSummaryData>();

  const fetchSummaryData = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    summary.load(`${window.location.pathname}/data?type=summary&duration=${e.target.value}`);
  };

  useEffect(() => {
    summary.load(`${window.location.pathname}/data?type=summary&duration=1d`);
  }, [location]);

  return (
    <Box
      border="1px"
      borderColor="gray.100"
      _dark={{ borderColor: "gray.700" }}
      className="bg-white dark:bg-gray-800 rounded-lg p-3 h-full w-1/2"
    >
      <div className="flex items-center justify-between w-full mb-5">
        <p className="text-xl font-bold mr-5">Summary</p>

        <Select
          defaultValue="1d"
          onChange={fetchSummaryData}
          borderColor="gray.500"
          w="max-content"
          size="sm"
          rounded="md"
        >
          {DURATIONS.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <Box className="flex justify-between items-center mb-2">
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 tracking-wide">UNIQUE VISITS</p>

        <Box className="bg-gray-200 dark:bg-gray-100 text-xs font-bold rounded-sm p-1 flex items-center justify-between text-gray-800">
          <p className="mr-3">{summary.data && summary.data.uniquePageVisits}</p>

          <p>-</p>
        </Box>
      </Box>

      <Box className="flex justify-between items-center mb-2">
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 tracking-wide">PAGE VIEWS</p>

        <Box className="bg-gray-200 dark:bg-gray-100 text-xs font-bold rounded-sm p-1 flex items-center justify-between text-gray-800">
          <p className="mr-3">{summary.data && summary.data.pageViews}</p>

          <p>-</p>
        </Box>
      </Box>

      <Box className="flex justify-between items-center mb-2">
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 tracking-wide">SESSION COUNT</p>

        <Box className="bg-gray-200 dark:bg-gray-100 text-xs font-bold rounded-sm p-1 flex items-center justify-between text-gray-800">
          <p className="mr-3">{summary.data && summary.data.sessionsCount}</p>

          <p>-</p>
        </Box>
      </Box>

      <Box className="flex justify-between items-center mb-2">
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 tracking-wide">AVG. SESSION TIME</p>

        <Box className="bg-gray-200 dark:bg-gray-100 text-xs font-bold rounded-sm p-1 flex items-center justify-between text-gray-800">
          <p className="mr-3">{summary.data && Math.round(summary.data.avgSessionsDuration)}s</p>

          <p>-</p>
        </Box>
      </Box>
    </Box>
  );
}
