from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore

# single shared scheduler instance, jobs.py uses this to schedule one-off delayed follow-up sends like spacing love bombing messages a few hours apart
scheduler = BackgroundScheduler(timezone='Europe/Dublin')
scheduler.add_jobstore(DjangoJobStore(), 'default')
