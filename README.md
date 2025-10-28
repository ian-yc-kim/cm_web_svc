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

## Customer Management UI

This frontend includes a protected customer management interface for authenticated users. The following describes how to access and use the UI and how it interacts with the backend.

Access and Navigation
- Route: Navigate to `/customer` after logging in.
- Protected: `/customer` is a protected route. Unauthenticated users are redirected to `/login`.
- Navigation: Use the "Customer" link in the top navigation or visit `/customer` directly after authentication.

Customer List Overview
- Display: A paginated table of customers with columns: Id, Name, Contact, Address, Managed By, Actions.
- Pagination: Previous/Next and page-number buttons are available. Page size selector options: 5, 10, 20.
- Total count: The UI shows a total count of customers and current page information.
- Loading and errors: Loading indicator displayed while fetching. Errors are surfaced with a simple message.
- Backend endpoint: GET /api/customers?page=<number>&page_size=<number> returns paginated data.

Adding a New Customer
- Entry point: Click the "Add Customer" button which opens a modal dialog (Add Customer form).
- Fields: Name, Contact, Address, Managed By.
- Validation: All fields required. Reasonable length limits enforced on client side (name/contact up to 100 chars, address up to 300 chars).
- On save: Frontend calls POST /api/customers with customer payload. On success the modal closes and the list refreshes. A brief success message is shown.

Editing a Customer (In-place)
- Flow: Click "Edit" on a row to switch fields inline to editable inputs. Use "Save" to persist or "Cancel" to discard.
- Validation: Same client-side validation rules as for adding.
- On save: Frontend calls PUT /api/customers/:id. On success the row updates and a brief success message is shown.

Deleting a Customer
- Flow: Click "Delete" on a row. The application asks for confirmation (browser confirm dialog).
- On confirm: Frontend calls DELETE /api/customers/:id. On success the row is removed and a brief success message is shown.

API and Environment Notes
- API base: Set VITE_API_BASE_URL to point to the backend (e.g. http://localhost:8000). When unset, the client falls back to relative `/api`.
- Endpoints referenced by the UI:
  - GET /api/customers?page=<n>&page_size=<s>
  - POST /api/customers
  - PUT /api/customers/:id
  - DELETE /api/customers/:id
- CORS: Ensure backend CORS allows requests from the frontend origin during development.

Example Workflow
- Log in -> Navigate to /customer -> Adjust page size or page -> Add/Edit/Delete records as needed.

Acceptance Criteria
- The README contains clear instructions how to access `/customer` and notes it is protected.
- The README documents the customer list columns, pagination behavior, and loading/error states.
- The README explains add, edit (inline), and delete flows and the corresponding backend endpoints.

## Developer Tips

- Use sessionStorage inspector in the browser devtools to view AUTH_TOKEN and AUTH_USER during development.
- Tests rely on Vitest and jsdom. Use `npm run test:run` for CI-style execution.
- Follow the project ESLint rules and run `npm run lint` before committing.

## Contributing

Contributions should follow existing code patterns and run lint/tests before submitting PRs.

## License

Project license as defined by the repository owner.
