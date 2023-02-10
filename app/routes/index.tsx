import { useLocation } from "@remix-run/react";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import { GITHUB_OAUTH_URI } from "~/config";

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();

  const isRedirect = new URLSearchParams(location.search).get("redirect");

  useLayoutEffect(() => {
    if (isRedirect) navigate("/dashboard", { replace: true });
  }, []);

  return (
    <div>
      <p className="text-3xl">Landing page</p>

      <a href={GITHUB_OAUTH_URI()} className="border border-red-500 m-5">
        Login with Github
      </a>
    </div>
  );
}
