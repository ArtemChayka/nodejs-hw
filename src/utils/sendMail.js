import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: options.from || process.env.SMTP_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  return await transporter.sendMail(mailOptions);
};
