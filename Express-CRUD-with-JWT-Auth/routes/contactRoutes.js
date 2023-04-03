const express = require("express")
const router = express.Router()
const {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController")
const validateToken = require("../middleware/validateTokenHandler")

// Simplification - 1 ===========================
/*
Below logic is put in controller.js file

router.route("/").get((req, res) => {
  //res.send("Get all contacts")
  res.status(200).json({ message: "Get all contacts" })
})
router.route("/").post((req, res) => {
  res.status(200).json({ message: "Create contact" })
})

router.route("/:id").put((req, res) => {
  res.status(200).json({ message: `Update contact for ${req.params.id}` })
})

router.route("/:id").delete((req, res) => {
  res.status(200).json({ message: `Delete contact for ${req.params.id}` })
})

// Get a particular contact
router.route("/:id").get((req, res) => {
  res.status(200).json({ message: `Get contact for ${req.params.id}` })
})
*/

// Simplification - 2 ==============================

/*Since below 2 routes are similar, we can even simplify them more

router.route("/").get(getContacts)

router.route("/").post(createContact)

Similarly we can do same for '/:id' routes

router.route("/:id").put(updateContact)

router.route("/:id").delete(deleteContact)

// Get a particular contact
router.route("/:id").get(getContact)
*/

// validate all routes
router.use(validateToken)
router.route("/").get(getContacts).post(createContact)

router.route("/:id").put(updateContact).delete(deleteContact).get(getContact)

module.exports = router
