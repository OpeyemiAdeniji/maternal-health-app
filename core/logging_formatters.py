import json
import logging


class DatadogJSONFormatter(logging.Formatter):
    # ddtrace sets these dotted attributes when DD_LOGS_INJECTION is on, so a log line can be matched to its APM trace, getattr defaults to empty when ddtrace isn't running
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
