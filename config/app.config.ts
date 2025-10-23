// App Configuration
// Centralized config for the Amistoso mobile app

export const config = {
  // App Info
  app: {
    name: 'Amistoso',
    version: '1.0.0',
    description: 'Conecte times e jogadores para partidas amistosas',
  },

  // API Configuration
  api: {
    baseUrl: process.env.API_URL || 'https://api.amistoso.com',
    timeout: 10000, // 10 seconds
    endpoints: {
      auth: {
        login: '/auth/login',
        register: '/auth/register',
        googleAuth: '/auth/google',
        refreshToken: '/auth/refresh',
        logout: '/auth/logout',
      },
      user: {
        profile: '/user/profile',
        update: '/user/update',
        teams: '/user/teams',
      },
      teams: {
        list: '/teams',
        create: '/teams',
        detail: '/teams/:id',
        join: '/teams/:id/join',
      },
      matches: {
        list: '/matches',
        create: '/matches',
        detail: '/matches/:id',
        accept: '/matches/:id/accept',
        decline: '/matches/:id/decline',
      },
      chat: {
        conversations: '/chat/conversations',
        messages: '/chat/:id/messages',
        send: '/chat/:id/send',
      },
    },
  },

  // OAuth Configuration
  oauth: {
    google: {
      androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID || '',
      iosClientId: process.env.GOOGLE_IOS_CLIENT_ID || '',
      webClientId: process.env.GOOGLE_WEB_CLIENT_ID || '',
    },
  },

  // App Settings
  settings: {
    defaultLanguage: 'pt',
    supportedLanguages: ['pt', 'en'],
    defaultTheme: 'auto', // 'light' | 'dark' | 'auto'
  },

  // Feature Flags
  features: {
    googleAuth: false, // Enable when OAuth is configured
    chat: false, // Enable when Socket.IO is ready
    notifications: false, // Enable when push notifications are configured
    maps: false, // Enable when Google Maps is configured
  },

  // Map Configuration (for future use)
  maps: {
    defaultZoom: 14,
    defaultLatitude: -23.550520, // São Paulo, Brazil
    defaultLongitude: -46.633308,
  },

  // Socket.IO Configuration (for future use)
  socket: {
    url: process.env.SOCKET_URL || 'https://socket.amistoso.com',
    options: {
      transports: ['websocket'],
      autoConnect: false,
    },
  },

  // Notifications Configuration (for future use)
  notifications: {
    sound: true,
    vibration: true,
    badge: true,
  },

  // Validation Rules
  validation: {
    password: {
      minLength: 6,
      requireUppercase: false,
      requireNumbers: false,
      requireSpecialChars: false,
    },
    teamName: {
      minLength: 3,
      maxLength: 50,
    },
  },

  // Storage Keys
  storageKeys: {
    user: 'user',
    token: 'token',
    refreshToken: 'refreshToken',
    language: 'language',
    theme: 'theme',
    onboardingComplete: 'onboardingComplete',
  },
};

export default config;
