import express from "express";
import {
  insert,
  getAdmin,
  updateAdmin,
} from "../controllers/admin.controller.js";
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
route.put("/update", updateAdmin);

export default route;
