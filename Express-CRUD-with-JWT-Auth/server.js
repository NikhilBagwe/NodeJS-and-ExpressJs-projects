const express = require("express")
const connectDb = require("./config/dbConnection")
const errorHandler = require("./middleware/errorHandler")
const dotenv = require("dotenv").config()

connectDb() //connect DB
const app = express()
const port = process.env.PORT

// Body parser middleware - to parse data received from client to server side
app.use(express.json())

// adding middleware for routing
app.use("/api/contacts", require("./routes/contactRoutes"))
app.use("/api/users", require("./routes/userRoutes"))

app.use(errorHandler)

app.listen(port, () => console.log(`Server running on port ${port}`))
