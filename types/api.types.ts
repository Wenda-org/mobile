/**
 * Wenda Tourism API - TypeScript Types
 */

// ========== BASE TYPES ==========

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginationMeta {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
}

// ========== USER & AUTH ==========

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  preferences?: Record<string, any>;
  isActive: boolean;
  emailVerifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  avatarUrl?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  avatarUrl?: string;
  preferences?: Record<string, any>;
  password?: string;
  confirmPassword?: string;
}

// ========== CATEGORY ==========

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryWithCount extends Category {
  _count: {
    destinations: number;
  };
}

// ========== DESTINATION ==========

export interface DestinationImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface DestinationSummary {
  id: string;
  name: string;
  slug: string;
  location: string;
  province: string;
  latitude: number;
  longitude: number;
  images: DestinationImage[];
  rating: number;
  reviewCount: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  isFeatured: boolean;
  createdAt: string;
}

export interface DestinationFilters extends PaginationParams {
  categoryId?: string;
  province?: string;
  search?: string;
  sortBy?: 'rating' | 'popular' | 'recent';
}

// ========== REVIEW ==========

export interface ReviewImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  visitDate?: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  destination: {
    id: string;
    name: string;
    slug: string;
  };
  images: ReviewImage[];
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewDto {
  destinationId: string;
  rating: number;
  comment: string;
  visitDate?: string;
  images?: Array<{
    url: string;
    thumbnailUrl?: string;
  }>;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
  visitDate?: string;
}

// ========== FAVORITE ==========

export interface Favorite {
  id: string;
  userId: string;
  destinationId: string;
  destination: DestinationSummary;
  createdAt: string;
}

export interface CreateFavoriteDto {
  destinationId: string;
}

// ========== TRIP ==========

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
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripDto {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface UpdateTripDto {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface AddDestinationToTripDto {
  destinationId: string;
  visitDate?: string;
  notes?: string;
}

// ========== ML TYPES ==========

export interface ForecastRequest {
  province: string;
  month: number;
  year: number;
}

export interface ForecastResponse {
  province: string;
  month: number;
  year: number;
  predicted_visitors: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  model_version: string;
  generated_at: string;
}

export interface RecommendationRequest {
  user_preferences: {
    preferred_categories?: string[];
    preferred_provinces?: string[];
    max_distance_km?: number;
  };
  top_n?: number;
}

export interface RecommendationResponse {
  recommendations: Array<{
    destination_id: string;
    destination_name: string;
    similarity_score: number;
    category: string;
    province: string;
    rating: number;
  }>;
  total_recommendations: number;
  model_version: string;
  generated_at: string;
}

export interface SegmentationResponse {
  user_segment: string;
  segment_description: string;
  segment_characteristics: {
    avg_trips_per_year: number;
    preferred_categories: string[];
    avg_rating_given: number;
    seasonality_preference: string;
  };
  similar_users_count: number;
  model_version: string;
  generated_at: string;
}

export interface MLHealthResponse {
  status: string;
  module: string;
  endpoints: string[];
  trained_models: number;
  model_status: string;
  timestamp: string;
}

export interface MLModel {
  model_type: string;
  model_name: string;
  version: string;
  algorithm: string;
  metrics: {
    mae?: number;
    mape?: number;
    test_samples?: number;
    silhouette_score?: number;
  };
  status: string;
  trained_on: string;
}

export interface MLModelsResponse {
  models: MLModel[];
  total_models: number;
  by_type: {
    forecast: number;
    clustering: number;
    recommender: number;
  };
  generated_at: string;
}
