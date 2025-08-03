// Load environment variables from .env file FIRST. This is crucial.
require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');
const FormData = require('form-data'); // Required for creating multipart/form-data for Node.js requests

const app = express();
// Use the PORT from .env, or default to 5000 if not specified
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
// Enable Cross-Origin Resource Sharing (CORS) for all requests
// This allows your frontend (on a different port/origin) to communicate with your backend.
app.use(cors());
// Parse incoming requests with JSON payloads
app.use(express.json());

// --- EXTERNAL API CONFIGURATION ---
// Retrieve sensitive API key and base URL from environment variables for security.
const EXTERNAL_API_KEY = process.env.EXTERNAL_API_KEY;
const EXTERNAL_BASE_URL = process.env.EXTERNAL_BASE_URL || "https://techhk.aoscdn.com";

// --- MULTER SETUP FOR FILE UPLOADS ---
// Use memory storage so the file is available as a buffer (req.file.buffer)
// This allows us to easily forward it to the external API without saving it to disk first.
const upload = multer({ storage: multer.memoryStorage() });

// --- API PROXY ENDPOINT: /api/enhance-image ---
// This is the endpoint your frontend will call to enhance an image.
app.post('/api/enhance-image', upload.single('image_file'), async (req, res) => {
    try {
        // Basic validation: Check if API key is set
        if (!EXTERNAL_API_KEY) {
            console.error("Backend Error: EXTERNAL_API_KEY is not configured in .env file.");
            return res.status(500).json({ message: "Server configuration error: External API key is missing." });
        }
        // Basic validation: Check if an image file was actually sent
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided in the request." });
        }

        // Prepare the FormData object to send the image to the EXTERNAL API
        const formData = new FormData();
        // Append the image file buffer with its original name and mimetype
        formData.append('image_file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        // --- Step 1: Send the image file to the EXTERNAL API's upload endpoint ---
        const uploadResponse = await axios.post(
            `${EXTERNAL_BASE_URL}/api/tasks/visual/scale`,
            formData, // Send the prepared form data
            {
                // Crucial: getHeaders() provides the correct 'Content-Type' for multipart/form-data
                headers: {
                    ...formData.getHeaders(),
                    'X-API-KEY': EXTERNAL_API_KEY, // Use the secure API key here!
                },
                maxBodyLength: Infinity,    // Allow large request bodies
                maxContentLength: Infinity, // Allow large response bodies
            }
        );

        // Extract the task_id from the external API's response
        const taskId = uploadResponse.data?.data?.task_id;
        if (!taskId) {
            console.error("External API did not return a task_id:", uploadResponse.data);
            return res.status(500).json({ message: "Failed to initiate enhancement with external service: Task ID not found." });
        }
        console.log(`[Backend] Image successfully sent to external API. Task ID: ${taskId}`);

        // --- Step 2: Poll the EXTERNAL API for the enhanced image result ---
        const enhancedImageData = await pollForEnhancedImage(taskId); // Call helper function

        // --- Step 3: Send the final enhanced image data back to the FRONTEND ---
        res.json(enhancedImageData);

    } catch (error) {
        console.error("[Backend] Error processing image enhancement request:", error.message);

        // Handle errors from the external API or network issues gracefully
        if (error.response) {
            // The external API responded with an error status (e.g., 400, 500)
            console.error("External API detailed error:", {
                status: error.response.status,
                data: error.response.data
            });
            res.status(error.response.status).json({
                message: `External API reported an error: ${error.response.data?.message || error.response.statusText}`,
                details: error.response.data
            });
        } else if (error.request) {
            // The request was sent to the external API, but no response was received
            console.error("No response received from external image enhancement service:", error.request);
            res.status(504).json({ message: "External image enhancement service did not respond (Gateway Timeout)." });
        } else {
            // Something else happened in setting up the request or a local error occurred
            console.error("Error with request setup or internal backend issue:", error.message);
            res.status(500).json({ message: `Internal server error: ${error.message}` });
        }
    }
});

// --- HELPER FUNCTION: Polling Logic to get the final enhanced image ---
// This function repeatedly checks the external API's task status until complete or timed out.
const pollForEnhancedImage = async (taskId, retries = 0) => {
    const MAX_RETRIES = 30; // Max number of times to check the external API
    const POLLING_INTERVAL_MS = 2500; // Time (in milliseconds) to wait between checks

    // Make a GET request to the external API to check the task status
    const result = await axios.get(
        `${EXTERNAL_BASE_URL}/api/tasks/visual/scale/${taskId}`,
        {
            headers: { 'X-API-KEY': EXTERNAL_API_KEY }, // API key is needed for status checks too
        }
    );

    // Check the 'state' property of the response data.
    // Based on techhk.aoscdn.com documentation, 'state: 4' typically means 'still processing'.
    if (result.data?.data?.state === 4) {
        console.log(`[Backend] Polling task ${taskId}: Still processing (attempt ${retries + 1}/${MAX_RETRIES})...`);

        // If max retries are reached, consider it a timeout and throw an error.
        if (retries >= MAX_RETRIES) {
            throw new Error(`Polling for task ${taskId} timed out. External API took too long to process.`);
        }

        // Wait for the specified interval before trying again.
        await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL_MS));
        // Recursively call itself to poll again
        return pollForEnhancedImage(taskId, retries + 1);
    }

    // If 'state' is not 4, assume processing is complete (or it failed immediately).
    // Validate that we received the actual enhanced image data.
    if (!result.data?.data || !result.data.data.image) {
        throw new Error(`Failed to retrieve enhanced image URL for task ${taskId}. Received data: ${JSON.stringify(result.data)}`);
    }

    console.log(`[Backend] Final enhanced image data received for task ${taskId}.`);
    return result.data.data; // Return the full data object, which should contain the 'image' URL
};


// --- BASIC SERVER HEALTH CHECK ROUTE ---
// You can access this in your browser: http://localhost:5000/
app.get('/', (req, res) => {
    res.status(200).send('Image Enhancer Backend Server is running and healthy!');
});

// --- START THE SERVER ---
// Listen for incoming requests on the specified port.
app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
    console.log(`Access backend root at: http://localhost:${PORT}`);
});