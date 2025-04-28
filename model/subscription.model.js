import mongoose from "mongoose";

// A Schema is like a blueprint, It defines the structure of your documents inside a MongoDB collection.
// A Model is like the building based on the blueprint. (Functions and tools to actually work with the data in MongoDB)
const subscriptionSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 2,
        maxlength: 100,
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        minLength: [0, 'Price must be greater than 0'],     
    },
    currency: {
        type: 'String',
        enum: ['USD', 'EUR', 'GBP'],
        default: 'USD',
    },
    frequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly', 'yearly']
    },
    category: {
        type: String,
        enum: ['Sports', 'News', 'Entertainment', 'Lifestyle', 'Technology', 'Finance', 'Politics', 'Other'],
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Canceled', 'Expired'],
        default: 'Active',
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(), // validate that the start date must be in the past
            message: 'Start date must be a past date',
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function(value) {
                return value > this.startDate},
            message: 'Renewal date must be after the start date',
        }
    },
    user: {
        tyep: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }
}, {timestamps: true});  // {timestamps: true} means createdAt and updatedAt will be automatically saved.


// Befor saving Subscription, Auto calculate renewal date if missing. so we remove this part --> required: true
subscriptionSchema.pre('save', function(next) {
    if(!this.renewalDate){
        const renewalperiods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        // start: Jan 1, monthly --> 30, renewal date: jan 1 + 30 = jan 31
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalperiods[this.frequency]);
    }

    // Auto update the status if renewal date has passed
    if(this.renewalDate < new Date()){
        this.status = 'Expired';
    }
    next();
});

// This creates the Subscription model.You can now use it to create, update, delete subscriptions in MongoDB!
const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;

