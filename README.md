<img width="701" height="143" alt="image" src="https://github.com/user-attachments/assets/7c7f55c0-f99d-4f3a-8150-75cd3af0ea9c" />


# Rental Marketplace Frontend - B9IS123 PROGRAMMING FOR INFORMATION SYSTEMS


## Project Overview

Rental Marketplace is a full-stack web application that connects property owners with potential tenants. The frontend is a single-page React application that provides a clean, responsive interface for users to browse available rental properties, view detailed listings, save favourites, and contact hosts directly  - without ever leaving the app.

The UI is built around Ireland's rental market conventions  - supporting BER energy ratings (A1–G), EUR pricing per week or month, and locale-formatted dates and currency.

The app integrates with a Node.js/Express backend for authentication, property management, and API handling.
Emphasis is placed on clean state management, reusable components, and performance optimization which is hosted on Vercel


**Live:** https://ipsrepo.github.io/rental_market_place_Frontend

**Backend API Deployed Link:** https://rental-market-place-backend.vercel.app/

**Backend Repo:** https://github.com/ipsrepo/rental_market_place_Backend

---

## Problem Statement

Finding rental accommodation in Ireland is a time-consuming, fragmented experience. Prospective tenants have to visit multiple platforms, manually track favourites, and contact landlords through slow email threads.

This project addresses those pain points by providing:

- A single searchable interface to browse all available properties
- Instant visibility of key details  - BER rating, furnished status, bills included, available-from date
- A one-click enquiry system that emails the property owner directly
- A personal dashboard where tenants can track saved properties and owners can manage their listings

---

## Features

### For All Visitors
- Browse all active property listings in a responsive card grid
- View full property details  - image carousel, description, all attributes
- See property type, rental type, BER energy rating with colour coding
- View the host's name and profile initial

### For Registered Users
- Sign up and log in with email and password
- Save properties to favourites  - persisted via API
- Contact the property host via an in-app enquiry form (sends a real email)
- View and manage saved properties from the profile dashboard

### For Property Owners
- Create new property listings with up to 10 images (uploaded to Cloudinary)
- Edit existing listings  - form pre-fills from existing data
- Delete listings with a confirmation step
- Manage all owned listings from the "My Properties" tab

### Profile Dashboard
- 3-tab layout: Profile info · Saved Properties · My Properties
- Tab badge counts for saved and owned listings
- Account deletion with a "TYPE DELETE" safety confirmation

---

## 🛠 Tech Stack

|                  |                                   |
|------------------|-----------------------------------|
| Framework        | React 19                          |
| State Management | Redux Toolkit + React Redux       |
| Routing          | React Router DOM v7               |
| Styling          | Tailwind CSS v4                   |
| HTTP Client      | Axios                             |
| Build Tool       | Vite 8                            |
| Test Tool        | Vitest                            |
| Deployment       | GitHub Pages (via GitHub Actions) |

---


## 📁 Project Structure

```
src/
├── assets/            # Logo, SVGs
├── components/        # Reusable UI (Button, Input, Modal, PropertyCard, AuthCard)
├── constants/         # App constants, form defaults, API endpoints
├── layouts/           # MainLayout, Header, ProfileMenu
├── pages/             # Route-level page components
├── services/          # Axios API service modules
├── utils/             # localStorage, date, currency helpers
└── __tests__/         # unit and integration tests
```

---

## Implementation Steps

### Step 1 — Project Scaffolding
- Initialised project with `npm create vite@latest` using the React template
- Configured Tailwind CSS v4 with PostCSS
- Added `vite-plugin-svgr` to import SVG files as React components
- Set up ESLint with `react-hooks` and `react-refresh` plugins
- Configured `basename` in React Router for GitHub Pages subdirectory deployment

### Step 2 — Routing Setup
- Defined all routes in `src/app/router/index.jsx` using `createBrowserRouter`
- Used a nested route structure with `MainLayout` as the parent (provides Header + Outlet)
- Separated auth pages (Login, CreateAccount) as standalone routes outside the main layout

### Step 3 — Axios Instance & Services
- Created a shared Axios instance in `services/API/axiosInstance.js`
- Added a request interceptor to inject the JWT Bearer token from localStorage automatically
- Added a response interceptor to unwrap `response.data` so all service functions return clean data
- Built service modules for each resource: `property`, `favorite`, `user`, `mail`

### Step 4 — Auth Flow
- Built Login and CreateAccount pages using the shared `AuthCard` component
- On success, stored JWT token and user object to localStorage using `TOKEN` and `USER` keys
- Header reads the token to conditionally render Sign In links vs. the ProfileMenu dropdown
- All protected actions (add property, favourite, contact host) check for token and redirect to `/login` if absent

