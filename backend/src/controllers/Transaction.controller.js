import Transaction from "../models/Transaction.model.js";
import User from "../models/User.model.js";

// ✅ INSERT TRANSACTION
const insert = async (req, res) => {
  const { buyer, type, transactionProof, amount, coin, image } = req.body;

  try {
    const transaction = await Transaction.create({
      buyer,
      type,
      transactionProof,
      amount,
      coin,
      image,
    });

    return res.status(201).send({
      status: true,
      data: transaction,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

// ✅ GET ALL TRANSACTIONS
const getAllData = async (req, res) => {
  try {
    const response = await Transaction.find().populate("buyer");

    if (response && response.length > 0) {
      return res.status(200).send({
        status: true,
        data: response,
      });
    } else {
      return res.status(404).send({
        status: false,
        message: "No transactions found",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

// ✅ UPDATE STATUS
const updateStatus = async (req, res) => {
  const { id } = req.body;

  try {
    const response = await Transaction.findByIdAndUpdate(
      id,
      { status: true },
      { new: true }
    );

    if (response) {
      return res.status(200).send({
        status: true,
        data: response,
      });
    } else {
      return res.status(404).send({
        status: false,
        message: "Transaction not found",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const buyCoinsTransactionProof = async (req, res) => {
  const { userId, amount, coin, image } = req.body;
  try {
    const userdata = await User.findById({ _id: userId });
    console.log(userdata);
    
    if (!userdata) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }

    const response = await Transaction.create({
      buyer: userId,
      type: "buy",
      amount: amount,
      coin: coin,
      image: image,
    });

    return res.status(201).send({
      status: true,
      data: response,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};


export { insert, getAllData, updateStatus, buyCoinsTransactionProof };
