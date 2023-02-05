import { Box } from "@chakra-ui/react";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "~/routes/dashboard/$pid";

export default function TopSources() {
  const { referrerData } = useLoaderData<typeof loader>();

  const totalPageViews = referrerData.reduce((acc, pageData) => acc + pageData._count._all, 0);

  return (
    <Box border="1px" borderColor="gray.100" className="bg-white rounded-lg p-3 h-full w-1/2 overflow-y-auto">
      <p className="text-xl font-bold mb-5">Top Sources</p>

      {referrerData
        .sort((a, b) => b._count._all - a._count._all)
        .map((source) => {
          return (
            <Box key={source.referrer} className="relative py-3 px-3 mb-1">
              <Box
                style={{ width: `${(source._count._all / totalPageViews) * 100}%` }}
                className="absolute top-0 left-0 z-0 h-full bg-orange-100"
              />

              <p className="sticky text-sm font-light text-gray-700 tracking-wide">{source.referrer}</p>
            </Box>
          );
        })}
    </Box>
  );
}
