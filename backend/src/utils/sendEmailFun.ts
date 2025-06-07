import nodemailer from "nodemailer";

const transporterFun = () => {
  return nodemailer.createTransport({
    host: process.env.HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });
};

const mailOptionsForVerify = (email: string, token: string) => {
  const CLIENT = process.env.PRODUCTION_CLIENT;
  const verifyUrl = `${CLIENT}/verify?token=${token}`;

  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: "Learncode - Email Verification",
    text: `Welcome to Learncode!

Verify your email using the link below:

${verifyUrl}

This link expires in 5 minutes. If you didn't sign up, ignore this email.`,
    html: `
    <div style="font-family: Arial, sans-serif;">
      <p><strong>Welcome to Learncode!</strong></p>
      <p>Click the button below to verify your email:</p>
      <a href="${verifyUrl}" style="padding: 10px 16px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a>
      <p>This link expires in 5 minutes.</p>
      <p>If you didn't sign up, please ignore this email.</p>
    </div>
  `,
  };

  return mailOptions;
};

const mailOptionsForVResetPass = (email: string, token: string) => {
  const CLIENT= process.env.PRODUCTION_CLIENT;
  const resetUrl = `${CLIENT}/resetPass?token=${token}`;


  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: "Reset Your Password",
    text: `You're receiving this email from Learncode to reset your password.

Click the link below to proceed:
${resetUrl}

This link will expire in 5 minutes. If you didn't request this, you can ignore it.`,
    html: `
    <div style="font-family: Arial, sans-serif;">
      <p><strong>Learncode Password Reset</strong></p>
      <p>Click the button below to reset your password:</p>
      <a href="${resetUrl}" style="padding: 10px 16px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
      <p>This link will expire in 5 minutes. If you didn’t request this, please ignore it.</p>
    </div>
  `,
  };

  return mailOptions;
};

export { transporterFun, mailOptionsForVResetPass, mailOptionsForVerify };
