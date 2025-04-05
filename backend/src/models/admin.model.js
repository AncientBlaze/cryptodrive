import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    name: {
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
    image: {
        type: String
    }
}, {
    timestamps: true
});

const Admin = mongoose.model('Admin', AdminSchema);

export default Admin;