import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
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
        unique: false,
        type: String,
        default: 'N/A',
        required: false
    },
    dateOfBirth: {
        type: Date,
    },
    country: {
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
});

const User = mongoose.model('User', UserSchema);

export default User