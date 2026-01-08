import { v2 as cloudinary } from 'cloudinary';
import config from '../config/environment.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (file, folder = 'campushubx') => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto' }
      ]
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('File upload failed');
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('File deletion failed');
  }
};

export const uploadMultipleFiles = async (files, folder = 'campushubx') => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple file upload error:', error);
    throw new Error('File upload failed');
  }
};

// For local file system (fallback if Cloudinary is not configured)
export const uploadToLocal = async (file, folder = 'uploads') => {
  // This would be implemented with multer or similar
  // For now, return placeholder
  return {
    url: `/uploads/${folder}/${file.filename}`,
    publicId: file.filename
  };
};
