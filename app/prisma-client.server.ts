import { PrismaClient } from "@prisma/client";

let client: PrismaClient = (global as any)["prismaClient"];

if (!client) {
  client = new PrismaClient();
  (global as any)["prismaClient"] = client;
}

export { client };
