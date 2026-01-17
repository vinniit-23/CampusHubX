import { useEffect, useState } from "react";
import { collegesApi } from "../../services/api/colleges";
import { useAuth } from "../../hooks/useAuth";
import Spinner from "../../components/common/Spinner/Spinner";
import { toast } from "react-hot-toast";

export default function Students() {
  const { user } = useAuth();
  // CHANGED: Initialize loading to false. We only turn it on when we actually have the ID to fetch.
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      // 1. Safety Check: If user or profile ID is missing, we stop here.
      // Since loading is initialized to false, this won't cause an infinite spinner.
      if (!user?.profile?._id) {
        return;
      }

      try {
        setLoading(true); // 2. Start loading NOW that we have the ID

        // Pass the ID explicitly to the API service
        const response = await collegesApi.getStudents(user.profile._id);

        // Handle different response structures safely
        const studentList = response.data?.data || response.data || [];
        setStudents(studentList);
      } catch (error) {
        console.error("Failed to fetch students:", error);
        toast.error(error.response?.data?.message || "Failed to load students");
      } finally {
        setLoading(false); // 3. Ensure loading is ALWAYS turned off after fetch
      }
    };

    fetchStudents();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Optional: Add a check for user authentication state if needed
  if (!user?.profile?._id) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading user profile...
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700">
          No students found
        </h2>
        <p className="text-gray-500 mt-2">
          Your college hasn't verified any students yet.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Registered Students
        </h1>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Total: {students.length}
        </span>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow ring-1 ring-black ring-opacity-5">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Branch
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Year
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Skills
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {students.map((student) => (
              <tr
                key={student._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {student.firstName} {student.lastName}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {student.branch || "N/A"}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {student.yearOfStudy || "N/A"}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {student.skills?.length > 0 ? (
                    <div className="flex gap-1 flex-wrap">
                      {student.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {skill.name || skill}
                        </span>
                      ))}
                      {student.skills.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{student.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">
                      No skills listed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
