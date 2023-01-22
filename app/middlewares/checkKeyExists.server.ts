import { json } from "@remix-run/node";

export default function checkKeyExists(request: Request) {
  const key = request.headers.get("project-key");

  if (!key) throw json({ message: "No project key provided!" }, { status: 400 });
  return key;
}
