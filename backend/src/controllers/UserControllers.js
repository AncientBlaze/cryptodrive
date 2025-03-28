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

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username or email already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    // Save user
    const savedUser = await newUser.save();

    // Return response without sensitive data
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
const validateKyc = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, phone, dateOfBirth, country, address } = req.body;
  try {
    const response = await User.updateOne({ _id: id }, { name, email, password, phone, dateOfBirth, country, address });
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

export { insertUser, updateCoin, getloggedUser, getUserByName, login, register, updateAuthentication, validateKyc };
