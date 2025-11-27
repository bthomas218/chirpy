const errorHandlingMiddleware = (err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong on our end" });
};
export default errorHandlingMiddleware;
