import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    select: { name: true, email: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold text-blue-700">
          Admin Dashboard
        </h1>

        <p className="mb-8 text-gray-600">
          Welcome, {user.name}!
        </p>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            User Details
          </h2>

          <p className="mb-2 text-gray-700">
            <strong>Name:</strong> {user.name}
          </p>

          <p className="text-gray-700">
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      </div>
    </main>
  );
}