import express from "express";


import {
    validateKyc,
    insertUser,
    updateCoin,
    getloggedUser,
    getUserByName,
    login,
    register,
    updateAuthentication
} from "../controllers/UserControllers.js";

const route = express.Router();

route.put('/insert', insertUser);
route.put('/:id/kyc', validateKyc);
route.put('/updateCoin', updateCoin);
route.get('/get/:id', getloggedUser);
route.post('/getByName', getUserByName);
route.post('/login', login);
route.post("/register", register);
route.put('/updateAuthentication', updateAuthentication);

export default route;
