//middleware de errores
const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
    logger.error(err);
    res.status(500).json({
        error: err.message,
    });
};
module.exports = errorHandler;
