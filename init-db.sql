-- Script de inicialización de bases de datos MySQL para SmartLogix

-- Base de datos de Inventario
CREATE DATABASE IF NOT EXISTS inventario_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Base de datos de Pedidos
CREATE DATABASE IF NOT EXISTS pedidos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Base de datos de Envíos
CREATE DATABASE IF NOT EXISTS envios_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Base de datos del BFF
CREATE DATABASE IF NOT EXISTS bff_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla Producto en inventario_db
USE inventario_db;
CREATE TABLE IF NOT EXISTS producto (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo en Producto
INSERT INTO producto (nombre, stock) VALUES 
('Laptop Dell XPS 13', 15),
('Mouse Logitech', 50),
('Teclado Mecánico', 30),
('Monitor LG 27"', 10),
('Webcam HD', 25);

-- Tabla Pedido en pedidos_db
USE pedidos_db;
CREATE TABLE IF NOT EXISTS pedido (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  producto_id BIGINT NOT NULL,
  cantidad INT NOT NULL,
  tipo_envio VARCHAR(50) NOT NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  direccion VARCHAR(255),
  region VARCHAR(100),
  comuna VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla Envio en envios_db
USE envios_db;
CREATE TABLE IF NOT EXISTS envio (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  pedido_id BIGINT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE',
  transportista VARCHAR(100),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_entrega TIMESTAMP NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (pedido_id) REFERENCES pedidos_db.pedido(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;