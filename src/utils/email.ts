import dotenv from "dotenv";
import nodemailer from "nodemailer";

import { IEmailVerification, ISendEmail } from "./interface";

dotenv.config();

const smtpSender = process.env.EMAILSENDER;
const smtpPassword = process.env.EMAILSENDERPASSWORD;
const smtpEmailFrom = process.env.EMAILFROM;
const clientUrl = process.env.CLIENT_URL;
const adminEmail = process.env.ADMIN_EMAIL ?? "";
const compName = process.env.COMP_NAME ?? "";

dotenv.config();

export const sendEmail = async (input: ISendEmail) => {
  //PROD
  // var transport = nodemailer.createTransport({
  //   host: "smtp.zeptomail.com",
  //   port: 587,
  //   auth: {
  //     user: smtpSender,
  //     pass: smtpPassword,
  //   },
  // });

  // var mailOptions = {
  //   from: `"Alphacourier Team" <${smtpEmailFrom}>`,
  //   to: input.receiverEmail,
  //   replyTo: smtpEmailFrom,
  //   subject: input.subject,
  //   html: input.emailTemplate,
  // };

  // transport.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     return console.log(error);
  //   }
  //   console.log("Successfully sent");
  // });
  //PROD

  try {
    // const transporter = nodemailer.createTransport({
    //   host: 'smtp-relay.sendinblue.com',
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: smtpSender,
    //     pass: smtpPassword,
    //   },
    // });

    // const mailOptions = {
    //   from: `Alphacourier <${smtpEmailFrom}>`,
    //   to: input.receiverEmail,
    //   subject: input.subject,
    //   html: input.emailTemplate,
    // };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpSender,
        pass: smtpPassword,
      },
    });

    const mailOptions = {
      from: `${compName} <${smtpEmailFrom}>`,
      to: input.receiverEmail,
      subject: input.subject,
      html: input.emailTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.error("email=sent", info);
    return info.response;
  } catch (error) {
    console.error("Email sending error:", error);
    // throw error;
  }
};

export const sendVerificationEmail = async (input: IEmailVerification) => {
  const { otp, email } = input;


  const verificationLink = `${clientUrl}/register/?email=${email}&otp=${otp}`;

  return sendEmail({
    receiverEmail: email,
    subject: "Customer Support",
    emailTemplate: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification - ${compName}</title>
  <style>
    /* Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { border-collapse: collapse !important; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; font-family: Arial, Helvetica, sans-serif; background-color: #eef2f7; }

    /* Responsive */
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .content { padding: 20px !important; }
      h1 { font-size: 22px !important; }
      p { font-size: 16px !important; }
      .btn { font-size: 16px !important; padding: 12px 20px !important; }
    }

    /* Button */
    .btn {
      display: inline-block;
      padding: 14px 32px;
      font-size: 18px;
      color: #ffffff !important;
      background: linear-gradient(90deg, #1a73e8, #0056b3);
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(26,115,232,0.3);
    }
    .btn:hover {
      background: linear-gradient(90deg, #155ab6, #00408f) !important;
    }

    /* Code Box */
    .code-box {
      font-size: 20px;
      letter-spacing: 3px;
      background: #f9fbff;
      padding: 14px;
      border: 1px dashed #1a73e8;
      border-radius: 6px;
      text-align: center;
      margin: 30px 0;
      font-weight: bold;
      color: #1a73e8;
    }
  </style>
</head>
<body>

  <!-- Main Wrapper -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" bgcolor="#eef2f7">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
          
          <!-- Header with Logo -->
          <tr>
            <td align="center" bgcolor="#ffffff" style="padding: 25px; border-bottom:1px solid #e5e5e5;">
              <img src="${clientUrl}/logo.png" alt=${compName} width="180" style="display:block;">
            </td>
          </tr>

          <!-- Banner -->
          <tr>
            <td align="center" style="padding: 35px; background: linear-gradient(120deg, #1a73e8, #0056b3, #d4af37);">
              <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:700;">Verify Your Email Address</h1>
              <p style="color:#f1f1f1; font-size:15px; margin:10px 0 0 0;">Welcome to ${compName} Online Banking</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding:40px;">
              <p style="font-size:16px; color:#333; line-height:1.6; margin:0 0 20px 0;">
                Dear Customer,
              </p>
              <p style="font-size:16px; color:#555; line-height:1.6; margin:0 0 25px 0;">
                Thank you for opening an account with <strong>${compName}</strong>.  
                For your security, please confirm your email address by clicking the button below:
              </p>
              <p style="text-align:center; margin:30px 0;">
                <a href=${verificationLink} class="btn" target="_blank">Verify Email</a>
              </p>

              <!-- Extra Trust: Verification Code -->
              <div class="code-box">
                ${otp}
              </div>

              <p style="font-size:14px; color:#888; line-height:1.5;">
                If the button above does not work, copy and paste this link into your browser: <br>
                <a href=${verificationLink} style="color:#1a73e8; word-break:break-all;">${verificationLink}</a>
              </p>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="padding:20px 40px; background:#fafafa; border-top:1px solid #e5e5e5;">
              <p style="font-size:13px; color:#666; line-height:1.5; margin:0;">
                🔒 This message is intended only for the account holder of American Horizon.  
                If you did not request this, please ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#f1f1f1" style="padding:25px; text-align:center; font-size:13px; color:#555; line-height:1.6;">
              &copy; ${new Date().getFullYear()}  ${compName}. All rights reserved. <br>
              1234 Finance Avenue, New York, NY 10001 <br>
              This is an automated message, please do not reply.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`,
  });
};
