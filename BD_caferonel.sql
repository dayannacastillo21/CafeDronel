
CREATE DATABASE IF NOT EXISTS `caferonel` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `caferonel`;

-- Tabla de usuarios del sistema
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rol` varchar(50) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `fecha_registro` timestamp DEFAULT CURRENT_TIMESTAMP,
  `activo` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `usuarios` (`id`, `rol`, `email`, `password`, `nombre`, `fecha_registro`, `activo`) VALUES
(1, 'gerente', 'gerente@gmail.com', 'gerente123', 'Carlos Mendoza', NOW(), 1),
(2, 'logistica', 'logistica@gmail.com', 'logistica123', 'Ana Rodriguez', NOW(), 1),
(3, 'vendedor', 'vendedor@gmail.com', 'vendedor123', 'Miguel Torres', NOW(), 1),
(4, 'contabilidad', 'contabilidad@gmail.com', 'contabilidad123', 'Sofia Vargas', NOW(), 1);

-- Catálogo de productos
CREATE TABLE `productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `descripcion` text,
  `tamaño` varchar(50) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `destacado` tinyint(1) DEFAULT 0,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_categoria` (`categoria`),
  KEY `idx_destacado` (`destacado`),
  KEY `idx_activo` (`activo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `productos` (`id`, `nombre`, `precio`, `categoria`, `descripcion`, `tamaño`, `imagen`, `destacado`, `activo`) VALUES
(1, 'Flat White', 10.00, 'cafe', 'Espresso con leche vaporizada, textura sedosa y fina espuma.', '8 Oz', '../img/white.jpg', 1, 1),
(2, 'Cappuccino Clásico', 12.00, 'cafe', 'Espresso balanceado con leche vaporizada y espuma cremosa.', '12 Oz', '../img/cappuccino.jpg', 0, 1),
(3, 'Latte Macchiato', 14.00, 'cafe', 'Leche vaporizada con un toque de espresso, en capas perfectas.', '16 Oz', '../img/latte.jpg', 1, 1),
(4, 'Mocha Especial', 16.00, 'cafe', 'Espresso con chocolate y leche vaporizada, coronado con crema.', '12 Oz', '../img/mocha.jpg', 0, 1),
(5, 'Cheesecake de Fresa', 18.00, 'postres', 'Delicioso cheesecake con salsa de fresa natural.', 'Porción individual', '../img/cheesecake.jpg', 1, 1),
(6, 'Brownie con Helado', 15.00, 'postres', 'Brownie de chocolate servido con bola de helado de vainilla.', 'Porción individual', '../img/brownie.jpg', 0, 1),
(7, 'Tiramisú Clásico', 20.00, 'postres', 'Postre italiano con café, cacao y queso mascarpone.', 'Porción individual', '../img/tiramisu.jpg', 1, 1),
(8, 'Frappé de Vainilla', 14.00, 'bebidas', 'Bebida fría mezclada con hielo y esencia de vainilla.', '16 Oz', '../img/frappe.jpg', 0, 1),
(9, 'Limonada de Menta', 10.00, 'bebidas', 'Refrescante limonada con hojas de menta fresca.', '500ml', '../img/limonada.jpg', 1, 1),
(10, 'Smoothie de Frutos Rojos', 16.00, 'bebidas', 'Mezcla de frutos rojos con yogurt natural.', '16 Oz', '../img/smoothie.jpg', 0, 1),
(11, 'Club Sandwich', 22.00, 'sandwiches', 'Pollo, tocino, lechuga, tomate y mayonesa casera.', 'Triple capa', '../img/club.jpg', 1, 1),
(12, 'Sandwich Vegano', 18.00, 'sandwiches', 'Vegetales frescos con hummus y aguacate.', 'Doble capa', '../img/vegano.jpg', 0, 1);

-- Registro de ventas
CREATE TABLE `ventas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `fecha_venta` timestamp DEFAULT CURRENT_TIMESTAMP,
  `total` decimal(10,2) NOT NULL,
  `estado` varchar(20) DEFAULT 'completada',
  `metodo_pago` varchar(50) DEFAULT 'efectivo',
  PRIMARY KEY (`id`),
  KEY `fk_ventas_usuario` (`usuario_id`),
  KEY `idx_fecha_venta` (`fecha_venta`),
  CONSTRAINT `fk_ventas_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Detalle de productos vendidos
