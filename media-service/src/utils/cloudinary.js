const cloudinary = require('cloudinary').v2
const logger = require('../utils/logger');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadMediaToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto'
            },
            (error, result) => {
                if (error) {
                    logger.error('Error while uploading media to cloudinary', error);
                    reject(error)
                } else {
                    resolve(result);
                }
            }
        )

        uploadStream.end(file.buffer);
    });
};

const deleteMediaFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        logger.info('Media deleted successfully from cloudinary', publicId);
        return result;
    } catch (error) {
        logger.error('Error deleting media from cloudinary', error);
        throw error
    }
}

module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary };