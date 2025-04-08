import { console } from "inspector";
import Admin from "../models/admin.model.js";

const insert = async (req, res) => {
  const validEmails = {
    email1: 'example1@gmail.com',
    email2: 'example2@gmail.com',
    email3: 'example3@gmail.com',
  }

  const { name, email, password, image } = req.body;
  const admin = {
    name,
    email,
    password,
    image,
  };

  if(email !== validEmails.email1 && email !== validEmails.email2 && email !== validEmails.email3) {
    return res.send({ success: false, message: "Email not valid" });
  }

  try {
    const response = await Admin.insertOne(admin);

    return res.send({ success: true, data: response });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

const getAdmin = async (req, res) => {
  try {
    const response = await Admin.find();

    if (response) {
      return res.send({ success: true, data: response });
    } else {
      return res.send({ success: false, data: response });
    }
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

const getAdminByName = async (req, res) => {
  const { email, name } = req.body;

  try {
    const response = await Admin.find({ email, name });

    if(response) {
      return res.send({ success: true, data: response });
    } else {
      return res.send({ success: false, data: response });
    }
  } catch (error) {
    return res.send({ success: false, message: error.message });

  }
}

const updateAdmin = async (req, res) => {
  const { id, password } = req.body;

  try {
    const response = await Admin.updateOne(
      { _id: id },
      { $set: { password } }
    );

    if (response) {
      return res.send({ success: true, data: response });
    } else {
      return res.send({ success: false, data: response });
    }
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

const getAdminByID = async (req, res) => {
  const { id } = req.body;

  try {
    const response = await Admin.findById({_id: id});

    if (response) {
      return res.send({ success: true, data: response });
    } else {
      return res.send({ success: false, data: response });
    }
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
}

const getAdminByEmailPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await Admin.find({ email, password });

    if(response) {
      return res.send({ success: true, data: response });
    } else {
      return res.send({ success: false, data: response });
    }
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
}

export { 
  insert, getAdmin, getAdminByName, updateAdmin, getAdminByID, getAdminByEmailPassword
};
