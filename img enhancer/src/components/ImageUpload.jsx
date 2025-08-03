import React, { useState } from "react";

const ImageUpload = ({ uploadImageHandler }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (file) {
      uploadImageHandler(file);
    }
  };

  const showImageHandler = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl w-full max-w-2xl border border-gray-100"> {/* Adjusted border and shadow */}
      <label
        htmlFor="fileInput"
        className={`
          relative flex flex-col items-center justify-center p-12 rounded-2xl cursor-pointer
          border-3 transition-all duration-300 ease-in-out
          ${isDragging ? 'border-indigo-600 bg-indigo-50 transform scale-105' : 'border-dashed border-gray-300 hover:border-indigo-500 hover:bg-gray-50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={showImageHandler}
          accept="image/jpeg, image/png, image/webp, image/gif" // More specific MIME types
        />
        <svg
          className={`mx-auto h-16 w-16 mb-4 transition-colors duration-300
            ${isDragging ? 'text-indigo-600' : 'text-gray-400'}
          `}
          stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"
        >
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDragging ? 'text-indigo-800' : 'text-gray-700'}`}>
          {isDragging ? 'Release to upload!' : 'Drag & Drop your image here'}
        </p>
        <p className="text-md text-gray-500 mb-2">or</p>
        <button
          type="button"
          className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => document.getElementById('fileInput').click()}
        >
          Browse Files
        </button>
        <p className="mt-4 text-sm text-gray-500">
          Supported: JPG, PNG, WebP, GIF. Max size: 5MB.
        </p>
      </label>
    </div>
  );
};

export default ImageUpload;