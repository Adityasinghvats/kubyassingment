import multer from "multer";
import { ApiError } from "../utils/apiError";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
})

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError(400, 'Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

export { upload };