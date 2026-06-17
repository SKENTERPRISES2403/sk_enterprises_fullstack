# S.K. Enterprises Full-Stack Ecommerce

React + FastAPI + MongoDB ecommerce/catalog system for S.K. Enterprises, Prayagraj.

## Features

- Customer storefront with real shop photos
- Categories: CP Fittings, Sanitaryware, Tiles, Water Tanks, Pipes, Kitchen Sinks, Construction Chemicals
- Product listing, filters, detail page, cart, quantity update and checkout
- Offline payment flow: WhatsApp / Cash / UPI
- Customer login/register and order history
- Admin/staff panel with mobile-first UI
- Product add/edit/delete, stock, price, MRP, warranty, featured flag
- Mobile camera upload via `accept="image/*" capture="environment"`
- Orders dashboard and status updates
- Leads/inquiries management
- Role access: owner/admin full access, staff limited access
- FastAPI REST API, MongoDB collections and JWT authentication

## Default Owner Login

- Phone: `7007062590`
- Password: `Owner@12345`

Change this in production using environment variables.

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

MongoDB must be running at `mongodb://localhost:27017`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

## MongoDB With Docker

```bash
docker compose up -d mongo
```

## Collections

- `users`
- `products`
- `categories`
- `orders`
- `addresses`
- `leads`
- `gallery`
- `settings`

## Phone Numbers

- WhatsApp orders: `9415216320`
- Call button: `7007062590`

