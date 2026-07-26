import { login, getCheckins, getJournal, getLearn } from './lib/api.js';

// Smoke test: read-only correctness check. Confirms the seeded test account
// can log in and every GET endpoint responds 200 — not a performance test.
export const options = {
  vus: 1,
  iterations: 3,
};

const TEST_EMAIL = 'sarah.byrne@example.com';
const TEST_PASSWORD = 'ModacareDemo123!';

export default function () {
  const token = login(TEST_EMAIL, TEST_PASSWORD);

  getCheckins(token);
  getJournal(token);
  getLearn(token);
}
