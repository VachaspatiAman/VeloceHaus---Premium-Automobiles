-- MySQL Schema for E-commerce Backend

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
