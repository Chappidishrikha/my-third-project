"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({
  redirectTo = "/login",
}: {
  redirectTo?: string;
}) {
  const router = useRouter();

  async function handleLogout() {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.replace(redirectTo);
        router.refresh();
      }
    } catch {
      alert("Logout failed. Please try again.");
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
    >
      Logout
    </button>
  );
}