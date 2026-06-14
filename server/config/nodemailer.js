import  { createTransport } from "nodemailer";


const transporter = createTransport({
  service: "smtp-relay.brevo.com",
  port:587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (
  to,
  subject,
  body
) => {
  try {
    const response = await transporter.sendMail({
      from: `"EMS System" <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      html:body
    });

   return response;
  } catch (error) {
    console.error(
      "Failed to send email:",
      error.message
    );
  }
};