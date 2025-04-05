import Transaction from "../models/Transaction.model.js";

const insert = async (req, res) => {
  const { buyer, type, transactionProof, amount, coin, image } = req.body;

  const transaction = {
    buyer,
    type,
    transactionProof,
    amount,
    coin,
    image,
  };

  try {
    const response = await Transaction.insertOne(transaction);

    return res.send({
      status: true,
      data: response,
    });
  } catch (error) {
    return res.send({
      status: false,
      error: error,
    });
  }
};

const getAllData = async (req, res) => {
  try {
    const response = await Transaction.find();

    if (response) {
      return res.send({
        status: true,
        data: response,
      });
    } else {
      return res.send({
        status: false,
        data: "response not found",
      });
    }
  } catch (error) {
    return res.send({
      status: false,
      error: error,
    });
  }
};

const updateStatus = async (req, res) => {
  const { id } = req.body;

  try {
    const response = await Transaction.updateOne(
      { _id: id },
      { $set: { status: true } }
    );

    if (response) {
      return res.send({
        status: true,
        data: response,
      });
    } else {
      return res.send({
        status: false,
        data: "response not found",
      });
    }
  } catch (error) {
    return res.send({
      status: false,
      error: error,
    });
  }
};

export { insert, getAllData, updateStatus };
