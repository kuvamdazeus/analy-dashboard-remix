import { Box } from "@chakra-ui/react";
import { useFetcher, useLocation } from "@remix-run/react";
import { useEffect } from "react";
import type { getPagesSummaryData } from "~/helpers/data.server";

export default function TopPages() {
  const location = useLocation();
  const pageSummary = useFetcher<typeof getPagesSummaryData>();

  const totalPageViews = pageSummary.data
    ? pageSummary.data.reduce((acc, pageData) => acc + pageData._count._all, 0)
    : 0;

  useEffect(() => {
    pageSummary.load(`${location.pathname}/data?type=pages`);
  }, [location]);

  return (
    <Box
      border="1px"
      borderColor="gray.100"
      _dark={{ borderColor: "gray.700" }}
      className="bg-white dark:bg-gray-800 rounded-lg p-3 h-full w-1/2 overflow-y-auto"
    >
      <p className="text-xl font-bold mb-5">Top Pages</p>

      {pageSummary.data &&
        pageSummary.data
          .sort((a, b) => b._count._all - a._count._all)
          .map((pageData) => {
            const pathname = new URL(pageData.parsed_url).pathname;
            const count = pageData._count._all;

            return (
              <Box key={pathname} className="relative p-2 mb-1">
                <Box
                  style={{ width: `${(count / totalPageViews) * 100}%` }}
                  className="absolute top-0 left-0 z-0 h-full bg-green-100 dark:bg-green-600"
                />

                <p className="sticky text-xs font-light text-gray-700 dark:text-white tracking-wide">
                  {pathname}
                </p>
              </Box>
            );
          })}
    </Box>
  );
}
