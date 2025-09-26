"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactUsEmail = exports.sendForgotPasswordEmail = exports.sendAccountSuspendedEmail = exports.sendLoanDeclinedEmail = exports.sendLoanApprovalEmail = exports.sendWireTransferCreditAlert = exports.sendDomesticTransferCreditAlert = exports.sendDomesticTransferDebitAlert = exports.sendWireTransferDebitAlert = exports.sendVerificationEmail = exports.sendEmail = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const _1 = require(".");
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const smtpSender = process.env.EMAILSENDER;
const smtpPassword = process.env.EMAILSENDERPASSWORD;
const smtpEmailFrom = process.env.EMAILFROM;
const clientUrl = process.env.CLIENT_URL;
const adminEmail = (_a = process.env.ADMIN_EMAIL) !== null && _a !== void 0 ? _a : "";
const compName = (_b = process.env.COMP_NAME) !== null && _b !== void 0 ? _b : "";
dotenv_1.default.config();
const sendEmail = (input) => __awaiter(void 0, void 0, void 0, function* () {
    //PROD
    const resp = yield axios_1.default.post("https://api.zeptomail.com/v1.1/email", {
        from: { address: smtpEmailFrom },
        to: [{ email_address: { address: input.receiverEmail } }],
        subject: input.subject,
        htmlbody: input.emailTemplate,
    }, {
        headers: {
            "Authorization": `Zoho-enczapikey ${process.env.ZEPTO_API_KEY}`,
            "Content-Type": "application/json",
        },
    });
    console.log(resp.data);
    //   var transport = nodemailer.createTransport({
    //     host: "smtp.zeptomail.com",
    //     port: 587,
    //      secure: false,
    //     auth: {
    //       user: smtpSender,
    //       pass: smtpPassword,
    //     },
    //   });
    //   var mailOptions = {
    //     from: `"${compName} Team" <${smtpEmailFrom}>`,
    //     to: input.receiverEmail,
    //     replyTo: smtpEmailFrom,
    //     subject: input.subject,
    //     html: input.emailTemplate,
    //   };
    //   transport.verify(function (error, success) {
    //   if (error) {
    //     console.error("SMTP verification error:", error);
    //   } else {
    //     console.log("SMTP connection is good");
    //   }
    // });
    //   transport.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //       return console.log(error);
    //     }
    //     console.log("Successfully sent", info);
    //   });
    //PROD
    // try {
    //   // const transporter = nodemailer.createTransport({
    //   //   host: 'smtp-relay.sendinblue.com',
    //   //   port: 587,
    //   //   secure: false,
    //   //   auth: {
    //   //     user: smtpSender,
    //   //     pass: smtpPassword,
    //   //   },
    //   // });
    //   // const mailOptions = {
    //   //   from: `Alphacourier <${smtpEmailFrom}>`,
    //   //   to: input.receiverEmail,
    //   //   subject: input.subject,
    //   //   html: input.emailTemplate,
    //   // };
    //   const transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //       user: smtpSender,
    //       pass: smtpPassword,
    //     },
    //   });
    //   const mailOptions = {
    //     from: `${compName} <${smtpEmailFrom}>`,
    //     to: input.receiverEmail,
    //     subject: input.subject,
    //     html: input.emailTemplate,
    //   };
    //   const info = await transporter.sendMail(mailOptions);
    //   console.error("email=sent", info);
    //   return info.response;
    // } catch (error) {
    //   console.error("Email sending error:", error);
    //   // throw error;
    // }
});
exports.sendEmail = sendEmail;
const sendVerificationEmail = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp, email } = input;
    const verificationLink = `${clientUrl}/register/?email=${email}&otp=${otp}`;
    return (0, exports.sendEmail)({
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
});
exports.sendVerificationEmail = sendVerificationEmail;
const sendWireTransferDebitAlert = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountName, userName, amount, country, recipientName, routingNumber, swiftCode, senderEmail, transferType, } = input;
    const now = new Date();
    const humanReadableDate = now.toLocaleString("en-US", {
        weekday: "long", // e.g., Monday
        year: "numeric", // e.g., 2023
        month: "long", // e.g., December
        day: "numeric", // e.g., 25
    });
    console.log("sending debit");
    return (0, exports.sendEmail)({
        receiverEmail: senderEmail,
        subject: "Transaction Alert",
        emailTemplate: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Debit Transaction Alert - American Horizon</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { border-collapse: collapse !important; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; font-family: Arial, Helvetica, sans-serif; background-color: #eef2f7; }

    @media screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .content { padding: 20px !important; }
      h1 { font-size: 22px !important; }
      p { font-size: 16px !important; }
    }

    .info-box, .transaction-box {
      border-radius: 8px;
      padding: 18px;
      margin: 25px 0;
      font-size: 15px;
      color: #333;
    }

    .info-box { background: #f9fbff; border: 1px solid #e0e7ff; }
    .transaction-box { background: #fff8f0; border: 1px solid #ffd7a6; }

    .highlight { color: #1a73e8; font-weight: bold; }
    .section-title { font-weight: bold; margin-top: 15px; margin-bottom: 5px; }
  </style>
</head>
<body>

  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" bgcolor="#eef2f7">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#ffffff" style="padding: 25px; border-bottom:1px solid #e5e5e5;">
              <img src="${clientUrl}/logo.png" alt="American Horizon" width="180" style="display:block;">
            </td>
          </tr>

          <!-- Banner -->
          <tr>
            <td align="center" style="padding: 35px; background: linear-gradient(120deg, #1a73e8, #0056b3, #d4af37);">
              <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:700;">Debit Transaction Alert</h1>
              <p style="color:#f1f1f1; font-size:15px; margin:10px 0 0 0;">Your account has been debited</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding:40px;">
              <p style="font-size:16px; color:#333; line-height:1.6; margin:0 0 20px 0;">
                Dear <span class="highlight">${userName}</span>,
              </p>
              <p style="font-size:16px; color:#555; line-height:1.6; margin:0 0 25px 0;">
                A debit transaction has been made from your account with <strong>${compName}</strong>.  
                Please review the transaction details below:
              </p>

              <!-- Transaction Details -->
              <div class="transaction-box">
                <p><strong>Transaction Type:</strong> <span class="highlight">${_1.utils.toSentenceCase(transferType)}</span></p>
                <p><strong>Date:</strong> <span class="highlight">${humanReadableDate}</span></p>
                <p><strong>Amount:</strong> <span class="highlight">$${_1.utils.formatNumber(amount)}</span></p>
               

                <!-- Conditional: Wire Transfer -->
               
                <div>
                  <p class="section-title">Wire Transfer Details:</p>
                  <p><strong>Routing Number:</strong> <span class="highlight">${routingNumber}</span></p>
                  <p><strong>SWIFT Code:</strong> <span class="highlight">${swiftCode}</span></p>
                  <p><strong>Country:</strong> <span class="highlight">${country}</span></p>
                </div>
                
              </div>

              <p style="font-size:14px; color:#888; line-height:1.5; margin-top:20px;">
                If you did not authorize this transaction, please contact our support team immediately.
              </p>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="padding:20px 40px; background:#fafafa; border-top:1px solid #e5e5e5;">
              <p style="font-size:13px; color:#666; line-height:1.5; margin:0;">
                🔒 This message is intended only for the account holder of ${compName}.  
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
});
exports.sendWireTransferDebitAlert = sendWireTransferDebitAlert;
const sendDomesticTransferDebitAlert = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountNumber, amount, recipientName, senderEmail, userName, decription, } = input;
    const now = new Date();
    const humanReadableDate = now.toLocaleString("en-US", {
        weekday: "long", // e.g., Monday
        year: "numeric", // e.g., 2023
        month: "long", // e.g., December
        day: "numeric", // e.g., 25
    });
    console.log("sending debit");
    return (0, exports.sendEmail)({
        receiverEmail: senderEmail,
        subject: "Transaction Alert",
        emailTemplate: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Debit Transaction Alert - American Horizon</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { border-collapse: collapse !important; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; font-family: Arial, Helvetica, sans-serif; background-color: #eef2f7; }

    @media screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .content { padding: 20px !important; }
      h1 { font-size: 22px !important; }
      p { font-size: 16px !important; }
    }

    .info-box, .transaction-box {
      border-radius: 8px;
      padding: 18px;
      margin: 25px 0;
      font-size: 15px;
      color: #333;
    }

    .info-box { background: #f9fbff; border: 1px solid #e0e7ff; }
    .transaction-box { background: #fff8f0; border: 1px solid #ffd7a6; }

    .highlight { color: #1a73e8; font-weight: bold; }
    .section-title { font-weight: bold; margin-top: 15px; margin-bottom: 5px; }
  </style>
</head>
<body>

  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" bgcolor="#eef2f7">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#ffffff" style="padding: 25px; border-bottom:1px solid #e5e5e5;">
              <img src="${clientUrl}/logo.png" alt="American Horizon" width="180" style="display:block;">
            </td>
          </tr>

          <!-- Banner -->
          <tr>
            <td align="center" style="padding: 35px; background: linear-gradient(120deg, #1a73e8, #0056b3, #d4af37);">
              <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:700;">Debit Transaction Alert</h1>
              <p style="color:#f1f1f1; font-size:15px; margin:10px 0 0 0;">Your account has been debited</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding:40px;">
              <p style="font-size:16px; color:#333; line-height:1.6; margin:0 0 20px 0;">
                Dear <span class="highlight">${userName}</span>,
              </p>
              <p style="font-size:16px; color:#555; line-height:1.6; margin:0 0 25px 0;">
                A debit transaction has been made from your account with <strong>${compName}</strong>.  
                Please review the transaction details below:
              </p>

              <!-- Transaction Details -->
              <div class="transaction-box">
                <p><strong>Transaction Type:</strong> <span class="highlight">Domestic Transfer</span></p>
                <p><strong>Date:</strong> <span class="highlight">${humanReadableDate}</span></p>
                <p><strong>Amount:</strong> <span class="highlight">$${_1.utils.formatNumber(amount)}</span></p>

               
                <div>
                  <p class="section-title">Domestic Transfer Details:</p>
                  <p><strong>Beneficiary Name:</strong> <span class="highlight">${recipientName}</span></p>
                  <p><strong>Beneficiary Account Number:</strong> <span class="highlight">${accountNumber}</span></p>
                  ${decription &&
            `<p><strong>Description:</strong> <span class="highlight">${decription}</span></p>`}
                </div>
       

               
              </div>

              <p style="font-size:14px; color:#888; line-height:1.5; margin-top:20px;">
                If you did not authorize this transaction, please contact our support team immediately.
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
});
exports.sendDomesticTransferDebitAlert = sendDomesticTransferDebitAlert;
const sendDomesticTransferCreditAlert = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountNumber, amount, recipientName, senderEmail, userName, decription, transferType, } = input;
    const now = new Date();
    const humanReadableDate = now.toLocaleString("en-US", {
        weekday: "long", // e.g., Monday
        year: "numeric", // e.g., 2023
        month: "long", // e.g., December
        day: "numeric", // e.g., 25
    });
    console.log("sending debit");
    return (0, exports.sendEmail)({
        receiverEmail: senderEmail,
        subject: "Transaction Alert",
        emailTemplate: `for credit alert    <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Credit Transaction Alert - American Horizon</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { border-collapse: collapse !important; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; font-family: Arial, Helvetica, sans-serif; background-color: #eef2f7; }

    @media screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .content { padding: 20px !important; }
      h1 { font-size: 22px !important; }
      p { font-size: 16px !important; }
    }

    .info-box, .transaction-box {
      border-radius: 8px;
      padding: 18px;
      margin: 25px 0;
      font-size: 15px;
      color: #333;
    }

    .info-box { background: #f9fbff; border: 1px solid #e0e7ff; }
    .transaction-box { background: #e6fff0; border: 1px solid #a6ffd7; }

    .highlight { color: #1a73e8; font-weight: bold; }
    .section-title { font-weight: bold; margin-top: 15px; margin-bottom: 5px; }
  </style>
</head>
<body>

  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" bgcolor="#eef2f7">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#ffffff" style="padding: 25px; border-bottom:1px solid #e5e5e5;">
              <img src="${clientUrl}/logo.png" alt="American Horizon" width="180" style="display:block;">
            </td>
          </tr>

          <!-- Banner -->
          <tr>
            <td align="center" style="padding: 35px; background: linear-gradient(120deg, #1a73e8, #0056b3, #28a745);">
              <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:700;">Credit Transaction Alert</h1>
              <p style="color:#f1f1f1; font-size:15px; margin:10px 0 0 0;">Your account has been credited</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding:40px;">
              <p style="font-size:16px; color:#333; line-height:1.6; margin:0 0 20px 0;">
                Dear <span class="highlight">${userName}</span>,
              </p>
              <p style="font-size:16px; color:#555; line-height:1.6; margin:0 0 25px 0;">
                A credit transaction has been made to your account with <strong>American Horizon</strong>.  
                Please review the transaction details below:
              </p>

              <!-- Transaction Details -->
              <div class="transaction-box">
                <p><strong>Transaction Type:</strong> <span class="highlight">${_1.utils.toSentenceCase(transferType)}</span></p>
                <p><strong>Date:</strong> <span class="highlight">${humanReadableDate}}</span></p>
                <p><strong>Amount:</strong> <span class="highlight">${_1.utils.formatNumber(amount)}span></p>

                <!-- Conditional: Domestic Transfer -->
              
                <div>
                  <p class="section-title">Domestic Transfer Details:</p>
                  <p><strong>Sender Name:</strong> <span class="highlight">${recipientName}</span></p>
                  <p><strong>Sender Account Number:</strong> <span class="highlight">${accountNumber}</span></p>
                 ${decription &&
            `<p><strong>Description:</strong> <span class="highlight">${decription}</span></p>`}
                </div>
              

              
              </div>

              <p style="font-size:14px; color:#888; line-height:1.5; margin-top:20px;">
                If you do not recognize this transaction, please contact our support team immediately.
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
});
exports.sendDomesticTransferCreditAlert = sendDomesticTransferCreditAlert;
const sendWireTransferCreditAlert = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountName, amount, country, recipientName, routingNumber, swiftCode, senderEmail, transferType, } = input;
    const now = new Date();
    const humanReadableDate = now.toLocaleString("en-US", {
        weekday: "long", // e.g., Monday
        year: "numeric", // e.g., 2023
        month: "long", // e.g., December
        day: "numeric", // e.g., 25
    });
    console.log("sending debit");
    return (0, exports.sendEmail)({
        receiverEmail: senderEmail,
        subject: "Transaction Alert",
        emailTemplate: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Credit Transaction Alert - American Horizon</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { border-collapse: collapse !important; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; font-family: Arial, Helvetica, sans-serif; background-color: #eef2f7; }

    @media screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .content { padding: 20px !important; }
      h1 { font-size: 22px !important; }
      p { font-size: 16px !important; }
    }

    .info-box, .transaction-box {
      border-radius: 8px;
      padding: 18px;
      margin: 25px 0;
      font-size: 15px;
      color: #333;
    }

    .info-box { background: #f9fbff; border: 1px solid #e0e7ff; }
    .transaction-box { background: #e6fff0; border: 1px solid #a6ffd7; }

    .highlight { color: #1a73e8; font-weight: bold; }
    .section-title { font-weight: bold; margin-top: 15px; margin-bottom: 5px; }
  </style>
</head>
<body>

  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" bgcolor="#eef2f7">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#ffffff" style="padding: 25px; border-bottom:1px solid #e5e5e5;">
              <img src="${clientUrl}/logo.png" alt="American Horizon" width="180" style="display:block;">
            </td>
          </tr>

          <!-- Banner -->
          <tr>
            <td align="center" style="padding: 35px; background: linear-gradient(120deg, #1a73e8, #0056b3, #28a745);">
              <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:700;">Credit Transaction Alert</h1>
              <p style="color:#f1f1f1; font-size:15px; margin:10px 0 0 0;">Your account has been credited</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding:40px;">
              <p style="font-size:16px; color:#333; line-height:1.6; margin:0 0 20px 0;">
                Dear <span class="highlight">${accountName}</span>,
              </p>
              <p style="font-size:16px; color:#555; line-height:1.6; margin:0 0 25px 0;">
                A credit transaction has been made to your account with <strong>American Horizon</strong>.  
                Please review the transaction details below:
              </p>

              <!-- Transaction Details -->
              <div class="transaction-box">
                <p><strong>Transaction Type:</strong> <span class="highlight">${_1.utils.toSentenceCase(transferType)}</span></p>
                <p><strong>Date:</strong> <span class="highlight">${humanReadableDate}</span></p>
                <p><strong>Amount:</strong> <span class="highlight">${_1.utils.formatNumber(amount)}</span></p>


                <!-- Conditional: Wire Transfer -->
            
                <div>
                  <p class="section-title">Wire Transfer Details:</p>
                  <p><strong>Routing Number:</strong> <span class="highlight">${routingNumber}</span></p>
                  <p><strong>SWIFT Code:</strong> <span class="highlight">${swiftCode}</span></p>
                  <p><strong>Country:</strong> <span class="highlight">${country}</span></p>
                  <p><strong>Sender Name:</strong> <span class="highlight">${recipientName}</span></p>
                </div>
            
              </div>

              <p style="font-size:14px; color:#888; line-height:1.5; margin-top:20px;">
                If you do not recognize this transaction, please contact our support team immediately.
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
});
exports.sendWireTransferCreditAlert = sendWireTransferCreditAlert;
const sendLoanApprovalEmail = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, interestRate, receiverEmail, userName, accountNumber, loanTenure, description, } = input;
    const now = new Date();
    const humanReadableDate = now.toLocaleString("en-US", {
        weekday: "long", // e.g., Monday
        year: "numeric", // e.g., 2023
        month: "long", // e.g., December
        day: "numeric", // e.g., 25
    });
    console.log("sending debit");
    return (0, exports.sendEmail)({
        receiverEmail: receiverEmail,
        subject: "Transaction Alert",
        emailTemplate: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loan Approved - ${compName}</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { border-collapse: collapse !important; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; font-family: Arial, Helvetica, sans-serif; background-color: #eef2f7; }

    @media screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .content { padding: 20px !important; }
      h1 { font-size: 22px !important; }
      p { font-size: 16px !important; }
    }

    .transaction-box {
      background: #e6fff0;
      border: 1px solid #a6ffd7;
      border-radius: 8px;
      padding: 25px;
      margin: 25px 0;
      font-size: 15px;
      color: #333;
    }

    .highlight { color: #1a73e8; font-weight: bold; }
    .section-title { font-weight: bold; margin-top: 15px; margin-bottom: 5px; }
  </style>
</head>
<body>

  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" bgcolor="#eef2f7">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#ffffff" style="padding: 25px; border-bottom:1px solid #e5e5e5;">
              <img src="${clientUrl}/logo.png" alt="American Horizon" width="180" style="display:block;">
            </td>
          </tr>

          <!-- Banner -->
          <tr>
            <td align="center" style="padding: 35px; background: linear-gradient(120deg, #1a73e8, #0056b3, #28a745);">
              <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:700;">Loan Approved & Credited</h1>
              <p style="color:#f1f1f1; font-size:15px; margin:10px 0 0 0;">Congratulations!</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding:40px;">
              <p style="font-size:16px; color:#333; line-height:1.6; margin:0 0 20px 0;">
                Dear <span class="highlight">${userName}</span>,
              </p>
              <p style="font-size:16px; color:#555; line-height:1.6; margin:0 0 25px 0;">
                Your loan application with <strong>${compName}</strong> has been <strong>approved</strong>. The approved loan amount has been successfully credited to your account.
              </p>

              <!-- Loan Details -->
              <div class="transaction-box">
                <p><strong>Loan Amount:</strong> <span class="highlight">${_1.utils.formatNumber(amount)}</span></p>
                <p><strong>Loan Account Number:</strong> <span class="highlight">${accountNumber}</span></p>
                <p><strong>Date Credited:</strong> <span class="highlight">${humanReadableDate}</span></p>
                <p><strong>Tenure:</strong> <span class="highlight">${loanTenure}</span></p>
                <p><strong>Interest Rate:</strong> <span class="highlight">${interestRate}%</span></p>
                <p><strong>Description:</strong> <span class="highlight">${description}</span></p>
              </div>

              <p style="font-size:14px; color:#888; line-height:1.5; margin-top:20px;">
                You can now access your account to view your updated balance. For any questions, please contact your account manager or our Customer Care team.
              </p>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="padding:20px 40px; background:#fafafa; border-top:1px solid #e5e5e5;">
              <p style="font-size:13px; color:#666; line-height:1.5; margin:0;">
                🔒 This message is intended only for the account holder of American Horizon.  
                If you did not request this, please contact Customer Care immediately.
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
});
exports.sendLoanApprovalEmail = sendLoanApprovalEmail;
const sendLoanDeclinedEmail = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiverEmail, userName } = input;
    const now = new Date();
    const humanReadableDate = now.toLocaleString("en-US", {
        weekday: "long", // e.g., Monday
        year: "numeric", // e.g., 2023
        month: "long", // e.g., December
        day: "numeric", // e.g., 25
    });
    console.log("sending debit");
    return (0, exports.sendEmail)({
        receiverEmail: receiverEmail,
        subject: "Transaction Alert",
        emailTemplate: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loan Application Status - American Horizon</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { border-collapse: collapse !important; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; font-family: Arial, Helvetica, sans-serif; background-color: #eef2f7; }

    @media screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .content { padding: 20px !important; }
      h1 { font-size: 22px !important; }
      p { font-size: 16px !important; }
    }

    .alert-box {
      background: #fff4f4;
      border: 1px solid #f5c2c7;
      border-radius: 8px;
      padding: 25px;
      margin: 25px 0;
      font-size: 15px;
      color: #333;
    }

    .highlight { color: #d93025; font-weight: bold; }
  </style>
</head>
<body>

  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" bgcolor="#eef2f7">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#ffffff" style="padding: 25px; border-bottom:1px solid #e5e5e5;">
              <img src="${clientUrl}/logo.png" alt="American Horizon" width="180" style="display:block;">
            </td>
          </tr>

          <!-- Banner -->
          <tr>
            <td align="center" style="padding: 35px; background: linear-gradient(120deg, #d93025, #a52714);">
              <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:700;">Loan Application Declined</h1>
              <p style="color:#f1f1f1; font-size:15px; margin:10px 0 0 0;">Important Update</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding:40px;">
              <p style="font-size:16px; color:#333; line-height:1.6; margin:0 0 20px 0;">
                Dear <span class="highlight">${userName}</span>,
              </p>
              <div class="alert-box">
                <p>
                  We regret to inform you that your recent loan application with <strong>American Horizon</strong> has been <span class="highlight">declined</span>.
                </p>
                <p>
                  The decision was based on our internal review process. Unfortunately, we are unable to provide specific reasons due to regulatory and confidentiality policies.
                </p>
                <p>
                  For further assistance or to discuss alternative financing options, please contact your account manager or our Customer Care team.
                </p>
                <p>
                  <strong>Customer Care:</strong> <span class="highlight">${adminEmail}</span> | <span class="highlight">{{customerCarePhone}}</span>
                </p>
              </div>

              <p style="font-size:14px; color:#888; line-height:1.5; margin-top:20px;">
                We appreciate your understanding and encourage you to explore other banking solutions with American Horizon.
              </p>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="padding:20px 40px; background:#fafafa; border-top:1px solid #e5e5e5;">
              <p style="font-size:13px; color:#666; line-height:1.5; margin:0;">
                🔒 This message is intended only for the account holder of ${compName}.  
                If you did not request this, please contact Customer Care immediately.
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
});
exports.sendLoanDeclinedEmail = sendLoanDeclinedEmail;
const sendAccountSuspendedEmail = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiverEmail, userName } = input;
    const now = new Date();
    const humanReadableDate = now.toLocaleString("en-US", {
        weekday: "long", // e.g., Monday
        year: "numeric", // e.g., 2023
        month: "long", // e.g., December
        day: "numeric", // e.g., 25
    });
    console.log("sending debit");
    return (0, exports.sendEmail)({
        receiverEmail: receiverEmail,
        subject: "Transaction Alert",
        emailTemplate: ` <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Suspension Notice - ${compName}</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { border-collapse: collapse !important; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; font-family: Arial, Helvetica, sans-serif; background-color: #eef2f7; }

    @media screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .content { padding: 20px !important; }
      h1 { font-size: 22px !important; }
      p { font-size: 16px !important; }
    }

    .alert-box {
      background: #fff4f4;
      border: 1px solid #f5c2c7;
      border-radius: 8px;
      padding: 25px;
      margin: 25px 0;
      font-size: 15px;
      color: #333;
    }

    .highlight { color: #d93025; font-weight: bold; }
  </style>
</head>
<body>

  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" bgcolor="#eef2f7">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#ffffff" style="padding: 25px; border-bottom:1px solid #e5e5e5;">
              <img src="${clientUrl}/logo.png" alt="American Horizon" width="180" style="display:block;">
            </td>
          </tr>

          <!-- Banner -->
          <tr>
            <td align="center" style="padding: 35px; background: linear-gradient(120deg, #d93025, #a52714);">
              <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:700;">Account Restricted</h1>
              <p style="color:#f1f1f1; font-size:15px; margin:10px 0 0 0;">Immediate Action Required</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding:40px;">
              <p style="font-size:16px; color:#333; line-height:1.6; margin:0 0 20px 0;">
                Dear <span class="highlight">${userName}</span>,
              </p>
              <div class="alert-box">
                <p>
                  We have detected <strong>malicious or unauthorized activity</strong> associated with your American Horizon account.  
                  As a precaution, your account has been <span class="highlight">temporarily restricted</span>.
                </p>
                <p>
                  You can still <strong>access your account to view balances and statements</strong>, but all outgoing transactions are currently disabled.
                </p>
                <p>
                  To restore full access and review your account, please contact your assigned account manager or our Customer Care team immediately.
                </p>
                <p>
                  <strong>Customer Care:</strong> <span class="highlight">${adminEmail}</span> | <span class="highlight">{{customerCarePhone}}</span>
                </p>
              </div>

              <p style="font-size:14px; color:#888; line-height:1.5; margin-top:20px;">
                This action is for your protection. Please do not ignore this notice to avoid further restrictions on your account.
              </p>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="padding:20px 40px; background:#fafafa; border-top:1px solid #e5e5e5;">
              <p style="font-size:13px; color:#666; line-height:1.5; margin:0;">
                🔒 This message is intended only for the account holder of American Horizon.  
                If you did not request this, please contact Customer Care immediately.
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
});
exports.sendAccountSuspendedEmail = sendAccountSuspendedEmail;
const sendForgotPasswordEmail = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp, receiverEmail, userName } = input;
    const now = new Date();
    const humanReadableDate = now.toLocaleString("en-US", {
        weekday: "long", // e.g., Monday
        year: "numeric", // e.g., 2023
        month: "long", // e.g., December
        day: "numeric", // e.g., 25
    });
    console.log("sending debit");
    return (0, exports.sendEmail)({
        receiverEmail: receiverEmail,
        subject: "Forgot Password",
        emailTemplate: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset - ${compName}</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { border-collapse: collapse !important; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; font-family: Arial, Helvetica, sans-serif; background-color: #eef2f7; }

    @media screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .content { padding: 20px !important; }
      h1 { font-size: 22px !important; }
      p { font-size: 16px !important; }
    }

    .alert-box {
      background: #f9fbff;
      border: 1px solid #c5d9f7;
      border-radius: 8px;
      padding: 25px;
      margin: 25px 0;
      font-size: 15px;
      color: #333;
    }

    .highlight { color: #1d4ed8; font-weight: bold; }
    .btn {
      display: inline-block;
      background: #1d4ed8;
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 15px;
      font-weight: bold;
      margin-top: 15px;
    }
  </style>
</head>
<body>

  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" bgcolor="#eef2f7">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#ffffff" style="padding: 25px; border-bottom:1px solid #e5e5e5;">
              <img src="${clientUrl}/logo.png" alt="American Horizon" width="180" style="display:block;">
            </td>
          </tr>

          <!-- Banner -->
          <tr>
            <td align="center" style="padding: 35px; background: linear-gradient(120deg, #1d4ed8, #0f172a);">
              <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:700;">Password Reset Request</h1>
              <p style="color:#f1f1f1; font-size:15px; margin:10px 0 0 0;">Secure Account Access</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding:40px;">
              <p style="font-size:16px; color:#333; line-height:1.6; margin:0 0 20px 0;">
                Dear <span class="highlight">${userName}</span>,
              </p>
              <div class="alert-box">
                <p>
                  We received a request to reset the password for your <strong>${compName}</strong> account.
                </p>
                <p>
                  To proceed, please click the button below. If you did not request a password reset, you can safely ignore this message.
                </p>
                <p style="text-align:center;">
                  <a href="${clientUrl}/login/forgot-password/new-password?email=${receiverEmail}&otp=${otp}" class="btn">Reset My Password</a>
                </p>
              </div>

              <p style="font-size:14px; color:#888; line-height:1.5; margin-top:20px;">
                This reset link will expire in <strong>30 minutes</strong>. For your security, do not share this link with anyone.
              </p>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="padding:20px 40px; background:#fafafa; border-top:1px solid #e5e5e5;">
              <p style="font-size:13px; color:#666; line-height:1.5; margin:0;">
                🔒 This email was sent to <span class="highlight">${receiverEmail}</span>.  
                If you did not request this, please contact Customer Care immediately.
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
});
exports.sendForgotPasswordEmail = sendForgotPasswordEmail;
const sendContactUsEmail = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, fullName, message, phoneNumber, subject } = input;
    const now = new Date();
    const humanReadableDate = now.toLocaleString("en-US", {
        weekday: "long", // e.g., Monday
        year: "numeric", // e.g., 2023
        month: "long", // e.g., December
        day: "numeric", // e.g., 25
    });
    console.log("sending debit");
    return (0, exports.sendEmail)({
        receiverEmail: adminEmail,
        subject: "Contact Form via Website",
        emailTemplate: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Form Submission - ${compName}</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { border-collapse: collapse !important; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; font-family: Arial, Helvetica, sans-serif; background-color: #eef2f7; }

    @media screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .content { padding: 20px !important; }
      h1 { font-size: 22px !important; }
      p { font-size: 16px !important; }
    }

    .info-box {
      background: #f9fbff;
      border: 1px solid #c5d9f7;
      border-radius: 8px;
      padding: 25px;
      margin: 25px 0;
      font-size: 15px;
      color: #333;
    }

    .highlight { color: #1d4ed8; font-weight: bold; }
  </style>
</head>
<body>

  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" bgcolor="#eef2f7">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#ffffff" style="padding: 25px; border-bottom:1px solid #e5e5e5;">
              <img src="${clientUrl}/logo.png" alt="American Horizon" width="180" style="display:block;">
            </td>
          </tr>

          <!-- Banner -->
          <tr>
            <td align="center" style="padding: 35px; background: linear-gradient(120deg, #1d4ed8, #0f172a);">
              <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:700;">New Contact Request</h1>
              <p style="color:#f1f1f1; font-size:15px; margin:10px 0 0 0;">Submitted via Website</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding:40px;">
              <p style="font-size:16px; color:#333; line-height:1.6; margin:0 0 20px 0;">
                A new message has been submitted through the <strong>Contact Us</strong> form.
              </p>

              <div class="info-box">
                <p><strong>Full Name:</strong> <span class="highlight">${fullName}</span></p>
                <p><strong>Email Address:</strong> <span class="highlight">${email}</span></p>
                <p><strong>Phone Number:</strong> <span class="highlight">${phoneNumber}</span></p>
                <p><strong>Subject:</strong> <span class="highlight">${subject}</span></p>
                <p><strong>Message:</strong></p>
                <p style="margin:10px 0; padding:12px; background:#f3f4f6; border-radius:6px; font-size:14px; line-height:1.5; color:#333;">
                  ${message}
                </p>
              </div>

              <p style="font-size:14px; color:#888; line-height:1.5; margin-top:20px;">
                Please respond to this inquiry as soon as possible.
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
});
exports.sendContactUsEmail = sendContactUsEmail;
