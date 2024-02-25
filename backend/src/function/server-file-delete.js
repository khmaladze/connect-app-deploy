const cloudinary = require("cloudinary").v2;
const config = require("../../../config/config");

// Function to delete a file from Cloudinary
exports.deleteFileFromCloudinary = async (fileUrl, resourceType) => {
  try {
    // Configure Cloudinary with your credentials
    cloudinary.config({
      cloud_name: config.cloudinary_cloud_name,
      api_key: config.cloudinary_api_key,
      api_secret: config.cloudinary_api_secret,
    });

    // Send a request to Cloudinary to delete the file
    await cloudinary.api.delete_resources([String(fileUrl)], {
      type: "upload",
      resource_type: resourceType,
    });

    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    // Optionally throw a more specific error or customize the error message
    throw new Error("Failed to delete file from Cloudinary");
  }
};
