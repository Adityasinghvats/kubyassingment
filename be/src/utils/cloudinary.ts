import { v2 as cld } from "cloudinary";
import fs from "fs/promises";
import { configDotenv } from "dotenv";
import { logger } from "./logger";
configDotenv();

cld.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadResource = async (localfilepath: string) => {
    try {
        if (!localfilepath) return null;
        const res = await cld.uploader.upload(
            localfilepath,
            { resource_type: "auto" }
        )
        logger.info(`Uploaded file to Cloudinary: ${res.secure_url}`);
        return res;
    } catch (error) {
        logger.error("Error uploading file to Cloudinary:", error);
        return null;
    } finally {
        try {
            await fs.unlink(localfilepath);
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
                logger.error("Error deleting local file after upload:", error);
            }
        }
    }
}

const deleteResource = async (publicId: string) => {
    try {
        const res = await cld.uploader.destroy(publicId);
        logger.info(`Deleted file from Cloudinary: ${publicId}`);
    } catch (error) {
        logger.error("Error deleting file from Cloudinary:", error);
        return null;
    }
}

export {
    uploadResource,
    deleteResource
}