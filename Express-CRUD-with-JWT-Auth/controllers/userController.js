const asyncHandler = require("express-async-handler")

// used to hash password
const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
const { use } = require("../routes/userRoutes")

// @desc Register a user
// @route POST /api/users/register
// @access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    res.status(400)
    throw new Error("All fields are mandatory")
  }

  // check if user is already available & throw error
  const userAvailable = await User.findOne({ email })
  if (userAvailable) {
    res.status(400)
    throw new Error("user already registered")
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create a new user and store it
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({ _id: user.id, email: user.email })
  } else {
    res.status(400)
    throw new Error("User data is not valid")
  }

  res.json({ message: "Register the user" })
})

// @desc Login user
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
  // when user tries to login, send its email & password
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400)
    throw new Error("All fields are mandatory")
  }

  // Check if user is already present in  DB
  const user = await User.findOne({ email })

  // compare password entered by user with hashed password stored in DB
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    )
    //provide an access token in return
    res.status(200).json({ accessToken })
  } else {
    res.status(401)
    throw new Error("Email or password is not valid")
  }
  //res.json({ message: "Login user" })
})

// @desc current user info
// @route POST /api/users/current
// @access private
const currentUser = asyncHandler(async (req, res) => {
  // res.json({ message: "Current user information" })
  res.json(req.user)
})

module.exports = { registerUser, loginUser, currentUser }
