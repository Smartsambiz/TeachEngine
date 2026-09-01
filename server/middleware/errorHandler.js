const errorHandler = (err, req, res, next)=>{
    console.log(err.stack);

    const statusCode = err.status || 500;

    res.status(statusCode).json({
        error: {
            message: err.message || "Internal server error",
            status: statusCode
        }
    })
};

module.exports = errorHandler