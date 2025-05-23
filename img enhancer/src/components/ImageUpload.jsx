import React from "react";

const ImageUpload = (props) => {
  const showImageHandler = (e) => {
    const file = e.target.files[0]; /* this is the image that we will upload*/
    if (file) {
      props.uploadImageHandler(
        file
      ); /*Yha hmne kha hai ki jo bhi file upload hokr aaye vo uploadImageHandler Func me chla jaye aur ye hme parent (Home) se milta hai */
    }
  };
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl">
      <label
        htmlFor="fileInput"
        className="block w-full cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-all"
      >
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={showImageHandler}
        />
        <span className="text-lg font-medium text-gray-600">
          Click and drag to upload your image
        </span>
      </label>
    </div>
  );
};

export default ImageUpload;
