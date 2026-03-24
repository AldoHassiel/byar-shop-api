-- CONSULTAS DE AYUDA ---

-- USUARIOS:
SELECT * FROM usuarios;

UPDATE usuarios SET
	activo = false
WHERE id = 2;

DELETE
FROM usuarios
WHERE id = 3;

-- CATEGORIAS:
SELECT * FROM categorias;

INSERT INTO categorias (nombre, descripcion)
VALUES ('Maquillaje', '')

UPDATE categorias SET
	activo = true
WHERE id = 2;

DELETE
FROM categorias
WHERE id = 3;

-- SUB CATEGORIAS:
SELECT * FROM subcategorias;

INSERT INTO subcategorias (nombre, descripcion, id_categoria)
VALUES ('Labial', '', 4)

UPDATE subcategorias SET
	activo = true
WHERE id = 1;

DELETE
FROM subcategorias
WHERE id = 1;

-- MARCAS
SELECT * FROM marcas;

INSERT INTO marcas (nombre, descripcion)
VALUES ('e.l.f', '')

UPDATE marcas SET
	activo = true
WHERE id = 1;

DELETE
FROM marcas
WHERE id = 2;

SELECT id
FROM marcas
WHERE activo = TRUE AND nombre = 'Elf'

-- PRODUCTOS
SELECT * FROM productos;

INSERT INTO productos(id_subcategoria, id_marca, nombre, descripcion, precio, stock)
VALUES(3, 3, 'Lip Oil', '', 299.99, 10)

INSERT INTO productos(id_subcategoria, id_marca, nombre, descripcion, precio, stock)
VALUES
(3, 3, 'Lip Oil Cherry', 'Aceite labial hidratante con aroma a cereza', 299.99, 15),
(3, 3, 'Lip Oil Vanilla', 'Aceite labial con acabado brillante sabor vainilla', 289.99, 20),
(3, 3, 'Lip Oil Rose', 'Aceite labial con tono rosado natural', 305.50, 12),
(3, 3, 'Matte Lipstick Nude', 'Labial mate tono nude de larga duración', 250.00, 30),
(3, 3, 'Matte Lipstick Red', 'Labial rojo intenso acabado mate', 255.00, 25),
(3, 3, 'Gloss Clear Shine', 'Brillo labial transparente efecto espejo', 199.99, 40),
(3, 3, 'Gloss Pink Glow', 'Gloss con brillo rosado sutil', 210.00, 18),
(3, 3, 'Lip Balm Hydrating', 'Bálsamo labial hidratante con vitamina E', 180.00, 50),
(3, 3, 'Lip Balm Strawberry', 'Bálsamo con aroma a fresa', 185.00, 35),
(3, 3, 'Liquid Lipstick Coral', 'Labial líquido tono coral vibrante', 275.00, 22),
(3, 3, 'Liquid Lipstick Wine', 'Labial líquido color vino elegante', 280.00, 16),
(3, 3, 'Lip Tint Peach', 'Tinta labial tono durazno natural', 230.00, 28),
(3, 3, 'Lip Tint Berry', 'Tinta labial color berry intenso', 235.00, 19),
(3, 3, 'Shimmer Lip Gloss Gold', 'Gloss con destellos dorados', 220.00, 14),
(3, 3, 'Shimmer Lip Gloss Silver', 'Gloss con brillo plateado', 220.00, 13),
(3, 3, 'Plumping Lip Gloss', 'Gloss efecto voluminizador', 260.00, 17),
(3, 3, 'Satin Lipstick Mauve', 'Labial acabado satinado tono malva', 245.00, 21),
(3, 3, 'Satin Lipstick Plum', 'Labial satinado color ciruela', 245.00, 20),
(3, 3, 'Lip Oil Mint', 'Aceite labial refrescante con menta', 295.00, 11),
(3, 3, 'Lip Oil Coconut', 'Aceite labial hidratante aroma coco', 300.00, 9);

SELECT
p.id, p.id_subcategoria, p.imagen_url, p.nombre, p.descripcion, p.precio, p.stock, s.nombre AS nombre_subcategoria, c.id AS id_categoria, c.nombre AS nombre_categoria
FROM productos p
INNER JOIN subcategorias s
ON s.id = p.id_subcategoria
INNER JOIN categorias c
ON c.id = s.id_categoria
WHERE p.activo = TRUE


-- ESTADOS DE LOS PEDIDOS
SELECT * FROM estados_pedido;

INSERT INTO estados_pedido(nombre)
VALUES
('En proceso'),
('Entregado'),
('Cancelado');

-- DIRECIONES
SELECT * FROM direcciones

SELECT * FROM direcciones
WHERE id_usuario = 2

SELECT activo FROM direcciones
WHERE id_usuario = 2 AND id = 6

SELECT id FROM direcciones
WHERE activo = TRUE AND id_usuario = 2

