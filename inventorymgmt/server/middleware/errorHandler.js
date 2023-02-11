const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    return res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });


};

module.exports = errorHandler;

// const errorHandler = (err, req, res, next) => {
//     let statusCode = 500;
//     let message = "An unknown error occurred.";

//     if (err.name === "ValidationError") {
//         statusCode = 400;
//         message = "Validation failed.";
//     } else if (err.name === "MongoError" && err.code === 11000) {
//         statusCode = 409;
//         message = "A unique constraint was violated.";
//     } else if (err.name === "CastError") {
//         statusCode = 400;
//         message = "The request could not be processed.";
//     } else if (err.name === "UnauthorizedError") {
//         statusCode = 401;
//         message = "Unauthorized access.";
//     }

//     return res.status(statusCode).json({
//         message,
//         stack: process.env.NODE_ENV === "development" ? err.stack : null,
//     });
// };

// module.exports = errorHandler;
