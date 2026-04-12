# Rental Marketplace - Frontend
<img width="701" height="143" alt="image" src="https://github.com/user-attachments/assets/7c7f55c0-f99d-4f3a-8150-75cd3af0ea9c" />


A rental property listing platform built with React 19, Redux Toolkit, and Tailwind CSS. Connects to a Node.js/Express backend for property listings, auth, favourites, and enquiries.

🔗 **Live:** https://ipsrepo.github.io/rental_market_place_Frontend

🔗 **Backend API Deployed Link:** https://rental-market-place-backend.vercel.app/

🔗 **Backend Repo:** https://github.com/ipsrepo/rental_market_place_Backend

---

## 🛠 Tech Stack

| | |
|---|---|
| Framework | React 19 |
| State Management | Redux Toolkit + React Redux |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios |
| Build Tool | Vite 8 |
| Deployment | GitHub Pages (via GitHub Actions) |

---



## ⚡ Getting Started

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

npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview built app
npm run deploy     # Deploy to GitHub Pages

```

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
└── utils/             # localStorage, date, currency helpers
```

---

## 🛣 Pages

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home — property grid | ❌ |
| `/property/:id` | Property detail + contact host | ❌ |
| `/add-property` | Create new listing | ✅ |
| `/login` | Login | ❌ |
| `/signup` | Create account | ❌ |
| `*` | 404 Not Found | — |

---

## 🧩 Components

**`PropertyCard`** — Listing card with image, price, location, type badges, and favourite toggle.

**`Modal`** — Reusable overlay. Used for the contact-host enquiry form on the detail page.

**`AuthCard`** — Shared card wrapper for Login and Sign Up forms.

**`Button`** — Styled primary/secondary button with variant support.

**`Input`** — Labelled input with error state support.

---

## 🔌 Services

All API calls go through a shared Axios instance configured with `VITE_API_BASE_URL`.

| File | Endpoints Used |
|---|---|
| `property.service.js` | GET / POST / PATCH / DELETE `/api/v1/property` |
| `favorite.service.js` | GET / POST / DELETE `/api/v1/favorites` |
| `user.service.js` | GET / PATCH `/api/v1/users` |
| `mail.service.js` | POST `/api/v1/mail/:propertyId` |

---

## 🗂 Constants (`app.constant.js`)

Centralises all shared values used across the app:

- `PROPERTY_TYPES` — studio, apartment, house
- `RENTAL_TYPES` — entire place, private room, shared room
- `BER_RATINGS` — A1 through G + exempt (Irish energy rating scale)
- `BerColor` — colour map for BER badge rendering
- `INITIAL_FORM` — default values for the Add Property form
- `TOKEN`, `USER` — localStorage key names

---

## 🔐 Auth Flow

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

---

## 🚀 CI/CD — GitHub Actions

Push to `main` triggers `.github/workflows/deploy.yml`:

1. Checkout on Node 24
2. `npm install --legacy-peer-deps`
3. `npm run build` — injects `VITE_API_BASE_URL` from GitHub Secrets
4. Uploads `./dist` and deploys to GitHub Pages

> **Setup:** Add `VITE_API_BASE_URL` under **Repo → Settings → Secrets and variables → Actions**.

---

## 📚 References

### General
- **React Docs** - https://react.dev/  
- **Redux Toolkit** - https://redux-toolkit.js.org/  
- **React Router v7** - https://reactrouter.com/  
- **Tailwind CSS v4** - https://tailwindcss.com/  
- **Vite** - https://vite.dev/  
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
