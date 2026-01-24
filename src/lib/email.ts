import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: import.meta.env.SMTP_HOST,
  port: Number(import.meta.env.SMTP_PORT) || 587,
  secure: Number(import.meta.env.SMTP_PORT) === 465,
  auth: {
    user: import.meta.env.SMTP_USER,
    pass: import.meta.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, text, html, replyTo }: EmailOptions) {
  const recipients = Array.isArray(to) ? to.join(', ') : to;

  const mailOptions = {
    from: `"SOLWED" <${import.meta.env.SMTP_FROM || 'noreply@solwed.es'}>`,
    to: recipients,
    subject,
    text,
    html,
    replyTo,
  };

  return transporter.sendMail(mailOptions);
}

export function isEmailConfigured(): boolean {
  return !!(
    import.meta.env.SMTP_HOST &&
    import.meta.env.SMTP_USER &&
    import.meta.env.SMTP_PASS
  );
}
