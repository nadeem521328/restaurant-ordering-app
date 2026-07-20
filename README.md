# Single Restaurant Ordering App

A full-stack restaurant ordering platform built with **Next.js, TypeScript, Supabase, PostgreSQL, and Vercel**.

The application provides a mobile-friendly customer ordering experience and a protected admin dashboard for managing incoming orders in real time.

## Live Demo

* Customer App: `https://bismillah-palaav-center.vercel.app`

## Overview

This project was built to streamline restaurant operations through a simple direct-ordering workflow.

Customers can place Cash on Delivery (COD) orders without creating accounts, while restaurant staff can monitor and manage orders through a secure admin dashboard with realtime updates.

## Business Context

Developed for:

Bismillah Palaav Center
Location: Bismillah Palaav Center, Koduru, Krishna, Andhra Pradesh, India,521328.

The application is currently deployed and used to manage customer orders and restaurant operations.

## Key Features

### Customer Features

* Mobile-first ordering experience
* Dynamic menu loaded from database
* Cart persistence using Local Storage
* Cash on Delivery checkout
* Server-side order validation
* Live restaurant status updates (Open / Closed / Sold Out)

### Admin Features

* Secure admin authentication with Supabase Auth
* Protected admin dashboard
* Realtime incoming order updates
* Order status management
* Restaurant status controls
* Customer call integration via `tel:` links

## Tech Stack

| Layer          | Technology                       |
| -------------- | -------------------------------- |
| Frontend       | Next.js 16, React, TypeScript    |
| Styling        | Tailwind CSS                     |
| Backend        | Next.js API Routes               |
| Database       | Supabase PostgreSQL              |
| Authentication | Supabase Auth                    |
| Authorization  | PostgreSQL RLS + Admin Allowlist |
| Realtime       | Supabase Realtime                |
| Validation     | Zod                              |
| Deployment     | Vercel                           |

## Architecture

```text
Customer
   ↓
Next.js Frontend
   ↓
API Routes
   ↓
Supabase PostgreSQL
   ↓
Realtime Updates
   ↓
Admin Dashboard
```

## Security Highlights

* Server-side order creation
* Supabase Authentication
* Row Level Security (RLS)
* Admin authorization via allowlist table
* Client and server-side validation
* Service role key restricted to server-side operations

## Project Structure

```text
app/
components/
hooks/
lib/
services/
database/
types/
utils/
```

## Setup

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_RESTAURANT_NAME=
```

### Start Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run start
```

## Deployment

The application is deployed on Vercel and uses Supabase as the production database.

Deployment flow:

```text
GitHub
   ↓
Vercel
   ↓
Automatic Production Deployment
```

## Project Highlights

* Designed a complete customer-to-admin ordering workflow.
* Implemented realtime operational updates using Supabase Realtime.
* Secured customer order data using PostgreSQL Row Level Security.
* Built server-side validation and business rule enforcement.
* Deployed and maintained a production-ready full-stack application.

## Future Enhancements

* Multiple menu item management
* Payment gateway integration
* Customer order tracking
* Analytics dashboard
* WhatsApp notifications

## Author

Nadeem Shaik

GitHub: https://github.com/nadeem521328
