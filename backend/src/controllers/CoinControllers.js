import Coin from "../models/Coin.model.js";

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
        return res.status(400).json({
          success: false,
          message: "ID and updatedPrice are required."
        });
      }
  
      const numericPrice = parseFloat(updatedPrice);
  
      const update = await Coin.updateOne(
        { _id: id },
        {
          $set: { price: numericPrice },
          $push: {
            list: {
              price: numericPrice,
              date: new Date()
            }
          }
        }
      );
  
      if (update.modifiedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Coin not found or no changes made."
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Price updated and pushed to history list.",
        data: update
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  


export {
    insert,
    getCoin,
    updateCoin
}