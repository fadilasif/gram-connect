# Gram Connect 🌾📱

**Everything. Everytime. Connected.**

Gram Connect is a comprehensive, offline-first Progressive Web Application (PWA) designed explicitly to bridge the digital divide in rural communities. It provides essential services—including Groceries, On-Demand Rides, Package Deliveries, and Transport—without requiring a stable internet connection.

## 🌟 The "Low Connectivity" Solution

In many rural areas, 4G/5G data networks are unreliable, spotty, or entirely non-existent. Gram Connect solves this critical infrastructure gap through an innovative **SMS-Based Checkout System**. 

While the app interface is cached locally on the user's smartphone, all transactions, bookings, and orders are transmitted over standard telecom networks via SMS (which relies on robust 2G technology available globally). 

### Why this works:
1. **Zero Data Requirement for Transactions**: A user can browse their locally cached catalog, build a cart, and place an order even with cellular data turned off.
2. **Instant Transmission**: SMS messages require incredibly low bandwidth and are instantly queued and delivered the moment a basic cellular signal is acquired.
3. **Hardware Agnostic**: It works seamlessly on low-end Android smartphones prevalent in rural regions.

## ✨ Core Features

* **🛒 Groceries**: Browse and order daily needs, vegetables, dairy, and snacks.
* **🛵 On-Demand Rides**: Book scooters or rickshaws for local transport.
* **📦 Deliveries**: Send packages with built-in Cash on Delivery (COD) or prepaid options.
* **🌐 Bilingual Support**: Seamlessly switch between English and Hindi to ensure accessibility for local populations.
* **💾 Offline Storage**: User profiles, cart data, and histories are securely stored locally on the device, eliminating the need to fetch data on every load.
* **🎨 Premium UI/UX**: Designed with a sleek, modern, and accessible interface featuring a beautiful splash screen, intuitive onboarding flow, and clear iconography.

## 🚀 Tech Stack

* **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) for rapid, responsive design
* **Icons**: [Lucide React](https://lucide.dev/)
* **State Management**: React Hooks + LocalStorage API
* **Routing**: React Router DOM

## 🛠️ Local Development

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/fadilasif/gram-connect.git
   cd gram-connect
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```


---
*Built to empower rural communities through accessible technology.*
