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
	p_limite INT DEFAULT 20,
	p_id_usuario INT DEFAULT NULL
)
RETURNS TABLE(
	id INT,
	imagen_url TEXT,
	nombre VARCHAR(100),
	descripcion VARCHAR(255),
	precio NUMERIC(10,2),
	stock INT,
	id_categoria INT,
	id_subcategoria INT,
	id_marca INT,
	nombre_categoria VARCHAR(100),
	nombre_subcategoria VARCHAR(100),
	nombre_marca VARCHAR(100),
	es_favorito BOOLEAN,
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
		c.id AS id_categoria,
		s.id AS id_subcategoria,
		m.id AS id_marca,
		c.nombre AS nombre_categoria,
		s.nombre AS nombre_subcategoria,
		m.nombre AS nombre_marca,
		CASE
			WHEN p_id_usuario IS NULL THEN FALSE
			ELSE EXISTS (
				SELECT 1 FROM mis_favoritos f
				WHERE f.id_usuario = p_id_usuario
				AND f.id_producto = p.id
			)
		END AS es_favorito,
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

-- PEDIDOS --
CREATE OR REPLACE FUNCTION obtener_pedidos(
	p_id_pedido INT DEFAULT NULL,
	p_nombre_usuario TEXT DEFAULT NULL,
	p_direccion_ciudad TEXT DEFAULT NULL,
	p_direccion_estado TEXT DEFAULT NULL,
	p_id_estado INT DEFAULT NULL,
	p_fecha_inicio DATE DEFAULT NULL,
	p_fecha_fin DATE DEFAULT NULL,
	p_periodo_dias INT DEFAULT
)
RETURNS TABLE (
	id INT,
	usuario_nombre VARCHAR(100),
	usuario_apellidos VARCHAR(100),
	direccion_calle VARCHAR(150),
	direccion_numero_exterior VARCHAR(20),
	direccion_numero_interior VARCHAR(20),
	direccion_colonia VARCHAR(100),
	direccion_ciudad VARCHAR(100),
	direccion_municipio VARCHAR(100),
	direccion_estado VARCHAR(100),
	direccion_codigo_postal VARCHAR(10),
	direccion_pais VARCHAR(100),
	direccion_especificaciones VARCHAR(255),
	estado VARCHAR(50),
	total NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
END;
$$;


