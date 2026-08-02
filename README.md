# Modacare

Modacare is a companion app for the whole perinatal journey, from early pregnancy through the newborn months and into life as an established mother. It gives users a private, supportive space to track their mood and sleep, journal freely, talk to a gentle chat companion, complete regular mental health check-ins, and quietly keep the people who support them in the loop, all in one place.

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Academic Project](#academic-project)
- [Credits](#credits)

---

## Overview

Perinatal mental health is under-discussed and under-supported. Modacare aims to change that by giving mothers, at every stage, a simple and compassionate tool to check in with themselves daily, notice patterns in how they're feeling, and stay connected to the people who care about them, without it feeling clinical or like a chore.

The app is built as a Progressive Web App (PWA), so it can be installed to a phone's home screen and used like a native app.

## Live Demo

- **Frontend (Vercel):** https://maternal-health-app-ecru.vercel.app
- **Backend API (Render):** https://modacare-api.onrender.com
- **API Docs (Swagger UI):** https://modacare-api.onrender.com/api/docs/

## Features

- **Daily check-ins** — mood and sleep scoring (1-5) with an optional trigger note, limited to one per day
- **Journaling** — a private space to write freely
- **Chat companion** — an AI-powered chat for support between check-ins, aware of what stage of motherhood the user is in
- **EPDS screening** — the Edinburgh Postnatal Depression Scale, built in for regular self-assessment
- **Insights** — pattern analysis across check-in history using statistical changepoint detection
- **Safety Net** — save trusted contacts (GP, midwife, partner, friend, family) who can be quietly kept in the loop, including SMS alerts for sustained low mood
- **Notifications** — daily affirmations, routine reminders, and push notifications via Firebase Cloud Messaging
- **Secure auth** — email-based registration and login with JWT tokens

## Tech Stack

**Backend**
- [Django 4.2](https://www.djangoproject.com/) + [Django REST Framework 3.14](https://www.django-rest-framework.org/)
- [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/) for authentication
- [drf-spectacular](https://drf-spectacular.readthedocs.io/) for OpenAPI schema and Swagger docs
- [django-cors-headers](https://pypi.org/project/django-cors-headers/) for cross-origin requests
- [APScheduler](https://apscheduler.readthedocs.io/) / django-apscheduler for scheduled jobs (daily affirmations, routines, weekly summaries)
- Gunicorn + WhiteNoise for serving in production (Render)

**Database**
- PostgreSQL hosted on [Supabase](https://supabase.com/)

**Frontend**
- React 19 PWA (Vite + Tailwind CSS + React Router)
- Deployed on Vercel

**Data & Insights**
- pandas, scipy, [ruptures](https://centre-borelli.github.io/ruptures-docs/) for trend and changepoint detection
- statsmodels for statistical analysis
- NLTK / VADER for sentiment analysis on journal entries

**AI & Messaging**
- [Anthropic Claude API](https://www.anthropic.com/) for the chat companion
- Firebase Cloud Messaging for push notifications
- Twilio for SMS (Safety Net contact alerts)
- SendGrid for transactional email

**Observability & Testing**
- Datadog (ddtrace) for logging/APM
- pytest + pytest-django for backend tests
- k6 for load and smoke testing (see `k6/README.md`)

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+ and npm
- A PostgreSQL database (local or Supabase)

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/OpeyemiAdeniji/maternal-health-app.git
   cd maternal-health-app
   ```

2. Create and activate a virtual environment:

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up your environment variables:

   ```bash
   cp .env.example .env
   ```

   Then open `.env` and fill in your values:

   | Variable                       | Description                                        |
   |--------------------------------|-----------------------------------------------------|
   | `SECRET_KEY`                   | Django secret key                                   |
   | `DEBUG`                        | `True` for local dev, `False` in prod                |
   | `DATABASE_HOST`                | Your Supabase or PostgreSQL host                    |
   | `DATABASE_PORT`                | Default: `5432`                                      |
   | `DATABASE_NAME`                | Database name (default: `postgres`)                  |
   | `DATABASE_USER`                | Database user                                        |
   | `DATABASE_PASSWORD`            | Database password                                    |
   | `ALLOWED_HOSTS`                | Comma-separated list of allowed hosts                |
   | `ANTHROPIC_API_KEY`            | API key for the Claude-powered chat companion         |
   | `FIREBASE_CREDENTIALS_PATH`    | Path to a Firebase service account JSON file          |
   | `TWILIO_ACCOUNT_SID`           | Twilio account SID (Safety Net SMS alerts)            |
   | `TWILIO_AUTH_TOKEN`            | Twilio auth token                                    |
   | `TWILIO_PHONE_NUMBER`          | Twilio phone number to send from                      |
   | `TWILIO_MESSAGING_SERVICE_SID` | Twilio messaging service SID                         |
   | `SENDGRID_API_KEY`             | SendGrid API key (transactional email)                |
   | `SENDGRID_FROM_EMAIL`          | From address for outgoing email                       |
   | `FRONTEND_URL`                 | URL of the running frontend, e.g. `http://localhost:5173` |

5. Run migrations:

   ```bash
   python manage.py migrate
   ```

6. (Optional) Create a superuser for the Django admin:

   ```bash
   python manage.py createsuperuser
   ```

7. Start the development server:

   ```bash
   python manage.py runserver
   ```

   The API will be available at `http://localhost:8000`.

### Frontend Setup

1. From the repo root, move into the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables:

   ```bash
   cp .env.example .env
   ```

   Then open `.env` and fill in your values:

   | Variable                        | Description                                  |
   |----------------------------------|-----------------------------------------------|
   | `VITE_API_BASE_URL`               | Base URL of the backend API, e.g. `http://localhost:8000` |
   | `VITE_FIREBASE_API_KEY`           | Firebase web app config (for push notifications) |
   | `VITE_FIREBASE_AUTH_DOMAIN`       | Firebase auth domain                          |
   | `VITE_FIREBASE_PROJECT_ID`        | Firebase project ID                           |
   | `VITE_FIREBASE_STORAGE_BUCKET`    | Firebase storage bucket                       |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID                |
   | `VITE_FIREBASE_APP_ID`            | Firebase app ID                               |
   | `VITE_FIREBASE_MEASUREMENT_ID`    | Firebase measurement ID                       |

4. Start the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## API Documentation

Interactive API docs (Swagger UI) are available once the backend is running:

- Local: `http://localhost:8000/api/docs/`
- Production: https://modacare-api.onrender.com/api/docs/

The raw OpenAPI schema is served at `/api/schema/`.

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your-access-token>
```

Tokens expire after 24 hours; refresh tokens are valid for 7 days.

To access the Django admin panel, visit `http://localhost:8000/admin/` using your superuser credentials.

## Testing

Backend tests use pytest:

```bash
pytest
```

Load and smoke tests use [k6](https://k6.io/) — see `k6/README.md` for details on running them against a live environment.

## Project Structure

```
.
├── authentication/    # User accounts, auth, healthcare contacts, Safety Net, SMS
├── chat/              # Chat companion (Claude-powered)
├── checkins/          # Daily mood/sleep check-ins
├── core/               # Django project settings, URLs, logging
├── epds/               # Edinburgh Postnatal Depression Scale screening
├── insights/           # Pattern analysis over check-in history
├── journal/            # Private journaling
├── messages_app/       # Supportive messages, affirmations, love bombing
├── notifications/      # Push notifications, email, Firebase
├── scheduler/          # Background jobs (APScheduler)
├── support/            # Support routines/resources
├── scripts/            # One-off scripts (e.g. seed_data.py)
├── k6/                 # Load and smoke tests
└── frontend/           # React PWA (Vite + Tailwind)
```

## Academic Project

Built as a final year capstone project for the Higher Diploma in Computing (Software Development) at National College of Ireland, 2026.

## Credits

Built by Opeyemi Adeniji.
