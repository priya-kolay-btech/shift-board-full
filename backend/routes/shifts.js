const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Shift = require('../models/Shift');
const Employee = require('../models/Employee');
const { auth, authorize } = require('../middleware/auth');

// helper: convert HH:MM to minutes
const toMinutes = (t) => {
  const [hh, mm] = t.split(':').map(Number);
  return hh*60 + mm;
};

// POST /api/shifts  (Admin only)
router.post('/', auth, authorize(['admin']), [
  body('employeeCode').notEmpty(),
  body('date').isISO8601(),
  body('startTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
  body('endTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { employeeCode, date, startTime, endTime } = req.body;
  const employee = await Employee.findOne({ employeeCode });
  if (!employee) return res.status(400).json({ message: 'Employee not found' });

  const startMin = toMinutes(startTime);
  const endMin = toMinutes(endTime);

  if (endMin <= startMin) return res.status(400).json({ message: 'End time must be after start time' });
  if (endMin - startMin < 4*60) return res.status(400).json({ message: 'Shift must be at least 4 hours' });

  // rule: no overlapping shifts for same employee on same date
  const existing = await Shift.find({ employee: employee._id, date });
  for (let s of existing) {
    const sStart = toMinutes(s.startTime), sEnd = toMinutes(s.endTime);
    const overlap = !(endMin <= sStart || startMin >= sEnd);
    if (overlap) return res.status(400).json({ message: 'Overlapping shift exists for this employee on that date' });
  }

  const shift = new Shift({ employee: employee._id, date, startTime, endTime });
  await shift.save();
  res.json(shift);
});

// GET /api/shifts?employee=employeeCode&date=YYYY-MM-DD
router.get('/', auth, async (req, res) => {
  const { employee: employeeCode, date } = req.query;

  let query = {};
  if (req.user.role === 'user') {
    // normal users see only their own shifts
    if (!req.user.employeeCode) return res.status(403).json({ message: 'No employee code assigned to user' });
    const emp = await Employee.findOne({ employeeCode: req.user.employeeCode });
    if (!emp) return res.status(400).json({ message: 'Employee record not found for user' });
    query.employee = emp._id;
  } else {
    if (employeeCode) {
      const emp = await Employee.findOne({ employeeCode });
      if (!emp) return res.status(400).json({ message: 'Employee not found' });
      query.employee = emp._id;
    }
  }
  if (date) query.date = date;

  const list = await Shift.find(query).populate('employee');
  res.json(list);
});

// DELETE /api/shifts/:id  (Admin only)
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
  const { id } = req.params;
  const s = await Shift.findByIdAndDelete(id);
  if (!s) return res.status(404).json({ message: 'Shift not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
