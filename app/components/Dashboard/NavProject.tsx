import { Badge, HStack, Tooltip } from "@chakra-ui/react";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { FiCopy } from "react-icons/fi";
import type { loader } from "~/routes/dashboard";

export default function NavProject() {
  const user = useLoaderData<typeof loader>();

  const location = useLocation();
  const navigate = useNavigate();

  const currentProject = user.projects.find((project) => project.id === location.pathname.split("/").at(-1));

  const [isPublic, setIsPublic] = useState<undefined | boolean>(currentProject?.is_public);
  const [showCopiedText, setShowCopiedText] = useState(false);

  const isUnsafe = !user.id;

  const makeProjectPublic = async () => {
    if (!currentProject) return;

    setIsPublic((prev) => !prev);

    fetch(`${location.pathname}`, {
      method: "POST",
      body: JSON.stringify({ isPublic: !isPublic }),
    });
  };

  return (
    <HStack className="">
      <select
        defaultValue={currentProject?.id}
        onChange={(e) => navigate(`/dashboard/${e.target.value}`)}
        className="font-semibold min-w-32 rounded border border-gray-500 p-1 focus:outline-none mr-1"
      >
        {user.projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      <Tooltip label={`Make ${isPublic ? "private" : "public"}`}>
        <Badge
          mr="2"
          colorScheme={isPublic ? "green" : "red"}
          cursor="pointer"
          onClick={isUnsafe ? () => {} : makeProjectPublic}
        >
          {isPublic ? "Public" : "Private"}
        </Badge>
      </Tooltip>

      <HStack
        className="text-lg text-purple-500 cursor-pointer"
        onClick={
          isUnsafe
            ? () => {}
            : () => {
                setShowCopiedText(true);
                setTimeout(() => setShowCopiedText(false), 1000);
                navigator.clipboard.writeText(currentProject?.key || "");
              }
        }
      >
        <FiCopy />

        {showCopiedText && <p className="text-xs font-light">COPIED API KEY!</p>}
      </HStack>
    </HStack>
  );
}
