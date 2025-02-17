// models/connection-request-model.js
const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        menteeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mentee",
            required: true,
        },
        mentorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mentor",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
