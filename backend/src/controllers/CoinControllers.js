import Coin from "../models/Coin.model.js";
import User from "../models/User.model.js";

const insert = async (req, res) => {
    const { price } = req.body;

    try {
        const response = await Coin.insertOne({ price });
        res.send({
            status: 'success',
            message: response
        })
    } catch (error) {
        res.send({
            status: 'error',
            message: error
        })
    }
}

const getCoin = async (req, res) => {
    try {
        const response = await Coin.find();
        res.send({
            success: true,
            data: response
        })
    } catch (error) {
        res.send({
            success: false,
            data: error
        })
    }
}

const updateCoin = async (req, res) => {
    try {
        const { id, updatedPrice } = req.body;

        if (!id || updatedPrice === undefined) {
            return res.status(400).json({ success: false, message: "ID and updatedPrice are required." });
        }

        const numericPrice = parseFloat(updatedPrice);

        const response = await Coin.updateOne({ _id: id }, {  price: numericPrice });

        if (response.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "Coin not found or price unchanged." });
        }

        res.status(200).json({ success: true, data: response });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const buyCoins = async (req, res) => {
    try {
        const { userId , amount } = req.body;
        
        const numericAmount = parseFloat(amount);
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const newCoinAmount = user.coin + numericAmount;

        const response = await User.updateOne({ _id: userId }, { coin: newCoinAmount });

        if (response.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "User not found or coin amount unchanged." });
        }

        res.status(200).json({ success: true, data: response });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const sellCoins = async (req, res) => {
    try {
        const { userId, amount } = req.body;

        if (!userId || amount === undefined) {
            return res.status(400).json({ success: false, message: "userId and amount are required." });
        }

        const numericAmount = parseFloat(amount);

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (user.coin < numericAmount) {
            return res.status(400).json({ success: false, message: "Insufficient coins." });
        }

        const newCoinAmount = user.coin - numericAmount;

        const response = await User.updateOne({ _id: userId }, { coin: newCoinAmount });

        if (response.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "User not found or coin amount unchanged." });
        }

        res.status(200).json({ success: true, data: response });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    insert,
    getCoin,
    updateCoin,
    buyCoins,
    sellCoins
}
