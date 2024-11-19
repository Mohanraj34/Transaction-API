const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// Create a new transaction
router.post("/", async (req, res) => {
  const { amount, transaction_type, user } = req.body;

  try {
    const transaction = new Transaction({ amount, transaction_type, user });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Retrieve transactions for a specific user
router.get("/", async (req, res) => {
  const { user_id } = req.query;

  try {
    const transactions = await Transaction.find({ user: user_id });
    res.json({ transactions });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update transaction status
router.put("/:transaction_id", async (req, res) => {
  const { transaction_id } = req.params;
  const { status } = req.body;

  if (!["COMPLETED", "FAILED"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const transaction = await Transaction.findByIdAndUpdate(
      transaction_id,
      { status },
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Retrieve a specific transaction by ID
router.get("/:transaction_id", async (req, res) => {
  const { transaction_id } = req.params;

  try {
    const transaction = await Transaction.findById(transaction_id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
