import { useState } from "react";
import CreateProjectModal from "../common/CreateProjectModal";

export default function CreateProject() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <CreateProjectModal open={modalOpen} setOpen={setModalOpen} />

      <div
        onClick={() => setModalOpen(true)}
        className="
          bg-gradient-to-br from-slate-200 via-white to-slate-100
          border-2 border-black rounded-lg h-48 w-72 p-5 flex flex-col justify-end
          cursor-pointer transition-all duration-300
          hover:shadow-[7px_7px_0px_0px_#252525]
          hover:translate-x-[-7px] hover:translate-y-[-7px]
        "
      >
        <p className="font-semibold">Create a New Project</p>
      </div>
    </>
  );
}
