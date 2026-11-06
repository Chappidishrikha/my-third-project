
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string" ? body.password : "";

    const dateOfBirth =
      typeof body.dateOfBirth === "string" ? body.dateOfBirth : "";

    const acceptedTerms = body.acceptedTerms === true;

    if (!name || !email || !password || !dateOfBirth) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    if (!acceptedTerms) {
      return NextResponse.json(
        { message: "You must accept the Terms & Conditions." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const dob = new Date(`${dateOfBirth}T00:00:00.000Z`);

    if (
      Number.isNaN(dob.getTime()) ||
      dob.toISOString().slice(0, 10) !== dateOfBirth
    ) {
      return NextResponse.json(
        { message: "Please enter a valid date of birth." },
        { status: 400 }
      );
    }

    if (dob > new Date()) {
      return NextResponse.json(
        { message: "Date of birth cannot be in the future." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        dateOfBirth: dob,
        acceptedTerms,
      },
      select: {
        id: true,
        name: true,
        email: true,
        dateOfBirth: true,
        acceptedTerms: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully!",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