### Step 5 — Property Listing (Home Page)
- Fetched all properties from `GET /api/v1/property` on mount
- For logged-in users, fetched their favourites and merged `ismyfavorite` flag onto each property
- Rendered results in a 2-column `PropertyCard` grid
- `PropertyCard` displays primary image, price, location, BER badge, beds/baths, and a heart toggle

### Step 6 — Property Detail Page
- Built a two-column layout: image area (left 3/5) and info panel (right 2/5)
- Implemented an image carousel with previous/next buttons, dot counter, and clickable thumbnails
- Fetched owner details separately via `getUser(property.owner)` to display the host card
- Implemented favourite toggle using `addFavorite` / `deleteFavorite` service calls
- "Contact Host" button opens a Modal with an enquiry form pre-filled from the logged-in user's data
- Enquiry form POSTs to `POST /api/v1/mail/:propertyId` and shows a success state on completion

### Step 7 — Add / Edit Property Form
- Built a multi-section form with numbered section headers (Basic Info, Details, Images, etc.)
- Used custom `Toggle` components for boolean fields (furnished, bills included, available, etc.)
- Sent form data as `multipart/form-data` to support image file upload
- Used React Router `location.state` to pass existing property data when editing
- Converted string values from FormData back to correct types (booleans, numbers) before submission

### Step 8 — Profile Dashboard
- Built a 3-tab interface using URL search params (`?tab=profile/saved/listings`)
- **Profile tab** — displays name, email, mobile; danger zone with delete account flow
- **Saved Properties tab** — fetches and displays user's favourited listings
- **My Properties tab** — fetches owner's listings; Edit navigates to AddProperty with pre-filled state; Delete triggers a confirmation Modal

### Step 9 — Constants & Utilities
- Centralised all enums, options, and form defaults in `app.constant.js`
- Built `formatEURO` using `Intl.NumberFormat` for consistent Irish currency display
- Built `formatDate` and `formatJoinDate` using `Intl.DateTimeFormat` for locale-correct dates
- Wrapped localStorage with helper functions (get/set/delete) for safe JSON parsing

### Step 10 — CI/CD Deployment
- Wrote a GitHub Actions workflow (`.github/workflows/deploy.yml`)
- On every push to `main`: install dependencies, build with `VITE_API_BASE_URL` from GitHub Secrets, upload `./dist` to GitHub Pages
- Configured `homepage` in `package.json` and router `basename` to match the GitHub Pages subdirectory path

---

## Installation and Setup

### 1. Clone & Install

```
# Clone the repository
git clone https://github.com/your-username/rental_market_place_Frontend.git

# Navigate to project directory
cd rental_market_place_Frontend

# Install dependencies
npm install

```

### 2. Configure Environment

Create a `.env` file in the root:

```env
# VITE_API_BASE_URL=https://rental-market-place-backend.vercel.app/
```

### 3. Run

```

npm run dev                 # Start dev server
npm run build               # Production build
npm run test                # Run the test
npm run test:coverage       # Run test with code coverage
npm run preview             # Preview built app
npm run deploy              # Deploy to GitHub Pages

```

---

## Pages

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home — property grid | ❌ |
| `/property/:id` | Property detail + contact host | ❌ |
| `/add-property` | Create new listing | ✅ |
| `/login` | Login | ❌ |
| `/signup` | Create account | ❌ |
| `*` | 404 Not Found | — |

---

## Components

**`PropertyCard`** — Listing card with image, price, location, type badges, and favourite toggle.

**`Modal`** — Reusable overlay. Used for the contact-host enquiry form on the detail page.

**`AuthCard`** — Shared card wrapper for Login and Sign Up forms.

**`Button`** — Styled primary/secondary button with variant support.

**`Input`** — Labelled input with error state support.

---

## Services

All API calls go through a shared Axios instance configured with `VITE_API_BASE_URL`.

| File | Endpoints Used |
|---|---|
| `property.service.js` | GET / POST / PATCH / DELETE `/api/v1/property` |
| `favorite.service.js` | GET / POST / DELETE `/api/v1/favorites` |
| `user.service.js` | GET / PATCH `/api/v1/users` |
| `mail.service.js` | POST `/api/v1/mail/:propertyId` |

---

## Constants (`app.constant.js`)

Centralises all shared values used across the app:

- `PROPERTY_TYPES` — studio, apartment, house
- `RENTAL_TYPES` — entire place, private room, shared room
- `BER_RATINGS` — A1 through G + exempt (Irish energy rating scale)
- `BerColor` — colour map for BER badge rendering
- `INITIAL_FORM` — default values for the Add Property form
- `TOKEN`, `USER` — localStorage key names

