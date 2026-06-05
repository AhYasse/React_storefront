# ShopHub E-commerce Client

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=ShopHub+Banner" alt="ShopHub Banner" width="100%">
</div>

A modern, responsive e-commerce frontend built with React, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Frontend:** [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & [Redux Persist](https://github.com/rt2zz/redux-persist)
- **Routing:** [React Router DOM](https://reactrouter.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Error Monitoring:** [Sentry](https://sentry.io/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Notifications:** [React Hot Toast](https://react-hot-toast.com/)
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
- **Global State Management:**
  - **Cart Persistence:** Shopping cart data is saved across browser sessions using `redux-persist`.
  - **User Authentication:** Centralized user profile and session management via `userSlice`.
  - **Product State:** Global management of product listings and details.
- **Authentication UI:**
  - Clean, centered Login form.
  - Detailed Registration form for new users.
- **Enterprise Infrastructure:**
  - **Production Error Tracking:** Sentry integration for real-time monitoring and crash reporting.
  - **Centralized API Layer:** Dedicated `api.ts` for clean backend communication.
  - **Error Boundaries:** Graceful UI degradation on runtime failures.
- **User Experience:** Smooth page transitions and element animations using Framer Motion.

## 📸 Screenshots

<p align="center">
  <img src="https://via.placeholder.com/400x300?text=Desktop+Screenshot" width="45%" />
  <img src="https://via.placeholder.com/200x300?text=Mobile+Screenshot" width="22%" />
</p>

## 🛠️ Project Structure

### 🏗️ Core Architecture
1. **`src/main.tsx`**: Entry point (Redux, Persist, Sentry & Toast setup).
2. **`src/App.tsx`**: Root component with Global Error Boundary.
3. **`src/router.tsx`**: Advanced routing & Role-based `ProtectedRoute`.
4. **`src/store/`**: Global state management (`store.ts`, `userSlice`, `cartSlice`, `productsSlice`).
5. **`src/services/`**: Infrastructure layer (`api.ts`, `sentry.ts`).

### 🧱 UI Components
6. **`src/components/Layout.tsx`**: Master layout with navigation progress.
7. **`src/components/NavBar.tsx`**: Responsive navigation & Cart status.
8. **`src/components/ErrorBoundary.tsx`**: Graceful error handling UI.

### 📄 Application Pages
9. **`src/pages/Home.tsx`**: Landing page & Hero section.
10. **`src/pages/ProductPage.tsx`**: Dynamic product details.
11. **`src/pages/CartPage.tsx`**: Inventory management & Totaling.
12. **`src/pages/CheckoutPage.tsx`**: Multi-section checkout flow.
13. **`src/pages/Login.tsx`**: Auth interface with feedback.
14. **`src/pages/Register.tsx`**: Account creation.
15. **`src/pages/Profile.tsx`**: User account management.
16. **`src/pages/AdminDashboard.tsx`**: Admin statistics & analytics.

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