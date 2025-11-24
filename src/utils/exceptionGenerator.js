const generateException = (type='Error', message='Something went wrong', statusCode=500) => {
     const errorClasses = {
        Error,
        TypeError,
        RangeError,
        ReferenceError,
        SyntaxError,
        EvalError,
        URIError
    };

    const ErrorClass = errorClasses[type] || Error;

    const error = new ErrorClass(message);
    error.statusCode = statusCode;
    
    throw error;
}

export default generateException;