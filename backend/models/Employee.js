const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  name: { type: String, required: true },
  employeeCode: { type: String, required: true, unique: true },
  department: { type: String }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
