import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { User } from "@/entities/User";

const SECRET_KEY = process.env.JWT_SECRET || "your_access_secret_key";
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || "your_refresh_secret_key";

export async function GET(req: Request) {
  try {
    const refreshToken = req.headers.get("authorization")?.split(" ")[1]; // Extract token from header

    if (!refreshToken) {
      return NextResponse.json({ message: "Refresh token is required" }, { status: 401 });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY) as jwt.JwtPayload;
    } catch (error) {
      return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });
    }

    const db = await connectDB();
    const userRepository = db.getRepository(User);

    // Find user by ID from decoded token
    const user = await userRepository.findOne({ where: { id: decoded.id } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate new access token
    const newAccessToken = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "15m",
    });

    return NextResponse.json({ accessToken: newAccessToken }, { status: 200 });

  } catch (error) {
    console.error("Refresh Token Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
