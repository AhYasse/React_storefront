# ShopHub E-commerce Client

A modern, responsive e-commerce frontend built with React, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Frontend:** [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Routing:** [React Router DOM](https://reactrouter.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)

## ✨ Features Implemented

- **Responsive Navigation:** A sticky navigation bar with a functional mobile menu and cart indicator.
- **Hero Section:** Animated landing page header to grab user attention.
- **Product Discovery:**
  - Home page with featured product placeholders.
  - Dynamic Product Detail page (`/product/:id`) with layout for specifications and "Add to Cart" actions.
- **Shopping Cart:** 
  - Dedicated Cart page with item quantity management (plus/minus controls).
  - Empty cart state handling.
  - Total price calculation.
- **Authentication UI:**
  - Clean, centered Login form.
  - Detailed Registration form for new users.
- **User Experience:** Smooth page transitions and element animations using Framer Motion.

## 🛠️ Project Structure

- `src/components/`: Reusable UI components like `Layout` and `NavBar`.
- `src/pages/`: Main views including `Home`, `ProductPage`, `CartPage`, `Login`, and `Register`.
- `src/App.tsx`: Centralized routing configuration.
- `src/main.tsx`: Application entry point.

## 🏁 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```