import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { User } from "@/entities/User";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Change this in production
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || "your_refresh_secret_key";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const db = await connectDB();
    const userRepository = db.getRepository(User);

    // Find user by email
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, REFRESH_SECRET_KEY, { expiresIn: "7d" });

    return NextResponse.json({ token, refreshToken }, { status: 200 });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