SELECT id, calle, numero_exterior, numero_interior, colonia,ciudad, municipio, estado, codigo_postal, especificaciones, es_predeterminada
FROM direcciones
WHERE activo = TRUE AND id_usuario = 2
ORDER BY es_predeterminada DESC

SELECT id FROM direcciones
WHERE id_usuario = 2 AND activo = true
ORDER BY id ASC
LIMIT 1

UPDATE direcciones SET
	activo = TRUE
WHERE id_usuario = 2 AND id = 4

DELETE FROM direcciones
WHERE id = 3

INSERT INTO direcciones (
    calle, numero_exterior, numero_interior, colonia, ciudad, municipio, estado, codigo_postal, especificaciones, id_usuario
) VALUES
    ('Av. Independencia', '123', 'A', 'Centro', 'Los Mochis', 'Ahome', 'Sinaloa', '81200', 'Casa color azul con portón negro', 2),
    ('Calle Benito Juárez', '456', NULL, 'Jiquilpan', 'Los Mochis', 'Ahome', 'Sinaloa', '81220', 'Frente a un parque', 2),
    ('Blvd. Antonio Rosales', '789', '2B', 'Scally', 'Los Mochis', 'Ahome', 'Sinaloa', '81240', 'Departamento en segundo piso', 2);

INSERT INTO direcciones (
    calle, numero_exterior, numero_interior, colonia, ciudad, municipio, estado, codigo_postal, especificaciones, id_usuario
) VALUES
    ('Calle Morelos', '101', NULL, 'Centro', 'Culiacán', 'Culiacán', 'Sinaloa', '80000', 'Casa blanca con reja negra', 4),
    ('Av. Álvaro Obregón', '202', '5', 'Las Quintas', 'Culiacán', 'Culiacán', 'Sinaloa', '80060', 'Departamento en quinto piso', 4),
    ('Calle Insurgentes', '303', 'B', 'Chapultepec', 'Mazatlán', 'Mazatlán', 'Sinaloa', '82140', 'Cerca de una tienda OXXO', 4);

-- METODOS DE PAGOS
SELECT * FROM metodos_de_pago;

UPDATE metodos_de_pago
SET
	activo = TRUE
WHERE id_usuario = 2;

UPDATE metodos_de_pago
SET
	es_predeterminada = true
WHERE id_usuario = 2 AND id = 1;

SELECT id, nombre_titular, ultimos_digitos, mes_vencimiento, ano_vencimiento, marca, es_predeterminada
FROM metodos_de_pago
WHERE activo = TRUE AND id_usuario = 2 AND id = 1

-- NEGOCIO
SELECT * FROM negocio;

INSERT INTO negocio (
    nombre,
    descripcion,
    sobre_de,
	imagen_sobre_de_url,
    instagram,
    direccion,
    dias_laborales,
    hora_de_apertura,
    hora_de_cierre,
    hero_titulo,
    hero_descripcion,
	hero_imagen_url
) VALUES (
    'byarshop',
    'Tienda de productos extranjeros de calidad',
    'En Byarshop somos apasionados por traerte lo mejor del mundo. Nos especializamos en productos extranjeros de alta calidad, cuidadosamente seleccionados para ofrecerte una experiencia de compra única. Nos encontramos en el corazón de la ciudad, frente a la iglesia de la Plazuela 27 de Sep, donde cada fin de semana abrimos nuestras puertas para que descubras artículos exclusivos que no encontrarás en ningún otro lugar. ¡Ven y vive la experiencia Byarshop!',
    '',
	'https://www.instagram.com/byar.shop',
    'Plazuela 27 de Sep frente a la iglesia',
    'Viernes a Domingo',
    '6:30 PM',
    '10:00 PM',
    'Bienvenido a byarshop',
    'Encuentra los mejores productos al mejor precio',
	''
);

UPDATE negocio
SET
    nombre = 'byarshop',
    descripcion = 'Tienda de productos extranjeros de calidad',
    sobre_de = 'En Byarshop somos apasionados por traerte lo mejor del mundo. Nos especializamos en productos extranjeros de alta calidad, cuidadosamente seleccionados para ofrecerte una experiencia de compra única. Nos encontramos en el corazón de la ciudad, frente a la iglesia de la Plazuela 27 de Sep, donde cada fin de semana abrimos nuestras puertas para que descubras artículos exclusivos que no encontrarás en ningún otro lugar. ¡Ven y vive la experiencia Byarshop!',
    imagen_sobre_de_url = '',
    instagram = 'https://www.instagram.com/byar.shop',
    direccion = 'Plazuela 27 de Sep frente a la iglesia',
    dias_laborales = 'Viernes a Domingo',
    hora_de_apertura = '6:30 PM',
    hora_de_cierre = '10:00 PM',
    hero_titulo = 'Bienvenido a byarshop',
    hero_descripcion = 'Encuentra los mejores productos al mejor precio',
    hero_imagen_url = ''
WHERE id = 1;

   