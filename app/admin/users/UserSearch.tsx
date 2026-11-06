
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
  dateOfBirth: string | null;
  createdAt: string;
  isActive: boolean;
};

export default function UserSearch({ users }: { users: User[] }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState<number | null>(null);

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText)
    );
  });

  function startEditing(user: User) {
    setEditingId(user.id);
    setName(user.name);
    setDateOfBirth(user.dateOfBirth?.slice(0, 10) ?? "");
    setError("");
  }

  async function saveChanges(userId: number) {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          dateOfBirth: dateOfBirth || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not update user.");
        return;
      }

      setEditingId(null);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleUserStatus(user: User) {
    const action = user.isActive ? "deactivate" : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.name}'s account?`
    );

    if (!confirmed) return;

    setStatusLoadingId(user.id);

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !user.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not update account status.");
        return;
      }

      router.refresh();
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setStatusLoadingId(null);
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full rounded-lg border border-gray-300 p-3 text-gray-800 outline-none focus:border-blue-500"
      />

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-gray-700">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Date of Birth</th>
              <th className="p-3">Registration Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b text-gray-700">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  {user.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString("en-IN")
                    : "Not provided"}
                </td>
                <td className="p-3">
                  {new Date(user.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      user.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => startEditing(user)}
                      className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => toggleUserStatus(user)}
                      disabled={statusLoadingId === user.id}
                      className={`rounded px-3 py-1 text-white disabled:opacity-50 ${
                        user.isActive
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {statusLoadingId === user.id
                        ? "Updating..."
                        : user.isActive
                          ? "Deactivate"
                          : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Showing {filteredUsers.length} of {users.length} users
      </p>

      {editingId !== null && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-slate-50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Edit User Details
          </h3>

          <label className="mb-1 block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4 w-full rounded-lg border border-gray-300 p-3 text-gray-800"
          />

          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            value={users.find((user) => user.id === editingId)?.email ?? ""}
            disabled
            className="mb-4 w-full rounded-lg border border-gray-300 bg-gray-100 p-3 text-gray-500"
          />

          <label className="mb-1 block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="mb-4 w-full rounded-lg border border-gray-300 p-3 text-gray-800"
          />

          {error && (
            <p className="mb-4 text-sm text-red-600">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => saveChanges(editingId)}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={() => setEditingId(null)}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
