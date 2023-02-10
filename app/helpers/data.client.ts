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
