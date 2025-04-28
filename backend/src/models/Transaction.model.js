import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
    },
    transactionProof: {
        type: String,
    },
    amount: {
        type: Number,
    },
    coin: {
        type: Number,
    },
    status: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
    }
}, {
    timestamps: true
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction;