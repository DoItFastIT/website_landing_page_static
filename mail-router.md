# Do It Fast IT — Contact Page & Email System Implementation Guide

## Project Goal

Create a professional Contact Us page for the Do It Fast IT website.

The contact form must:

* Collect user inquiries
* Send submitted form data directly to `support@doitfastit.com`
* Use Cloudflare Pages + Cloudflare Workers
* Use Cloudflare Email Binding / Email Routing
* Be fully responsive and production-ready
* Maintain professional branding and modern UI/UX

---

# Required Form Fields

The contact form should contain the following fields:

* Name
* Email Address
* Phone Number
* Subject
* Details / Message
* Submit Button

All fields must be required and validated properly.

---

# Expected User Flow

1. User opens the Contact page
2. User fills out the form
3. User clicks Submit
4. Frontend sends POST request to Cloudflare Worker API
5. Worker validates and processes the request
6. Worker sends email to:
   `support@doitfastit.com`
7. User receives success confirmation message

---

# Success Message

After successful submission, show the following message:

“Your message has been sent successfully.

We will review your inquiry shortly and one of our representatives will contact you as soon as possible.

Please keep an eye on your email inbox.”

---

# Technical Architecture

## Frontend

* Hosted on Cloudflare Pages
* Source code stored in GitHub repository
* Responsive modern UI
* Mobile-first design

### Recommended Stack

* HTML5
* TailwindCSS
* Vanilla JavaScript

OR

* React / Next.js (optional)

---

## Backend

Use Cloudflare Workers as the backend API.

The Worker should:

* Accept POST requests
* Validate incoming data
* Send email using Cloudflare Email Binding
* Return JSON response

---

# Infrastructure Flow

```text
GitHub Repository
        ↓
Cloudflare Pages Deployment
        ↓
Frontend Contact Form
        ↓
Cloudflare Worker API
        ↓
Cloudflare Email Binding
        ↓
support@doitfastit.com
```

---

# Project Structure

```text
project-root/

├── index.html
├── style.css
├── app.js
├── worker.js
├── wrangler.toml
├── assets/
└── README.md
```

---

# Frontend Requirements

## Design Requirements

The UI should look modern, clean, and professional.

### Recommended Style

* Dark professional theme
* Smooth animations
* Rounded input fields
* Soft shadows / glass effect
* Gradient accents
* Responsive layout
* Fast loading

---

# Contact Form Requirements

## Validation

Validate:

* Empty fields
* Email format
* Phone number format
* Message length

---

## Loading State

While submitting:

* Disable submit button
* Show loading state:
  “Sending…”

---

## Error Handling

Display friendly error messages if submission fails.

Example:

“Something went wrong. Please try again later.”

---

# Backend Requirements

## Worker Responsibilities

The Worker should:

* Handle POST requests only
* Reject invalid requests
* Sanitize form inputs
* Send formatted email
* Return JSON response

---

# Email Requirements

Send email to:

`support@doitfastit.com`

The email should include:

* Name
* Email
* Phone Number
* Subject
* Details

---

# Example Email Format

Subject:
New Contact Form Submission

Body:

Name: John Doe
Email: [john@example.com](mailto:john@example.com)
Phone: +8801XXXXXXXXX
Subject: Website Inquiry

Message:
Hello, I would like to know more about your services.

---

# Cloudflare Configuration

## Cloudflare Pages

* Connect GitHub repository
* Auto-deploy on push
* Production branch: main

---

## Cloudflare Worker

Create Worker API endpoint.

Example route:

`/api/contact`

---

## Wrangler Configuration

Use a proper `wrangler.toml` configuration.

Example:

```toml
name = "doitfastit-contact-worker"

main = "worker.js"

compatibility_date = "2026-05-14"
```

---

# Security Requirements

## Must Implement

### 1. Cloudflare Turnstile

Use Turnstile for anti-spam protection.

### 2. Rate Limiting

Prevent spam flooding and abuse.

### 3. Input Sanitization

Prevent malicious input injection.

### 4. CORS Protection

Allow only required origins.

---

# Performance Requirements

* Optimized for mobile devices
* Lightweight assets
* Fast page loading
* SEO-friendly structure

---

# Optional Features (Recommended)

If possible, implement:

* Auto-reply confirmation email
* Smooth success animation
* Contact information section
* Social media links
* WhatsApp contact button
* Dark/light mode support

---

# Deliverables

Developer should provide:

* Complete source code
* GitHub repository setup
* Cloudflare Pages deployment
* Worker deployment
* README documentation
* Environment configuration instructions
* Production-ready implementation

---

# Final Goal

The final result should be:

* Professional
* Secure
* Fast
* Mobile responsive
* Production-ready
* Fully integrated with Cloudflare ecosystem
* Easy to maintain and scale