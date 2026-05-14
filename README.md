# Do It Fast IT — Website & Contact System

This project is a modernized, premium SaaS website for **Do It Fast IT**, featuring a unified social media management command center.

## Project Structure

- `index.html`: Main landing page with a modern hero and feature overview.
- `about.html`: Company mission, history, and team details.
- `contact.html`: Advanced contact form with validation and Turnstile integration.
- `faq.html`: Support and general questions.
- `assets/`: 
    - `css/main.css`: Core design system, dark/light mode support, and premium styling.
    - `js/main.js`: UI logic, mobile menu, and AJAX form handling.
- `worker.js`: Cloudflare Worker for backend email routing.
- `wrangler.toml`: Cloudflare Worker configuration.
- `privacy-policy.html`, `terms-of-service.html`, etc.: Modernized legal and compliance pages.

## Deployment Instructions

### 1. Frontend (Cloudflare Pages)
1. Push this project to a GitHub repository.
2. Go to the **Cloudflare Dashboard** -> **Workers & Pages** -> **Create application**.
3. Connect your GitHub account and select the repository.
4. Set the build command to empty (static site) and deploy.

### 2. Backend (Cloudflare Worker)
The contact form uses a Cloudflare Worker to send emails.
1. Install Wrangler CLI: `npm install -g wrangler`
2. Authenticate: `wrangler login`
3. Deploy the worker: `wrangler deploy`
4. **Configure Email Binding**:
   - Go to your Worker settings in the Cloudflare Dashboard.
   - Go to **Settings** -> **Bindings**.
   - Add a **Send Email** binding named `SEB`.
   - Set the destination address to `support@doitfastit.com`.

### 3. Anti-Spam (Cloudflare Turnstile)
1. Go to **Cloudflare Dashboard** -> **Turnstile**.
2. Create a new widget for your domain.
3. Copy the **Site Key** and replace the `data-sitekey` in `contact.html` (line 166).
4. (Optional) Add the **Secret Key** to your Worker's environment variables if you want to verify the token server-side.

## Features
- **Modern Premium Design**: Glassmorphism, smooth animations, and high-quality typography.
- **Dark/Light Mode**: Respects system settings and provides a toggle-ready architecture.
- **Enterprise Ready**: Complete legal documentation and platform verification info.
- **Optimized Performance**: Lightweight assets and fast-loading structure.

---
Built with ❤️ by MAS Hunter Team
