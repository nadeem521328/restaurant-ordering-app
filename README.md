# Roast Biryani Ordering

A lightweight direct ordering MVP for one restaurant. It is built for fast mobile ordering, simple admin operations, and Supabase realtime order updates.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- Supabase Auth for the two admin accounts
- Supabase Realtime for live admin orders
- Vercel-ready deployment

## Features

- Guest customer ordering only
- Dynamic menu from database
- Cash on Delivery order creation
- 10 digit phone validation on client and server
- LocalStorage cart
- Restaurant status: `OPEN`, `CLOSED`, `SOLD_OUT`
- Protected admin dashboard
- Realtime incoming orders with sound button
- Manual order status updates

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_RESTAURANT_NAME="Roast Biryani House"
NEXT_PUBLIC_RESTAURANT_PHONE="9876543210"
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` in the browser.

3. Run `database/schema.sql` in the Supabase SQL editor.

4. Create two admin users in Supabase Authentication.

5. Add both admins to `public.admins`:

```sql
insert into public.admins (user_id, name)
values
  ('first-auth-user-id', 'Admin 1'),
  ('second-auth-user-id', 'Admin 2');
```

6. Start development:

```bash
npm run dev
```

Customer app: `http://localhost:3000`

Admin login: `http://localhost:3000/admin/login`

## Important Supabase Notes

- Keep email signup disabled unless you intentionally want to add more admins.
- Only authenticated users listed in `public.admins` can read or update orders.
- Customers never read order history directly from Supabase.
- Customer order creation uses the server API route and service role key.
- Realtime must be enabled for `orders`; the SQL file adds it to the realtime publication.

## Project Structure

```txt
app/                 Next.js routes and API routes
components/          Reusable customer, admin, and UI components
hooks/               Client hooks for cart and realtime
lib/                 Supabase clients, auth helpers, validation
services/            Server-side database operations
types/               Shared TypeScript types
utils/               Small formatting helpers
database/            Supabase SQL schema
public/              Local static assets
```

## Production Checklist

- Add real Supabase environment variables in Vercel.
- Create exactly the two required admin users.
- Confirm Row Level Security policies are active.
- Test a customer COD order on mobile.
- Test admin realtime updates in two browser tabs.
- Replace restaurant phone/name in environment variables.

## First Git Commit

```bash
git init
git add .
git commit -m "Initial roast biryani ordering MVP"
```
