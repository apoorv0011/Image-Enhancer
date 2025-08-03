import ImageUpload from "./ImageUpload";
import ImagePreview from "./ImagePreview";
import { useState, useEffect, useCallback } from "react";
import { enhancedimageAPI } from "../utils/enhanceimageAPI";

const Home = () => {
  const [uploadImage, setUploadImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = useCallback((type, text) => {
    setMessage({ type, text });
    const timer = setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const uploadImageHandler = async (file) => {
    if (!file) {
      showMessage('error', 'No file selected.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      showMessage('error', 'Invalid file type. Please upload an image (e.g., JPG, PNG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showMessage('error', 'File size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    setUploadImage(null);
    setEnhancedImage(null);
    setMessage({ type: '', text: '' }); // Clear previous messages explicitly

    setUploadImage(URL.createObjectURL(file));
    setLoading(true);
    showMessage('info', 'Uploading and processing your image...');

    try {
      const enhancedURL = await enhancedimageAPI(file);
      setEnhancedImage(enhancedURL);
      setLoading(false);
      showMessage('success', 'Image enhanced successfully! You can now download it.');
    } catch (error) {
      console.error("Error during image enhancement:", error);
      let errorMessage = "An unexpected error occurred. Please try again later.";
      if (error.response) {
        // Server responded with a status other than 2xx
        errorMessage = `API Error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "Network error: Could not reach the enhancement service. Please check your internet connection.";
      } else if (error.message) {
        // Something happened in setting up the request that triggered an Error
        errorMessage = `Processing Error: ${error.message}`;
      }
      showMessage('error', errorMessage);
      setLoading(false);
      setUploadImage(null); // Clear original image preview on API error
      setEnhancedImage(null); // Ensure enhanced image is also cleared
    }
  };

  useEffect(() => {
    return () => {
      if (uploadImage) {
        URL.revokeObjectURL(uploadImage);
      }
    };
  }, [uploadImage]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl space-y-8"> {/* Adjusted max-w and spacing */}
      {/* Message Display Area */}
      {message.text && (
        <div className={`w-full p-4 rounded-lg shadow-md text-center text-lg font-medium animate-fadeIn
          ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' :
            message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' :
            'bg-indigo-100 text-indigo-700 border border-indigo-200' // Info messages
          }`}>
          {message.text}
        </div>
      )}

      <ImageUpload uploadImageHandler={uploadImageHandler} />

      <ImagePreview
        loading={loading}
        upload={uploadImage}
        enhanced={enhancedImage?.image}
      />
    </div>
  );
};

export default Home;