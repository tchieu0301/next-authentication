import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/entities/User";
import { authenticate } from "@/app/middleware/authMiddleware";
import { JwtPayload } from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const authResult = await authenticate(req);
    if (typeof authResult === "object" && "message" in authResult)
      return authResult; // If authentication failed, return error response

    const db = await connectDB();
    const userRepository = db.getRepository(User);
    if (typeof authResult !== "object" || !("email" in authResult)) {
      return NextResponse.json(
        { message: "Authentication failed" },
        { status: 401 }
      );
    }
    const user = await userRepository.findOne({
      where: { email: (authResult as JwtPayload).email },
      select: ["id", "email", "first_name", "last_name"],
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Profile Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const authResult = await authenticate(req);
    if (typeof authResult === "object" && "message" in authResult)
      return authResult;

    const db = await connectDB();
    const userRepository = db.getRepository(User);

    if (typeof authResult !== "object" || !("email" in authResult)) {
      return NextResponse.json(
        { message: "Authentication failed" },
        { status: 401 }
      );
    }

    const user = await userRepository.findOne({
      where: { email: (authResult as JwtPayload).email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await req.json();

    const updatedUser = userRepository.create({ ...user, ...body });

    await userRepository.save(updatedUser);

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Profile Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
