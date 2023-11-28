const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    code: {
      type: String,
      unique: true,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    amount: {
      type: Number,
      required: true
    },
    purchaser: {
      type: String,
      required: true
    }
  });


const ticketsModel = mongoose.model("tickets", ticketSchema);


module.exports = ticketsModel;