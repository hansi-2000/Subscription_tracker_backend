import User from "../model/user.model.js";

// Retrieves all users from the database and returns them as JSON.
export const getUsers = async(req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({success:true, data: users});

    } catch(error) {
        next(error);
    }
}

// Fetches a single user by ID, excluding the password field.
export const getUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({success:true, data: user});
        
    } catch(error) {
        next(error);
    }
}   