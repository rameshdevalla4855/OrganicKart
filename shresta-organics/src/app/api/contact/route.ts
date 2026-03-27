import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, mobile, message } = await req.json();

    // 1. Create a transporter
    // For Gmail: Use an App Password (not your regular password)
    // Settings -> Security -> 2FA -> App Passwords
    if (!process.env.SMTP_PASS || process.env.SMTP_PASS === 'YOUR_GMAIL_APP_PASSWORD_HERE') {
      console.warn("SMTP_PASS is missing or using placeholder. Message will be saved to Firestore only.");
      return NextResponse.json({ message: 'Saved to records, but email notification skipped (No SMTP Password)' }, { status: 200 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'rameshdevalla144@gmail.com',
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 5000, // 5 seconds timeout
      greetingTimeout: 5000,
      socketTimeout: 5000,
    });

    // 2. Define email options
    const mailOptions = {
       from: `"Shresta Organics Contact" <${process.env.SMTP_USER || 'rameshdevalla144@gmail.com'}>`,
       to: 'rameshdevalla144@gmail.com',
       replyTo: `${name} <${mobile}>`,
       subject: `New Customer Inquiry: ${name}`,
       html: `
         <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
           <h2 style="color: #1B4332; border-bottom: 2px solid #D4A373; padding-bottom: 10px;">New Contact Inquiry</h2>
           <p><strong>Customer Name:</strong> ${name}</p>
           <p><strong>Mobile Number:</strong> ${mobile}</p>
           <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
             <strong>Message:</strong><br/>
             ${message.replace(/\n/g, '<br/>')}
           </div>
           <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
           <p style="font-size: 12px; color: #888;">This email was sent automatically from the Shresta Organics Platform.</p>
         </div>
       `,
    };

    // 3. Send the email with a sub-try/catch to avoid 500 errors
    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError: unknown) {
      const mailErrorMessage = mailError instanceof Error ? mailError.message : 'Unknown mail error';
      console.warn('Email notification skipped or failed:', mailErrorMessage);
      // We still proceed to return 200 because the message IS saved in Firestore (from the client)
    }

    return NextResponse.json({ message: 'Message recorded successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error('API critical error:', error);
    return NextResponse.json({ error: 'Failed to process inquiry' }, { status: 500 });
  }
}
