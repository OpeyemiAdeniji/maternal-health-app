# k6 load testing — Modacare backend

Load/smoke testing for the Django API, using [k6](https://k6.io) with metrics
shipped to Datadog.

## Layout

- `lib/api.js` — shared helper module. Wraps each endpoint's request + checks
  (`login`, `getCheckins`, `getJournal`, `getLearn`) so `smoke.js` and
  `load.js` stay focused on scenario shape (VUs, stages, thresholds) rather
  than repeating request boilerplate.
- `smoke.js` — **correctness check.** 1 VU, 3 iterations. Logs in as a real
  seeded test account and confirms every GET endpoint still returns 200. Run
  this after a deploy or a backend change to catch a broken endpoint before
  it reaches load testing.
- `load.js` — **performance check.** Ramps to 10 VUs over 10s, holds for 20s,
  ramps down over 10s, repeating the same login + GET flow with a 1s sleep
  between iterations. Fails the run if p(95) latency exceeds 2000ms or the
  request failure rate exceeds 1%. Use this to see how the API holds up
  under expected concurrent traffic.

Both scripts are **read-only** — no POST/PATCH/DELETE beyond the login call
itself — so repeated runs don't create or mutate rows in the seeded
database.

## Prerequisites

- [k6 installed locally](https://grafana.com/docs/k6/latest/set-up/install-k6/)
- A Datadog API key, exported as an environment variable before running
  anything:

  ```bash
  export K6_DATADOG_APIKEY=your-datadog-api-key
  ```

## Running

From the project root:

```bash
# smoke test, against local Django dev server (default http://localhost:8000)
k6 run --out datadog k6/smoke.js

# load test, against local Django dev server
k6 run --out datadog k6/load.js
```

### Against the live Render backend

Override `BASE_URL` with `-e`:

```bash
k6 run --out datadog -e BASE_URL=https://modacare-api.onrender.com k6/smoke.js
k6 run --out datadog -e BASE_URL=https://modacare-api.onrender.com k6/load.js
```

`BASE_URL` defaults to `http://localhost:8000` (set in `lib/api.js`) when
`-e BASE_URL=...` isn't passed.

## Test account

Both scripts log in as `sarah.byrne@example.com` / `ModacareDemo123!`, a
seeded demo account with existing check-ins, journal entries, and EPDS
results (see `scripts/seed_data.py`). Using a real account with real data
means the GET endpoints exercise realistic query paths instead of returning
empty lists.
