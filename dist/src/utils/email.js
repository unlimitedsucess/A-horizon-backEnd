"use strict";
// import dotenv from "dotenv";
// import nodemailer from "nodemailer";
// import { ISendEmail } from "./interface";
// import { IContactUsUserInput } from "../contact_us/interface";
// import { IParcelSendEmail } from "../parcel/interface";
// import { IReachOutUserInput } from "../reach_out/interface";
// dotenv.config();
// const smtpSender = process.env.EMAILSENDER;
// const smtpPassword = process.env.EMAILSENDERPASSWORD;
// const smtpEmailFrom = process.env.EMAILFROM;
// const clientUrl = process.env.CLIENT_URL;
// const adminEmail = process.env.ADMIN_EMAIL ?? "";
// dotenv.config();
// export const sendEmail = async (input: ISendEmail) => {
//   //PROD
//   // var transport = nodemailer.createTransport({
//   //   host: "smtp.zeptomail.com",
//   //   port: 587,
//   //   auth: {
//   //     user: smtpSender,
//   //     pass: smtpPassword,
//   //   },
//   // });
//   // var mailOptions = {
//   //   from: `"Alphacourier Team" <${smtpEmailFrom}>`,
//   //   to: input.receiverEmail,
//   //   replyTo: smtpEmailFrom,
//   //   subject: input.subject,
//   //   html: input.emailTemplate,
//   // };
//   // transport.sendMail(mailOptions, (error, info) => {
//   //   if (error) {
//   //     return console.log(error);
//   //   }
//   //   console.log("Successfully sent");
//   // });
// //PROD
//   try {
//     // const transporter = nodemailer.createTransport({
//     //   host: 'smtp-relay.sendinblue.com',
//     //   port: 587,
//     //   secure: false,
//     //   auth: {
//     //     user: smtpSender,
//     //     pass: smtpPassword,
//     //   },
//     // });
//     // const mailOptions = {
//     //   from: `Alphacourier <${smtpEmailFrom}>`,
//     //   to: input.receiverEmail,
//     //   subject: input.subject,
//     //   html: input.emailTemplate,
//     // };
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: smtpSender,
//         pass: smtpPassword,
//       },
//     });
//     const mailOptions = {
//       from: `Alphacourier <${smtpEmailFrom}>`,
//       to: input.receiverEmail,
//       subject: input.subject,
//       html: input.emailTemplate,
//     };
//     const info = await transporter.sendMail(mailOptions);
//     console.error("email=sent", info);
//     return info.response;
//   } catch (error) {
//     console.error("Email sending error:", error);
//     // throw error;
//   }
// };
// export const sendContactUsEmailToAdmin = async (input: IContactUsUserInput) => {
//   return sendEmail({
//     receiverEmail: adminEmail,
//     subject: "Customer Support",
//     emailTemplate: `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Delivery Update | Alphacourier</title>
//     <style>
//         /* Global Reset */
//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//         }
//         body {
//             font-family: Arial, sans-serif;
//             background-color: #f2f2f2;
//             color: #333;
//             line-height: 1.6;
//         }
//         .container {
//             max-width: 600px;
//             margin: 40px auto;
//             background-color: #fff;
//             padding: 20px;
//             border-radius: 10px;
//             box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//             height: auto;
//             box-sizing: border-box;
//         }
//         .header {
//             text-align: center;
//             background-color: #FE6C16;
//             padding: 20px;
//             border-radius: 10px 10px 0 0;
//             color: #fff;
//         }
//         .header img {
//             width: 150px;
//             margin-bottom: 10px;
//         }
//         .content {
//             padding: 20px;
//             color: #333;
//         }
//         .footer {
//             text-align: center;
//             background-color: #FE6C16;
//             padding: 10px;
//             border-radius: 0 0 10px 10px;
//             color: #fff;
//         }
//         h1, h2, h3 {
//             color: #333;
//         }
//         p {
//             font-size: 16px;
//             margin-bottom: 15px;
//         }
//         .highlight {
//             font-weight: bold;
//             color: #FE6C16;
//         }
//         ul {
//             list-style: none;
//             margin: 20px 0;
//             padding: 0;
//             border: 1px solid #FE6C16;
//             border-radius: 8px;
//         }
//         li {
//             font-size: 16px;
//             padding: 12px 20px;
//             border-bottom: 1px solid #ddd;
//         }
//         li:last-child {
//             border-bottom: none;
//         }
//         .button {
//             display: inline-block;
//             background-color: #FE6C16;
//             color: white;
//             padding: 12px 25px;
//             border-radius: 5px;
//             text-decoration: none;
//             font-weight: bold;
//             text-align: center;
//             margin-top: 20px;
//         }
//         .button:hover {
//             background-color: #e0561a;
//         }
//         /* Responsive Styles */
//         @media (max-width: 600px) {
//             .container {
//                 padding: 15px;
//             }
//             .header img {
//                 width: 120px;
//             }
//             .footer {
//                 font-size: 14px;
//             }
//             .button {
//                 font-size: 14px;
//                 padding: 10px 20px;
//             }
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <div class="header">
//             <img src="${clientUrl}/assets/img/logo/logo5.png" alt="Alphacourier Logistics Logo">
//             <h1>Delivery Update</h1>
//         </div>
//         <div class="content">
//             <p style="font-size: 24px; font-weight: bold;">${input.name}</p>
//             <p><strong>Date:</strong> 11-12-2025 10:00:04</p>
//             <p style="font-size: 16px; line-height: 1.5"><span class="highlight">Description:</span> ${
//               input.description
//             }</p>
//             <div style="background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//                 <ul>
//                     <li><span class="highlight">Name:</span> ${input.name}</li>
//                     <li><span class="highlight">Issue Type:</span> ${
//                       input.issueType
//                     }</li>
//                     <li><span class="highlight">Email:</span> ${
//                       input.email
//                     }</li>
//                 </ul>
//             </div>
//         </div>
//         <div class="footer">
//             <p>&copy; ${new Date().getFullYear()} Alphacourier. All rights reserved.</p>
//         </div>
//     </div>
// </body>
// </html>
// 	`,
//   });
// };
// export const sendReachOutEmailToAdmin = async (input: IReachOutUserInput) => {
//   const now = new Date();
//   const humanReadableDate = now.toLocaleString("en-US", {
//     weekday: "long", // e.g., Monday
//     year: "numeric", // e.g., 2023
//     month: "long", // e.g., December
//     day: "numeric", // e.g., 25
//   });
//   return sendEmail({
//     receiverEmail: adminEmail,
//     subject: "Customer Support",
//     emailTemplate: `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Delivery Update | Alphacourier</title>
//     <style>
//         /* Global Reset */
//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//         }
//         body {
//             font-family: Arial, sans-serif;
//             background-color: #f2f2f2;
//             color: #333;
//             line-height: 1.6;
//         }
//         .container {
//             max-width: 600px;
//             margin: 40px auto;
//             background-color: #fff;
//             padding: 20px;
//             border-radius: 10px;
//             box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//             height: auto;
//             box-sizing: border-box;
//         }
//         .header {
//             text-align: center;
//             background-color: #FE6C16;
//             padding: 20px;
//             border-radius: 10px 10px 0 0;
//             color: #fff;
//         }
//         .header img {
//             width: 150px;
//             margin-bottom: 10px;
//         }
//         .content {
//             padding: 20px;
//             color: #333;
//         }
//         .footer {
//             text-align: center;
//             background-color: #FE6C16;
//             padding: 10px;
//             border-radius: 0 0 10px 10px;
//             color: #fff;
//         }
//         h1, h2, h3 {
//             color: #333;
//         }
//         p {
//             font-size: 16px;
//             margin-bottom: 15px;
//         }
//         .highlight {
//             font-weight: bold;
//             color: #FE6C16;
//         }
//         ul {
//             list-style: none;
//             margin: 20px 0;
//             padding: 0;
//             border: 1px solid #FE6C16;
//             border-radius: 8px;
//         }
//         li {
//             font-size: 16px;
//             padding: 12px 20px;
//             border-bottom: 1px solid #ddd;
//         }
//         li:last-child {
//             border-bottom: none;
//         }
//         .button {
//             display: inline-block;
//             background-color: #FE6C16;
//             color: white;
//             padding: 12px 25px;
//             border-radius: 5px;
//             text-decoration: none;
//             font-weight: bold;
//             text-align: center;
//             margin-top: 20px;
//         }
//         .button:hover {
//             background-color: #e0561a;
//         }
//         /* Responsive Styles */
//         @media (max-width: 600px) {
//             .container {
//                 padding: 15px;
//             }
//             .header img {
//                 width: 120px;
//             }
//             .footer {
//                 font-size: 14px;
//             }
//             .button {
//                 font-size: 14px;
//                 padding: 10px 20px;
//             }
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <div class="header">
//             <img src="${clientUrl}/assets/img/logo/logo5.png">
//             <h1>Need a hand</h1>
//         </div>
//         <div class="content">
//             <p style="font-size: 24px; font-weight: bold;">${input.name}</p>
//             <p><strong>Date:</strong> ${humanReadableDate}</p>
//             <p style="font-size: 16px; line-height: 1.5"><span class="highlight">Description:</span> ${
//               input.description
//             }</p>
//             <div style="background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//                 <ul>
//                     <li><span class="highlight">Name:</span> ${input.name}</li>
//                     <li><span class="highlight">Department:</span> ${
//                       input.departmentToEmail
//                     }</li>
//                     <li><span class="highlight">Email:</span> ${
//                       input.email
//                     }</li>
//                 </ul>
//             </div>
//         </div>
//         <div class="footer">
//             <p>&copy; ${new Date().getFullYear()} Alphacourier. All rights reserved.</p>
//         </div>
//     </div>
// </body>
// </html>`,
//   });
// };
// export const sendMessageToParcelReceiverOrSender = async (input: IParcelSendEmail) => {
//   const now = new Date();
//   const humanReadableDate = now.toLocaleString("en-US", {
//     weekday: "long", // e.g., Monday
//     year: "numeric", // e.g., 2023
//     month: "long", // e.g., December
//     day: "numeric", // e.g., 25
//   });
//   return sendEmail({
//     receiverEmail: input.isSender ? input.senderEmail : input.receiverEmail,
//     subject: "Customer Support",
//     emailTemplate: `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Delivery Update | Alphacourier</title>
//   <style>
//     /* Global Reset */
//     * {
//       margin: 0;
//       padding: 0;
//       box-sizing: border-box;
//     }
//     body {
//       font-family: Arial, sans-serif;
//       background-color: #f2f2f2;
//       color: #333;
//       line-height: 1.6;
//     }
//     .container {
//       max-width: 600px;
//       margin: 0 auto;
//       background-color: #ffffff;
//       padding: 20px;
//       border-radius: 10px;
//       box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//     }
//     .header {
//       text-align: center;
//       background-color: #FE6C16;
//       padding: 20px;
//       border-radius: 10px 10px 0 0;
//       color: #fff;
//     }
//     .header img {
//       width: 150px;
//       margin-bottom: 10px;
//     }
//     .content {
//       padding: 20px;
//     }
//     .footer {
//       text-align: center;
//       background-color: #FE6C16;
//       padding: 10px;
//       border-radius: 0 0 10px 10px;
//       color: #fff;
//     }
//     h1, h2, h3 {
//       color: #333;
//     }
//     p {
//       font-size: 14px;
//       margin-bottom: 15px;
//     }
//     ul {
//       list-style: none;
//       margin: 20px 0;
//       padding: 0;
//     }
//     li {
//       font-size: 14px;
//       padding-bottom: 8px;
//     }
//     .highlight {
//       font-weight: bold;
//       color: #FE6C16;
//     }
//     .tracking-link {
//       color: #FE6C16;
//       text-decoration: none;
//     }
//     .tracking-link:hover {
//       text-decoration: underline;
//     }
//     .details-list {
//       border: 1px solid #FE6C16;
//       border-radius: 8px;
//       padding: 15px;
//     }
//     .details-list li {
//       padding: 8px 0;
//     }
//     .details-list span {
//       font-weight: bold;
//       color: #FE6C16;
//     }
//     .identity-card-info {
//       background-color: #f9f9f9;
//       border: 1px solid #ddd;
//       padding: 20px;
//       border-radius: 8px;
//     }
//     .identity-card-info p {
//       font-size: 16px;
//       color: #333;
//     }
//     .button {
//       display: inline-block;
//       background-color: #FE6C16;
//       color: white;
//       padding: 12px 25px;
//       border-radius: 5px;
//       text-decoration: none;
//       font-weight: bold;
//       text-align: center;
//       margin-top: 20px;
//     }
//     .button:hover {
//       background-color: #e0561a;
//     }
//     /* Responsive Styles */
//     @media (max-width: 600px) {
//       .container {
//         padding: 10px;
//       }
//       .header img {
//         width: 120px;
//       }
//       .footer {
//         font-size: 12px;
//       }
//       .tracking-link, .button {
//         font-size: 14px;
//       }
//     }
//   </style>
// </head>
// <body>
//   <div class="container">
//     <div class="header">
//       <img src="${clientUrl}/assets/img/logo/logo5.png" alt="Alphacourier Logo">
//       <h1>Delivery Update</h1>
//     </div>
//     <div class="content">
//       <p>Dear ${input.receiverName},</p>
//       <p><strong>Date:</strong> ${humanReadableDate}</p>
//       <p><strong>Deposit Delivery Information:</strong> From ${input.senderLocation} to ${input.parcelsDesignation}.</p>
//       <p>Click on the link or copy the tracking ID below to track your parcel:</p>
//       <ul>
//         <li><a href="${clientUrl}/trackingdetail.html#${input.trackingId}" class="tracking-link">Track Your Parcel</a></li>
//         <li><span class="highlight">Tracking ID:</span> <br/> ${input.trackingId}</li>
//       </ul>
//       <div class="identity-card-info">
//         <p>We received a freight deposit in your name. To proceed with the delivery of your package, we kindly request that you reconfirm your delivery details:</p>
//         <p><strong>Below are your details to reconfirm:</strong></p>
//         <ul class="details-list">
//           <li><span>Name:</span> ${input.receiverName}</li>
//           <li><span>Address:</span> ${input.parcelsDesignation}</li>
//           <li><span>Email:</span> ${input.receiverEmail}</li>
//           <li><span>Phone Number:</span> ${input.phoneNumber}</li>
//         </ul>
//         <p>Please send us a clear picture of a valid government-issued identity card to verify your identity and ensure a smooth delivery process.</p>
//         <p>Thank you for your cooperation. We look forward to your prompt response.</p>
//         <p><strong>Best regards,</strong><br> Alphacourier</p>
//       </div>
//     </div>
//     <div class="footer">
//       <p>&copy; 2025 Alphacourier. All rights reserved.</p>
//     </div>
//   </div>
// </body>
// </html>`,
//   });
// }
