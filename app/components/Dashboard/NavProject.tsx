import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { loader } from "~/routes/dashboard";

export default function NavProject() {
  const user = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentProjectID = () => {
    return user.projects.find((project) => project.id === location.pathname.split("/").at(-1))?.id;
  };

  return (
    <div className="">
      <select
        defaultValue={getCurrentProjectID()}
        onChange={(e) => navigate(`/dashboard/${e.target.value}`)}
        className="font-semibold w-32 rounded border border-gray-500 p-1 focus:outline-none"
      >
        {user.projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
}
