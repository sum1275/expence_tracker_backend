const mongoose = require("mongoose");

const statementSchema = new mongoose.Schema({
  date: {
    type: Date, // Store dates as JavaScript Date objects
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  debit: {
    type: Number,
    default: 0,
  },
  credit: {
    type: Number,
    default: 0,
  },
  balance: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0,
    required: true,
  },
  bankName: {
    type: String,
  },
});

const Statement = mongoose.model("Statement", statementSchema);

module.exports = Statement;
