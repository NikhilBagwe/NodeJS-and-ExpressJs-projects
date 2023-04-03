// middleware to verify whether the token sent by user is valid or not for PRIVATE ROUTES
// A token is passsed in header or Auth section as Bearer token in Thunderclient

const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")

const validateToken = asyncHandler(async (req, res, next) => {
  let token
  let authHeader = req.headers.Authorization || req.headers.authorization

  // Extract the token
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1]
    // verify token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401)
        throw new Error("User isn not authorized")
      }
      // console.log(decoded)
      req.user = decoded.user // sending data back to display
      next()
    })

    if (!token) {
      res.status(401)
      throw new Error("User is not authorized or token is misssing")
    }
  }
})

module.exports = validateToken
