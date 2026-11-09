const Inquiry = require("../models/inquiry");

function validEmail(value) {
  return (
    typeof value === "string" &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  );
}

async function create(req, res) {
  const body = req.body || {};
  const {
    name,
    email,
    phone = "",
    subject = "General enquiry",
    message,
    website,
  } = body;
  // Honeypot field: accept bots quietly without saving their submission.
  if (typeof website === "string" && website.trim())
    return res
      .status(201)
      .json({ message: "Thank you. Your enquiry has been sent." });
  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 100 ||
    !validEmail(email) ||
    typeof phone !== "string" ||
    phone.length > 30 ||
    typeof subject !== "string" ||
    !subject.trim() ||
    subject.trim().length > 120 ||
    typeof message !== "string" ||
    message.trim().length < 5 ||
    message.trim().length > 3000
  ) {
    return res
      .status(400)
      .json({
        message: "Please provide a valid name, email, subject, and message.",
      });
  }
  const inquiry = await Inquiry.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    subject: subject.trim(),
    message: message.trim(),
  });
  res
    .status(201)
    .json({
      message: "Thank you. Your enquiry has been sent.",
      id: inquiry._id,
    });
}

async function list(req, res) {
  const inquiries = await Inquiry.find().sort({ status: 1, createdAt: -1 });
  res.json({ inquiries });
}

async function updateStatus(req, res) {
  const { status } = req.body || {};
  if (!["new", "in-progress", "handled"].includes(status)) {
    return res
      .status(400)
      .json({ message: "Status must be new, in-progress, or handled." });
  }
  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true },
  );
  if (!inquiry) return res.status(404).json({ message: "Inquiry not found." });
  res.json({ inquiry });
}

async function remove(req, res) {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
  if (!inquiry) return res.status(404).json({ message: "Inquiry not found." });
  res.json({ message: "Inquiry deleted." });
}

module.exports = { create, list, updateStatus, remove };
