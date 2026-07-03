# 🍔 CraveBite

> **Your Cravings, Delivered Fast!**  
> A premium, glassmorphism-inspired fullstack food ordering web application built using **Next.js 15**, **React 19**, **Prisma**, **PostgreSQL**, **NextAuth**, and **Razorpay**.

🔗 **[Live Demo: crave-bites-by-tanesh.vercel.app](https://crave-bites-by-tanesh.vercel.app/)**

---

## ✨ Features

### 1. 🏠 Homepage & Navigation
*   **Sticky Glassmorphism Navbar**: Reads the active authentication session, displaying a dashboard link if logged in or a login prompt. Includes a live cart items count indicator.
*   **Hero & Cuisine Carousel**: Dynamic landing section featuring search actions, category sliders (Pizza, Sushi, Burgers, Healthy), and hydration-safe floating food particles.

### 2. 🍽️ Restaurant Catalog & Menus
*   **Restaurant Catalog**: Browse partner eateries with real-time text search, Veg/Non-Veg filter parameters, and sorting based on rating or fastest delivery speed.
*   **Dynamic Menus**: Visual details for items (Starters, Mains, Desserts, Beverages) with custom cart actions and restaurant conflict guard warnings.

### 3. 🛒 Cross-Restaurant Cart Guard
*   A custom state validator ensures users only add items from one restaurant at a time. Trying to add items from another restaurant triggers a modal warning, offering to clear the current cart.

### 4. 💳 Razorpay & Sandbox Gateway
*   **Secure Checkout**: Computes order billing details (subtotal, delivery fee, taxes, total) directly from the database to prevent pricing tamper.
*   **Sandbox Simulator**: Automatically falls back to a sandbox payment simulator if Razorpay credentials are using defaults, allowing complete end-to-end checkout testing.

### 5. 📊 Dynamic Customer Workspace
*   **Sidebar layout**: Shared user layout linking Overview, Order History, Address details, and Reviews.
*   **Overview Panel**: Displays a welcome greeting, metrics (total orders, active orders), address data, and a summary of recent orders.
*   **Accordion Order Cards**: Toggle-expand past orders to view subtotal items, quantities, pricing, and locations.
*   **Live Tracker Progress Bar**: Shows order status (*Placed* ➜ *Preparing* ➜ *On the Way* ➜ *Delivered*) with glowing progress indicators.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Next.js 15 (App Router), Lucide Icons |
| **Styling** | Custom Vanilla CSS (HSL Gradients, Glassmorphism, Responsive Grid) |
| **Authentication** | NextAuth.js (Credentials Provider with encrypted bcryptjs passwords) |
| **Database & ORM** | Prisma Client, PostgreSQL (Hosted on Neon.tech for production) |
| **Payments Gateway** | Razorpay Node.js SDK |

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database connection string (from Neon.tech or Supabase)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# NextAuth configurations
NEXTAUTH_SECRET="your-custom-super-secure-secret-key-12345"
NEXTAUTH_URL="http://localhost:3000"

# Razorpay credentials (test keys from dashboard.razorpay.com)
RAZORPAY_KEY_ID="rzp_test_yourkeyhere"
RAZORPAY_KEY_SECRET="your_secret_here"
```

---

## 🚀 Local Installation & Run

1. **Clone the Repository**
   ```bash
   git clone https://github.com/taneshkhandal07-debug/Crave-Bites.git
   cd Crave-Bites
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Database Schema & Seeds**
   Push the schema to your database provider and seed the mockup restaurants/menu items:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. **Run Local Server**
   ```bash
   npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)** in your browser!
