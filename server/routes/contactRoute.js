const validateToken = require("../middleware/validateToken");
const { validateContact, Contact } = require("../models/contact");

const mongoose = require("mongoose");
const router = require("express").Router();

//create contact
router.post("/contact", validateToken, async (req, res) => {
  const { error } = validateContact(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { name, address, email, phone } = req.body;
  try {
    const newContact = new Contact({
      name,
      address,
      email,
      phone,
      postedBy: req.user._id,
    });
    const result = await newContact.save();

    return res.status(201).json({ ...result._doc });
  } catch (err) {
    console.log(err);
  }
});

//fetch all contacts
router.get("/mycontacts", validateToken, async (req, res) => {
  try {
    const myContacts = await Contact.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "-password"
    );
    return res.status(200).json({ contacts: myContacts.reverse() });
  } catch (err) {
    console.log(err);
  }
});

//update contact
router.put("/contact", validateToken, async (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ error: "no id specified" });

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "please enter a valid id" });
  }

  try {
    const contact = await Contact.findOne({ _id: id });

    if (req.user._id.toString() !== contact.postedBy._id.toString()) {
      return res
        .status(401)
        .json({ error: "you are not authorized to edit this post" });
    }

    const updatedData = { ...req.body, id: undefined };
    const result = await Contact.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    return res.status(200).json({ ...result._doc });
  } catch (err) {
    console.log(err);
  }
});

//delete contact
router.delete("/delete/:id", validateToken, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "no id specified" });

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "please enter a valid id" });
  }

  try {
    const contact = await Contact.findOne({ _id: id });

    if (!contact) return res.status(400).json({ error: "no contact found" });

    if (req.user._id.toString() !== contact.postedBy._id.toString()) {
      return res
        .status(401)
        .json({ error: "you are not authorized to delete this post" });
    }

    const result = await Contact.deleteOne({ _id: id });

    const myContacts = await Contact.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "-password"
    );

    return res
      .status(200)
      .json({ ...contact._doc, myContacts: myContacts.reverse() });
  } catch (err) {
    console.log(err);
  }
});

//to get a single contact
router.get("/contact/:id", validateToken, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "no id specified" });

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "please enter a valid id" });
  }
  try {
    const contact = await Contact.findOne({ _id: id });
    return res.status(200).json({ ...contact._doc });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
