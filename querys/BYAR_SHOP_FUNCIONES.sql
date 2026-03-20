-- PRODUCTOS
-- Todos los productos
CREATE OR REPLACE FUNCTION obtener_productos(
	p_nombre VARCHAR(100) DEFAULT NULL,
	p_marca INT DEFAULT NULL,
	p_categoria INT DEFAULT NULL,
	p_subcategoria INT DEFAULT NULL,
	p_precio_min NUMERIC DEFAULT NULL,
	p_precio_max NUMERIC DEFAULT NULL,
	p_pagina INT DEFAULT 1,
	p_limite INT DEFAULT 20
)
RETURNS TABLE(
	id INT,
	imagen_url TEXT,
	nombre VARCHAR(100),
	descripcion VARCHAR(255),
	precio NUMERIC(10,2),
	stock INT,
	nombre_categoria VARCHAR(100),
	nombre_subcategoria VARCHAR(100),
	nombre_marca VARCHAR(100),
	total_registros BIGINT
)
AS $$
BEGIN
	RETURN QUERY

	SELECT
		p.id,
		p.imagen_url,
		p.nombre,
		p.descripcion,
		p.precio,
		p.stock,
		c.nombre AS nombre_categoria,
		s.nombre AS nombre_subcategoria,
		m.nombre AS nombre_marca,
		COUNT(*) OVER() AS total_registros
	FROM productos p
	INNER JOIN subcategorias s
		ON s.id = p.id_subcategoria
	INNER JOIN categorias c
		ON c.id = s.id_categoria
	INNER JOIN marcas m
		ON m.id = p.id_marca
	WHERE
		p.activo = TRUE
		AND p.stock > 0
		AND (p_nombre IS NULL OR p.nombre ILIKE '%' || p_nombre || '%')
		AND (p_marca IS NULL OR m.id = p_marca)
		AND (p_categoria IS NULL OR c.id = p_categoria)
		AND (p_subcategoria IS NULL OR s.id = p_subcategoria)
		AND (p_precio_min IS NULL OR p.precio >= p_precio_min)
		AND (p_precio_max IS NULL OR p.precio <= p_precio_max)
		ORDER BY p.precio ASC
		LIMIT p_limite
		OFFSET (p_pagina - 1) * p_limite;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION obtener_productos();

SELECT * FROM obtener_productos(p_precio_max => 250, p_pagina => 2,p_limite => 5);

-- Un producto
CREATE OR REPLACE FUNCTION obtener_producto(
	p_id INT
)
RETURNS TABLE(
	id INT,
	imagen_url TEXT,
	nombre VARCHAR(100),
	descripcion VARCHAR(255),
	precio NUMERIC(10,2),
	stock INT,
	id_categoria INT,
	nombre_categoria VARCHAR(100),
	id_subcategoria INT,
	nombre_subcategoria VARCHAR(100),
	id_marca INT,
	nombre_marca VARCHAR(100)
)
AS $$
BEGIN
	RETURN QUERY

	SELECT
		p.id,
		p.imagen_url,
		p.nombre,
		p.descripcion,
		p.precio,
		p.stock,
		c.id AS id_categoria,
		c.nombre AS nombre_categoria,
		s.id AS id_subcategoria,
		s.nombre AS nombre_subcategoria,
		m.id AS id_marca,
		m.nombre AS nombre_marca
	FROM productos p
	INNER JOIN subcategorias s
		ON s.id = p.id_subcategoria
	INNER JOIN categorias c
		ON c.id = s.id_categoria
	INNER JOIN marcas m
		ON m.id = p.id_marca
	WHERE
		p.activo = TRUE
		AND p.id = p_id;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION obtener_producto();

SELECT * FROM obtener_producto(10);
