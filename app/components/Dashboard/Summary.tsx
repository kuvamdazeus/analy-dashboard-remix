import { Box, Select } from "@chakra-ui/react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { DURATIONS } from "~/constants";
import type { loader } from "~/routes/dashboard/$pid";
import type { getSummaryData } from "~/helpers/data.server";

export default function Summary() {
  const fetcher = useFetcher<typeof getSummaryData>();
  const { summaryData } = useLoaderData<typeof loader>();

  const summary = fetcher.data || summaryData;

  const fetchSummaryData = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    fetcher.load(`${window.location.pathname}/data?type=summary&duration=${e.target.value}`);
  };

  return (
    <Box border="1px" borderColor="gray.100" className="bg-white rounded-lg p-3 h-full w-1/2">
      <div className="flex items-center justify-between w-full mb-5">
        <p className="text-xl font-bold mr-5">Summary</p>

        <Select
          defaultValue="today"
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
        <p className="text-sm font-bold text-gray-500 tracking-wide">UNIQUE VISITS</p>

        <Box className="bg-gray-200 text-xs font-bold rounded-sm p-1 flex items-center justify-between text-gray-800">
          <p className="mr-3">{summary.uniquePageVisits}</p>

          <p>-</p>
        </Box>
      </Box>

      <Box className="flex justify-between items-center mb-2">
        <p className="text-sm font-bold text-gray-500 tracking-wide">PAGE VIEWS</p>

        <Box className="bg-gray-200 text-xs font-bold rounded-sm p-1 flex items-center justify-between text-gray-800">
          <p className="mr-3">{summary.pageViews}</p>

          <p>-</p>
        </Box>
      </Box>

      <Box className="flex justify-between items-center mb-2">
        <p className="text-sm font-bold text-gray-500 tracking-wide">SESSION COUNT</p>

        <Box className="bg-gray-200 text-xs font-bold rounded-sm p-1 flex items-center justify-between text-gray-800">
          <p className="mr-3">{summary.sessionsCount}</p>

          <p>-</p>
        </Box>
      </Box>

      <Box className="flex justify-between items-center mb-2">
        <p className="text-sm font-bold text-gray-500 tracking-wide">AVG. SESSION TIME</p>

        <Box className="bg-gray-200 text-xs font-bold rounded-sm p-1 flex items-center justify-between text-gray-800">
          <p className="mr-3">{Math.round(summary.avgSessionsDuration)}s</p>

          <p>-</p>
        </Box>
      </Box>
    </Box>
  );
}