CREATE TABLE `detalle_ventas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `venta_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_detalle_venta` (`venta_id`),
  KEY `fk_detalle_producto` (`producto_id`),
  CONSTRAINT `fk_detalle_venta` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Control de inventario
CREATE TABLE `inventario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_insumo` varchar(100) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `unidad` varchar(20) NOT NULL,
  `stock_minimo` decimal(10,2) NOT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `proveedor` varchar(100) DEFAULT NULL,
  `fecha_actualizacion` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_stock_minimo` (`stock_minimo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `inventario` (`nombre_insumo`, `cantidad`, `unidad`, `stock_minimo`, `precio_unitario`, `proveedor`) VALUES
('Café en grano', 50.00, 'kg', 10.00, 25.00, 'Café Superior SAC'),
('Leche fresca', 30.00, 'litros', 5.00, 3.50, 'Lácteos Frescos EIRL'),
('Azúcar', 20.00, 'kg', 5.00, 2.80, 'Distribuidora Central'),
('Chocolate en polvo', 5.00, 'kg', 2.00, 15.00, 'Dulces y Postres SA'),
('Crema batida', 10.00, 'litros', 3.00, 8.50, 'Lácteos Frescos EIRL'),
('Pan para sandwich', 50.00, 'unidades', 20.00, 0.80, 'Panadería San José'),
('Queso crema', 3.00, 'kg', 1.00, 12.00, 'Lácteos Frescos EIRL'),
('Fresas', 5.00, 'kg', 2.00, 8.00, 'Frutas del Valle');

-- Directorio de proveedores
CREATE TABLE `proveedores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_registro` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `proveedores` (`nombre`, `telefono`, `email`, `direccion`, `activo`) VALUES
('Café Superior SAC', '987 654 321', 'cafe@superior.com', 'Av. Los Cafetales 123, Lima', 1),
('Lácteos Frescos EIRL', '987 654 322', 'ventas@lacteosfrescos.com', 'Jr. La Leche 456, Lima', 1),
('Dulces y Postres SA', '987 654 323', 'pedidos@dulcesypostres.com', 'Av. Dulce 789, Lima', 1),
('Distribuidora Central', '987 654 324', 'ventas@distribuidora.com', 'Av. Central 101, Lima', 1),
('Panadería San José', '987 654 325', 'pedidos@sanjose.com', 'Jr. Pan 202, Lima', 1),
('Frutas del Valle', '987 654 326', 'ventas@frutasdelvalle.com', 'Av. Valle 303, Lima', 1);

-- Vistas para reportes
CREATE VIEW `reporte_ventas` AS
SELECT 
    v.id as venta_id,
    v.fecha_venta,
    v.total,
    v.estado,
    v.metodo_pago,
    u.nombre as vendedor,
    u.rol,
    COUNT(dv.id) as cantidad_items,
    GROUP_CONCAT(CONCAT(p.nombre, ' (', dv.cantidad, ')') SEPARATOR ', ') as productos
FROM ventas v
JOIN usuarios u ON v.usuario_id = u.id
LEFT JOIN detalle_ventas dv ON v.id = dv.venta_id
LEFT JOIN productos p ON dv.producto_id = p.id
GROUP BY v.id, v.fecha_venta, v.total, v.estado, v.metodo_pago, u.nombre, u.rol;

CREATE VIEW `control_stock` AS
SELECT 
    i.id,
    i.nombre_insumo,
    i.cantidad,
    i.unidad,
    i.stock_minimo,
    i.precio_unitario,
    i.proveedor,
    i.fecha_actualizacion,
    CASE 
        WHEN i.cantidad <= i.stock_minimo THEN 'CRÍTICO'
        WHEN i.cantidad <= (i.stock_minimo * 1.5) THEN 'BAJO'
        ELSE 'NORMAL'
    END AS estado_stock
FROM inventario i;

-- Procedimiento para registrar ventas
DELIMITER //

CREATE PROCEDURE `nueva_venta`(
    IN p_usuario_id INT,
    IN p_total DECIMAL(10,2),
    IN p_metodo_pago VARCHAR(50),
    IN p_productos JSON
)
BEGIN
    DECLARE v_venta_id INT;
    DECLARE v_producto_id INT;
    DECLARE v_cantidad INT;
    DECLARE v_precio DECIMAL(10,2);
    DECLARE v_subtotal DECIMAL(10,2);
    DECLARE i INT DEFAULT 0;
    DECLARE v_count INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    INSERT INTO ventas (usuario_id, total, metodo_pago) 
    VALUES (p_usuario_id, p_total, p_metodo_pago);
    
    SET v_venta_id = LAST_INSERT_ID();
    SET v_count = JSON_LENGTH(p_productos);
    
    WHILE i < v_count DO
        SET v_producto_id = JSON_UNQUOTE(JSON_EXTRACT(p_productos, CONCAT('$[', i, '].id')));
        SET v_cantidad = JSON_UNQUOTE(JSON_EXTRACT(p_productos, CONCAT('$[', i, '].cantidad')));
        
        SELECT precio INTO v_precio FROM productos WHERE id = v_producto_id;
        SET v_subtotal = v_precio * v_cantidad;
        
        INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal)
        VALUES (v_venta_id, v_producto_id, v_cantidad, v_precio, v_subtotal);
        
        SET i = i + 1;
    END WHILE;
    
    COMMIT;
    SELECT v_venta_id as venta_id;
END //

DELIMITER ;

-- Índices para optimización
CREATE INDEX idx_productos_categoria_precio ON productos(categoria, precio);
CREATE INDEX idx_ventas_fecha_usuario ON ventas(fecha_venta, usuario_id);
CREATE INDEX idx_detalle_ventas_producto ON detalle_ventas(producto_id, venta_id);

-- Trigger para log de ventas
DELIMITER //

CREATE TRIGGER `log_venta` 
AFTER INSERT ON `detalle_ventas`
FOR EACH ROW
BEGIN
    UPDATE inventario 
    SET fecha_actualizacion = NOW() 
    WHERE nombre_insumo LIKE CONCAT('%', (SELECT nombre FROM productos WHERE id = NEW.producto_id), '%');
END //

DELIMITER ;
