# Orlando Frontend — Requirements

## Overview
Orlando is an e-commerce frontend built with React, connecting to a Spring Boot backend API. The app must deliver a polished, modern shopping experience with clean UI/UX across all pages.

## Authentication
- **Login**: Users sign in with email + password via `POST /api/v1/auth/login`
  - Backend returns `{ token, role, userId }` (JWT, 24hr expiry)
  - Roles: `ROLE_CUSTOMER`, `ROLE_STAFF`
  - Display validation errors (field-level + general message)
  - Store token/role/userId in localStorage via AuthContext
  - Redirect to Dashboard on success
- **Register**: Users create account via `POST /api/v1/auth/register`
  - Fields: firstName, lastName, email, password
  - Password: min 8 chars, uppercase, lowercase, digit, special char (`@$!%*?&`)
  - Returns 201 on success (empty body)
- **Logout**: Clear localStorage, redirect to login
- **JWT**: Sent as `Authorization: Bearer <token>` on all authenticated requests

## Pages
| Route | Page | Auth Required |
|---|---|---|
| `/` | Dashboard | No |
| `/login` | Login | No |
| `/register` | Register | No |
| `/products` | Product List | No |
| `/products/:id` | Product Detail | No |
| `/cart` | Cart | Yes |
| `/orders` | Orders | Yes |
| `/profile` | Profile | Yes |

## Navigation
- Navbar visible on all pages
- Show Dashboard, Products links always
- Show Cart, Orders, Profile only when authenticated
- Show Login/Register when logged out; Logout when logged in

## Tech Stack
- React 19 + React Router 7
- Tailwind CSS for styling
- shadcn/ui components (built on Radix UI primitives)
- Axios for API calls with JWT interceptor
- Create React App (react-scripts 5.0.1)

## API Base URL
- Configured via `REACT_APP_API_URL` env variable
- Currently: `http://localhost:8080/api/v1`
