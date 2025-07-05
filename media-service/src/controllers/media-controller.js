const { uploadMediaToCloudinary } = require('../utils/cloudinary');
const logger = require('../utils/logger');
const Media = require('../models/Media');

const uploadMedia = async (req, res) => {
    logger.info('Starting media upload....')
    try {
        if (!req.file) {
            logger.error('No file found . please try adding a file and try!');
            return res.status(400).json({
                success: false,
                message: 'No file found . please try adding a file and try!'
            })
        }

        const { originalname, mimetype, buffer } = req.file;
        const userId = req.user.userId;

        logger.info(`File details : name = ${originalname} , type : ${mimetype}`);
        logger.info('Uploading to cloudinary starting...');

        const cloudinaryUploadResult = await uploadMediaToCloudinary(req.file)
        logger.info(`Cloudinary upload successfully!! . publicId : ${cloudinaryUploadResult.public_id}`);

        const newlyCreateMedia = new Media({
            publicId: cloudinaryUploadResult.public_id,
            originalName: originalname,
            mimeType: mimetype,
            url: cloudinaryUploadResult.secure_url,
            userId
        })

        await newlyCreateMedia.save();

        return res.status(201).json({
            success: true,
            mediaId: newlyCreateMedia._id,
            url: newlyCreateMedia.url,
            message: 'Media upload successfully'
        })
    } catch (error) {
        logger.error('Error while uploding');
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getAllMedia = async (req, res) => {
    try {
        const results = await Media.find({});
        return res.json(results);
    } catch (error) {
        logger.error('Error while fetching all media');
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { uploadMedia, getAllMedia };