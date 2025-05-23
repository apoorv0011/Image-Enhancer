import axios from "axios";
const API_KEY = "wxtjam61532o2xaoa";
const BASE_Url = "https://techhk.aoscdn.com";

export const enhancedimageAPI = async (file) => {
  try {
    const taskId = await uploadImage(file);
    console.log("Image Uploaded Successfully,task ID:", taskId);

    //Pooling krna pdega-Mtlb hme set timeinterval vgera lgana pdega yani hme api ko tb tk call krna hai jb tk pura data aa n jaye
    const enhancedImageData = await PoolForEnhancedImage(taskId);
    console.log(
      "Image Enhanced Successfully,Ehanced Image Data:",
      enhancedImageData
    );
    return enhancedImageData;
  } catch (error) {
    console.log("Error ennhacing image:", error.message);
  }
};

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image_file", file);

  const { data } = await axios.post(
    `${BASE_Url}/api/tasks/visual/scale`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-API-KEY": API_KEY,
      },
    }
  );

  if (!data?.data?.task_id) {
    throw new Error("Failed to upload Image, task ID not found");
  }
  return data.data.task_id;
  // console.log(data)
  // return taskId
};

const fetchEnhancedImage = async (taskId) => {
  const { data } = await axios.get(
    `${BASE_Url}/api/tasks/visual/scale/${taskId}`,
    {
      headers: {
        "X-API-KEY": API_KEY,
      },
    }
  );

  if (!data?.data) {
    throw new Error("Failed to fetch enhanced image! Image not found.");
  }

  return data.data;
  // "/api/tasks/visual/scale/{task_id}"
  // return enhancedImageData
};

const PoolForEnhancedImage = async (taskId, retries = 0) => {
  const result = await fetchEnhancedImage(taskId);

  if (result.state === 4) {
    console.log("Image is still being Processed ");

    if (retries >= 20) {
      throw new Error("Max tries reached. Please try again later!");
    }

    //wait for 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return PoolForEnhancedImage(taskId, retries + 1);
  }
  console.log("Enhanced image URL", result);
  return result;
};
