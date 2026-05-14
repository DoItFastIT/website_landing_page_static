/**
 * Do It Fast IT — Cloudflare Pages Function
 * Route: POST /api/contact
 * Handles contact form submissions with Turnstile verification + Email Binding
 */

export async function onRequestPost({ request, env }) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': 'https://doitfastit.com',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };

    try {
        // Parse JSON body
        let data;
        try {
            data = await request.json();
        } catch {
            return Response.json({ message: 'Invalid request body.' }, { status: 400, headers: corsHeaders });
        }

        const { name, email, phone, subject, message } = data;
        const turnstileToken = data['cf-turnstile-response'];

        // ── 1. Field Validation ─────────────────────────────
        if (!name || !email || !subject || !message) {
            return Response.json({ message: 'All required fields must be filled.' }, { status: 400, headers: corsHeaders });
        }

        if (name.trim().length < 2 || name.length > 100) {
            return Response.json({ message: 'Please enter a valid full name.' }, { status: 400, headers: corsHeaders });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) || email.length > 254) {
            return Response.json({ message: 'Please enter a valid email address.' }, { status: 400, headers: corsHeaders });
        }

        if (message.trim().length < 10 || message.length > 5000) {
            return Response.json({ message: 'Message must be between 10 and 5000 characters.' }, { status: 400, headers: corsHeaders });
        }

        // ── 2. Turnstile Verification ────────────────────────
        if (!turnstileToken) {
            return Response.json({ message: 'Anti-spam verification required.' }, { status: 400, headers: corsHeaders });
        }

        if (env.TURNSTILE_SECRET) {
            const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    secret: env.TURNSTILE_SECRET,
                    response: turnstileToken,
                    remoteip: request.headers.get('CF-Connecting-IP') || '',
                }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
                return Response.json({ message: 'Anti-spam check failed. Please try again.' }, { status: 400, headers: corsHeaders });
            }
        }

        // ── 3. Sanitize Inputs ───────────────────────────────
        const safe = (str) => String(str || '').replace(/[<>]/g, '').trim();
        const safeName    = safe(name).substring(0, 100);
        const safeEmail   = safe(email).substring(0, 254);
        const safePhone   = safe(phone).substring(0, 30);
        const safeSubject = safe(subject).substring(0, 100);
        const safeMessage = safe(message).substring(0, 5000);

        const subjectMap = {
            'custom-quote':  'Custom Pricing Quote',
            'support':       'Technical Support',
            'partnership':   'Partnership Inquiry',
            'other':         'General Inquiry',
        };
        const subjectLabel = subjectMap[safeSubject] || safeSubject;

        // ── 4. Build Email Body ──────────────────────────────
        const emailText = `
New Contact Form Submission — Do It Fast IT
============================================
Name    : ${safeName}
Email   : ${safeEmail}
Phone   : ${safePhone || 'Not provided'}
Subject : ${subjectLabel}

Message:
${safeMessage}

============================================
Submitted : ${new Date().toUTCString()}
IP Address: ${request.headers.get('CF-Connecting-IP') || 'Unknown'}
Country   : ${request.headers.get('CF-IPCountry') || 'Unknown'}
        `.trim();

        // ── 5. Send Email via Brevo API ──────────────────────────────
        if (env.BREVO_API_KEY) {
            const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': env.BREVO_API_KEY,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    sender: { name: 'Do It Fast IT Form', email: 'contact-form@doitfastit.com' },
                    to: [{ email: 'support@doitfastit.com', name: 'Do It Fast IT Support' }],
                    replyTo: { email: safeEmail, name: safeName },
                    subject: `[Contact Form] ${subjectLabel} — ${safeName}`,
                    textContent: emailText,
                })
            });

            if (!brevoRes.ok) {
                const errorData = await brevoRes.json();
                console.error('[contact] Brevo API error:', errorData);
                throw new Error('Failed to send email via Brevo');
            }
        } else {
            console.warn('[contact] BREVO_API_KEY not configured. Form data logged.');
            console.log(emailText);
        }

        return Response.json(
            { message: 'Your message has been sent successfully. We will get back to you within 24 hours.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (err) {
        console.error('[contact] Unexpected error:', err);
        return Response.json(
            { message: 'An unexpected error occurred. Please try again or email us directly.' },
            { status: 500, headers: corsHeaders }
        );
    }
}

// Handle preflight CORS
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': 'https://doitfastit.com',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
