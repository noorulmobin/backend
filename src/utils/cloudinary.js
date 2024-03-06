import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary with your credentials
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // Upload file to cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto'
    });
    console.log("Uploaded on Cloudinary:", response.secure_url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
}

export { uploadOnCloudinary };

// Example usage
uploadOnCloudinary("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg")
  .then(result => console.log(result))
  .catch(error => console.error(error));
