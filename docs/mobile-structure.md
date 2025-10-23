# 📱 Wenda Mobile App — Structure & Flow Documentation

## 🎯 Purpose
The Wenda mobile app helps tourists discover attractions, plan routes, and receive personalized recommendations powered by Machine Learning.

## 🧭 App Flow Overview

Language Selection
   ↓
Onboarding (Screens 1–3)
   ↓
Login / Register
   ↓
Home (Discover)
   ↓
Destination Details → Map View
   ↓
Personalized Recommendations
   ↓
Trip Planner / My Trips
   ↓
Profile / Settings

---

## 🗂️ Screens & Components

### 1. Language Selection
**Purpose:** Let users choose between English or Portuguese (and possibly French).  
**Components:**
- Language options (buttons or dropdown)
- “Continue” button  

**Colors:**  
Primary `#136F63` (green) | Secondary `#FFD166` (yellow)

---

### 2. Onboarding (3 Screens)
**Goal:** Introduce app features to new users.  

| Screen | Title | Description | Icon |
| ------- | ------ | ------------ | ----- |
| 1 | Discover Angola | Explore attractions and experiences. | Map |
| 2 | Smart Suggestions | Get AI-based travel recommendations. | Robot |
| 3 | Plan Your Journey | Create itineraries easily. | Route |

**Buttons:** “Next”, “Skip”, “Get Started”  
**Design:** White background, green accents, yellow highlights.

---

### 3. Authentication
#### 🔹 Login Screen
Fields:
- Email  
- Password  

Buttons:
- “Login”  
- “Forgot Password?”  
- “Register”  

#### 🔹 Register Screen
Fields:
- Full Name  
- Email  
- Password  
- Confirm Password  
- Country  

Checkbox: “I agree with Terms & Privacy”  
Button: “Create Account”  
Auth methods: Email/password + Google OAuth (Firebase/Auth0)

---

### 4. Home (Discover)
Tabs:
- 🏠 Discover  
- 🗺️ Map  
- ❤️ Favorites  
- 👤 Profile  

Components:
- Search bar (“Search attractions, places, events…”)
- Carousel: Featured destinations
- Sections:
  - Top Destinations
  - Recommended for You
  - Events Nearby

Each destination card includes:
- Image  
- Name  
- Location  
- ⭐ Rating  
- Distance (km)

---

### 5. Destination Details
**Sections:**
- Image gallery  
- Name, Location, Description  
- Map preview (Leaflet / react-native-maps)  
- “Add to Trip” and “Open on Map” buttons  
- Tabs: Overview | Reviews | Nearby Places

---

### 6. Map View
Interactive map with markers for attractions.

**Filters:**
- Type (Cultural, Natural, Historical)
- Distance radius
- Popularity

Tap marker → opens bottom sheet with place info and “View Details”.

---

### 7. Recommendations
AI-powered suggestions based on user preferences and current location.

Components:
- Recommendation cards  
- “Refresh Suggestions” button  
- “Add to Favorites” option  

---

### 8. Trip Planner / My Trips
Helps users build and manage itineraries.

**Features:**
- Add destination  
- Optimize route (distance API)  
- Date picker  
- Notes section  
- Share trip  

---

### 9. Profile & Settings
Tabs:
- Personal Info (edit name, email, country)
- Preferences (interests: nature, adventure, culture)
- Language  
- Notifications (toggle)
- About / Contact  

Buttons: Logout | Delete Account

---

## 🎨 UI Design & Colors

| Element | Color | Description |
|----------|--------|-------------|
| Primary | `#136F63` | Deep green — brand color |
| Secondary | `#FFD166` | Warm yellow — accents |
| Background | `#FFFFFF` | Clean and minimal |
| Text | `#333333` | Primary text |
| Muted text | `#888888` | Secondary text |
| Success | `#06D6A0` | Success actions |
| Error | `#EF476F` | Alerts or invalid inputs |

**Font:** Inter / Poppins  
**Corner radius:** 16px  
**Shadow:** Soft for cards and buttons  

---

## 🔄 Navigation Structure

Navigation library: `@react-navigation/native`

**Flow:**
- Stack: Onboarding → Auth → Main  
- Tabs: Discover | Map | Favorites | Profile  
- Nested stacks: Discover → Details → TripPlanner  

---

## 🔗 API Integrations

| Endpoint | Purpose |
|-----------|----------|
| `/api/destinations` | Fetch list of tourist attractions |
| `/api/recommendations` | Get ML-based recommendations |
| `/api/events` | Retrieve upcoming events |
| `/api/user/preferences` | Save and retrieve user preferences |
| `/api/trips` | Manage user itineraries |

---

## 🧩 Future Enhancements
- Offline mode (cached destinations)
- QR code scanner for tourist info
- AI chatbot assistant
- Multi-language i18n support

---

## 🧑‍💻 Technical Notes for Development
- Framework: React Native (Expo)  
- Language: TypeScript  
- Styling: NativeWind + Tailwind config  
- Navigation: React Navigation (Stack + Tabs)  
- Maps: `react-native-maps` or `expo-maps`  
- Data fetch: Axios  
- Auth: Firebase/Auth0  

---

*Document prepared for the Wenda mobile app development — Bootcamp FTL Capstone Project.*
