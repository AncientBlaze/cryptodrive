import User from "../models/User.model.js";

const insertUser = async (req, res) => {
  const { name, email, password, phone, dateOfBirth, address, coin } = req.body;
  const user = {
    name,
    email,
    password,
    phone,
    dateOfBirth,
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
  const { name } = req.body;

  try {
    const response = await User.find({ name });
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
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' }); // Simple login success message

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const registration = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
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

export { insertUser, updateCoin, getUser, getUserByName, login, registration, updateAuthentication };

