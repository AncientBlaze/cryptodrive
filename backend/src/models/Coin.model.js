import mongoose from "mongoose";

const CoinSchema = new mongoose.Schema({
    price: {
        type: Number,
        default: 10
    }
}, {timestamps: true});

const Coin = mongoose.model('Coin', CoinSchema);

export default Coin;