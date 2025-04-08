import express from "express";
import {
  insert,
  getAdmin,
  getAdminByName,
  updateAdmin,
  getAdminByID,
  getAdminByEmailPassword
} from "../../../newBackend/Backend/src/controllers/admin.controller.js";
import multer from "multer";
import path from "path";

const route = express.Router();

const storage = multer.diskStorage({
  destination: "../../public/admin/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

route.post('/insert', upload.single('image'), insert);
route.get("/get", getAdmin);
route.post('/getAdminByName', getAdminByName);
route.put("/update", updateAdmin);
route.post('/getAdminByID', getAdminByID)
route.post('/getAdminByEmailPassword', getAdminByEmailPassword)

export default route;
