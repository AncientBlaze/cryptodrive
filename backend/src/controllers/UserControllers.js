import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
const insertUser = async (req, res) => {
  const { name, email, password, phone, dateOfBirth, country, address, coin } = req.body;
  const user = {
    name,
    email,
    password,
    phone,
    dateOfBirth,
    country,
    address,
    coin,
  };

  try {
    const response = await User.insertOne(user);
    res.send({
      success: true,
      data: response,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error,
    });
  }
};

const updateCoin = async (req, res) => {
  const { id, coin } = req.body;

  try {
    const response = await User.updateOne(
      { _id: id },
      { $inc: { coin: coin } }
    );
    res.send({
      success: true,
      data: response,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const response = await User.find();
    res.send({
      success: true,
      data: response,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error,
    });
  }
};

const getUserByName = async (req, res) => {
  const { username } = req.body;

  try {
    const response = await User.find({ username });
    res.send({
      success: true,
      data: response,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error,
    });
  }
};


const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json(
        { success: false, message: "User not found" }
      )
    }
    if (user.password !== password) {
      return res
        .json({ success: false, message: "Invalid password" });
    }
    if (user.authorized == false) {
      return res.json({
        status: false,
        message: "Unauthorized User"
      })
    }
    if (user.email == email && user.password == password) {
      return res.json({
        success: true,
        logIn: "Success",
        data: user
      })
    }
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

const register = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already in use." });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    const response = await user.save();
    res.status(201).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAuthentication = async (req, res) => {
  const { id } = req.body;

  try {
    const response = await User.updateOne({ _id: id }, { authorized: true });
    res.send({
      status: true,
      data: response
    })
  } catch (error) {
    res.send({
      status: false,
      error: error
    })
  }
}

export { insertUser, updateCoin, getUser, getUserByName, login, register, updateAuthentication };

