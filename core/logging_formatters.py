import json
import logging


class DatadogJSONFormatter(logging.Formatter):
    # ddtrace (run with DD_LOGS_INJECTION=true) sets these dotted attributes on
    # the record so a log line can be correlated with the APM trace/span that
    # produced it. getattr(..., '') is safe even when ddtrace isn't active
    # (e.g. running `python manage.py runserver` without ddtrace-run locally).
    def format(self, record):
        payload = {
            'timestamp': self.formatTime(record, self.datefmt),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'dd.service': getattr(record, 'dd.service', ''),
            'dd.env': getattr(record, 'dd.env', ''),
            'dd.version': getattr(record, 'dd.version', ''),
            'dd.trace_id': getattr(record, 'dd.trace_id', ''),
            'dd.span_id': getattr(record, 'dd.span_id', ''),
        }
        if record.exc_info:
            payload['exc_info'] = self.formatException(record.exc_info)
        return json.dumps(payload)
