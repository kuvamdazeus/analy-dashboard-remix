import { Duration } from "./types";

export const DURATIONS: { label: string; value: Duration }[] = [
  { label: "Today", value: "today" },
  { label: "Last week", value: "7d" },
  { label: "Last month", value: "1m" },
  { label: "Last 3 months", value: "3m" },
  { label: "Last year", value: "1y" },
  { label: "Last 5 years", value: "5y" },
  { label: "All time", value: "all" },
];
