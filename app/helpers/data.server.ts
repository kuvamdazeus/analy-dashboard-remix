import { client } from "~/prisma-client.server";
import type { Duration } from "~/types";

const getGte = (duration: Duration) => {
  switch (duration) {
    case "1d":
      return new Date(Date.now() - 24 * 60 * 60 * 1000);
    case "7d":
      return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    case "1m":
      return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    case "3m":
      return new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    case "1y":
      return new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    case "5y":
      return new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000);
    case "all":
      return new Date(0);
  }
};

export const getSummaryData = async (projectId: string, duration: Duration = "1d") => {
  const [uniquePageVisits, pageViews, sessions] = await Promise.all([
    client.event.count({
      where: {
        session: {
          project: {
            id: projectId,
          },
        },
        name: "user_init",
        created_at: {
          gte: getGte(duration),
        },
      },
    }),
    client.event.count({
      where: {
        session: {
          project: {
            id: projectId,
          },
        },
        name: "page_load",
        created_at: {
          gte: getGte(duration),
        },
      },
    }),
    client.session.findMany({
      where: {
        project: {
          id: projectId,
        },
        created_at: {
          gte: getGte(duration),
        },
      },
      include: {
        events: {
          select: {
            created_at: true,
          },
        },
      },
    }),
  ]);

  const sessionsCount = sessions.length;

  let avgSessionsDuration = 0;

  for (let session of sessions) {
    let dates: Date[] = [];

    for (let event of session.events) {
      dates.push(event.created_at);
    }

    dates.sort((a, b) => a.getTime() - b.getTime());

    const sessionDuration = dates.length
      ? (dates.at(-1) as Date).getTime() - (dates.at(0) as Date).getTime()
      : 0;
    avgSessionsDuration += sessionDuration;
  }
  avgSessionsDuration = avgSessionsDuration / sessionsCount;
  avgSessionsDuration = avgSessionsDuration / 1000;

  return { uniquePageVisits, pageViews, sessionsCount, avgSessionsDuration };
};

export const getPagesSummaryData = async (projectId: string, duration: Duration = "all") => {
  const pagesSummaryData = await client.event.groupBy({
    where: {
      session: {
        project: {
          id: projectId,
        },
      },
    },
    by: ["parsed_url"],
    _count: {
      _all: true,
    },
  });

  return pagesSummaryData;
};

export const getReferrerData = async (projectId: string) => {
  const referrerData = await client.event.groupBy({
    where: {
      session: {
        project: {
          id: projectId,
        },
      },
      referrer: {
        not: "",
      },
    },
    by: ["referrer"],
    _count: {
      _all: true,
    },
  });

  return referrerData;
};

export const getChartData = async (projectId: string, duration: Duration = "7d") => {
  const chartData = await client.event.groupBy({
    where: {
      session: {
        project: {
          id: projectId,
        },
      },
      name: "page_load",
      created_at: {
        gte: getGte(duration),
      },
    },
    by: ["date"],
    orderBy: {
      date: "asc",
    },
    _count: {
      _all: true,
    },
  });

  return chartData;
};

export const getCountryData = async (projectId: string) => {
  const countryData = await client.event.groupBy({
    where: {
      session: {
        project: {
          id: projectId,
        },
      },
      country: {
        not: "",
      },
    },
    by: ["country"],
    _count: {
      _all: true,
    },
  });

  return countryData;
};

export const getRealtimeData = async (projectId: string) => {
  const realtimeData = await client.event.findMany({
    where: {
      session: {
        project: {
          id: projectId,
        },
      },
      created_at: {
        gte: new Date(Date.now() - 60 * 60 * 1000),
      },
    },
    orderBy: {
      created_at: "asc",
    },
  });

  return realtimeData;
};
