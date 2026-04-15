import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_KEY);

const filePath = path.join(process.cwd(), 'public', 'events_april_2026.pdf')
const pdfBuffer = fs.readFileSync(filePath)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: 'Ellie\'s Oats <noreply@elliesoats.co.uk>',
      replyTo: 'elliesoats@hotmail.com',
      to: email,
      subject: 'Thank you for your interest in Ellie\'s Oats Events!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Logo -->
          <div style="text-align: center; padding: 30px 20px 20px;">
            <img src="https://elliesoats.co.uk/logo.png" alt="Ellie's Oats" style="width: 200px; height: auto;" />
          </div>
          
          <!-- Main Content -->
          <div style="background-color: #e8dcc8; padding: 30px; border-radius: 12px; margin: 20px;">
            <h1 style="color: #9e9b65; margin-top: 0; font-size: 24px;">Thank You for Your Interest!</h1>
            <p style="color: #2c2c2c; line-height: 1.6;">Hello,</p>
            <p style="color: #2c2c2c; line-height: 1.6;">Thank you for expressing interest in our events packages at Ellie's Oats!</p>
            <p style="color: #2c2c2c; line-height: 1.6;">Please see attached brochure with our events packages and catering services. Just drop us a message or email if you have any questions or to book in. We can't wait to hear from you & fuel your clients to reach their fitness goals!</p>
            <p style="color: #2c2c2c; line-height: 1.6;">In the meantime, feel free to check out our Instagram <a href="https://instagram.com/ellies.oats" style="color: #9e9b65; text-decoration: none; font-weight: bold;">@ellies.oats</a> or email us directly at <a href="mailto:elliesoats@hotmail.com" style="color: #9e9b65; text-decoration: none; font-weight: bold;">elliesoats@hotmail.com</a>.</p>
            <p style="color: #2c2c2c; line-height: 1.6; margin-bottom: 0;">Best regards,<br/><strong>Ellie's Oats</strong></p>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p style="margin: 5px 0;">Ellie's Oats - Fuelling Your Fitness Goals</p>
            <p style="margin: 5px 0;">
              <a href="https://instagram.com/ellies.oats" style="color: #9e9b65; text-decoration: none;">Instagram</a> | 
              <a href="mailto:elliesoats@hotmail.com" style="color: #9e9b65; text-decoration: none;">Email Us</a>
            </p>
          </div>
        </div>
      `,
      attachments: [
            {
            filename: 'events_april_2026.pdf',
            content: pdfBuffer,
            }
        ]
    });

    await resend.emails.send({
      from: 'Ellie\'s Oats <noreply@elliesoats.co.uk>',
      to: 'elliesoats@hotmail.com',
      subject: 'New Events Package Inquiry',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Logo -->
          <div style="text-align: center; padding: 30px 20px 20px;">
            <img src="https://elliesoats.co.uk/logo.png" alt="Ellie's Oats" style="width: 200px; height: auto;" />
          </div>
          
          <!-- Main Content -->
          <div style="background-color: #e8dcc8; padding: 30px; border-radius: 12px; margin: 20px;">
            <h1 style="color: #4a7c59; margin-top: 0; font-size: 24px;">📧 New Events Package Inquiry</h1>
            <p style="color: #2c2c2c; line-height: 1.6;">Someone has expressed interest in your events packages!</p>
            
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; color: #2c2c2c;">
                <tr>
                  <td style="padding: 8px 0;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Date:</strong></td>
                  <td style="padding: 8px 0;">${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Source:</strong></td>
                  <td style="padding: 8px 0;">About Page Form</td>
                </tr>
              </table>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p style="margin: 5px 0;">Ellie's Oats - Admin Notification</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error subscribing to events:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
