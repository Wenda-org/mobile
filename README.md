# 📱 Wenda Mobile App

The Wenda mobile app helps tourists discover attractions, plan routes, and receive personalized recommendations powered by Machine Learning.

## 🎯 Project Overview

Wenda is a comprehensive tourism application designed specifically for Angola, helping visitors and locals discover the country's rich cultural heritage, natural wonders, and historical landmarks. The app provides AI-powered recommendations, interactive maps, and trip planning features to enhance the tourism experience.

## ✨ Key Features

- **🗺️ Discover Attractions**: Browse featured destinations, top-rated locations, and personalized recommendations
- **🤖 Smart Suggestions**: AI-powered recommendations based on user preferences and location
- **🗓️ Trip Planning**: Create and manage custom itineraries
- **🗺️ Interactive Maps**: Explore destinations with markers, filters, and location details
- **❤️ Favorites**: Save and manage your favorite destinations
- **🌐 Multilingual**: Support for English and Portuguese
- **👤 User Profiles**: Manage preferences, settings, and trip history

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query + Axios
- **Internationalization**: i18next
- **Authentication**: Expo Auth Session + Secure Store
- **Maps**: React Native Maps (planned)

## 🎨 Design System

### Colors
- **Primary**: `#136F63` (Deep Green) - Brand color
- **Secondary**: `#FFD166` (Warm Yellow) - Accent color
- **Success**: `#06D6A0`
- **Error**: `#EF476F`
- **Background**: White/Dark mode support
- **Text**: Adaptive based on theme

### Typography
- **Font**: System default (Inter/Poppins recommended)
- **Sizes**: Consistent scale from 12px to 36px

## 📁 Project Structure

```
mobile/
├── app/                      # Main application screens
│   ├── (auth)/              # Authentication flow
│   │   ├── onboarding/      # Onboarding screens (0, 1, 2)
│   │   ├── login.tsx        # Login screen
│   │   ├── register.tsx     # Registration screen
│   │   └── confirm.tsx      # Email confirmation
│   ├── (tabs)/              # Main tab navigation
│   │   ├── index.tsx        # Discover/Home screen
│   │   ├── map.tsx          # Map view
│   │   ├── favorites.tsx    # Saved destinations
│   │   └── two.tsx          # Profile screen
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Splash screen
│   └── language.tsx         # Language selection
├── components/              # Reusable components
│   ├── DestinationCard.tsx  # Destination card component
│   ├── SearchBar.tsx        # Search input component
│   ├── FilterButton.tsx     # Filter button component
│   ├── Input.tsx            # Form input component
│   └── Button.tsx           # Button component
├── hooks/                   # Custom hooks
│   └── useAuth.ts           # Authentication hook
├── contexts/                # React contexts
│   └── ThemeContext.tsx     # Theme management
├── locales/                 # Translation files
│   ├── en.json             # English translations
│   └── pt.json             # Portuguese translations
├── constants/              # App constants
│   └── Colors.ts           # Color definitions
├── docs/                   # Documentation
│   └── mobile-structure.md # Detailed structure doc
└── config/                 # Configuration files
    └── app.config.ts       # Expo config
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Wenda-org/mobile.git
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

## 🌍 App Flow

```
Language Selection
   ↓
Onboarding (3 screens)
   ↓
Login / Register
   ↓
Main App (Tabs)
   ├── Discover (Home)
   ├── Map View
   ├── Favorites
   └── Profile
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```
API_URL=https://api.wenda.ao
GOOGLE_CLIENT_ID=your_google_client_id
```

### API Integration
The app is designed to integrate with the Wenda backend API. Update API endpoints in your configuration:
- `/api/destinations` - Fetch tourist attractions
- `/api/recommendations` - Get ML-based recommendations
- `/api/events` - Retrieve upcoming events
- `/api/user/preferences` - User preferences
- `/api/trips` - Trip management

## 📱 Features Implementation Status

- ✅ Language Selection
- ✅ Onboarding Flow
- ✅ Authentication UI (Login/Register)
- ✅ Discover/Home Screen
- ✅ Map Screen (UI only, needs maps integration)
- ✅ Favorites Screen
- ✅ Profile Screen
- ⏳ Destination Details
- ⏳ Trip Planner
- ⏳ Real Maps Integration
- ⏳ Backend API Integration
- ⏳ Push Notifications

## 🎯 Next Steps

1. **Backend Integration**: Connect to Wenda API
2. **Maps Implementation**: Integrate react-native-maps with real location data
3. **Authentication**: Implement full auth flow with backend
4. **Destination Details**: Create detailed view for attractions
5. **Trip Planner**: Build itinerary creation and management
6. **Offline Mode**: Add offline data caching
7. **Push Notifications**: Implement notification system

## 🤝 Contributing

This is a capstone project for FTL Bootcamp. For contributions, please follow standard Git workflow practices.

## 📄 License

This project is part of the FTL Bootcamp Capstone Project.

## 📞 Contact

For questions or support, contact the Wenda development team.

---

**Wenda** - Discover Angola, Plan Your Journey 🇦🇴
