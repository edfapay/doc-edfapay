# EdfaPay Documentation

## Project Overview

This project is an integration documentation site for the EdfaPayPlugin SDK, built with React, Vite, Tailwind CSS, and TypeScript.

## Features

- **SDK Documentation**: Complete API reference for all EdfaPayPlugin functions
- **Contact Form**: Public contact form with database storage and email notifications

---

## Contact Form Setup

The contact form saves submissions to the database and sends email notifications via Resend.

### Prerequisites

1. **Resend Account**: Create an account at [resend.com](https://resend.com)
2. **Verified Domain**: Verify your sending domain in Resend dashboard
3. **API Key**: Generate an API key from Resend dashboard

### Environment Variables

Add the following secret to your project:

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Your Resend API key for sending emails |

### Database Schema

The `contact_submissions` table stores all form submissions:

```sql
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

### Security (RLS Policies)

- **Public Insert**: Anyone can submit the contact form
- **Authenticated Select**: Only authenticated users can view submissions

---

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Lovable Cloud (Database, Edge Functions)
- **Email**: Resend

## Development

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

Deploy via Lovable by clicking **Share → Publish**.

---

## License

Private project.
