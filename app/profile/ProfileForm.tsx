
"use client";

import { useState } from "react";

export default function ProfileForm({
  initialName,
  email,
}: {
  initialName: string;
  email: string;
}) {
  const [name, setName] = useState(initialName);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to update profile.");
        return;
      }

      setName(data.user.name);
      setMessage("Profile updated successfully!");
    } catch {
      setMessage("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="mb-2 block font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={100}
            className="w-full rounded-lg border border-gray-300 p-3 text-gray-800"
          />
        </div>

        <div className="mb-5">
          <label className="mb-2 block font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-gray-100 p-3 text-gray-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {message && (
          <p className="mt-4 text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
