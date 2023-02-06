import { Box } from "@chakra-ui/react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import type { getCountryData, getReferrerData } from "~/helpers/data.server";
import type { loader } from "~/routes/dashboard/$pid";

export default function TopSources() {
  const countries = useFetcher<typeof getCountryData>();

  const { referrerData } = useLoaderData<typeof loader>();

  const [fetchMode, setFetchMode] = useState<"referrers" | "countries">("referrers");

  const fetchBy = (mode: typeof fetchMode) => {
    if (mode === "countries") {
      countries.load(`${window.location.pathname}/data?type=country`);
    }

    setFetchMode(mode);
  };

  const totalPageViews =
    fetchMode === "referrers"
      ? referrerData.reduce((acc, pageData) => acc + pageData._count._all, 0)
      : countries.data
      ? countries.data.reduce((acc, pageData) => acc + pageData._count._all, 0)
      : 0;

  return (
    <Box border="1px" borderColor="gray.100" className="bg-white rounded-lg p-3 h-full w-1/2 overflow-y-auto">
      <div className="flex items-center justify-between mb-5">
        <p className="text-xl font-bold">Top Sources</p>

        <div className="flex items-center font-light">
          <p
            style={{
              fontWeight: fetchMode === "referrers" ? "bold" : "inherit",
              textDecoration: fetchMode === "referrers" ? "underline" : "",
            }}
            onClick={() => fetchBy("referrers")}
            className="text-sm cursor-pointer mr-2"
          >
            referrers
          </p>
          <p
            style={{
              fontWeight: fetchMode === "countries" ? "bold" : "inherit",
              textDecoration: fetchMode === "countries" ? "underline" : "",
            }}
            onClick={() => fetchBy("countries")}
            className="text-sm cursor-pointer"
          >
            countries
          </p>
        </div>
      </div>

      {fetchMode === "referrers" &&
        referrerData
          .sort((a, b) => b._count._all - a._count._all)
          .map((source) => {
            return (
              <Box key={source.referrer} className="relative py-3 px-3 mb-1">
                <Box
                  style={{ width: `${(source._count._all / totalPageViews) * 100}%` }}
                  className="absolute top-0 left-0 z-0 h-full bg-blue-100"
                />

                <p className="sticky text-sm font-light text-gray-700 tracking-wide">{source.referrer}</p>
              </Box>
            );
          })}

      {fetchMode === "countries" &&
        countries.data &&
        countries.data
          .sort((a, b) => b._count._all - a._count._all)
          .map((source) => {
            return (
              <Box key={source.country} className="relative py-3 px-3 mb-1">
                <Box
                  style={{ width: `${(source._count._all / totalPageViews) * 100}%` }}
                  className="absolute top-0 left-0 z-0 h-full bg-blue-100"
                />

                <p className="sticky text-sm font-light text-gray-700 tracking-wide">{source.country}</p>
              </Box>
            );
          })}
    </Box>
  );
}
