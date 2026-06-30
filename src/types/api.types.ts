export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  preferences?: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  preferred_categories?: string[];
  preferred_provinces?: string[];
  style?: string; // relaxation, adventure, beach, urban
  budget?: 'low' | 'medium' | 'high' | 'luxury'; // Economic, Medium, Alto, Luxo
  companions?: 'alone' | 'couple' | 'friends' | 'family';
  activity_level?: 'low' | 'medium' | 'high' | 'extreme';
}

export interface Category {
  id: string;
  name: string; // Cultural, Natural, Histórico, Aventura, etc.
  slug: string;
  icon?: string;
}

export interface DestinationImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  province: string;
  latitude: number;
  longitude: number;
  images: DestinationImage[];
  rating: number;
  reviewCount: number;
  categoryId: string;
  category: Category;
  tags: string[];
  facilities: string[];
  bestTimeToVisit?: string;
  entryFee?: string;
  openingHours?: string;
  isFeatured: boolean;
  isActive: boolean;
  reviews?: Review[];

}

export interface DestinationSummary {
  id: string;
  name: string;
  location: string;
  province: string;
  imageUrl?: string;
  rating: number;
}

export interface TripDestination {
  id: string;
  destinationId: string;
  destination: DestinationSummary;
  visitDate?: string;
  notes?: string;
  order: number;
}

export interface Trip {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  userId: string;
  destinations: TripDestination[];
}

export interface Review {
  id: string;
  destinationId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  rating: number; // 1-5
  comment: string;
  visitDate?: string;
  createdAt: string;
  likesCount: number;
  isLikedByCurrentUser?: boolean;
}

export interface FeedPost {
  id: string;
  title: string;
  content: string;
  type: 'news' | 'promo' | 'event' | 'schedule_change' | 'new_attraction';
  establishmentName: string;
  establishmentAvatar?: string;
  location?: string;
  images: string[];
  publishTime: string; // ISO String
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  ctaText?: string;
  ctaLink?: string;
}

export interface AddTripDestinationData {
  destinationId: string;
  visitDate: string;
  notes?: string;
}

