import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    fullName: {
        type: String
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
        type: String,
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
        type: String,
        default: 'Not Authorized'
    },
    photo: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },
    file: {
        type: String
    },
});

const User = mongoose.model('User', UserSchema);

export default User;