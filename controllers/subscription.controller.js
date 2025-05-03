import Subscription from '../model/subscription.model.js'

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });
        res.status(201).json({success: true, data: subscription});

    } catch(e) {
        next(e);
    }
}


export const getUserSubscriptions = async (req, res, next) => {
    try {
        // check whether user is the same as the person in the token (whether he is the owner)
        if(req.user.id !== req.params.id){
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error; 
        }

        const subscriptions = await Subscription.find({user: req.params.id});

        res.status(200).json({success: true, data: subscriptions});

    } catch(e){
        next(e);

    }
}