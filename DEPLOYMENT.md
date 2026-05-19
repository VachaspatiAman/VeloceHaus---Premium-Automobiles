# 🚀 VeloceHaus – Full-Stack Netlify Deployment Guide

> **Stack**: Next.js 14 (frontend) + Express.js (backend, via Netlify Functions) + Supabase

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Local Development Setup](#local-development-setup)
4. [Step 1 – Install Dependencies](#step-1--install-dependencies)
5. [Step 2 – Configure Environment Variables](#step-2--configure-environment-variables)
6. [Step 3 – Deploy to Netlify](#step-3--deploy-to-netlify)
7. [Step 4 – Connect GitHub with Netlify](#step-4--connect-github-with-netlify)
8. [Step 5 – Add Env Variables in Netlify Dashboard](#step-5--add-env-variables-in-netlify-dashboard)
9. [Step 6 – Test Netlify Functions Locally](#step-6--test-netlify-functions-locally)
10. [API Route Reference](#api-route-reference)
11. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
Browser
  │
  ├── Next.js pages      ──▶  Netlify CDN  (static + SSR)
  │
  └── /api/* fetch calls ──▶  netlify.toml rewrite
                                  │
                                  └──▶  /.netlify/functions/api
                                              │
                                              └──▶  Express app (serverless-http)
                                                        │
                                                        └──▶  Supabase (PostgreSQL)
```

**Key points:**
- The Express backend is wrapped with `serverless-http` in `netlify/functions/api.js`
- All existing routes, controllers, and middleware are unchanged
- `netlify.toml` rewrites `/api/*` → `/.netlify/functions/api/*`
- Frontend uses `lib/api.ts` which auto-detects prod vs dev

---

## Project Structure

```
e-commerce/
├── netlify.toml                  ← Netlify build & redirect config
├── package.json                  ← Root scripts (deploy, dev, install:all)
├── .env.example                  ← Template for environment variables
├── .gitignore
│
├── netlify/
│   └── functions/
│       └── api.js                ← Single serverless function wrapping Express
│
├── frontend/                     ← Next.js 14 app
│   ├── lib/
│   │   └── api.ts                ← Centralised API utility
│   ├── app/                      ← App Router pages
│   ├── components/
│   └── next.config.mjs           ← Updated with env vars & rewrites
│
└── backend/                      ← Original Express backend (unchanged)
    ├── server.js                 ← Used for local dev only
    ├── routes/
    ├── controllers/
    ├── middleware/
    ├── config/
    └── utils/
```

---

## Local Development Setup

### Option A – Full Netlify simulation (recommended)

```powershell
# 1. Install everything
npm run install:all

# 2. Create your .env (copy the example)
copy .env.example .env
# Edit .env with your actual values

# 3. Start Netlify dev server (runs frontend + functions together)
npm run dev
# → Frontend: http://localhost:3000
# → Functions: http://localhost:3000/.netlify/functions/api
```

### Option B – Separate servers

```powershell
# Terminal 1 – Backend
cd backend
npm run dev
# → http://localhost:5000

# Terminal 2 – Frontend
cd frontend
npm run dev
# → http://localhost:3000  (proxies /api/* → localhost:5000)
```

---

## Step 1 – Install Dependencies

```powershell
# From the root e-commerce/ directory:

# Install root deps (netlify-cli, serverless-http)
npm install

# Install frontend deps
cd frontend && npm install && cd ..

# Install backend deps (still needed by the Netlify function)
cd backend && npm install && cd ..
```

---

## Step 2 – Configure Environment Variables

```powershell
# Copy the example file
copy .env.example .env

# Edit .env and fill in:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - JWT_SECRET  (use a long random string)
# - CORS_ORIGIN (your Netlify URL, e.g. https://veloce.netlify.app)
# - NEXT_PUBLIC_API_URL=/.netlify/functions/api
# - NEXT_PUBLIC_APP_URL=https://veloce.netlify.app
```

---

## Step 3 – Deploy to Netlify

### First-time deploy

```powershell
# 1. Login to Netlify CLI
npx netlify login

# 2. Link or create a Netlify site
npx netlify init
# Choose: "Create & configure a new site"
# Build command:  cd frontend && npm install && npm run build
# Publish dir:    frontend/.next

# 3. Deploy a preview
npm run deploy:preview

# 4. Deploy to production
npm run deploy
```

### Subsequent deploys

```powershell
npm run deploy          # production deploy
npm run deploy:preview  # preview deploy (get a test URL)
```

---

## Step 4 – Connect GitHub with Netlify

1. **Push your repo to GitHub**
   ```powershell
   git init
   git add .
   git commit -m "feat: initial Netlify deployment setup"
   git remote add origin https://github.com/YOUR_USERNAME/veloce-ecommerce.git
   git push -u origin main
   ```

2. **Link GitHub in Netlify dashboard**
   - Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
   - Choose **GitHub** → Authorize Netlify
   - Select your `veloce-ecommerce` repository

3. **Configure build settings** (Netlify will read `netlify.toml` automatically):
   - Base directory: *(leave empty – netlify.toml handles it)*
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/.next`

4. **Auto-deploy on push** – every `git push` to `main` triggers a production deploy. PRs get preview URLs.

---

## Step 5 – Add Env Variables in Netlify Dashboard

1. Go to your site → **Site configuration** → **Environment variables**
2. Click **Add a variable** for each of the following:

| Variable | Value | Scope |
|---|---|---|
| `SUPABASE_URL` | `https://xxx.supabase.co` | All |
| `SUPABASE_ANON_KEY` | `eyJ...` | All |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | All |
| `JWT_SECRET` | `your-long-secret` | All |
| `CORS_ORIGIN` | `https://your-site.netlify.app` | All |
| `NODE_ENV` | `production` | All |
| `NEXT_PUBLIC_API_URL` | `/.netlify/functions/api` | All |
| `NEXT_PUBLIC_APP_URL` | `https://your-site.netlify.app` | All |
| `NEXT_PUBLIC_APP_NAME` | `VeloceHaus` | All |

> ⚠️ **Important**: Variables prefixed with `NEXT_PUBLIC_` are bundled into the client-side JS bundle. Never put secrets in `NEXT_PUBLIC_` variables.

3. Click **Save** and trigger a new deploy: **Deploys** → **Trigger deploy** → **Deploy site**

---

## Step 6 – Test Netlify Functions Locally

```powershell
# Install netlify-cli globally (if not already done)
npm install -g netlify-cli

# From the repo root, start the Netlify dev server
netlify dev

# This starts:
# - Next.js frontend on port 3000
# - Netlify Functions on port 8888 (proxied through 3000)

# Test the health endpoint
curl http://localhost:8888/.netlify/functions/api/api/health

# Or via the proxy URL:
curl http://localhost:3000/.netlify/functions/api/api/health

# Test auth
curl -X POST http://localhost:3000/.netlify/functions/api/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@veloce.com\",\"password\":\"your_password\"}"

# List vehicles
curl http://localhost:3000/.netlify/functions/api/api/vehicles
```

---

## API Route Reference

All routes are accessible at `/.netlify/functions/api` in production.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET`  | `/api/health` | None | Health check |
| `POST` | `/api/auth/signup` | None | Register user |
| `POST` | `/api/auth/login` | None | Login |
| `GET`  | `/api/vehicles` | None | List vehicles (with filters) |
| `GET`  | `/api/vehicles/:id` | None | Get single vehicle |
| `GET`  | `/api/vehicles/featured` | None | Featured vehicles |
| `GET`  | `/api/cart` | User | Get cart |
| `POST` | `/api/cart/add` | User | Add to cart |
| `PUT`  | `/api/cart/update` | User | Update quantity |
| `DELETE` | `/api/cart/remove/:id` | User | Remove from cart |
| `GET`  | `/api/wishlist` | User | Get wishlist |
| `POST` | `/api/wishlist/add` | User | Add to wishlist |
| `DELETE` | `/api/wishlist/remove/:id` | User | Remove from wishlist |
| `POST` | `/api/orders/create` | User | Place order from cart |
| `GET`  | `/api/orders/myorders` | User | Get my orders |
| `GET`  | `/api/admin/dashboard` | Admin | Dashboard stats |
| `POST` | `/api/admin/vehicles` | Admin | Add vehicle |
| `PUT`  | `/api/admin/vehicles/:id` | Admin | Update vehicle |
| `DELETE` | `/api/admin/vehicles/:id` | Admin | Delete vehicle |
| `GET`  | `/api/admin/orders` | Admin | All orders |
| `PUT`  | `/api/admin/orders/:id/status` | Admin | Update order status |
| `GET`  | `/api/admin/users` | Superadmin | All users |
| `PUT`  | `/api/admin/users/:id/assign-role` | Superadmin | Assign role |
| `POST` | `/api/ai/chat` | None | AI chat |
| `GET`  | `/api/ai/recommendations` | None | Personalized recs |
| `GET`  | `/api/ai/similar/:id` | None | Similar vehicles |

---

## Troubleshooting

### `Cannot find module 'serverless-http'`
```powershell
# Install from root
npm install serverless-http
```

### Functions not found locally
```powershell
# Make sure netlify.toml [functions] directory points correctly
# Run from the repo root (not inside frontend/)
netlify dev
```

### CORS errors in production
- Set `CORS_ORIGIN` in Netlify dashboard to your exact site URL (no trailing slash)
- Example: `https://veloce-abc123.netlify.app`

### Build fails on Netlify
- Check that `NODE_VERSION=18` is set in Netlify environment variables
- Ensure `frontend/.next` is listed as publish directory

### Environment variables not available in browser
- Make sure the variable starts with `NEXT_PUBLIC_`
- Trigger a fresh deploy after adding variables

### JWT errors in production
- Confirm `JWT_SECRET` is set in Netlify dashboard
- The secret must be identical to what was used to sign existing tokens

---

*Generated for VeloceHaus Automobile E-Commerce Platform*
