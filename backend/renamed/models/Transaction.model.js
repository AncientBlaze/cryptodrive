import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true
    },
    transactionProof: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    coin: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction;