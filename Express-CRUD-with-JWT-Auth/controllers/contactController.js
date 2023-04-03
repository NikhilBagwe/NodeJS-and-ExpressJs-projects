/* when we use async we need to use try catch to catch error in each function. But there is a better way. 
We use express-async-handler which is a middleware that will handle our exceptions inside the async express routes and then pass them to express event handler  */
const asyncHandler = require("express-async-handler")
const Contact = require("../models/contactModel")

// controller file = Contains the logic for request response and DB connection

// @desc Get all contacts
// @route GET /api/contacts
// @access private
const getContacts = asyncHandler(async (req, res) => {
  // res.status(200).json({ message: "Get all contacts" })
  const contacts = await Contact.find({ user_id: req.user.id })
  res.status(200).json(contacts)
})

// @desc create new contact
// @route POST /api/contacts
// @access private
const createContact = asyncHandler(async (req, res) => {
  console.log(req.body)
  const { name, email, phone } = req.body

  // Error handling in case user passes empty body {} or incomplete data
  if (!name || !email || !phone) {
    res.status(400)
    throw new Error("All fields are mandatory")
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  })
  res.status(201).json(contact)
  // res.status(201).json({ message: "Create new contact" })
})

// @desc get individual contact
// @route GET /api/contacts/:id
// @access private
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)
  if (!contact) {
    res.status(404)
    throw new Error("Contact not found")
  }
  res.status(200).json(contact)
  //res.status(200).json({ message: `Get contact for ${req.params.id}` })
})

// @desc update a contact
// @route PUT /api/contacts/:id
// @access private
const updateContact = asyncHandler(async (req, res) => {
  // Fetching the contact which is to be updated
  const contact = await Contact.findById(req.params.id)
  if (!contact) {
    res.status(404)
    throw new Error("Contact not found")
  }

  // Check to make sure only the user who created the contact is trying to access it
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403)
    throw new Error("User dont have permission to update other user contact")
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
  res.status(200).json(updatedContact)
  // res.status(200).json({ message: `Update contact for ${req.params.id}` })
})

// @desc delete contact
// @route DELETE /api/contacts/:id
// @access private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)
  if (!contact) {
    res.status(404)
    throw new Error("Contact not found")
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403)
    throw new Error("User dont have permission to delete other user contact")
  }
  await Contact.deleteOne({ _id: req.params.id })

  res.status(200).json(contact)

  // res.status(200).json({ message: `Delete contact for ${req.params.id}` })
})

module.exports = {
  getContact,
  createContact,
  getContacts,
  updateContact,
  deleteContact,
}
