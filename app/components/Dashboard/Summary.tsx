import { Badge, Box } from "@chakra-ui/react";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "~/routes/dashboard/$pid";

export default function Summary() {
  const { summaryData } = useLoaderData<typeof loader>();

  return (
    <Box border="1px" borderColor="gray.100" className="bg-white rounded-lg p-3 h-full w-1/2">
      <p className="text-xl font-bold mb-5">Summary</p>

      <Box className="flex justify-between items-center mb-2">
        <p className="text-sm font-bold text-gray-500 tracking-wide">UNIQUE VISITS</p>

        <Box className="bg-gray-200 text-xs font-bold rounded-sm p-1 flex items-center justify-between text-gray-800">
          <p className="mr-3">{summaryData.uniquePageVisits}</p>

          <p>-</p>
        </Box>
      </Box>

      <Box className="flex justify-between items-center mb-2">
        <p className="text-sm font-bold text-gray-500 tracking-wide">PAGE VIEWS</p>

        <Box className="bg-gray-200 text-xs font-bold rounded-sm p-1 flex items-center justify-between text-gray-800">
          <p className="mr-3">{summaryData.pageViews}</p>

          <p>-</p>
        </Box>
      </Box>

      <Box className="flex justify-between items-center mb-2">
        <p className="text-sm font-bold text-gray-500 tracking-wide">SESSION COUNT</p>

        <Box className="bg-gray-200 text-xs font-bold rounded-sm p-1 flex items-center justify-between text-gray-800">
          <p className="mr-3">{summaryData.sessionsCount}</p>

          <p>-</p>
        </Box>
      </Box>

      <Box className="flex justify-between items-center mb-2">
        <p className="text-sm font-bold text-gray-500 tracking-wide">AVG. SESSION TIME</p>

        <Box className="bg-gray-200 text-xs font-bold rounded-sm p-1 flex items-center justify-between text-gray-800">
          <p className="mr-3">{Math.round(summaryData.avgSessionsDuration)}s</p>

          <p>-</p>
        </Box>
      </Box>
    </Box>
  );
}
