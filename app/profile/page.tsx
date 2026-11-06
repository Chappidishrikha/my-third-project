
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileForm from "./ProfileForm";

export const instant = false;

export default async function ProfilePage() {
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
      <div className="mx-auto max-w-2xl">
        <Link
          href="/message"
          aria-label="Back to welcome message"
          className="mb-6 inline-block text-3xl text-gray-700 hover:text-blue-700"
        >
          ←
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-blue-700">
          My Profile
        </h1>
        <p className="mb-8 text-gray-600">
          View and update your account details.
        </p>

        <ProfileForm initialName={user.name} email={user.email} />
      </div>
    </main>
  );
}
