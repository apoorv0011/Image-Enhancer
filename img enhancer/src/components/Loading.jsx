import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500">
        <div className="h-12 w-12 rounded-full bg-white"></div> {/* Inner circle */}
        <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-indigo-500 border-t-transparent animate-spin-fast"></div> {/* Spinning border */}
      </div>
    </div>
  );
};

export default Loading;