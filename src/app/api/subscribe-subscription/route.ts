import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Email to customer
    const imagePath = path.join(process.cwd(), 'public', 'email-subscriptions.png');
    const imageBuffer = fs.readFileSync(imagePath);
    
    await resend.emails.send({
      from: 'Ellie\'s Oats <noreply@elliesoats.co.uk>',
      replyTo: 'elliesoats@hotmail.com',
      to: email,
      subject: 'Welcome to Ellie\'s Oats Subscription Service!',
      html: `<div style="font-family: Arial, sans-serif; max-width: 750px; margin: 0 auto; background-color: #ffffff;">
          <!-- Subscription Image -->
          <div style="text-align: center; padding: 20px;">
            <img src="cid:subscription-image" alt="Ellie's Oats Subscription Service" style="max-width: 100%; height: auto; border-radius: 8px;" />
          </div>
          
          <!-- FAQs Section -->
          <div style="background-color: #e8dcc8; padding: 30px; border-radius: 12px; margin: 20px;">
            <h2 style="color: #9e9b65; margin-top: 0; font-size: 24px; text-align: center; margin-bottom: 20px;">FAQs</h2>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #2c2c2c; font-size: 16px; margin-bottom: 8px; font-weight: bold;">How long will the bowls last?</h3>
              <p style="color: #2c2c2c; line-height: 1.6; margin: 0;">Our bowls are fresh without preservatives! Day of delivery +2 extra days</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #2c2c2c; font-size: 16px; margin-bottom: 8px; font-weight: bold;">How much does the subscription cost?</h3>
              <p style="color: #2c2c2c; line-height: 1.6; margin: 0;">£80 investment for 16 bowls. Two bowls delivered each Monday; two bowls delivered each Wednesday</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #2c2c2c; font-size: 16px; margin-bottom: 8px; font-weight: bold;">When can I subscribe?</h3>
              <p style="color: #2c2c2c; line-height: 1.6; margin: 0;">You can subscribe whenever you fancy. Each week, your bowl selection must be placed by 2pm on Saturday.</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #2c2c2c; font-size: 16px; margin-bottom: 8px; font-weight: bold;">What areas do you cover?</h3>
              <p style="color: #2c2c2c; line-height: 1.6; margin: 0;">East Lancashire & Greater Manchester. Email/dm us your postcode if you're unsure, and we'll check! East Lancashire deliveries will be between approximately 6am and 9am. Greater Manchester deliveries will be between approximately 9am and 12pm.</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #2c2c2c; font-size: 16px; margin-bottom: 8px; font-weight: bold;">I'm not going to be in when you deliver.</h3>
              <p style="color: #2c2c2c; line-height: 1.6; margin: 0;">We can deliver to your work or home, as long as there is a safe space to leave your bowl. We cannot guarantee specific timings, but we will try and accommodate if you let us know. The bowls should be kept refrigerated. If you live in a flat we can give you a message when we're on the way so you can come down and grab them.</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #2c2c2c; font-size: 16px; margin-bottom: 8px; font-weight: bold;">I have a food allergy.</h3>
              <p style="color: #2c2c2c; line-height: 1.6; margin: 0;">All bowls are prepared in a kitchen that handles all 14 major allergens. Therefore, we cannot guarantee any dish is allergen-free. Customers with food allergies or intolerances should contact us via dm or email before ordering to discuss ingredients and suitability. By placing an order, customers acknowledge and accept this risk.</p>
            </div>
            
            <div style="margin-bottom: 0;">
              <h3 style="color: #2c2c2c; font-size: 16px; margin-bottom: 8px; font-weight: bold;">Which bowls can I choose?</h3>
              <p style="color: #2c2c2c; line-height: 1.6; margin: 0;">You can choose any bowls from our menu including our Signature Bowls, Monthly Special or build-your-own.</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p style="margin: 5px 0;">Ellie's Oats - Fuelling Your Fitness Goals</p>
            <p style="margin: 5px 0;">
              <a href="https://instagram.com/ellies.oats" style="color: #9e9b65; text-decoration: none;">Instagram</a> | 
              <a href="mailto:elliesoats@hotmail.com" style="color: #9e9b65; text-decoration: none;">Email Us</a>
            </p>
          </div>
        </div>`,
      attachments: [
        {
          filename: 'email-subscriptions.png',
          content: imageBuffer,
          contentId: 'subscription-image',
        }
      ]
    });

    // Email to admin
    await resend.emails.send({
      from: 'Ellie\'s Oats <noreply@elliesoats.co.uk>',
      to: 'elliesoats@hotmail.com',
      subject: 'New Subscription Service Inquiry',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Logo -->
          <div style="text-align: center; padding: 30px 20px 20px;">
            <img src="https://elliesoats.co.uk/logo.png" alt="Ellie's Oats" style="width: 200px; height: auto;" />
          </div>
          
          <!-- Main Content -->
          <div style="background-color: #e8dcc8; padding: 30px; border-radius: 12px; margin: 20px;">
            <h1 style="color: #4a7c59; margin-top: 0; font-size: 24px;">📧 New Subscription Service Inquiry</h1>
            <p style="color: #2c2c2c; line-height: 1.6;">Someone has expressed interest in your subscription service!</p>
            
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
                  <td style="padding: 8px 0;">Order Page Subscription Form</td>
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
    console.error('Error subscribing to subscription service:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
