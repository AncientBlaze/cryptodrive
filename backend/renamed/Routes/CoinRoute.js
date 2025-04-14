import express from "express";
import {
    insert,
    getCoin,
    updateCoin
} from '../controllers/CoinControllers.js'

const router = express.Router();

router.post('/insert', insert);
router.get('/get', getCoin);
router.put('/update', updateCoin);

export default router