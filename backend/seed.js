/**
 * Seed script to create:
 * - Admin user: hire-me@anshumat.org / HireMe@2025!
 * - A normal user
 * - Some employee records
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');
const Employee = require('./models/Employee');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/shiftboard';

async function run() {
  await mongoose.connect(MONGO);
  console.log('Connected to mongo for seeding');

  // clear minimal collections (you can comment out in real use)
  // await User.deleteMany({});
  // await Employee.deleteMany({});

  const adminEmail = 'hire-me@anshumat.org';
  const adminPass = 'HireMe@2025!';

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const adminEmployee = await Employee.findOne({ employeeCode: 'ADM001' }) || await Employee.create({ name: 'Admin User', employeeCode: 'ADM001', department: 'HR' });
    const hash = await bcrypt.hash(adminPass, 10);
    admin = await User.create({ name: 'Admin', email: adminEmail, passwordHash: hash, role: 'admin', employeeCode: adminEmployee.employeeCode });
    console.log('Admin created:', adminEmail);
  } else {
    console.log('Admin already exists');
  }

  const userEmail = 'user@company.com';
  const userPass = 'User@2025!';
  let user = await User.findOne({ email: userEmail });
  if (!user) {
    const emp = await Employee.findOne({ employeeCode: 'EMP100' }) || await Employee.create({ name: 'Normal User', employeeCode: 'EMP100', department: 'Ops' });
    const hash = await bcrypt.hash(userPass, 10);
    user = await User.create({ name: 'User', email: userEmail, passwordHash: hash, role: 'user', employeeCode: emp.employeeCode });
    console.log('User created:', userEmail);
  } else {
    console.log('User already exists');
  }

  console.log('Seeding complete');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
