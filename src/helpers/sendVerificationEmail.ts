import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifycode: string
): Promise<ApiResponse> {
  try {
    console.log("Attempting to send verification email to:", email);
    const response = await resend.emails.send({
      from: "noreply@krgaurav.me",
      to: email,
      subject: "Onest Feedback | Verification Code",
      react: VerificationEmail({ username, otp: verifycode }),
    });
    console.log("Email sent successfully:", response);
    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return {
      success: false,
      message: `Failed to send verification email`,
    };
  }
}
