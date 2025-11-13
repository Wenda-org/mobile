// Export all services
export { authService } from './auth.service';
export { userService } from './user.service';
export { categoryService } from './category.service';
export { destinationService } from './destination.service';
export { reviewService } from './review.service';
export { favoriteService } from './favorite.service';
export { tripService } from './trip.service';
export { mlService } from './ml.service';
export { uploadService, uploadImage, uploadImageBase64 } from './upload.service';

// Export API instances
export { coreApi, mlApi } from './api.config';
