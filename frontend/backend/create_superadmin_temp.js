const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config();

const dbHost = process.env.DB_HOST;
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

async function run() {
  console.log(`Connecting to ${dbHost}:${dbPort}/${dbName}...`);
  const db = await mysql.createConnection({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
  });

  const salt = await bcrypt.genSalt(10);
  
  // Credentials for superadmin
  const email = 'superadmin@veloce.com';
  const plainPassword = 'superadmin123';
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  const fullName = 'Veloce Super Admin';
  const phone = '+919999999999';
  const role = 'superadmin';

  // Check if user already exists
  const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    console.log(`User with email ${email} already exists. Updating password/role to superadmin...`);
    await db.query(
      'UPDATE users SET password = ?, role = ?, full_name = ? WHERE email = ?',
      [hashedPassword, role, fullName, email]
    );
    console.log('Update successful!');
  } else {
    console.log(`Inserting new superadmin: ${email}...`);
    await db.query(
      'INSERT INTO users (id, full_name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      [crypto.randomUUID(), fullName, email, hashedPassword, phone, role]
    );
    console.log('Insert successful!');
  }

  // Also make sure default admin@veloce.com exists and is superadmin
  const adminEmail = 'admin@veloce.com';
  const adminPlainPassword = 'admin123';
  const adminHashedPassword = await bcrypt.hash(adminPlainPassword, salt);
  const [existingAdmin] = await db.query('SELECT * FROM users WHERE email = ?', [adminEmail]);
  if (existingAdmin.length > 0) {
    console.log(`User with email ${adminEmail} already exists. Updating to superadmin...`);
    await db.query(
      'UPDATE users SET password = ?, role = ? WHERE email = ?',
      [adminHashedPassword, 'superadmin', adminEmail]
    );
  } else {
    console.log(`Inserting default admin: ${adminEmail}...`);
    await db.query(
      'INSERT INTO users (id, full_name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      [crypto.randomUUID(), 'Veloce Admin', adminEmail, adminHashedPassword, phone, 'superadmin']
    );
  }
  console.log('Default admin check complete.');

  await db.end();
  console.log('Done!');
}

run().catch(err => {
  console.error('Error running script:', err);
});
