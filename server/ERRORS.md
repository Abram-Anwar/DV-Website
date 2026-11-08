# Status codes and errors (ELMANHRY)

## The rule

- `4xx`: the problem is in the request (the frontend or Postman).
- `5xx`: the problem is in the server or the database, and the real reason shows in the server terminal.
- On any error, open both together:
  - **Network** tab in the browser (F12) to see the status code and the response.
  - **Server terminal** to see the real cause.

## HTTP status codes in the project

| Code | Meaning | Happens when | What to check |
|---|---|---|---|
| `200` | Success | The test payment returned `{ "paid": true }` | This is the expected result |
| `201` | Created | A new application was saved | This is the expected result |
| `400` | Bad data | zod rejected the body, the images do not match the data, a file is not jpg/png, a file is over 2MB, `data` is not valid JSON, or `applicationId` is not a UUID | Read `errors` in the response (it names the field) |
| `404` | Not found | No application has this `applicationId`, or the route is not registered (`Cannot POST`) | Is the id correct? Is the router registered in `index.js`? Did the server restart? |
| `409` | Conflict | A payment was already recorded for this application | The frontend treats it as "paid" |
| `500` | Server error | The database is down, a column is missing, or a value is not in the ENUM | The real message is in the server terminal (`console.error`) |

## Admin status codes (when we build the admin)

| Code | Meaning | Happens when |
|---|---|---|
| `401` | Not logged in | The admin did not log in, or the cookie expired |
| `403` | Forbidden | Logged in but without permission |
| `429` | Too many requests | `rate-limit` stopped someone who tried too many times (for example guessing a password) |

## Errors with no status code (the request never arrived)

| Message | Cause |
|---|---|
| `getaddrinfo ENOTFOUND server` | Wrong URL (the host name is not `localhost`) |
| `Failed to fetch` or `ECONNREFUSED` | The server is not running, or the port is wrong |
| `CORS error` in the Console | `CLIENT_URL` in the server `.env` is not the same as the Vite URL |

## MySQL errors (shown in the server terminal together with `500`)

| Code | Meaning |
|---|---|
| `ER_DUP_ENTRY` | Duplicate value in a `UNIQUE` column (application number, `transaction_id`) |
| `ER_BAD_FIELD_ERROR` | Wrong column name, or the column was not created yet |
| `ER_NO_SUCH_TABLE` | The table does not exist (wrong database?) |
| `ER_DATA_TOO_LONG` | The text is longer than the `VARCHAR` |
| `ER_TRUNCATED_WRONG_VALUE_FOR_FIELD` or "Data truncated" | A value that is not in the ENUM (for example `male` after the column became `ذكر`) |
| `ER_BAD_NULL_ERROR` | `NULL` sent to a `NOT NULL` column |
| `ER_NO_REFERENCED_ROW_2` | `application_id` does not exist (wrong foreign key) |
| `ER_ACCESS_DENIED_ERROR` | Wrong database user or password in `.env` |
| `ECONNREFUSED` | MySQL is not running |
| `Error 1175` (Workbench) | Safe Update Mode: add a `WHERE` on the key column |