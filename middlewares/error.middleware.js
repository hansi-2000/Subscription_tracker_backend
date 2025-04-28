// this sends a clear response back to the user instead of crashing the app

// Imagine you have a notebook (err).
// You photocopy all its pages (...err) into a new notebook (error),
// but then rewrite the title page (error.message = err.message)
// just to be 100% sure it's correct.

const errorMiddleware = (err, req, res, next) => {
    try {
        // This creates a shallow copy of the err object. So we can safely modify error without accidentally changing the original err object

        // const err = { name: 'ValidationError', statusCode: 400, message: 'Invalid input' };
        // const error = { ...err };
        // Now 'error' is a copy. If we modify 'error', it won't change 'err' accidentally.
        
        let error = {... err};  // Using the spread operator ...err, it copies all the properties of err into a new object error. 
        error.message = err.message;

        // Mongoose bad objectID
        if(err.name === 'CastErro'){
            const message = 'Resources not found';
            error = new Error(message);
            error.statusCode = 404;
        }

        // Mongoose duplicate key
        if (err.code === 11000) {
            const message = 'Duplicate field value entered';
            error = new Error(message);
            error.statusCode = 400;
        }

        // Mongoose validation error
        // err.errors is an object where each key is a field name (name, email, etc.). You extract the error messages from each field using
            // Object.values(err.errors) ➔ gets all field error objects.
            // .map(val => val.message) ➔ takes only their .message property.
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message).join(', ');
            error = new Error(message);
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({success:false, error:error.message || 'Server error'});

        console.error(err);
    } catch(error) {
        next(error);
    }
};

export default errorMiddleware;