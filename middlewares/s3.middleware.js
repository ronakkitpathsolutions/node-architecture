import multer from 'multer';
import multerS3 from 'multer-s3';
import { Upload } from '@aws-sdk/lib-storage';
import s3 from '../config/s3.js';
import { ENV } from '../config/index.js';
import {
  isImage,
  getFileSizeInMB,
  aggressiveCompressImage,
  fastProcessImage,
} from '../utils/imageProcessor.js';

// Simple upload middleware (original functionality)
const getUploadMiddleware = (folder = '') => {
  return multer({
    storage: multerS3({
      s3,
      bucket: ENV.S3_BUCKET_NAME,
      acl: 'public-read',
      metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        const timestamp = Date.now();
        const originalName = file.originalname.replace(/\s+/g, '-');
        const fileName = `${timestamp}-${originalName}`;
        const fullPath = `${folder}/${fileName}`;
        cb(null, fullPath);
      },
    }),
  });
};

// Enhanced upload middleware with actual image compression
const getCompressedUploadMiddleware = (folder = '', options = {}) => {
  const {
    imageQuality = 80, // Aggressive compression for 80% reduction
    maxWidth = 1920,
    maxHeight = 1080,
    maxFileSize = 10 * 1024 * 1024, // 10MB default
  } = options;

  const storage = multer.memoryStorage();

  const upload = multer({
    storage,
    limits: {
      fileSize: maxFileSize,
    },
    fileFilter: (req, file, cb) => {
      cb(null, true);
    },
  });

  return {
    single: fieldName => {
      return (req, res, next) => {
        upload.single(fieldName)(req, res, async err => {
          if (err) {
            return next(err);
          }

          if (!req.file) {
            return next();
          }

          try {
            let fileBuffer = req.file.buffer;
            let fileName = req.file.originalname;
            let contentType = req.file.mimetype;

            // Process image if it's an image file
            if (isImage(req.file.mimetype)) {
              console.log(`Processing image: ${fileName}`);
              console.log(
                `Original size: ${getFileSizeInMB(fileBuffer).toFixed(2)} MB`
              );

              // Use aggressive compression if specified, otherwise use standard
              if (options.useAggressiveCompression) {
                fileBuffer = await aggressiveCompressImage(fileBuffer, {
                  targetReduction: 70,
                  maxWidth,
                  maxHeight,
                });
              } else {
                fileBuffer = await fastProcessImage(fileBuffer, {
                  quality: imageQuality,
                  maxWidth,
                  maxHeight,
                });
              }

              // Update filename and content type
              const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
              const cleanName = nameWithoutExt.replace(/\s+/g, '-');
              fileName = `${cleanName}.webp`;
              contentType = 'image/webp';

              console.log(
                `Processed size: ${getFileSizeInMB(fileBuffer).toFixed(2)} MB`
              );
              console.log(
                `Size reduction: ${(((req.file.buffer.length - fileBuffer.length) / req.file.buffer.length) * 100).toFixed(1)}%`
              );
            }

            // Generate unique filename
            const timestamp = Date.now();
            const uniqueFileName = `${timestamp}-${fileName}`;
            const key = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;

            // Upload to S3 using Upload class for better handling
            const uploadParams = {
              Bucket: ENV.S3_BUCKET_NAME,
              Key: key,
              Body: fileBuffer,
              ContentType: contentType,
              ACL: 'public-read',
              Metadata: {
                originalName: req.file.originalname,
                uploadedAt: new Date().toISOString(),
              },
            };

            const s3Upload = new Upload({
              client: s3,
              params: uploadParams,
            });

            const result = await s3Upload.done();

            // Add S3 info to request object (compatible with multer-s3 format)
            req.file.location = result.Location;
            req.file.key = result.Key;
            req.file.bucket = result.Bucket;
            req.file.etag = result.ETag;

            next();
          } catch (error) {
            console.error('S3 upload error:', error);
            next(error);
          }
        });
      };
    },
  };
};

// Specialized middleware for category images with aggressive compression
const getCategoryImageUploadMiddleware = (folder = 'categories') => {
  return getCompressedUploadMiddleware(folder, {
    imageQuality: 80, // Very aggressive compression for 70%+ reduction
    maxWidth: 600, // Smaller max width for category images
    maxHeight: 450, // Smaller max height for category images
    maxFileSize: 15 * 1024 * 1024, // 15MB limit
    useAggressiveCompression: false,
  });
};

export default getUploadMiddleware;
export { getCompressedUploadMiddleware, getCategoryImageUploadMiddleware };
