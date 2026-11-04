import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";

export const instant = false;

export default async function MessagePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  const session = token ? await verifySession(token) : null;

  if (!session || typeof session.userId !== "number") {
    redirect("/login");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#f0f4f8",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "32px", color: "#2563eb", marginBottom: "16px" }}>
        Welcome!
      </h1>

      <p style={{ fontSize: "18px", color: "#333" }}>
        You have successfully logged in.
      </p>

      <h2 style={{ marginTop: "25px", color: "#1e293b" }}>
        Have a great day!
      </h2>
    </main>
  );
}