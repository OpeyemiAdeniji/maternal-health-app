import { sleep } from 'k6';
import { login, getCheckins, getJournal, getLearn } from './lib/api.js';

// Load test: performance under expected traffic. Ramps to 10 concurrent
// users, holds, then ramps down, exercising the same read-only login + GET
// flow as the smoke test but under sustained concurrency.
export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '20s', target: 10 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};

const TEST_EMAIL = 'sarah.byrne@example.com';
const TEST_PASSWORD = 'ModacareDemo123!';

export default function () {
  const token = login(TEST_EMAIL, TEST_PASSWORD);

  getCheckins(token);
  getJournal(token);
  getLearn(token);

  sleep(1);
}
