import config from "../config.js";
const middlewareMetricsInc = (req, res, next) => {
    config.fileserverHits++;
    next();
};
export default middlewareMetricsInc;
