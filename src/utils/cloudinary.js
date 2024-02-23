import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: CLOUDINARY_API_KEY, 
  api_secret: CLOUDINARY_API_SECRET
});

const uploadOnCloudinary= async (localFilePath)=>{
    try {
        if(!localFilePath) return null
//uploadFileon cloudinary
     const response = cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
        })
        console.log("uploaded on cloudinary", response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export {uploadOnCloudinary}

cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" }, 
  function(error, result) {console.log(result); });