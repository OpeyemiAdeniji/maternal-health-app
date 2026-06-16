# Maternal Mental Health Companion

An emotional wellbeing web application for pregnant and postpartum women.

## Tech Stack
- Backend: Django 4.2 + Django REST Framework
- Database: PostgreSQL (Supabase)
- Frontend: React PWA (Vite + Tailwind)
- Pattern analysis: pandas, scipy, ruptures
- NLP: NLTK / VADER

## Setup
1. Clone the repo
2. Create a virtual environment: `python3 -m venv venv`
3. Activate it: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` and fill in your values
6. Run migrations: `python manage.py migrate`
7. Start the server: `python manage.py runserver`
