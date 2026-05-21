const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'veloce_ecommerce';

const seedVehicles = [
  {
    name: "Nexon EV Max", brand: "Tata", type: "car", fuelType: "Electric",
    price: 1899000, stock: 12,
    image_url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80",
    featured: true,
    description: "The Tata Nexon EV Max redefines electric mobility in India with an exceptional 437 km WLTC range, rapid DC fast charging, and an array of connected car features. Its bold SUV styling conceals a highly efficient electric drivetrain that delivers brisk performance with zero emissions.",
    engine: "Permanent Magnet AC Motor", transmission: "Automatic", horsepower: 143, torque: "215 Nm", mileage: "437 km (Range)", seats: 5, top_speed: 150, warranty: "8 Years / 1,60,000 km",
    color_variants: JSON.stringify([
      { color_name: "Fearless Purple", hex_code: "#4B0082", image_url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80" },
      { color_name: "Tropical Mist", hex_code: "#E0F7FA", image_url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80" },
      { color_name: "Pristine White", hex_code: "#FFFFFF", image_url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80" },
      { color_name: "Daytona Grey", hex_code: "#808080", image_url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80" }
    ])
  },
  {
    name: "Creta 2024", brand: "Hyundai", type: "car", fuelType: "Petrol",
    price: 1111000, stock: 15,
    image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=80",
    featured: true,
    description: "The Hyundai Creta remains India's most loved compact SUV, now with a completely redesigned interior featuring a panoramic dual-screen dashboard, enhanced safety tech, and a smoother, more refined ride quality.",
    engine: "1.5L Kappa MPi", transmission: "Manual", horsepower: 115, torque: "144 Nm", mileage: "17 kmpl", seats: 5, top_speed: 165, warranty: "3 Years / Unlimited km",
    color_variants: JSON.stringify([
      { color_name: "Abyss Black", hex_code: "#000000", image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=80" },
      { color_name: "Fiery Red", hex_code: "#FF0000", image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=80" },
      { color_name: "Atlas White", hex_code: "#FFFFFF", image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=80" }
    ])
  },
  {
    name: "Grand Vitara", brand: "Maruti", type: "car", fuelType: "Hybrid",
    price: 1369000, stock: 8,
    image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900&q=80",
    featured: true,
    description: "The Maruti Suzuki Grand Vitara with strong hybrid technology delivers exceptional fuel efficiency with a class-leading 700 km tank range. The self-charging hybrid system seamlessly switches between petrol and electric power.",
    engine: "1.5L Strong Hybrid", transmission: "Automatic", horsepower: 116, torque: "141 Nm", mileage: "27.97 kmpl", seats: 5, top_speed: 175, warranty: "2 Years / 40,000 km",
    color_variants: JSON.stringify([
      { color_name: "Grandeur Grey", hex_code: "#696969", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900&q=80" },
      { color_name: "Splendid Silver", hex_code: "#C0C0C0", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900&q=80" },
      { color_name: "Opulent Red", hex_code: "#8B0000", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900&q=80" }
    ])
  },
  {
    name: "Thar ROXX", brand: "Mahindra", type: "car", fuelType: "Diesel",
    price: 1899000, stock: 5,
    image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=80",
    featured: true,
    description: "The Mahindra Thar ROXX brings iconic 4x4 capability to a family-friendly 5-door body. With the powerful mHawk diesel, switchable 4WD, and premium interior, it's the most capable lifestyle SUV in the segment.",
    engine: "2.2L mHawk Diesel", transmission: "Manual", horsepower: 172, torque: "370 Nm", mileage: "15 kmpl", seats: 5, top_speed: 155, warranty: "3 Years / Unlimited km",
    color_variants: JSON.stringify([
      { color_name: "Everest White", hex_code: "#F8F9FA", image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=80" },
      { color_name: "Stealth Black", hex_code: "#1A1A1A", image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=80" }
    ])
  },
  {
    name: "Swift 2024", brand: "Maruti", type: "car", fuelType: "Petrol",
    price: 649000, stock: 25,
    image_url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80",
    featured: false,
    description: "The all-new Maruti Swift is lighter, peppier, and more fuel-efficient than ever. With a fresh sporty design, enhanced cabin quality, and the new Z-Series engine, it sets a new benchmark in the premium hatchback segment.",
    engine: "1.2L Z-Series", transmission: "Manual", horsepower: 82, torque: "112 Nm", mileage: "25.72 kmpl", seats: 5, top_speed: 170, warranty: "2 Years / 40,000 km",
    color_variants: JSON.stringify([
      { color_name: "Speedy Blue", hex_code: "#0000FF", image_url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80" },
      { color_name: "Magma Grey", hex_code: "#555555", image_url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80" }
    ])
  },
  {
    name: "Creta EV", brand: "Hyundai", type: "car", fuelType: "Electric",
    price: 1799000, stock: 10,
    image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=80",
    featured: false,
    description: "The Hyundai Creta EV combines the class-leading design and features of the Creta with a long-range electric drivetrain. With 473 km ARAI range and V2L (Vehicle-to-Load) capability, it's the most feature-packed electric SUV under ₹20L.",
    engine: "Electric Motor (42 kWh)", transmission: "Automatic", horsepower: 135, torque: "255 Nm", mileage: "473 km (Range)", seats: 5, top_speed: 160, warranty: "8 Years / 1,60,000 km",
    color_variants: JSON.stringify([
      { color_name: "Cosmic Blue", hex_code: "#008B8B", image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=80" },
      { color_name: "Atlas White", hex_code: "#FFFFFF", image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=80" }
    ])
  },
  {
    name: "Classic 350", brand: "Royal Enfield", type: "bike", fuelType: "Petrol",
    price: 193000, stock: 20,
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    featured: true,
    description: "The Royal Enfield Classic 350 is the quintessential retro motorcycle that has defined a generation. With its thump-worthy engine, iconic styling, and vastly improved reliability, it remains India's most romantic ride.",
    engine: "349cc J-Series Single", transmission: "Manual", horsepower: 20, torque: "27 Nm", mileage: "35 kmpl", seats: 2, top_speed: 130, warranty: "3 Years / 30,000 km",
    color_variants: JSON.stringify([
      { color_name: "Dark Gunmetal", hex_code: "#4F4F4F", image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80" },
      { color_name: "Stealth Black", hex_code: "#2B2B2B", image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80" }
    ])
  },
  {
    name: "Duke 390", brand: "KTM", type: "bike", fuelType: "Petrol",
    price: 311000, stock: 10,
    image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900&q=80",
    featured: true,
    description: "The KTM Duke 390 is the most powerful street naked in its class, blending aggressive styling with razor-sharp handling. With a full-color TFT display, quick-shifter, and cornering ABS, it delivers a superbike experience at a fraction of the cost.",
    engine: "399cc Single Cylinder", transmission: "Manual", horsepower: 45, torque: "39 Nm", mileage: "28 kmpl", seats: 2, top_speed: 167, warranty: "2 Years / 30,000 km",
    color_variants: JSON.stringify([
      { color_name: "Orange", hex_code: "#FF4500", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900&q=80" },
      { color_name: "Black", hex_code: "#000000", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900&q=80" }
    ])
  },
  {
    name: "Himalayan 450", brand: "Royal Enfield", type: "bike", fuelType: "Petrol",
    price: 285000, stock: 11,
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    featured: false,
    description: "The all-new Royal Enfield Himalayan 450 is a ground-up redesign built for serious adventure touring. With the new Sherpa 450 engine, fully adjustable suspension, and a comprehensive TFT Tripper display, it's the most capable mid-size adventure tourer.",
    engine: "452cc Sherpa Engine", transmission: "Manual", horsepower: 40, torque: "40 Nm", mileage: "30 kmpl", seats: 2, top_speed: 155, warranty: "3 Years / 30,000 km",
    color_variants: JSON.stringify([
      { color_name: "Slate", hex_code: "#708090", image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80" },
      { color_name: "Kamet White", hex_code: "#FAF0E6", image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80" }
    ])
  },
  {
    name: "CB300R", brand: "Honda", type: "bike", fuelType: "Petrol",
    price: 288000, stock: 6,
    image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900&q=80",
    featured: false,
    description: "The Honda CB300R is a neo-sports café-inspired naked motorcycle that combines minimalist Japanese design with a punchy single-cylinder engine. Its lightweight chassis, premium components, and clean aesthetics make it a joy to ride in any condition.",
    engine: "286cc Single Cylinder", transmission: "Manual", horsepower: 31, torque: "27.5 Nm", mileage: "32 kmpl", seats: 2, top_speed: 143, warranty: "2 Years / 32,000 km",
    color_variants: JSON.stringify([
      { color_name: "Candy Red", hex_code: "#C0392B", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900&q=80" },
      { color_name: "Matte Black", hex_code: "#2C3E50", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900&q=80" }
    ])
  },
  {
    name: "Dominar 400", brand: "Bajaj", type: "bike", fuelType: "Petrol",
    price: 242000, stock: 14,
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    featured: false,
    description: "The Bajaj Dominar 400 is a power cruiser built for long-distance touring. With twin exhaust headers, USD front forks, a slipper clutch, and a strong 40 bhp output, it offers highway-crushing performance at an accessible price point.",
    engine: "373.3cc Triple-Spark", transmission: "Manual", horsepower: 40, torque: "35 Nm", mileage: "27 kmpl", seats: 2, top_speed: 148, warranty: "5 Years / 75,000 km",
    color_variants: JSON.stringify([
      { color_name: "Aurora Green", hex_code: "#006400", image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80" },
      { color_name: "Charcoal Black", hex_code: "#333333", image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80" }
    ])
  },
  {
    name: "Meteor 350", brand: "Royal Enfield", type: "bike", fuelType: "Petrol",
    price: 221000, stock: 18,
    image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900&q=80",
    featured: false,
    description: "The Royal Enfield Meteor 350 is the ultimate cruiser for long weekend rides. With its relaxed ergonomics, thumpy J-Series engine, and Tripper navigation, it's designed for those who love unhurried, soul-satisfying journeys.",
    engine: "349cc J-Series Single", transmission: "Manual", horsepower: 20, torque: "27 Nm", mileage: "38 kmpl", seats: 2, top_speed: 130, warranty: "3 Years / 30,000 km",
    color_variants: JSON.stringify([
      { color_name: "Supernova Brown", hex_code: "#8B4513", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900&q=80" },
      { color_name: "Fireball Yellow", hex_code: "#FFD700", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900&q=80" }
    ])
  }
];

const schemaSql = `
-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Create Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    type VARCHAR(50),
    fuelType VARCHAR(50),
    price DECIMAL(15, 2) NOT NULL,
    stock INT DEFAULT 0,
    image_url VARCHAR(512),
    featured BOOLEAN DEFAULT false,
    description TEXT,
    engine VARCHAR(255),
    transmission VARCHAR(255),
    horsepower INT,
    torque VARCHAR(255),
    mileage VARCHAR(255),
    seats INT DEFAULT 5,
    top_speed INT,
    warranty VARCHAR(255),
    color_variants JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Create Cart Table
CREATE TABLE IF NOT EXISTS cart (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    vehicle_id VARCHAR(36) NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Create Wishlist Table
CREATE TABLE IF NOT EXISTS wishlist (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    vehicle_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY user_vehicle_idx (user_id, vehicle_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. Create Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    vehicle_id VARCHAR(36),
    quantity INT DEFAULT 1,
    price DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL
) ENGINE=InnoDB;
`;

const initializeDatabase = async () => {
  console.log(`Connecting to MySQL at ${dbHost}:${dbPort} to create database (if not exists)...`);
  
  try {
    // Connection without database to create it first
    const connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.end();
    console.log(`Database '${dbName}' created/verified.`);
  } catch (err) {
    console.log(`Note: Database creation skipped or not allowed (${err.message}). Connecting directly...`);
  }
  
  // Connection with database to load tables
  const db = await mysql.createConnection({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    multipleStatements: true
  });

  console.log('Applying schema structures...');
  await db.query(schemaSql);

  // Check if vehicles are already seeded
  const [vehicles] = await db.query('SELECT COUNT(*) as count FROM vehicles');
  if (vehicles[0].count === 0) {
    console.log('Seeding initial vehicles...');
    for (const v of seedVehicles) {
      const id = crypto.randomUUID();
      await db.query(
        `INSERT INTO vehicles (
          id, name, brand, type, fuelType, price, stock, image_url, featured, description, 
          engine, transmission, horsepower, torque, mileage, seats, top_speed, warranty, color_variants
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, v.name, v.brand, v.type, v.fuelType, v.price, v.stock, v.image_url, v.featured, v.description,
          v.engine, v.transmission, v.horsepower, v.torque, v.mileage, v.seats, v.top_speed, v.warranty, v.color_variants
        ]
      );
    }
    console.log(`Successfully seeded ${seedVehicles.length} vehicles!`);
  } else {
    console.log('Vehicles table is not empty, skipping seed.');
  }

  // Create default admin user if none exists
  const [users] = await db.query('SELECT COUNT(*) as count FROM users');
  if (users[0].count === 0) {
    console.log('Seeding default superadmin and user account...');
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    // Create superadmin
    await db.query(
      `INSERT INTO users (id, full_name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)`,
      [crypto.randomUUID(), 'Veloce Admin', 'admin@veloce.com', adminPassword, '+919999999999', 'superadmin']
    );

    // Create regular user
    await db.query(
      `INSERT INTO users (id, full_name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)`,
      [crypto.randomUUID(), 'Aman Vachaspati', 'user@veloce.com', userPassword, '+918888888888', 'user']
    );

    console.log('Seed users created:');
    console.log('  Admin - Email: admin@veloce.com, Password: admin123 (Role: superadmin)');
    console.log('  User  - Email: user@veloce.com,  Password: user123  (Role: user)');
  }

  await db.end();
  console.log('MySQL Database Initialized Successfully.');
};

if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Failed to initialize database:', err);
      process.exit(1);
    });
}

module.exports = initializeDatabase;
