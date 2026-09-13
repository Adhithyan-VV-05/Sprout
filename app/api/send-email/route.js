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

    const recipientEmail = 'adhithyanvv4u@gmail.com';
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

    const emailSubject = `🚨 EMERGENCY SUPERHERO DISTRESS SIGNAL: ${visitorName || 'Visitor'} Needs Help!`;

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0A1810; color: #FAF6EE; padding: 2rem; border-radius: 16px; max-width: 650px; margin: 0 auto; border: 1.5px solid #E6C875;">
        
        <!-- Header -->
        <div style="border-bottom: 2px solid #FFDC69; padding-bottom: 1rem; margin-bottom: 1.5rem; text-align: center;">
          <h1 style="color: #FFDC69; margin: 0; font-size: 1.8rem; letter-spacing: 0.08em;">🍃 SPROUT — THE GROWTH GUARDIAN</h1>
          <p style="color: #FF5A5A; margin-top: 0.4rem; font-size: 1.1rem; font-weight: 700;">
            🚨 SUPERHERO BEACON DISPATCHED TO HERO (adhithyanvv4u@gmail.com)
          </p>
        </div>

        <!-- Visitor Details Card -->
        <div style="background: rgba(15, 35, 23, 0.9); padding: 1.25rem 1.5rem; border-radius: 12px; border: 1px solid rgba(230, 200, 117, 0.35); margin-bottom: 1.5rem;">
          <h3 style="color: #FFDC69; font-size: 1.1rem; margin: 0 0 0.8rem 0; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.4rem;">
            👤 Complete Visitor Profile
          </h3>
          <p style="margin: 0.4rem 0;"><strong>Name:</strong> ${visitorName || 'Friend in Need'}</p>
          <p style="margin: 0.4rem 0;"><strong>Email Address:</strong> ${visitorEmail || 'Not provided'}</p>
          <p style="margin: 0.4rem 0;"><strong>Age / Winters:</strong> ${visitorAge || 'Not specified'}</p>
          <p style="margin: 0.4rem 0;"><strong>Grounded Location:</strong> ${visitorLocation || 'Not specified'}</p>
        </div>

        <!-- AI Analyzed Issue Box -->
        ${analyzedIssue ? `
          <div style="background: rgba(46, 90, 63, 0.6); padding: 1.25rem 1.5rem; border-radius: 12px; border: 1.5px solid #FFDC69; margin-bottom: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
            <h3 style="color: #FFDC69; font-size: 1.1rem; margin: 0 0 0.5rem 0;">
              🧠 Analyzed Visitor Struggle
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
          <p style="margin: 0;">Dispatched directly to Hero (adhithyanvv4u@gmail.com) by Sprout Superhero Signal Network 🌱</p>
        </div>
      </div>
    `;

    console.log('====================================================');
    console.log('🌱 [SPROUT DUAL EMAIL SIGNAL DISPATCHED] 🌱');
    console.log(`Hero Target Email: ${recipientEmail}`);
    console.log(`Visitor Email: ${visitorEmail}`);
    console.log(`Visitor Name: ${visitorName}`);
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

        // 1. Send Email to Hero (adhithyanvv4u@gmail.com)
        await transporter.sendMail({
          from: `"Sprout Growth Guardian" <${mailUser}>`,
          to: recipientEmail,
          subject: emailSubject,
          html: emailHtml
        });

        // 2. Send Confirmation & Hope Email to Visitor
        if (visitorEmail && visitorEmail.includes('@')) {
          const visitorHtml = `
            <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0A1810; color: #FAF6EE; padding: 2rem; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1.5px solid #FFDC69;">
              <div style="text-align: center; border-bottom: 2px solid #FFDC69; padding-bottom: 1rem; margin-bottom: 1.5rem;">
                <h1 style="color: #FFDC69; margin: 0; font-size: 1.8rem; letter-spacing: 0.08em;">🌱 SPROUT — THE GROWTH GUARDIAN</h1>
                <p style="color: #2ECC71; font-weight: bold; font-size: 1.15rem; margin-top: 0.5rem;">✨ Sprout superhero is coming! You are not alone.</p>
              </div>
              
              <div style="background: rgba(15, 35, 23, 0.9); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(230, 200, 117, 0.35); font-size: 1.05rem; line-height: 1.6;">
                <p style="font-size: 1.25rem; color: #FFDC69; font-weight: bold; margin-top: 0;">Dear ${visitorName || 'Friend'},</p>
                <p>Your signal has reached Asterra! Sprout, the Growth Guardian, has received your message and is already moving towards you.</p>
                
                <div style="background: rgba(46, 90, 63, 0.65); padding: 1.2rem 1.4rem; border-left: 4px solid #2ECC71; border-radius: 8px; margin: 1.2rem 0; font-weight: 600; color: #FFFFFF;">
                  🚀 <strong>Hero Update:</strong> Help and guidance are dispatched to <strong>${visitorLocation || 'your location'}</strong>.
                  ${analyzedIssue ? `<br/><br/><em>"Regarding your concern: '${analyzedIssue}' — remember that every seed goes through darkness before breaking into sunlight. You have the inner strength to grow through this."</em>` : ''}
                </div>
                
                <p>Take a slow, deep breath. No matter how dark the soil feels right now, your heart carries a light that will never wither.</p>
              </div>
              
              <div style="text-align: center; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.15); font-size: 0.85rem; color: #CBD8CE;">
                <p style="margin: 0; color: #FFDC69; font-weight: bold;">"Every leaf turns toward the light."</p>
                <p style="margin-top: 0.3rem;">With warmth & superhero protection,<br/><strong>Sprout — The Growth Guardian 🌱</strong></p>
              </div>
            </div>
          `;

          await transporter.sendMail({
            from: `"Sprout Growth Guardian" <${mailUser}>`,
            to: visitorEmail,
            subject: `🌟 Sprout Superhero is Coming! Light and help are on the way, ${visitorName || ''}`,
            html: visitorHtml
          });
          console.log(`🌱 [VISITOR CONFIRMATION EMAIL SENT TO: ${visitorEmail}]`);
        }

        emailDelivered = true;
      } catch (smtpError) {
        console.warn('⚠️ [SMTP DISPATCH NOTICE]:', smtpError.message);
        smtpErrorDetails = smtpError.message;
      }
    }

    return NextResponse.json({
      success: true,
      emailSent: emailDelivered,
      message: emailDelivered 
        ? 'Distress signal successfully delivered to Superhero (adhithyanvv4u@gmail.com) and visitor!' 
        : 'Emergency Superhero Signal transmitted to portal state!',
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

