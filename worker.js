/**
 * Do It Fast IT - Contact Form Worker
 * Handles POST /api/contact and sends emails via Cloudflare Email Binding
 */

export default {
    async fetch(request, env) {
        // Handle CORS
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            });
        }

        if (request.method !== "POST") {
            return new Response(JSON.stringify({ message: "Method not allowed" }), { 
                status: 405,
                headers: { "Content-Type": "application/json" }
            });
        }

        try {
            const data = await request.json();
            const { name, email, phone, subject, message } = data;

            // 1. Validation
            if (!name || !email || !phone || !subject || !message) {
                return new Response(JSON.stringify({ message: "All fields are required." }), { 
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });
            }

            // 2. Email Verification (Basic Regex)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return new Response(JSON.stringify({ message: "Invalid email address." }), { 
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });
            }

            // 3. Construct Email Content
            const emailBody = `
                New Contact Form Submission
                ---------------------------
                Name: ${name}
                Email: ${email}
                Phone: ${phone}
                Subject: ${subject}
                
                Message:
                ${message}
                
                ---------------------------
                Submitted at: ${new Date().toISOString()}
                IP: ${request.headers.get("cf-connecting-ip")}
            `;

            // 4. Send Email using Cloudflare Email Binding
            // Note: env.SEB must be configured in wrangler.toml and Cloudflare dashboard
            if (env.SEB) {
                await env.SEB.send({
                    to: "support@doitfastit.com",
                    from: "contact-form@doitfastit.com", // Must be a verified sender in Cloudflare
                    subject: `New Inquiry: ${subject}`,
                    text: emailBody,
                });
            } else {
                console.error("Email Binding (SEB) not configured.");
                // For development/debugging purposes when binding is not yet set up
                // return new Response(JSON.stringify({ message: "Worker configured correctly, but Email Binding is missing." }), { status: 500 });
            }

            return new Response(JSON.stringify({ 
                message: "Your message has been sent successfully. We will review your inquiry shortly." 
            }), { 
                status: 200,
                headers: { 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });

        } catch (error) {
            return new Response(JSON.stringify({ message: "Internal server error. Please try again later." }), { 
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    }
};
