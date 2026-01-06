import React, { useMemo, useRef, useState } from "react";
import { LuEye, LuPlus, LuTrash } from "react-icons/lu";
import {
  Button,
  Card,
  Heading,
  Text,
  ProjectsForm,
  DeleteDialog,
  DepartmentDD,
  Select,
} from "@/components";
import {
  useDeleteProjectsMutation,
  useGetProjectsByDepartmentIdQuery,
  useGetProjectsQuery,
} from "@/redux/api/projects";
import { truncate } from "@/utils/truncate";
import { truncateHtml } from "@/utils/truncateHtml";
import { BsThreeDots } from "react-icons/bs";
import useClickOutside from "@/hooks/useClickOutside";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import SearchInput from "@/components/shared/SearchInput";
import { useGetCoreBusinessOptionsQuery } from "@/redux/api/coreBusiness";

const Projects = () => {
  const { data: departments } = useGetCoreBusinessOptionsQuery();
  const { role, department } = useSelector((state) => state.auth);
  const { data, isLoading } =
    role === "superadmin"
      ? useGetProjectsQuery()
      : useGetProjectsByDepartmentIdQuery(department);

  const [deleteProjects] = useDeleteProjectsMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [openOptionIndex, setOpenOptionIndex] = useState(null);
  const [selectedProjects, setSelectedProjects] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const optionRefs = useRef(null);

  useClickOutside(optionRefs, () => setOpenOptionIndex(null));

  const toggleOptions = (index) => {
    setOpenOptionIndex(openOptionIndex === index ? null : index);
  };

  const handleView = (projects) => {
    setSelectedProjects(projects);
    setIsModalOpen(true);
  };

  const handleDelete = (project) => {
    setSelectedProjects(project);
    setIsDeleteOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteProjects(id).unwrap();
      toast.success("Projects deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  const handleAddProjects = () => {
    setSelectedProjects(null);
    setIsModalOpen(true);
  };

  const filteredData = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter((d) => {
      const matchesSearch = d?.title?.en
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "all" ||
        !selectedDepartment ||
        d?.department?._id === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [data, searchTerm, selectedDepartment]);

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <Heading className="text-xl md:text-2xl">Projects</Heading>

        <div className="flex w-full gap-2 md:w-auto">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            id={"department"}
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            options={[
              { key: "all", value: "all", label: "All" },
              ...(departments?.data?.map((d) => ({
                key: d?._id,
                value: d?._id,
                label: d?.name?.en,
              })) || []),
            ]}
          />
          <Button onClick={handleAddProjects}>
            <LuPlus />
            Add Projects
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Card className="p-5 mt-3 overflow-y-auto">
          <table className="w-full mb-10 border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-2">#</th>
                <th className="p-2">Image</th>
                <th className="p-2">Title</th>
                <th className="p-2">Location</th>
                <th className="p-2">Department</th>
                <th className="p-2">Display</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((d, idx) => (
                <tr
                  key={d?._id || idx}
                  className="border-b hover:bg-gray-100 dark:hover:bg-neutral-600"
                >
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${d?.image}`}
                      alt=""
                      className="object-contain overflow-hidden size-20"
                    />
                  </td>
                  <td className="p-2"> {truncate(d?.title?.en, 30)}</td>
                  <td className="p-2"> {truncate(d?.location?.en, 30)}</td>
                  <td className="p-2">{d?.department?.name?.en}</td>
                  <td className="p-2">{d?.display ? "Display" : "Hide"}</td>
                  <td className="relative p-2">
                    <button
                      onClick={() => toggleOptions(idx)}
                      aria-label="Options"
                    >
                      <BsThreeDots />
                    </button>
                    {openOptionIndex === idx && (
                      <div
                        className="absolute z-50 p-3 space-y-2 bg-white rounded-lg shadow-lg right-10 top-5"
                        ref={optionRefs}
                      >
                        <button
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => handleView(d)}
                          aria-label="View Projects"
                        >
                          <LuEye />
                          <Text
                            as="span"
                            className="text-sm font-medium text-black"
                          >
                            View
                          </Text>
                        </button>
                        <button
                          className="flex items-center gap-3"
                          onClick={() => handleDelete({ id: d?._id })}
                          aria-label="Delete Projects"
                        >
                          <LuTrash />
                          <Text
                            as="span"
                            className="text-sm font-medium text-black"
                          >
                            Delete
                          </Text>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {isDeleteOpen && (
        <DeleteDialog
          onCancel={() => setIsDeleteOpen(false)}
          onDelete={() => handleDeleteClick(selectedProjects)}
          isModalOpen={isDeleteOpen}
        />
      )}

      {isModalOpen && (
        <ProjectsForm
          isOpen={isModalOpen}
          onClose={() => {
            setSelectedProjects(null);
            setIsModalOpen(false);
          }}
          projects={selectedProjects}
        />
      )}
    </>
  );
};

export default Projects;
