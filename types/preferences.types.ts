/**
 * User Preferences Types
 */

export interface TravelPreferences {
  // Categories of interest
  favoriteCategories: string[]; // Category IDs
  
  // Travel style
  travelStyle: ('adventure' | 'relaxation' | 'cultural' | 'nature' | 'urban' | 'beach')[];
  
  // Budget preference
  budgetRange: 'low' | 'medium' | 'high' | 'luxury';
  
  // Group preference
  travelWith: 'solo' | 'couple' | 'family' | 'friends' | 'group';
  
  // Activity level
  activityLevel: 'low' | 'moderate' | 'high' | 'extreme';
  
  // Duration preference
  preferredDuration: 'day-trip' | 'weekend' | 'week' | 'long-stay';
  
  // Accessibility
  needsAccessibility: boolean;
  
  // Language preference
  preferredLanguage: 'pt' | 'en';
  
  // Notification preferences
  notifications: {
    recommendations: boolean;
    deals: boolean;
    updates: boolean;
    newsletter: boolean;
  };
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
}

export const DEFAULT_PREFERENCES: TravelPreferences = {
  favoriteCategories: [],
  travelStyle: [],
  budgetRange: 'medium',
  travelWith: 'solo',
  activityLevel: 'moderate',
  preferredDuration: 'weekend',
  needsAccessibility: false,
  preferredLanguage: 'pt',
  notifications: {
    recommendations: true,
    deals: true,
    updates: true,
    newsletter: false,
  },
};
