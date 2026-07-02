from datetime import timedelta

import numpy as np
import pandas as pd
import ruptures as rpt
from django.utils import timezone
from scipy.stats import pearsonr

from checkins.models import CheckIn

from .models import InsightCache

MIN_CHECKINS = 3
ROLLING_WINDOW = 7
TREND_THRESHOLD = 0.3  # min change in rolling mood average to call it a trend, not noise


def analyse_user_patterns(user):
    since = timezone.localdate() - timedelta(days=30)
    checkins = CheckIn.objects.filter(user=user, date__gte=since).order_by('date')

    if checkins.count() < MIN_CHECKINS:
        cache, _ = InsightCache.objects.update_or_create(
            user=user,
            defaults={
                'trend_direction': 'insufficient_data',
                'correlation_strength': None,
                'insight_cards': [],
            },
        )
        return cache

    df = pd.DataFrame(list(checkins.values('date', 'mood_score', 'sleep_score')))
    df['mood_rolling'] = df['mood_score'].rolling(window=ROLLING_WINDOW, min_periods=1).mean()

    trend_direction = _determine_trend(df['mood_rolling'])
    change_points = _detect_change_points(df['mood_score'].to_numpy())
    correlation_strength = _compute_correlation(df['sleep_score'], df['mood_score'])
    insight_cards = _build_insight_cards(df, trend_direction, correlation_strength, change_points)

    cache, _ = InsightCache.objects.update_or_create(
        user=user,
        defaults={
            'trend_direction': trend_direction,
            'correlation_strength': correlation_strength,
            'insight_cards': insight_cards,
        },
    )
    return cache


def _determine_trend(rolling_avg):
    window = rolling_avg.tail(ROLLING_WINDOW)
    if len(window) < 2:
        return 'stable'
    delta = window.iloc[-1] - window.iloc[0]
    if delta >= TREND_THRESHOLD:
        return 'improving'
    if delta <= -TREND_THRESHOLD:
        return 'declining'
    return 'stable'


def _detect_change_points(mood_signal):
    # PELT needs a handful of points either side of a candidate breakpoint to be meaningful
    if len(mood_signal) < 6:
        return []
    try:
        algo = rpt.Pelt(model='rbf', min_size=3, jump=1).fit(mood_signal)
        breakpoints = algo.predict(pen=2)
    except Exception:
        return []
    # predict() always tacks on the signal length as a final "breakpoint" — drop it
    return [bp for bp in breakpoints if bp < len(mood_signal)]


def _compute_correlation(sleep_scores, mood_scores):
    # pearsonr is undefined (and errors or warns) when either series has zero variance
    if sleep_scores.nunique() < 2 or mood_scores.nunique() < 2:
        return None
    correlation, _ = pearsonr(sleep_scores, mood_scores)
    if np.isnan(correlation):
        return None
    return round(float(correlation), 2)


def _build_insight_cards(df, trend_direction, correlation_strength, change_points):
    cards = []

    if trend_direction == 'improving':
        cards.append('Your mood has been trending upward over the last week.')
    elif trend_direction == 'declining':
        cards.append('Your mood has been trending downward over the last week — it may help to check in with your care team.')
    else:
        cards.append('Your mood has stayed fairly steady over the last week.')

    if correlation_strength is not None:
        if correlation_strength >= 0.5:
            cards.append('Better sleep tends to line up with better mood for you.')
        elif correlation_strength <= -0.5:
            cards.append('Poor sleep tends to line up with lower mood for you.')

    if change_points:
        shift_date = df.iloc[change_points[-1] - 1]['date']
        cards.append(f'We noticed a shift in your mood pattern around {shift_date:%b %d}.')

    return cards[:3]
