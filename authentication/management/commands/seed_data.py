from django.core.management.base import BaseCommand

from scripts.seed_data import seed


class Command(BaseCommand):
    help = 'Seed the database with synthetic demo users, check-ins, journal entries, and EPDS results.'

    def handle(self, *args, **options):
        seed()
        self.stdout.write(self.style.SUCCESS('Seed data created.'))
