import nodemailer from "nodemailer";
import { config } from "../config/index.js";

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpPort === 465,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });
};

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send password reset OTP email
export const sendPasswordResetOTP = async (email, otp, name) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"${config.appName}" <${config.smtpUser}>`,
    to: email,
    subject: `Password Reset OTP - ${config.appName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">${config.appName}</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Hi ${name || "there"},
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            We received a request to reset your password. Use the following OTP code to complete the process:
          </p>
          <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 8px;">${otp}</span>
          </div>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
            This OTP will expire in <strong>10 minutes</strong>. If you didn't request this password reset, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            This is an automated email from ${config.appName}. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send welcome email for Google sign-up
export const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"${config.appName}" <${config.smtpUser}>`,
    to: email,
    subject: `Welcome to ${config.appName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">${config.appName}</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-top: 0;">Welcome aboard, ${name}!</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Thank you for joining ${config.appName}. Your account has been successfully created using Google Sign-In.
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Start building ATS-optimized resumes tailored to every job description.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${config.corsOrigin}/dashboard" style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              Get Started
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            This is an automated email from ${config.appName}. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
