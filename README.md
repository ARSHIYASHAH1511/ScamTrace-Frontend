# ScamTrace frontend

React + Vite. No secrets live here: the browser only talks to the public API Gateway URL.

## Run it

```bash
npm install
npm run dev        # http://127.0.0.1:5173
```

## Where things are

| File | What it does |
| --- | --- |
| `src/config.js` | API URL, message length limit, timeout |
| `src/services/api.js` | The `fetch()` call and error handling |
| `src/services/normalizeResult.js` | **Adapter.** Turns any backend response into the shape the UI needs |
| `src/data/sampleData.js` | Sample message and sample response (documents the expected fields) |
| `src/components/` | One small component per part of the screen |
| `src/styles.css` | All styling. Colors and fonts are the variables at the top |

## When the real backend is ready

Return the fields listed at the top of `normalizeResult.js`. If your Lambda uses different key names,
add them to the `pick([...])` lists there. No component needs to change.

## CORS

The browser sends `Content-Type: application/json`, which triggers a CORS preflight. Enable CORS on the
API Gateway route for `http://127.0.0.1:5173` (and your deployed site) with `POST` and `OPTIONS`,
and allow the `content-type` header. Otherwise the app shows "Couldn't reach ScamTrace".
