const errorHandlingMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode ?? 500;
    if (statusCode === 500) {
        console.error(err.message);
    }
    res.status(statusCode).json({
        error: statusCode === 500 ? "Something went wrong on our end" : err.message,
    });
};
export default errorHandlingMiddleware;
