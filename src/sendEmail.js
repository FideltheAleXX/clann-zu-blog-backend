import { Resend } from 'resend';
import 'dotenv/config';

const resend = new Resend(process.env.RESEND_API_KEY);

export const createWelcomeEmail = (name) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Clann Zu Fan Site</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    <div style="background: linear-gradient(to right, #36D1DC, #5B86E5); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 500;">Welcome to Clann Zu fan-site!</h1>
    </div>
    <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <p style="font-size: 18px; color: #5B86E5;"><strong>Hello ${name},</strong></p>
      <p>We're excited to have you join our fan-site! Enjoy yourself.</p>
           
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://www.clann-zu.com" style="background: linear-gradient(to right, #36D1DC, #5B86E5); color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 500; display: inline-block;">Go to Clann Zu fan-site</a>
      </div>
      
      <p style="margin-bottom: 5px;">If you need any help or have questions, we're always here to assist you.</p>
         
      <p style="margin-top: 25px; margin-bottom: 0;">Best regards,<br>The Clann Zu FS Team</p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>© 2026. All rights reserved.</p>
  
    </div>
  </body>
  </html>
  `;
};

export const sendWelcomeEmail = async (email, name) => {
  const { data, error } = await resend.emails.send({
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: 'Welcome to Clann Zu Fan-Site',
    html: createWelcomeEmail(name),
  });

  if (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }

  console.log('Welcome Email sent successfully', data);
};
