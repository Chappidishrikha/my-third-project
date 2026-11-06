
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UserSearch from "./users/UserSearch";
import LogoutButton from "@/app/components/LogoutButton";

export const instant = false;

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  const session = token ? await verifySession(token) : null;

  if (!session || typeof session.userId !== "number") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/message");
  }

  const users = await prisma.user.findMany({
    where: { role: "USER" },
    select: {
      id: true,
      name: true,
      email: true,
      dateOfBirth: true,
      createdAt: true,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedUsers = users.map((registeredUser) => ({
    ...registeredUser,
    dateOfBirth: registeredUser.dateOfBirth?.toISOString() ?? null,
    createdAt: registeredUser.createdAt.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-blue-700">
          Admin Dashboard
        </h1>

        <p className="mb-8 text-gray-600">
          Welcome, {user.name}!
        </p>

        <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
          <div className="mb-4 flex justify-end">
  <LogoutButton redirectTo="/admin-login" />
</div>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Admin Details
          </h2>

          <p className="mb-2 text-gray-700">
            <strong>Name:</strong> {user.name}
          </p>

          <p className="mb-2 text-gray-700">
            <strong>Email:</strong> {user.email}
          </p>

          <p className="text-gray-700">
            <strong>Role:</strong> {user.role}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            User Management
          </h2>

          <p className="mb-6 text-gray-600">
            Total registered users: {users.length}
          </p>

          <UserSearch users={formattedUsers} />
        </div>
      </div>
    </main>
  );
}
