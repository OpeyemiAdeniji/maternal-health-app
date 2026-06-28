# Modacare

A maternal mental health companion web app built for pregnant and postpartum women. Modacare gives users a private, supportive space to track their mood, log journal entries, complete mental health screenings, and receive personalised insights over time — all in one place.

---

## Table of Contents

- [Description](#description)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)

---

## Description

Perinatal mental health is under-discussed and under-supported. Modacare aims to change that by giving women a simple, compassionate tool to check in with themselves daily, spot patterns in their emotional wellbeing, and stay connected to the people who support them.

Key features include:

- **Daily check-ins** — mood and sleep scoring (1–5) with an optional trigger note, limited to one per day
- **Journaling** — a private space to write freely
- **EPDS screening** — the Edinburgh Postnatal Depression Scale built in for self-assessment
- **Insights** — pattern analysis across check-in history using statistical changepoint detection
- **Healthcare contacts** — save a trusted GP, midwife, or support person for quick access
- **Secure auth** — email-based registration and login with JWT tokens

---

## Tech Stack

**Backend**
- [Django 4.2](https://www.djangoproject.com/) + [Django REST Framework 3.14](https://www.django-rest-framework.org/)
- [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/) for authentication
- [django-cors-headers](https://pypi.org/project/django-cors-headers/) for cross-origin requests

**Database**
- PostgreSQL hosted on [Supabase](https://supabase.com/)

**Frontend**
- React PWA (Vite + Tailwind CSS)

**Data & NLP**
- pandas, scipy, [ruptures](https://centre-borelli.github.io/ruptures-docs/) — trend and changepoint detection
- statsmodels — statistical analysis
- NLTK / VADER — sentiment analysis on journal entries

**AI**
- LLM API for personalised supportive messages

**Testing**
- pytest + pytest-django

---

## Installation

### Prerequisites

- Python 3.9+
- A PostgreSQL database (local or Supabase)

### Backend setup

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

   | Variable            | Description                           |
   |---------------------|---------------------------------------|
   | `SECRET_KEY`        | Django secret key                     |
   | `DEBUG`             | `True` for local dev, `False` in prod |
   | `DATABASE_HOST`     | Your Supabase or PostgreSQL host      |
   | `DATABASE_PORT`     | Default: `5432`                       |
   | `DATABASE_NAME`     | Database name (default: `postgres`)   |
   | `DATABASE_USER`     | Database user                         |
   | `DATABASE_PASSWORD` | Database password                     |
   | `ALLOWED_HOSTS`     | Comma-separated list of allowed hosts |

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

### Frontend setup

The React PWA frontend is currently in development and will be added in a future sprint.

---

## Usage

Once the backend server is running:

- **Register / log in** via `POST /api/auth/register/` and `POST /api/auth/login/`
- **Submit a daily check-in** via `POST /api/checkins/`
- **View past check-ins** via `GET /api/checkins/`

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your-access-token>
```

Tokens expire after 24 hours; refresh tokens are valid for 7 days.

To access the Django admin panel, visit `http://localhost:8000/admin/` using your superuser credentials.

---

## Credits

Built by Opeyemi Adeniji.
