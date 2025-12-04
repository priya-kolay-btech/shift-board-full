const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { auth, authorize } = require('../middleware/auth');

// GET /api/employees
router.get('/', auth, async (req, res) => {
  const list = await Employee.find({});
  res.json(list);
});

// Admin-only create could be added; but seed script creates employees.
module.exports = router;
