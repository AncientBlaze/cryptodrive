import express from "express";
import {
    insert,
    getCoin,
    updateCoin,
    buyCoins
} from '../controllers/CoinControllers.js'

const router = express.Router();

router.post('/insert', insert);
router.get('/get', getCoin);
router.put('/update', updateCoin);
router.post('/:id/buy', buyCoins);

export default router;