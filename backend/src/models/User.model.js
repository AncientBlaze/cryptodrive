import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        unique: true
    },
    dateOfBirth: {
        type: String,
    },
    address: {
        type: String,
    },
    coin: {
        type: Number,
        default: 0
    },
    authorized: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const user = mongoose.model('User', userSchema);

export default user;