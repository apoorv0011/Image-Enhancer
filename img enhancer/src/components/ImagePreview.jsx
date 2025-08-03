import React from "react";
import Loading from "./Loading";
import ReactCompareImage from 'react-compare-image';

const ImagePreview = ({ loading, upload, enhanced }) => {
  return (
    <div className="w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100 min-h-[300px] flex flex-col justify-center items-center">
      {loading ? (
        <div className="flex flex-col items-center justify-center w-full h-full text-center">
          <Loading />
          <p className="mt-6 text-xl font-medium text-indigo-700 animate-pulse">
            Enhancing your masterpiece...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This might take a few moments depending on image size.
          </p>
        </div>
      ) : upload && enhanced ? (
        <div className="flex flex-col items-center w-full">
          <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
            Your Transformed Image
          </h2>
          <div className="w-full max-w-2xl relative aspect-square overflow-hidden rounded-xl shadow-lg border border-gray-200"> {/* Added aspect-square and shadow */}
            <ReactCompareImage
              leftImage={upload}
              rightImage={enhanced}
              sliderLineColor="#6366F1" // Indigo-500
              sliderLineWidth={4}
              handleSize={50} // Slightly larger handle for better grab
              handle={<div className="bg-white rounded-full shadow-lg flex items-center justify-center p-2 border border-gray-200 cursor-grab active:cursor-grabbing">
                <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path></svg>
              </div>} // Custom handle
            />
          </div>
          <a
            href={enhanced}
            download="ai-enhanced-image.jpg"
            className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center text-lg transform hover:-translate-y-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Download Enhanced Image
          </a>
        </div>
      ) : upload ? (
        <div className="flex flex-col items-center w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Original Image Uploaded
          </h2>
          <div className="w-full max-w-sm relative aspect-video overflow-hidden rounded-xl shadow-md border border-gray-200 flex items-center justify-center bg-gray-100">
             <img src={upload} alt="Original" className="w-full h-full object-contain p-4" />
          </div>
          <p className="mt-6 text-lg text-gray-600">
             Your image is ready for enhancement.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full text-center p-4">
          <svg className="w-20 h-20 text-indigo-300 mb-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
          <p className="text-xl font-medium text-gray-600">
            Upload an image to see the magic happen!
          </p>
          <p className="text-md text-gray-400 mt-2">
            Your enhanced images will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;