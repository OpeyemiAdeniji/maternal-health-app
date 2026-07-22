import os

import firebase_admin
from firebase_admin import credentials


def initialize_firebase():
    # reuse the existing app if one is already initialised
    try:
        return firebase_admin.get_app()
    except ValueError:
        cred_path = os.getenv('FIREBASE_CREDENTIALS_PATH')
        cred = credentials.Certificate(cred_path)
        return firebase_admin.initialize_app(cred)
