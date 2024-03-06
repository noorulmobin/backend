import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({ 
  cloud_name:"dj2znfxus", 
  api_key: 315353759155867, 
  api_secret:"b6gqz-7jkKr554wNGzrPQxdLXiM"
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
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
}

export { uploadOnCloudinary };

// Example usage
uploadOnCloudinary("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg")
  .then(result => console.log(result))
  .catch(error => console.error(error));
