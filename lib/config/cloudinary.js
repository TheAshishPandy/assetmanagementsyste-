// utils/cloudinary.js
import cloudinary from 'cloudinary';

// Configure the Cloudinary client using the CLOUDINARY_URL
cloudinary.config({
  cloud_name: 'delvnhtb6', // Extracted from your CLOUDINARY_URL
  api_key: '224333371894272', // Extracted from your CLOUDINARY_URL
  api_secret: 'QbHKpe1b3bDRWPEqRvyLoHxacIM', // Extracted from your CLOUDINARY_URL
});

export const cloudinaryClient = cloudinary.v2;
