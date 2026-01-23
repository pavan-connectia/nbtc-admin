import { useState } from "react";
import { Card, Heading } from "@/components";
import { 
  useGetAllDepartmentLoginsQuery, 
  useUpdateDepartmentLoginMutation 
} from "@/redux/api/url";
import { toast } from "sonner";

const EmployeeLoginURL = () => {
  const { data, isLoading } = useGetAllDepartmentLoginsQuery();
  const [updateLoginUrl, { isLoading: isUpdating }] = useUpdateDepartmentLoginMutation();

  // Local state to manage which row is in "Edit Mode"
  const [editingId, setEditingId] = useState(null);
  const [tempUrl, setTempUrl] = useState("");

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setTempUrl(item.departmentLoginUrl);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTempUrl("");
  };

  const handleSave = async (deptId) => {
    try {
      // Your backend expects: { department: "DEPT_ID", departmentLoginUrl: "URL" }
      await updateLoginUrl({
        department: deptId, 
        departmentLoginUrl: tempUrl,
      }).unwrap();

      toast.success("URL updated successfully");
      setEditingId(null);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update URL");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <Heading className="text-xl md:text-2xl">Employee Login Url</Heading>
      </div>

      {isLoading ? (
        <div className="mt-10 text-center">Loading...</div>
      ) : (
        <Card className="p-5 mt-3 overflow-y-auto">
          <table className="w-full mb-10 border-collapse">
            <thead>
              <tr className="text-left border-b dark:border-neutral-700">
                <th className="p-3">#</th>
                <th className="p-3">Department</th>
                <th className="p-3">URL</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((item, idx) => {
                const isEditing = editingId === item._id;

                return (
                  <tr
                    key={item?._id || idx}
                    className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <td className="p-3">{idx + 1}</td>
                    <td className="p-3 font-medium text-gray-800 dark:text-neutral-200">
                      {truncate(item?.department?.name?.en, 40)}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full p-1 border rounded dark:bg-neutral-700 dark:border-neutral-600"
                          value={tempUrl}
                          onChange={(e) => setTempUrl(e.target.value)}
                        />
                      ) : (
                        <a
                          href={item?.departmentLoginUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm break-all"
                        >
                          {item?.departmentLoginUrl}
                        </a>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleSave(item.department?._id)}
                            disabled={isUpdating}
                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            {isUpdating ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-3 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(item)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
};

export default EmployeeLoginURL;