import { Box } from "@chakra-ui/react";
import { useFetcher, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { getCountryData, getReferrerData } from "~/helpers/data.server";

export default function TopSources() {
  const location = useLocation();

  const countries = useFetcher<typeof getCountryData>();
  const referrers = useFetcher<typeof getReferrerData>();

  const [fetchMode, setFetchMode] = useState<"referrers" | "countries">("referrers");

  const fetchBy = (mode: typeof fetchMode) => {
    setFetchMode(mode);
  };

  useEffect(() => {
    countries.load(`${window.location.pathname}/data?type=country`);
    referrers.load(`${window.location.pathname}/data?type=referrer`);
  }, [location]);

  let totalPageViews = 0;

  if (fetchMode === "referrers" && referrers.data) {
    totalPageViews = referrers.data.reduce((acc, referrerData) => acc + referrerData._count._all, 0);
  } else if (fetchMode === "countries" && countries.data) {
    totalPageViews = countries.data.reduce((acc, countryData) => acc + countryData._count._all, 0);
  }

  return (
    <Box
      border="1px"
      borderColor="gray.100"
      _dark={{ borderColor: "gray.700" }}
      className="bg-white dark:bg-gray-800 rounded-lg p-3 h-full w-1/2 overflow-y-auto"
    >
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
        referrers.data &&
        referrers.data
          .sort((a, b) => b._count._all - a._count._all)
          .map((source) => {
            return (
              <Box key={source.referrer} className="relative p-2 mb-1">
                <Box
                  style={{ width: `${(source._count._all / totalPageViews) * 100}%` }}
                  className="absolute top-0 left-0 z-0 h-full bg-blue-100 dark:bg-blue-500"
                />

                <p className="sticky text-xs font-light text-gray-700 dark:text-white tracking-wide">
                  {source.referrer}
                </p>
              </Box>
            );
          })}

      {fetchMode === "countries" &&
        countries.data &&
        countries.data
          .sort((a, b) => b._count._all - a._count._all)
          .map((source) => {
            return (
              <Box key={source.country} className="relative p-2 mb-1">
                <Box
                  style={{ width: `${(source._count._all / totalPageViews) * 100}%` }}
                  className="absolute top-0 left-0 z-0 h-full bg-blue-100 dark:bg-blue-500"
                />

                <p className="sticky text-xs font-light text-gray-700 dark:text-white tracking-wide">
                  {source.country}
                </p>
              </Box>
            );
          })}
    </Box>
  );
}
