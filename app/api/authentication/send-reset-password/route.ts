import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { User } from "@/entities/User";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Change this in production

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const db = await connectDB();
    const userRepository = db.getRepository(User);

    // Find the user by email
    const user = await userRepository.findOne({ where: { email: email } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate a reset password token (expires in 1 hour)
    const resetToken = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });

    // Save the reset token in the database
    user.reset_password_token = resetToken;
    await userRepository.save(user);

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "fff7ec0a5afadf",
        pass: "502e1419c4fb28",
      },
    });

    // Send the email
    await transporter.sendMail({
      from: '"Test" <noreply@yourapp.com>',
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <a href="http://localhost:3000/reset-password?token=${resetToken}" 
             style="display: inline-block; padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p>If you didn't request this, you can ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Reset password email sent!" });
  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}
