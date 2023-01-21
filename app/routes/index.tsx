import { GH_CLIENT_ID, REDIRECT_URI } from "~/config";

export default function Index() {
  const githubOauthUri = `https://github.com/login/oauth/authorize?client_id=${GH_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user`;

  return (
    <div>
      <p className="text-3xl">Landing page</p>

      <a href={githubOauthUri} className="border border-red-500 m-5">
        Login with Github
      </a>
    </div>
  );
}
