import "server-only";

import nodemailer from "nodemailer";

import { Path } from "@/config";
import { env } from "@/env";

interface Email {
  to: string;
  subject: string;
  text: string;
  html: string;
}

const transporter = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
    })
  : null;

async function sendEmail({ to, subject, text, html }: Email) {
  // Without SMTP configured (local development) print the email instead of sending it
  if (!transporter) {
    console.info(`[email] To: ${to}\nSubject: ${subject}\n\n${text}`);
    return;
  }

  await transporter.sendMail({ from: env.EMAIL_FROM, to, subject, text, html });
}

const getLink = (path: Path, token: string) =>
  `${env.APP_URL}${path}?token=${token}`;

const renderEmail = (message: string, cta: string, link: string) => `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
    <h2>Easy and Tasty</h2>
    <p>${message}</p>
    <p>
      <a href="${link}" style="display: inline-block; padding: 10px 16px; background: #b9512e; color: #fff; text-decoration: none; border-radius: 6px;">${cta}</a>
    </p>
    <p style="color: #666; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
  </div>
`;

export async function sendVerificationEmail(email: string, token: string) {
  const link = getLink(Path.VERIFY_EMAIL, token);
  const message =
    "Thanks for signing up! Please confirm your email address. The link is valid for 24 hours.";

  await sendEmail({
    to: email,
    subject: "Confirm your email",
    text: `${message}\n\n${link}`,
    html: renderEmail(message, "Confirm email", link),
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const link = getLink(Path.RESET_PASSWORD, token);
  const message =
    "We received a request to reset your password. The link is valid for 1 hour.";

  await sendEmail({
    to: email,
    subject: "Reset your password",
    text: `${message}\n\n${link}`,
    html: renderEmail(message, "Reset password", link),
  });
}
