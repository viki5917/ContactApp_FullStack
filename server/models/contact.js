const mongoose = require("mongoose");
const Joi = require("joi");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  address: {
    type: String,
    required: [true, "address is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  phone: {
    type: Number,
    require: [true, "phone number is required"],
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const validateContact = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(4).max(20).required(),
    address: Joi.string().min(4).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.number().min(1000000000).max(10000000000).required(),
  });
  return schema.validate(data);
};

const Contact = new mongoose.model("Contact", contactSchema);

module.exports = { validateContact, Contact };
