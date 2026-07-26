import http from 'k6/http';
import { check } from 'k6';

export const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';

export function login(email, password) {
  const res = http.post(
    `${BASE_URL}/api/auth/login/`,
    JSON.stringify({ email, password }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(res, {
    'login status is 200': (r) => r.status === 200,
  });

  return res.json('access');
}

export function getCheckins(token) {
  const res = http.get(`${BASE_URL}/api/checkins/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  check(res, {
    'checkins status is 200': (r) => r.status === 200,
  });

  return res;
}

export function getJournal(token) {
  const res = http.get(`${BASE_URL}/api/journal/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  check(res, {
    'journal status is 200': (r) => r.status === 200,
  });

  return res;
}

export function getLearn(token) {
  const res = http.get(`${BASE_URL}/api/learn/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  check(res, {
    'learn status is 200': (r) => r.status === 200,
  });

  return res;
}
