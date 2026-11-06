
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify the logged-in administrator.
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    const session = token ? await verifySession(token) : null;

    if (!session || typeof session.userId !== "number") {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Access denied." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { message: "Invalid user ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Find only regular user accounts.
    const existingUser = await prisma.user.findFirst({
      where: { id: userId, role: "USER" },
      select: { id: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    // Activate or deactivate a user account.
    if (typeof body.isActive === "boolean") {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isActive: body.isActive },
        select: {
          id: true,
          name: true,
          isActive: true,
        },
      });

      return NextResponse.json({
        message: body.isActive
          ? "User account activated successfully."
          : "User account deactivated successfully.",
        user: updatedUser,
      });
    }

    // Existing Edit User functionality.
    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    if (!name) {
      return NextResponse.json(
        { message: "Name is required." },
        { status: 400 }
      );
    }

    let dateOfBirth: Date | null = null;

    if (body.dateOfBirth !== null && body.dateOfBirth !== "") {
      if (
        typeof body.dateOfBirth !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(body.dateOfBirth)
      ) {
        return NextResponse.json(
          { message: "Invalid date of birth." },
          { status: 400 }
        );
      }

      dateOfBirth = new Date(`${body.dateOfBirth}T00:00:00.000Z`);

      if (
        Number.isNaN(dateOfBirth.getTime()) ||
        dateOfBirth.toISOString().slice(0, 10) !== body.dateOfBirth
      ) {
        return NextResponse.json(
          { message: "Invalid date of birth." },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        dateOfBirth,
      },
      select: {
        id: true,
        name: true,
        email: true,
        dateOfBirth: true,
      },
    });

    return NextResponse.json({
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
