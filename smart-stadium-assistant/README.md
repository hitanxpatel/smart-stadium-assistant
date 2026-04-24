# Smart Stadium Assistant

## Problem Statement
Large stadium events often suffer from crowd congestion, long queues for food and facilities, and a lack of real-time information for attendees. Navigating a massive stadium can be confusing and frustrating, leading to a suboptimal event experience.

## Solution
The **Smart Stadium Assistant** is a modern, responsive web application designed to solve these issues. It provides attendees with real-time insights into stadium dynamics, helping them navigate efficiently, avoid crowds, and order food without standing in line. By simulating live data, this dashboard acts as a digital companion for anyone attending a large-scale event.

## Features
- **Live Crowd Heatmap**: Visualizes stadium zones with real-time density updates (simulated every 3 seconds), using intuitive color coding (Green/Low, Yellow/Medium, Red/High).
- **Smart Navigation**: Recommends the least crowded path to user-selected destinations (e.g., Gates, Washrooms, Medical Centers).
- **Food Ordering UI**: Allows users to browse food stalls, view wait times, add items to a slide-in cart, and place orders with success animations.
- **Nearby Facilities**: Lists the nearest amenities, their distance, and current crowd levels with filter options.
- **Alerts System**: Auto-refreshing notifications that inform users of important updates, like crowded gates or fast food service.
- **UI/UX Enhancements**: Dark mode toggle, toast notifications, loading skeletons, smooth Framer Motion animations, and a fully responsive design.

## Tech Stack
- **Frontend**: React.js (Hooks)
- **Styling**: Tailwind CSS, PostCSS, clsx, tailwind-merge
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Build Tool**: Vite
- *(Note: No backend is used; data is simulated via JavaScript)*

## Future Scope
- **AI Integration**: Predictive analytics to forecast crowd movements before they happen.
- **IoT Integration**: Connect real stadium cameras and turnstiles to provide true live data instead of simulations.
- **Cloud Integration**: Use scalable backend services (AWS/GCP/Firebase) to handle thousands of concurrent users during a real game.
- **Geolocation**: Use user device GPS to provide turn-by-turn indoor navigation.

## How to Run Locally
1. Clone the repository.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open the provided localhost link in your browser.
