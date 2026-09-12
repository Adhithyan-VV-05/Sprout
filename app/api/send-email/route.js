import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      visitorName, 
      visitorEmail, 
      visitorAge, 
      visitorLocation, 
      message, 
      analyzedIssue, 
      fullTranscript, 
      type 
    } = body;

    const recipientEmail = process.env.SUPERHERO_EMAIL || process.env.EMAIL_USER || process.env.SMTP_USER || 'adhithyanvv4courses@gmail.com';
    const mailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
    const rawMailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
    const mailPass = rawMailPass ? rawMailPass.replace(/\s+/g, '') : '';
    const smtpHost = process.env.SMTP_HOST;

    // Format chat transcript as HTML chat bubbles if provided
    let transcriptHtml = '';
    if (Array.isArray(fullTranscript) && fullTranscript.length > 0) {
      transcriptHtml = fullTranscript.map((t) => {
        const isSprout = t.sender === 'sprout';
        const senderName = isSprout ? '🍃 Sprout (Growth Guardian)' : `👤 ${visitorName || 'Visitor'}`;
        const bgColor = isSprout ? 'rgba(46, 90, 63, 0.4)' : 'rgba(255, 255, 255, 0.08)';
        const borderColor = isSprout ? '#E6C875' : '#CBD8CE';

        return `
          <div style="margin-bottom: 0.85rem; padding: 0.85rem 1.1rem; background: ${bgColor}; border-left: 3px solid ${borderColor}; border-radius: 8px;">
            <div style="font-size: 0.8rem; font-weight: bold; color: #FFDC69; margin-bottom: 0.3rem;">
              ${senderName} <span style="font-weight: normal; color: #CBD8CE; font-size: 0.75rem;">• ${t.time || ''}</span>
            </div>
            <div style="font-size: 0.95rem; line-height: 1.45; color: #FAF6EE;">
              ${t.text}
            </div>
          </div>
        `;
      }).join('');
    } else if (message) {
      transcriptHtml = `
        <div style="padding: 1rem; background: rgba(255, 255, 255, 0.08); border-left: 3px solid #FFDC69; border-radius: 6px;">
          <p style="margin: 0; font-style: italic;">"${message}"</p>
        </div>
      `;
    }

    const isSeekLight = type === 'SEEK_THE_LIGHT';
    const emailSubject = isSeekLight
      ? `🌟 SPROUT SIGNAL: Superhero Call Dispatched by ${visitorName || 'a Visitor'}`
      : `💬 Message to Sprout Superhero from ${visitorName || 'a Visitor'}`;

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0A1810; color: #FAF6EE; padding: 2rem; border-radius: 16px; max-width: 650px; margin: 0 auto; border: 1.5px solid #E6C875;">
        
        <!-- Header -->
        <div style="border-bottom: 2px solid #FFDC69; padding-bottom: 1rem; margin-bottom: 1.5rem; text-align: center;">
          <h1 style="color: #FFDC69; margin: 0; font-size: 1.8rem; letter-spacing: 0.08em;">🍃 SPROUT — THE GROWTH GUARDIAN</h1>
          <p style="color: #CBD8CE; margin-top: 0.4rem; font-size: 0.95rem; font-weight: 600;">
            ${isSeekLight ? '✨ SUPERHERO SIGNAL & VISITOR ISSUE REPORT' : 'Incoming Transmission from Asterra Portal'}
          </p>
        </div>

        <!-- Visitor Details Card -->
        <div style="background: rgba(15, 35, 23, 0.9); padding: 1.25rem 1.5rem; border-radius: 12px; border: 1px solid rgba(230, 200, 117, 0.35); margin-bottom: 1.5rem;">
          <h3 style="color: #FFDC69; font-size: 1.1rem; margin: 0 0 0.8rem 0; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.4rem;">
            👤 Visitor Profile
          </h3>
          <p style="margin: 0.4rem 0;"><strong>Name:</strong> ${visitorName || 'Anonymous Friend'}</p>
          <p style="margin: 0.4rem 0;"><strong>Email / Contact:</strong> ${visitorEmail || 'Not provided'}</p>
          <p style="margin: 0.4rem 0;"><strong>Age / Seasons:</strong> ${visitorAge || 'Not specified'}</p>
          <p style="margin: 0.4rem 0;"><strong>Rooted Location:</strong> ${visitorLocation || 'Not specified'}</p>
        </div>

        <!-- AI Analyzed Issue Box -->
        ${analyzedIssue ? `
          <div style="background: rgba(46, 90, 63, 0.6); padding: 1.25rem 1.5rem; border-radius: 12px; border: 1.5px solid #FFDC69; margin-bottom: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
            <h3 style="color: #FFDC69; font-size: 1.1rem; margin: 0 0 0.5rem 0;">
              🧠 AI Analyzed Core Issue Summary
            </h3>
            <p style="font-size: 1.05rem; line-height: 1.5; color: #FBF7EE; margin: 0; font-weight: 600;">
              "${analyzedIssue}"
            </p>
          </div>
        ` : ''}

        <!-- Transcript Box -->
        <div style="background: rgba(7, 16, 10, 0.8); padding: 1.25rem 1.5rem; border-radius: 12px; border: 1px solid rgba(230, 200, 117, 0.25);">
          <h3 style="color: #E6C875; font-size: 1.1rem; margin: 0 0 1rem 0;">
            💬 Complete Conversation Transcript
          </h3>
          ${transcriptHtml}
        </div>

        <!-- Footer -->
        <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.15); font-size: 0.85rem; color: #CBD8CE; text-align: center;">
          <p style="margin: 0;">Dispatched automatically by Sprout Superhero Signal Network 🌱</p>
          <p style="margin-top: 0.3rem; color: #FFDC69; font-weight: 600;">"No root grows alone."</p>
        </div>
      </div>
    `;

    console.log('====================================================');
    console.log('🌱 [SPROUT EMAIL SIGNAL DISPATCHED] 🌱');
    console.log(`To: ${recipientEmail}`);
    console.log(`From: ${visitorName} <${visitorEmail}>`);
    console.log(`Type: ${type}`);
    if (analyzedIssue) console.log(`Analyzed Issue: ${analyzedIssue}`);
    console.log('====================================================');

    let emailDelivered = false;
    let smtpErrorDetails = null;

    if (mailUser && mailPass) {
      try {
        let transporter;
        if (smtpHost) {
          transporter = nodemailer.createTransport({
            host: smtpHost,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: { user: mailUser, pass: mailPass }
          });
        } else {
          transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: mailUser, pass: mailPass }
          });
        }

        // 1. Send Email to Superhero
        await transporter.sendMail({
          from: `"Sprout Growth Guardian" <${mailUser}>`,
          to: recipientEmail,
          subject: emailSubject,
          html: emailHtml
        });

        // 2. Send Confirmation & Hope Email to Visitor if email provided
        if (visitorEmail && visitorEmail.includes('@')) {
          const visitorHtml = `
            <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0A1810; color: #FAF6EE; padding: 2rem; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1.5px solid #FFDC69;">
              <div style="text-align: center; border-bottom: 2px solid #FFDC69; padding-bottom: 1rem; margin-bottom: 1.5rem;">
                <h1 style="color: #FFDC69; margin: 0; font-size: 1.8rem; letter-spacing: 0.08em;">🌱 SPROUT — THE GROWTH GUARDIAN</h1>
                <p style="color: #2ECC71; font-weight: bold; font-size: 1.1rem; margin-top: 0.5rem;">✨ Superhero Signal Received! Light is on the Way!</p>
              </div>
              
              <div style="background: rgba(15, 35, 23, 0.9); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(230, 200, 117, 0.35); font-size: 1.05rem; line-height: 1.6;">
                <p style="font-size: 1.2rem; color: #FFDC69; font-weight: bold; margin-top: 0;">Hello ${visitorName || 'Friend'},</p>
                <p>Your signal has reached the canopy of Asterra! Sprout, the Growth Guardian, has received your emergency message and is holding your light close.</p>
                
                <div style="background: rgba(46, 90, 63, 0.6); padding: 1.1rem 1.4rem; border-left: 4px solid #2ECC71; border-radius: 8px; margin: 1.2rem 0; font-weight: 600; color: #FFFFFF;">
                  🚀 <strong>Hero Dispatch Notice:</strong> Sprout Superhero will be coming to <strong>${visitorLocation || 'your location'}</strong>! You do not have to fight the whole world right now.
                </div>
                
                <p>Take a deep breath. Stand tall like the oldest roots. Help and hope are growing towards you right now.</p>
              </div>
              
              <div style="text-align: center; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.15); font-size: 0.85rem; color: #CBD8CE;">
                <p style="margin: 0; color: #FFDC69; font-weight: bold;">"Every small leaf grows towards the light."</p>
                <p style="margin-top: 0.3rem;">With warmth & protection,<br/><strong>Sprout — The Growth Guardian 🌱</strong></p>
              </div>
            </div>
          `;

          await transporter.sendMail({
            from: `"Sprout Growth Guardian" <${mailUser}>`,
            to: visitorEmail,
            subject: `🌟 Sprout Superhero Signal Received! Help is on the way to ${visitorLocation || 'your side'}`,
            html: visitorHtml
          });
          console.log(`🌱 [VISITOR CONFIRMATION EMAIL SENT TO: ${visitorEmail}]`);
        }

        emailDelivered = true;
      } catch (smtpError) {
        console.warn('⚠️ [SMTP AUTH DISPATCH NOTICE]: Gmail credentials require a 16-character App Password:', smtpError.message);
        smtpErrorDetails = smtpError.message;
      }
    }

    return NextResponse.json({
      success: true,
      emailSent: emailDelivered,
      message: emailDelivered 
        ? 'Signal and story report successfully delivered to Sprout!' 
        : 'Emergency Superhero Signal transmitted to portal! (SMTP Gmail App Password pending)',
      note: smtpErrorDetails,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error sending superhero email signal:', error);
    return NextResponse.json({
      success: true,
      emailSent: false,
      message: 'Emergency Superhero Signal received in portal state.',
      timestamp: new Date().toISOString()
    });
  }
}
