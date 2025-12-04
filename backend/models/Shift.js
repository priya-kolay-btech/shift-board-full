const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShiftSchema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  startTime: { type: String, required: true }, // HH:MM (24h)
  endTime: { type: String, required: true } // HH:MM (24h)
}, { timestamps: true });

module.exports = mongoose.model('Shift', ShiftSchema);
