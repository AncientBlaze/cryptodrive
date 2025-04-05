import express from "express";

import {
    validateKyc,
    insertUser,
    updateCoin,
    getloggedUser,
    getUserByName,
    login,
    register,
    updateAuthentication,
    changePass
} from "../controllers/UserControllers.js";

const route = express.Router();

route.put('/insert', insertUser);
route.put('/:id/kyc', validateKyc);
route.put('/updateCoin', updateCoin);
route.get('/get/:id', getloggedUser);
route.post('/getByName', getUserByName);
route.post('/login', login);
route.post("/register", register);
route.put('/:id/updateauth', updateAuthentication);
route.put("/:id/changePassword", changePass);

export default route;


