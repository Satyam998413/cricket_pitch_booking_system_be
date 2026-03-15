const Replicate = require("replicate");

/**
 * Replicate client
 */
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});


/**
 * Generate image using Replicate (SDXL Lightning)
 */
const createImageWithReplicate = async (prompt) => {
  const input = {
    prompt:prompt,
    aspect_ratio: "16:9",
    output_format: "jpg",
    safety_filter_level: "block_medium_and_above",
  };

  const output = await replicate.run("google/imagen-4", { input });

  // To access the file URL:
  console.log(output.url().href); //=> "http://example.com"
  // Replicate returns an array of image URLs
  return output.url().href;
};


/**
 * Main image generator
 * Switch provider here
 */
const createImage = async (prompt, provider = "replicate") => {
  try {
    console.log("---provider---------", prompt, provider);
      return await createImageWithReplicate(prompt);
   
  } catch (error) {
    console.error("Image generation failed:", error.message);
    throw error;
  }
};

module.exports = {
  createImage,
  createImageWithReplicate,
};
