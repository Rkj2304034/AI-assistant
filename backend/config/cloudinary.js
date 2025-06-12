 const uploadOnCloudinary = async(filePath) => {
    //add configuration
    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.cloud_name, 
        api_key:process.env.api_key,
        api_secret:process.env.api_secret, // Click 'View API Keys' above to copy your API secret
    });

    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(filePath)
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
}

export default uploadOnCloudinary;