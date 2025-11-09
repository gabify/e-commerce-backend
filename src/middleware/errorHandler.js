export const errorHandler = async (err, req, res, next) =>{
    console.log(err); //logs error

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
        success: false, 
        message
    });
}