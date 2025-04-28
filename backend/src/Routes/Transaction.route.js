import express from "express";
import { insert, getAllData, updateStatus, buyCoinsTransactionProof } from "../controllers/Transaction.controller.js";

const route = express.Router();

route.post('/insert', insert);
route.get('/get', getAllData);
route.put('/updateStatus', updateStatus);
route.post('/:id/buy', buyCoinsTransactionProof);

export default route