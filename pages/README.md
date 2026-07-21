# SellSync Landing Page

Multi-page marketing website for SellSync — a business management platform. Includes a splash screen (`index.html`) that auto-redirects to the main business page.

## Pages

| Page | File | Description |
|------|------|-------------|
| Splash | `index.html` | Logo splash screen, redirects to `business.html` after 4.2s |
| Business | `business.html` | Main landing page with hero, features, dashboard previews |
| Login | `login.html` | User login with validation & password toggle |
| Signup | `signup.html` | User registration |
| Blog | `blog.html` | Blog listing |
| Support | `support.html` | Support/FAQ |
| About / Careers | `about-careers.html` | Company info & job listings |
| Schedule Call | `schedule-call.html` | Book a demo call |
| Payment | `payment.html` | Pricing / payment |
| Privacy Policy | `privacy-policy.html` | Legal |
| Terms of Service | `terms-of-service.html` | Legal |
| Cookie Policy | `cookie-policy.html` | Legal |
| Reset Password | `reset-password.html` | Password reset form |
| Reset Email | `reset-email.html` | Password reset email sent confirmation |

## Project Structure

```
├── index.html              Splash screen (entry point)
├── business.html           Main landing page
├── login.html / signup.html
├── blog.html / support.html / about-careers.html
├── schedule-call.html / payment.html
├── privacy-policy.html / terms-of-service.html / cookie-policy.html
├── reset-password.html / reset-email.html
│
├── *.css                   Page-specific styles
├── *.js                    Page-specific scripts
├── navbar.js               Shared navigation (dropdowns, mobile menu)
├── document.js             Shared document utilities
├── newsletter.js           Newsletter subscription handler
│
├── contact_server.py       Flask API — contact form & schedule-call (SMTP)
├── login.py                Flask login endpoint (demo)
├── business.py             Flask business page serve (demo)
├── check_google_config.py  Google OAuth config validator
├── setup_google_auth.py    Google OAuth setup script
├── setup_google_auth.bat   Windows batch wrapper for OAuth setup
│
├── vercel.json             Vercel deployment config
├── requirements.txt        Python dependencies
├── .env.example            Environment variable template
├── GOOGLE_OAUTH_SETUP.md   Google OAuth setup guide
│
├── icon.png / wallpaper.png / last.png
├── 8080.jpg / AI.jpg / data.jpg / excel.jpg
├── salesinventory.png / multistore.png / multistores.png
├── centraliseddashboard.png / ai insight.png
```

## Local Development

### Frontend (static)

Open any `.html` file directly in a browser, or serve with any static server:

```bash
npx serve .
```

### Backend (Flask API)

The contact & schedule-call form backend:

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Set up .env (copy from .env.example)
#    - SMTP_USER / SMTP_PASSWORD: Gmail App Password
#    - CONTACT_TO: email where submissions go

# 3. Run the server
python contact_server.py
```

Server runs at `http://localhost:5050`.

## Deployment (Vercel)

1. Push the project to a Git repository.
2. Import into [Vercel](https://vercel.com).
3. Add environment variables in Vercel dashboard:
   - `SMTP_USER`
   - `SMTP_PASSWORD`
   - `CONTACT_TO`
   - `GOOGLE_CLIENT_ID`
   - `JWT_SECRET`
4. Deploy — root `/` serves `index.html` (splash), auto-redirects to `business.html`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SMTP_USER` | Gmail address for sending emails |
| `SMTP_PASSWORD` | Gmail App Password (not normal password) |
| `CONTACT_TO` | Recipient email for contact/schedule-call submissions |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `JWT_SECRET` | Secret key for JWT token generation |