---

## Auth Flow

- JWT token and user object are stored in `localStorage` on login/signup.
- Header checks for the token to render Sign In links vs. the Profile menu.
- Protected actions (add property, contact host, favourite) redirect to `/login` if no token is present.

---


## Screen

### **Home — Property Listings**

<img width="1590" height="1125" alt="Screenshot 2026-04-12 215806" src="https://github.com/user-attachments/assets/081bfd4f-df47-4dab-950d-8db1e610d81d" />


### **Property Detail Page**

<img width="1613" height="1141" alt="Screenshot 2026-04-12 220019" src="https://github.com/user-attachments/assets/29e85f85-6d7d-4b81-8c24-3e1d16961843" />


### **Message to the Host**

<img width="1591" height="1129" alt="Screenshot 2026-04-12 220037" src="https://github.com/user-attachments/assets/aee150f7-a1eb-4824-b775-fe24c9c78e31" />


### **Add / Edit Property**

<img width="1596" height="1134" alt="Screenshot 2026-04-12 215857" src="https://github.com/user-attachments/assets/53b3817b-7806-471f-803d-3f7763bd72d4" />


### **Login / Sign Up**

<img width="1612" height="1153" alt="Screenshot 2026-04-12 215738" src="https://github.com/user-attachments/assets/82c7b37f-de0a-4908-b7aa-7b27228dfa8f" />
<img width="1604" height="1139" alt="Screenshot 2026-04-12 215745" src="https://github.com/user-attachments/assets/80f3e4ef-e0b1-46fe-a5d0-d60c0618b086" />


### **Profile**

<img width="1591" height="1148" alt="Screenshot 2026-04-12 215822" src="https://github.com/user-attachments/assets/e1bc3aaf-1de5-4c06-8e1f-58cd022e5ef8" />
<img width="1595" height="1128" alt="Screenshot 2026-04-12 215829" src="https://github.com/user-attachments/assets/0555c54d-bcd9-44ac-a11e-1fa33a909c25" />
<img width="1592" height="1136" alt="Screenshot 2026-04-12 215837" src="https://github.com/user-attachments/assets/d41424fd-9715-4191-bc03-da252d6a0afb" />

### **Test Coverage**

<img width="716" height="362" alt="Screenshot 2026-04-12 235047" src="https://github.com/user-attachments/assets/4ac1d6e7-fde7-4641-815c-11e36e734233" />


---

## CI/CD — GitHub Actions

Push to `main` triggers `.github/workflows/deploy.yml`:

1. Checkout on Node 24
2. `npm install --legacy-peer-deps`
3. `npm run build` — injects `VITE_API_BASE_URL` from GitHub Secrets
4. Uploads `./dist` and deploys to GitHub Pages

> **Setup:** Add `VITE_API_BASE_URL` under **Repo → Settings → Secrets and variables → Actions**.

---
## AI Usage
 
- **Tailwind CSS Styling** — Used Claude to generate Tailwind utility classes for component layouts, badges, and responsive design.
- **Debugging** — Used Claude to diagnose and resolve configuration conflicts and unexpected rendering issues during development.
- **Code Refinement** — Used Claude to review component logic and improve form state handling and conditional rendering patterns.
 
---

## References

### Core
- **React Docs** - https://react.dev/  
- **Redux Toolkit** - https://redux-toolkit.js.org/  
- **React Router v7** - https://reactrouter.com/  
- **Tailwind CSS v4** - https://tailwindcss.com/  
- **Vite** - https://vite.dev/  
- **Vitest** - https://vitest.dev/guide/  
- **Jest** - https://jestjs.io/  
- **GitHub Pages Action** - https://github.com/actions/deploy-pages  

### Video
- Udemy Courses - https://www.udemy.com/course/the-complete-javascript-course/
- Udemy Courses - https://www.udemy.com/course/react-the-complete-guide-incl-redux/
- Youtube - https://www.youtube.com/@akshaymarch7,
          - https://www.youtube.com/@LeelaWebDev
          - other youtube videos

### Others
- Stackoverflow - https://stackoverflow.com/  
- Reddit - https://www.reddit.com/r/reactjs/  
- dev.to - https://dev.to/  
- Claude - https://claude.ai/

### Prompts: 
- https://claude.ai/share/f83204c2-c7f1-4fb2-8d47-a8486d832cb6
- https://claude.ai/share/22422dcb-5433-475b-9f9c-387f9f998310
- https://claude.ai/share/0c680012-2203-49ab-ac02-a67ec2265ca6
