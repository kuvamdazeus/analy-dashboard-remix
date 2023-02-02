import { HStack } from "@chakra-ui/react";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { FiCopy } from "react-icons/fi";
import { loader } from "~/routes/dashboard";

export default function NavProject() {
  const user = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigate = useNavigate();

  const [showCopiedText, setShowCopiedText] = useState(false);

  const getCurrentProject = () => {
    return user.projects.find((project) => project.id === location.pathname.split("/").at(-1));
  };

  return (
    <HStack className="">
      <select
        defaultValue={getCurrentProject()?.id}
        onChange={(e) => navigate(`/dashboard/${e.target.value}`)}
        className="font-semibold min-w-32 rounded border border-gray-500 p-1 focus:outline-none mr-1"
      >
        {user.projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      <HStack
        className="text-lg text-purple-500 cursor-pointer"
        onClick={() => {
          setShowCopiedText(true);
          setTimeout(() => setShowCopiedText(false), 1000);
          navigator.clipboard.writeText(getCurrentProject()?.key || "");
        }}
      >
        <FiCopy />

        {showCopiedText && <p className="text-xs font-light">COPIED API KEY!</p>}
      </HStack>
    </HStack>
  );
}
