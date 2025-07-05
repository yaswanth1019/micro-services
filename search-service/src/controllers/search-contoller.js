const Search = require('../models/Search');
const logger = require('../utils/logger');


//*** Implement caching here for 2 to 5 minutes */

const searchPostController = async (req, res) => {
    logger.info('Search Endpoint hit...');
    try {
        const { query } = req.query

        const results = await Search.find(
            {
                $text: { $search: query }
            },
            {
                score: { $meta: 'textScore' }
            }
        )
            .sort({ score: { $meta: 'textScore' } })
            .limit(10);

        return res.json(results)

    } catch (error) {
        logger.error('Error while searching post', error);
        res.status(500).json({
            success: false,
            message: 'Error searching post'
        })
    }
}

module.exports = { searchPostController };