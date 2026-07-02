import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(toEmail: string, firstName: string, tempPassword: string) {
  const mailOptions = {
    from: `"MyOnlineResume.am" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Your temporary password — MyOnlineResume.am',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #f7f7f5;">
        <div style="background: #ffffff; border-radius: 16px; padding: 40px; border: 1px solid #e2e2dd;">
          <h2 style="font-size: 24px; color: #1a1a1a; margin: 0 0 8px 0;">Hi ${firstName},</h2>
          <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
            We received a request to reset your password for your <strong>MyOnlineResume.am</strong> account.
          </p>

          <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 12px 0;">
            Your temporary password is:
          </p>

          <div style="background: #f0f0ec; border: 2px dashed #c07a3a; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px 0;">
            <span style="font-size: 22px; font-weight: bold; letter-spacing: 4px; color: #1a1a1a; font-family: monospace;">
              ${tempPassword}
            </span>
          </div>

          <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 8px 0;">
            Please follow these steps:
          </p>
          <ol style="color: #555555; font-size: 15px; line-height: 1.8; margin: 0 0 24px 0; padding-left: 20px;">
            <li>Go to <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/sign-in" style="color: #c07a3a;">MyOnlineResume.am</a> and sign in using your email and the temporary password above.</li>
            <li>Once logged in, go to your <strong>Profile Settings</strong> and change your password immediately.</li>
          </ol>

          <p style="color: #888888; font-size: 13px; line-height: 1.6; margin: 0; border-top: 1px solid #e2e2dd; padding-top: 20px;">
            If you did not request a password reset, please ignore this email. Your account remains secure.<br/>
            — The MyOnlineResume.am team
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPasswordChangedEmail(toEmail: string, firstName: string) {
  const mailOptions = {
    from: `"MyOnlineResume.am" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Password changed successfully — MyOnlineResume.am',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #f7f7f5;">
        <div style="background: #ffffff; border-radius: 16px; padding: 40px; border: 1px solid #e2e2dd;">
          <h2 style="font-size: 24px; color: #1a1a1a; margin: 0 0 8px 0;">Hi ${firstName},</h2>
          <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
            Your password has been changed successfully on <strong>MyOnlineResume.am</strong>.
          </p>
          <p style="color: #888888; font-size: 13px; line-height: 1.6; margin: 0; border-top: 1px solid #e2e2dd; padding-top: 20px;">
            If you did not make this change, please contact us immediately.<br/>
            — The MyOnlineResume.am team
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
