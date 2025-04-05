import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
const insertUser = async (req, res) => {
  const { name, email, password, phone, dateOfBirth, country, address, coin, image } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and password are required",
    });
  }

  const user = new User({
    name,
    email,
    password,
    phone,
    dateOfBirth,
    country,
    address,
    coin,
    image,
  });

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;

    const savedUser = await user.save();
    res.status(201).json({
      success: true,
      data: {
        id: savedUser._id,
        email: savedUser.email,
        name: savedUser.name,
      },
    });
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
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

const getloggedUser = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const response = await User.find({ _id: id });
    res.send({
      success: true,
      data: response,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error,
    });
  };
}

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
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        email: user.email,
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;


    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username or email already exists"
      });
    }


    const hashedPassword = await bcryptjs.hash(password, 10);


    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();


    res.status(201).json({
      success: true,
      data: {
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const updateAuthentication = async (req, res) => {
  const { id } = req.params;
  const { authorized } = req.body;

  try {
    const response = await User.updateOne({ _id: id }, { authorized: authorized });
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

const validateKyc = async (req, res) => {
  const { id } = req.params;
  const { file, fullname, phone, dateOfBirth, country, address, kyc } = req.body;

  try {
    const response = await User.updateOne({ _id: id }, { file, fullname, phone, dateOfBirth, country, address, kyc });
    res.send({
      status: true,
      data: response
    });
  } catch (error) {
    res.send({
      status: false,
      error: error
    });
  }
};

const changePass = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Both old password and new password are required"
    });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isPasswordValid = await bcryptjs.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect"
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from old password"
      });
    }
    const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
    await User.updateOne({ _id: id }, { $set: { password: hashedNewPassword } });
    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};


export { insertUser, updateCoin, getloggedUser, getUserByName, login, register, updateAuthentication, validateKyc, changePass };
