# Customer Web Service Frontend

## Description

A React + TypeScript frontend application for user authentication and customer management. The app provides signup and login pages, maintains session state in sessionStorage, and communicates with a backend customer-service via a REST API.

## Getting Started

These instructions will help you set up a development environment for the project.

### Prerequisites

- Node.js >= 18 (recommend latest LTS)
- npm >= 9
- Git

### Installation

1. Clone the repository:

   git clone <repo-url>

2. Change into the project directory:

   cd cm_web_svc

3. Install dependencies:

   npm install

### Environment Variables

The application reads environment variables prefixed with VITE_. Only VITE_* variables are exposed to the browser.

Create a file named `.env` in the project root (do NOT commit secrets).

Example `.env`:

VITE_API_BASE_URL=http://localhost:8000

Notes:
- VITE_API_BASE_URL should point to the backend API base URL (e.g. http://localhost:8000).
- If VITE_API_BASE_URL is not set, the client defaults to the relative path `/api`.

### Running the Application

Start the development server:

npm run dev

Vite will print the local development URL (commonly http://localhost:5173).

### Running Tests

- Run tests in watch mode (default):

  npm run test

- Run tests once (CI / non-watch):

  npm run test:run

- Open Vitest UI:

  npm run test:ui

- Generate coverage report:

  npm run test:coverage

## Available Scripts

- `dev` - Start the Vite development server.
- `build` - Type-check and build a production bundle (tsc -b && vite build).
- `lint` - Run ESLint across the project.
- `preview` - Preview the production build locally.
- `test` - Run Vitest in watch mode.
- `test:run` - Run Vitest once for CI environments.
- `test:ui` - Start the Vitest UI.
- `test:coverage` - Run tests and collect a coverage report.

## Authentication Flow (Overview)

This section describes the typical user journey and how authentication state is managed.

1. Signup
   - User fills the signup form (employee_id, employee_name, password, or email variations depending on backend acceptance).
   - Frontend calls POST /signup on the configured API (VITE_API_BASE_URL + /signup).
   - On success the backend returns a created resource (no automatic login expected unless backend provides a token).

2. Login
   - User provides credentials on the login page.
   - Frontend calls POST /login and expects a LoginResponse containing `access_token` and optionally a `user` object.
   - On success the frontend stores the access token and user in sessionStorage and updates auth context state.

3. Storage and Keys
   - Token is stored under sessionStorage key: `AUTH_TOKEN`.
   - User JSON (if provided) is stored under sessionStorage key: `AUTH_USER`.

4. Protected Routes
   - Routes like `/customer` are protected by a ProtectedRoute component.
   - If `AUTH_TOKEN` is absent, the user is redirected to `/login`.

5. Logout
   - Logout clears `AUTH_TOKEN` and `AUTH_USER` from sessionStorage and resets the auth context state.

## Backend Connectivity Notes

- Ensure the backend server is running and accessible at the URL you set in VITE_API_BASE_URL.
- Confirm CORS on the backend allows requests from your frontend origin during development.
- The client code defaults to `/api` when VITE_API_BASE_URL is not provided; set VITE_API_BASE_URL for explicit configuration.

## Developer Tips

- Use sessionStorage inspector in the browser devtools to view AUTH_TOKEN and AUTH_USER during development.
- Tests rely on Vitest and jsdom. Use `npm run test:run` for CI-style execution.
- Follow the project ESLint rules and run `npm run lint` before committing.

## Contributing

Contributions should follow existing code patterns and run lint/tests before submitting PRs.

## License

Project license as defined by the repository owner.
