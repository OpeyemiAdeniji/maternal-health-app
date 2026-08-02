import logging
import os
import sys

from django.apps import AppConfig
from django.db import Error as DjangoDBError

logger = logging.getLogger(__name__)


class SchedulerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'scheduler'

    def ready(self):
        # sys.argv is only a manage.py command line for local dev entry points
        # (runserver, migrate, shell, ...). Under gunicorn/asgi in production,
        # argv[0] is the server executable, not manage.py, so there's no
        # subcommand to gate on — always start there.
        if sys.argv and os.path.basename(sys.argv[0]) == 'manage.py':
            # only start under `runserver`, and only in the reloaded worker process —
            # skip for makemigrations/migrate/check/shell/etc, and skip the reloader's
            # parent watcher process so the scheduler doesn't start twice
            if 'runserver' not in sys.argv or os.environ.get('RUN_MAIN') != 'true':
                return

        from .jobs import (
            send_daily_affirmations,
            send_daily_routines,
            send_love_bombing_check,
            send_weekly_summary_emails,
        )
        from .scheduler import scheduler

        scheduler.add_job(
            send_daily_affirmations, trigger='cron', hour=8, minute=0,
            id='send_daily_affirmations', replace_existing=True,
        )
        scheduler.add_job(
            send_daily_routines, trigger='cron', hour=8, minute=0,
            id='send_daily_routines', replace_existing=True,
        )
        scheduler.add_job(
            send_love_bombing_check, trigger='cron', hour=9, minute=0,
            id='send_love_bombing_check', replace_existing=True,
        )
        scheduler.add_job(
            send_weekly_summary_emails, trigger='cron', day_of_week='mon', hour=9, minute=0,
            id='send_weekly_summary_emails', replace_existing=True,
        )

        try:
            scheduler.start()
        except DjangoDBError:
            logger.warning('Scheduler could not start: database unavailable', exc_info=True)
