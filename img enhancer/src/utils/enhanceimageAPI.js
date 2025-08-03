import axios from "axios";

// --- Configuration: Point to YOUR Backend Server ---
// In development, this is the URL where your backend server is running.
// When you deploy your application, this URL will need to be updated to your live backend server's address.
const BACKEND_BASE_URL = "http://localhost:5000";

// This function sends the image file from your frontend to YOUR backend for enhancement.
export const enhancedimageAPI = async (file) => {
  try {
    const formData = new FormData();
    // The field name 'image_file' MUST match what your backend's Multer expects (in server.js).
    formData.append("image_file", file);

    // Make the API call to your own backend's proxy endpoint
    const response = await axios.post(
      `${BACKEND_BASE_URL}/api/enhance-image`, // This is your backend's endpoint!
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Essential for sending file data
        },
      }
    );

    // Your backend now handles the full enhancement process (calling external API, polling, etc.).
    // It directly returns the final enhanced image data.
    console.log("Frontend received final enhanced image data from backend:", response.data);
    return response.data; // This 'data' object should contain the 'image' URL (e.g., response.data.image)

  } catch (error) {
    // Handle errors received from your backend or network issues
    console.error("Frontend Error: Failed to enhance image via backend.", error);

    // Customize the error message based on the backend's response, if available.
    if (error.response && error.response.data && error.response.data.message) {
        throw new Error(`Enhancement failed: ${error.response.data.message}`);
    } else if (error.request) {
        throw new Error("Network error: Could not connect to the backend server.");
    } else {
        throw new Error(`An unexpected error occurred: ${error.message}`);
    }
  }
};

// --- IMPORTANT: DELETE ALL OLD EXTERNAL API CALLING FUNCTIONS FROM THIS FILE ---
// The functions named 'uploadImage', 'fetchEnhancedImage', and 'PoolForEnhancedImage'
// should be completely removed from 'enhanceimageAPI.js' as they are now handled by 'backend/server.js'.