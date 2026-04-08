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
    p_direccion TEXT DEFAULT NULL,
    p_estado_pedido INT DEFAULT 0,
    p_fecha_inicio DATE DEFAULT NULL,
    p_fecha_fin DATE DEFAULT NULL,
    p_periodo_dias INT DEFAULT NULL
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
    tarjeta_marca VARCHAR(50),
    estado VARCHAR(50)
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        u.nombre,
        u.apellidos,
        d.calle,
        d.numero_exterior,
        d.numero_interior,
        d.colonia,
        d.ciudad,
        d.municipio,
        d.estado,
        d.codigo_postal,
        d.pais,
        d.especificaciones,
        m.marca,
        e.nombre
    FROM pedidos p
    JOIN usuarios u
        ON u.id  = p.id_usuario
    JOIN direcciones d
        ON d.id  = p.id_direccion
    JOIN metodos_de_pago m
        ON m.id  = p.id_metodo_de_pago
    JOIN estados_pedido e
        ON e.id  = p.id_estado
    WHERE
        (p_id_pedido IS NULL OR p.id = p_id_pedido)

        AND (p_nombre_usuario IS NULL
            OR u.nombre ILIKE '%' || p_nombre_usuario || '%'
            OR u.apellidos ILIKE '%' || p_nombre_usuario || '%')

        AND (p_direccion IS NULL
            OR d.calle ILIKE '%' || p_direccion || '%'
            OR d.numero_exterior ILIKE '%' || p_direccion || '%'
            OR d.colonia ILIKE '%' || p_direccion || '%'
            OR d.ciudad ILIKE '%' || p_direccion || '%'
            OR d.municipio ILIKE '%' || p_direccion || '%'
            OR d.estado ILIKE '%' || p_direccion || '%'
            OR d.codigo_postal ILIKE '%' || p_direccion || '%'
            OR d.pais ILIKE '%' || p_direccion || '%'
            OR d.especificaciones ILIKE '%' || p_direccion || '%')

        AND (COALESCE(p_estado_pedido, 0) = 0
            OR p.id_estado = p_estado_pedido)

        AND (
            CASE
                WHEN p_periodo_dias IS NOT NULL THEN
                    p.fecha >= NOW() - (p_periodo_dias || ' days')::INTERVAL
                ELSE
                    (p_fecha_inicio IS NULL OR p.fecha >= p_fecha_inicio)
                    AND
                    (p_fecha_fin IS NULL OR p.fecha < p_fecha_fin + INTERVAL '1 day')
            END
        )

    ORDER BY
        CASE
            WHEN COALESCE(p_estado_pedido, 0) = 0
            THEN CASE p.id_estado
                WHEN 1 THEN 1
                WHEN 2 THEN 2
                WHEN 3 THEN 3
                ELSE 4
            END
            ELSE NULL
        END ASC NULLS LAST,
        p.fecha ASC;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM pedidos;


SELECT COUNT(*) AS total_productos FROM productos WHERE activo = TRUE
SELECT COUNT(*) AS total_ventas FROM pedidos WHERE id_estado = 2
SELECT COALESCE(SUM(total), 0) AS total_ganancias FROM pedidos WHERE id_estado = 2

SELECT
        pr.id,
        pr.nombre,
        pr.imagen_url,
        SUM(dp.cantidad) AS total_vendido,
        SUM(dp.subtotal) AS ingresos
FROM detalle_pedido dp
JOIN pedidos  pe 
	ON pe.id = dp.id_pedido
JOIN productos pr
	ON pr.id = dp.id_producto
WHERE pe.id_estado = 2
GROUP BY pr.id, pr.nombre, pr.imagen_url
ORDER BY total_vendido DESC
LIMIT 5;

CREATE OR REPLACE FUNCTION obtener_estadisticas()
RETURNS JSON
AS $$
DECLARE
    resultado JSON;
BEGIN
    SELECT json_build_object(
        'datos_generales', (
            SELECT json_build_object(
                'total_productos', COUNT(*),
                'total_ventas', (SELECT COUNT(*) FROM pedidos),
                'total_ganancias', (SELECT COALESCE(SUM(total), 0) FROM pedidos)
            )
            FROM productos
            WHERE activo = TRUE
        ),
        'ganancias_totales', (
            SELECT json_agg(t ORDER BY t.anio)
            FROM (
                SELECT
                    a.anio,
                    COALESCE(v.ganancias, 0) AS ganancias
                FROM generate_series(
                        EXTRACT(YEAR FROM NOW()) - 4,
                        EXTRACT(YEAR FROM NOW()),
                        1
                ) AS a(anio)
                LEFT JOIN (
                    SELECT
                        EXTRACT(YEAR FROM fecha) AS anio,
                        SUM(total) AS ganancias
                    FROM pedidos
                    GROUP BY 1
                ) v ON a.anio = v.anio
            ) t
        ),
        'venta_mes', (
            SELECT json_agg(t ORDER BY t.mes)
            FROM (
                SELECT
                    TO_CHAR(m.mes, 'YYYY-MM') AS mes,
                    COALESCE(v.ventas, 0) AS ventas
                FROM generate_series(
                        DATE_TRUNC('month', NOW()) - INTERVAL '4 months',
                        DATE_TRUNC('month', NOW()),
                        INTERVAL '1 month'
                ) AS m(mes)
                LEFT JOIN (
                    SELECT
                        DATE_TRUNC('month', fecha) AS mes,
                        COUNT(*) AS ventas
                    FROM pedidos
                    GROUP BY 1
                ) v ON m.mes = v.mes
            ) t
        ),
        'top_productos', (
            SELECT json_agg(t)
            FROM (
                SELECT
                    pr.nombre AS producto,
                    SUM(dp.cantidad) AS total_vendido
                FROM pedidos p
                JOIN detalle_pedido dp ON dp.id_pedido = p.id
                JOIN productos pr ON pr.id = dp.id_producto
                GROUP BY pr.nombre
                ORDER BY total_vendido DESC
                LIMIT 5
            ) t
        )
    ) INTO resultado;
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;