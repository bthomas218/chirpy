const errorHandlingMiddleware = (err, req, res, next) => {
    if (err.statusCode === 500) {
        console.error(err.message);
    }
    res.status(err.statusCode).json({
        error: err.statusCode === 500 ? "Something went wrong on our end" : err.message,
    });
};
export default errorHandlingMiddleware;
