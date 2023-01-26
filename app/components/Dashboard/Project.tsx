import { Project } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import { FiExternalLink } from "react-icons/fi";

interface Props {
  project: Project;
}

export default function Project({ project }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/dashboard/${project.id}`)}
      className="
        bg-white relative border-2 border-black rounded-lg h-48 w-72 p-5 flex flex-col justify-end
        transition-all duration-100 hover:scale-[1.01] hover:shadow-lg cursor-pointer
      "
    >
      <p className="text-xl font-light">{project.name}</p>

      <a
        className="text-blue-500 absolute top-3 right-3 text-lg"
        target="_blank"
        href={`https://${project.url}`}
      >
        <FiExternalLink />
      </a>
    </div>
  );
}
