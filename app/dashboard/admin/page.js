"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.API}/users`);
      const data = await res.json();
      const students = data.filter((user) => user.role !== "admin");
      setUsers(students);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (applicationId) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      const res = await fetch(`/api/admin/univApplication/${applicationId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete application. 01");
      }

      toast.success("Application deleted successfully!");
      // router.refresh();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error(err.message);
      toast.error("Failed to delete the application. 02");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to remove this user?")) return;

    try {
      const res = await fetch(`/api/admin/user/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to remove user");
      }

      toast.success("User removed successfully!");
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (err) {
      console.error(err.message);
      toast.error("Failed to remove user");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="text-center text-4xl pt-4">Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-center text-4xl pt-4">
          No students yet. The list is empty.
        </div>
      ) : (
        users?.map((user) => (
          <div className="grid " key={user._id}>
            {/* Users Row */}

            <div className="py-2 px-2 flex flex-row justify-between items-center bg-darkGray mt-6">
              <div className="px-6 grid grid-cols-4 font-medium	">
                <div>{user.fullName}</div>
                <div>{user.email}</div>
                <div>{user.contactInfo}</div>
              </div>
              <div className="flex gap-2">
                <Link
                  className="btn w-fit"
                  href={`/dashboard/admin/createApplication/${user._id}`}
                >
                  Add Application
                </Link>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="outline-btn-white w-fit"
                >
                  Remove Student
                </button>
              </div>
            </div>
            {/* Univ Row */}
            <div className="bg-slate-200 flex flex-col justify-between w-full px-12 py-2 font-medium">
              {user.universitiesAppliedTo.length === 0 ? (
                ""
              ) : (
                <div className="w-full grid grid-cols-6 text-green-600 gap-2 mb-2">
                  <div>Name</div>
                  <div>Specialty</div>
                  <div>PreEnrollment</div>
                  <div>Status</div>
                  <div>Note</div>
                  <div>Actions</div>
                </div>
              )}

              {user.universitiesAppliedTo.length === 0 ? (
                <div className="text-center">
                  No university applications, yet!
                </div>
              ) : (
                user.universitiesAppliedTo?.map((univ) => (
                  <div
                    key={univ._id}
                    className=" w-full grid grid-cols-6 font-medium py-1 gap-2"
                  >
                    <div>{univ.name}</div>
                    <div>{univ.specialty}</div>
                    <div>{univ.preEnrollment}</div>
                    <div>{univ.status}</div>
                    <div>{univ.note}</div>
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/admin/editApplication/${univ._id}`}
                        className="outline-btn-sm"
                      >
                        Edit ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(univ._id)}
                        className="outline-btn-sm"
                      >
                        Delete 🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
