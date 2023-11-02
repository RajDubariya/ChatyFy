const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkey);
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (user) {
      return res.status(400).json("user with this email already exist");
    }
    if (!name || !email || !password) {
      return res.status(400).json("all field are required");
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json("Enter valid Email");
    }
    // if (!validator.isStrongPassword(password)) {
    //   return res.status(400).json("password must be strong");
    // }

    user = new userModel({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = createToken(user._id);

    res.status(200).json({
      userId: user._id,
      name: user.name,
      email: user.email,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json("invalid email or password... !!");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json("invalid password... !!");
    }

    const token = createToken(user._id);

    res.status(200).json({
      userId: user._id,
      name: user.name,
      email: user.email,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
module.exports = { registerUser, loginUser, findUser, findAllUsers };
