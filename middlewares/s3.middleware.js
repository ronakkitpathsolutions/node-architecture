import multer from 'multer';
import multerS3 from 'multer-s3';
import s3 from '../config/s3.js';
import { ENV } from '../config/index.js';

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
        const originalName = file.originalname.replace(/\s+/g, '-'); // optional: replace spaces
        const fileName = `${timestamp}-${originalName}`;
        const fullPath = `${folder}/${fileName}`; // dynamic folder
        cb(null, fullPath);
      },
    }),
  });
};

export default getUploadMiddleware;
