import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/entities/User";

export async function POST(req: Request) {
  try {
    const { password, resetPasswordToken } = await req.json();
    const db = await connectDB();
    const userRepository = db.getRepository(User);

    // Find user by reset token
    const user = await userRepository.findOne({
      where: { reset_password_token: resetPasswordToken },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid reset password token" },
        { status: 401 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and remove reset token
    user.password = hashedPassword;
    user.reset_password_token = null; // Clear the token after reset
    await userRepository.save(user);

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
