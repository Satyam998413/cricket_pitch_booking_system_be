const Replicate = require("replicate");

/**
 * Replicate client
 */
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

/**
 * Replicate Video (Stable Video Diffusion)
 * Image → Video
 */
const createVideoWithReplicate = async (imageUrl,prompt) => {
  const input = {
    prompt: prompt,
    duration: 10,
    first_frame_image: imageUrl
};

const output = await replicate.run("minimax/video-01", { input });

// To access the file URL:
console.log(output.url());

  return output?.[0];
};
/**
 * Main video generator
 */
const createVideo = async ({ imageUrl, prompt, provider = "replicate" }) => {
  try {

    // default → Replicate
    return await createVideoWithReplicate(imageUrl,prompt);
  } catch (error) {
    console.error(
      "Video generation failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = {
  createVideo,
  createVideoWithReplicate
};
