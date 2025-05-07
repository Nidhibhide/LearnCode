import nodemailer from "nodemailer";

const transporterFun = () => {
  return nodemailer.createTransport({
    host: process.env.HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  } as any);
};

const mailOptionsForVerify = (email: string, token: string) => {
  const verifyUrl = `http://localhost:8080/api/user/verify/${token}`;

  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: "Verify Your Email",
    text: `Welcome! Please verify your email by clicking the following link:\n\n${verifyUrl}\n\nNote: This link will expire in 5 minutes.`,
    html: `
      <p>Welcome!</p>
      <p>Please verify your email address by clicking the button below:</p>
      <a href="${verifyUrl}" style="padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If you did not sign up, please ignore this email.</p>
      <p><strong>Note:</strong> This link will expire in 5 minutes.</p>
    `,
  };

  return mailOptions;
};

const mailOptionsForVResetPass = (email: string, token: string) => {
  const resetUrl = `http://localhost:8080/api/user/resetPass/${token}`;

  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: "Reset Your Password",
    text: `You requested to reset your password. Click the link below:\n\n${resetUrl}\n\nNote: This link will expire in 5 minutes.`,
    html: `
      <p>You requested a password reset. Click the button below to reset your password:</p>
      <a href="${resetUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p><strong>Note:</strong> This link will expire in 5 minutes.</p>
    `,
  };

  return mailOptions;
};

export { transporterFun, mailOptionsForVResetPass, mailOptionsForVerify };
