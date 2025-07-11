import sharp from 'sharp';

export const aggressiveCompressImage = async (buffer, options = {}) => {
  const {
    targetReduction = 70, // Target percentage reduction
    maxWidth = 800,
    maxHeight = 600,
  } = options;

  try {
    const originalSize = buffer.length;
    let quality = 80; // Start with very low quality
    let processedBuffer;
    let attempts = 0;
    const maxAttempts = 10;

    // Get original dimensions first
    const originalInfo = await sharp(buffer).metadata();

    // Iteratively adjust quality to achieve target reduction
    while (attempts < maxAttempts) {
      let sharpInstance = sharp(buffer);

      // Note: Metadata removal will be handled by Sharp automatically during format conversion

      // Calculate aggressive resize dimensions
      let targetWidth = Math.min(
        maxWidth,
        Math.floor(originalInfo.width * 0.7)
      );
      let targetHeight = Math.min(
        maxHeight,
        Math.floor(originalInfo.height * 0.7)
      );

      // Ensure minimum dimensions
      targetWidth = Math.max(targetWidth, 300);
      targetHeight = Math.max(targetHeight, 200);

      sharpInstance = sharpInstance.resize(targetWidth, targetHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });

      processedBuffer = await sharpInstance
        .webp({
          quality,
          effort: 6,
          lossless: false,
          nearLossless: false,
          smartSubsample: true,
          preset: 'photo',
        })
        .toBuffer();

      const currentReduction =
        ((originalSize - processedBuffer.length) / originalSize) * 100;

      console.log(
        `Attempt ${attempts + 1}: Quality ${quality}, Reduction: ${currentReduction.toFixed(1)}%`
      );

      if (currentReduction >= targetReduction) {
        console.log(
          `✅ Target reduction achieved: ${currentReduction.toFixed(1)}%`
        );
        break;
      }

      // Adjust quality for next attempt
      if (currentReduction < targetReduction) {
        quality = Math.max(10, quality - 5); // Decrease quality more aggressively
      } else {
        quality = Math.min(80, quality + 5);
      }

      attempts++;
    }

    return processedBuffer;
  } catch (error) {
    throw new Error(`Aggressive compression failed: ${error.message}`);
  }
};

export const isImage = mimetype => {
  return mimetype.startsWith('image/');
};

export const getFileSizeInMB = buffer => {
  return buffer.length / (1024 * 1024);
};

export const fastProcessImage = async (buffer, options = {}) => {
  const { quality = 85, maxWidth = 1920, maxHeight = 1080 } = options;

  try {
    const sharpInstance = sharp(buffer);

    // Get metadata and process in a single pipeline for speed
    const processedBuffer = await sharpInstance
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality,
        effort: 2, // Fast processing with minimal effort
        lossless: false,
        smartSubsample: false, // Disable for speed
      })
      .toBuffer();

    return processedBuffer;
  } catch (error) {
    throw new Error(`Fast image processing failed: ${error.message}`);
  }
};
