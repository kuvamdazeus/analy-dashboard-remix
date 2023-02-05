import { client } from "~/prisma-client.server";

export const getTodaySummaryData = async (projectId: string) => {
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
          gte: new Date(new Date().setDate(new Date().getDate() - 1)),
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
          gte: new Date(new Date().setDate(new Date().getDate() - 1)),
        },
      },
    }),
    client.session.findMany({
      where: {
        project: {
          id: projectId,
        },
        created_at: {
          gte: new Date(new Date().setDate(new Date().getDate() - 1)),
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

export const getPagesSummaryData = async (projectId: string) => {
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

export const get7DaysChartData = async (projectId: string) => {
  const chartData = await client.event.groupBy({
    where: {
      session: {
        project: {
          id: projectId,
        },
      },
      name: "page_load",
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
