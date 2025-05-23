import ImageUpload from "./ImageUpload";
import ImagePreview from "./ImagePreview";
import { useState, useEffect } from "react";
import { enhancedimageAPI } from "../utils/enhanceimageAPI";

const Home = () => {
  const [uploadImage, setUploadImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadImageHandler = async (file) => {
    setUploadImage(URL.createObjectURL(file));
    setLoading(true);
    try {
      const enhancedURL = await enhancedimageAPI(file);
      setEnhancedImage(enhancedURL);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Error while enhancing the image please try again later");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enhancedImage) {
      console.log("Enhanced image updated:", enhancedImage);
    }
  }, [enhancedImage]);

  return (
    <div>
      <ImageUpload uploadImageHandler={uploadImageHandler} />
      <ImagePreview
        loading={loading}
        upload={uploadImage}
        enhanced={enhancedImage?.image} // Adjust this depending on API response structure
      />
    </div>
  );
};

export default Home;


// import ImageUpload from "./ImageUpload";
// import ImagePreview from "./ImagePreview";
// import { useState } from "react";
// import { enhancedimageAPI } from "../utils/enhanceimageAPI";

// const Home = () => {
//   const [uploadImage, setUploadImage] = useState(null);
//   const [enhancedImage,setEnhancedImage] = useState();
//   const [loading, setLoading] = useState(false);

//   const uploadImageHandler =  async(file) => {
//     setUploadImage(URL.createObjectURL(file));
//     console.log("The uploaded img is", file);
//     setLoading(true);
//     //calling API to enhance the Image
//     try{
//         const enhancedURL=await  enhancedimageAPI(file)
//         console.log(">>>>>>>>>>>>>>>>>>>>>>>>>",enhancedURL)
//         setEnhancedImage(enhancedURL)
//         console.log(enhancedImage)
//         setLoading(false)

//     }catch(error){
//         console.error(error)
//         alert("Error while enhancing the image please try again later")

//     }
//   };

// //   console.log(enhancedImage)
//   return (
//     <div>
//       <ImageUpload uploadImageHandler={uploadImageHandler} />{" "}
//       {/*Image upload me hm jo bhi image upload kire vo hme dikhni chahye isliye upr Upload Image Handkler bnaya*/}
//       <ImagePreview
//         loading={
//           loading
//         } /*yha pr hmne props paas kr diye hai; Props ka kaam hai ki vo parent me paas kiya jata hai taki data pass ho ske from parent component to child component*/
//         upload={uploadImage}
//         enhanced={enhancedImage?.image}
//       />
//     </div>
//   );
// };

// export default Home;