import nodemailer from "nodemailer";

/**
 * Email Notification Service
 * Handles sending email messages to applicants for application status updates.
 */

// Create a transporter using Gmail. 
// For production, configure SMTP_USER and SMTP_PASS in .env
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER || "demo@gmail.com",
    pass: process.env.SMTP_PASS || "demo_password",
  },
});

export async function sendEmailNotification(email: string, subject: string, message: string) {
  if (!email) {
    console.warn("[Email Service] No email address provided. Skipping email.");
    return;
  }

  // If no credentials provided, just log it as a mock email
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`\n================ EMAIL NOTIFICATION ================`);
    console.log(`📧 To: ${email}`);
    console.log(`📝 Subject: ${subject}`);
    console.log(`✉️ Message: ${message}`);
    console.log(`====================================================\n`);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"HimSeva e-District" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      text: message,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
               <h2 style="color: #059669;">HimSeva e-District</h2>
               <p style="font-size: 16px; color: #333;">${message}</p>
               <br />
               <p style="font-size: 12px; color: #888;">This is an automated notification from Government of Himachal Pradesh e-District portal.</p>
             </div>`,
    });
    console.log(`[Email Service] Email sent to ${email} (Message ID: ${info.messageId})`);
  } catch (error) {
    console.error("[Email Service] Failed to send email:", error);
  }
}
