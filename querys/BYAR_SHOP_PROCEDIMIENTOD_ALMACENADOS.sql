CREATE OR REPLACE PROCEDURE realizar_compra(
	p_id_usuario INT,
	p_id_direccion INT,
	p_id_metodo_de_pago INT,
	OUT p_error TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
	v_subtotal NUMERIC;
	v_costo_de_envio NUMERIC;
	v_id_pedido INT;
	v_producto RECORD;
BEGIN
	p_error := NULL;

	SELECT
        SUM(p.precio * c.cantidad),
        e.costo
    INTO
        v_subtotal,
        v_costo_de_envio
    FROM carrito c
    INNER JOIN productos p  ON p.id = c.id_producto
    INNER JOIN direcciones d ON d.id = p_id_direccion
    INNER JOIN costos_envio e ON e.estado = d.estado
    WHERE c.id_usuario = p_id_usuario
    GROUP BY e.costo;

	IF v_subtotal IS NULL THEN
        p_error := 'Carrito vacío o no encontrado';
        RETURN;
    END IF;

	FOR v_producto IN
		SELECT
			p.id,
			p.nombre,
			p.stock,
			c.cantidad
		FROM carrito c
		INNER JOIN productos p
		ON p.id = c.id_producto
		WHERE c.id_usuario = p_id_usuario
	LOOP
		IF v_producto.stock < v_producto.cantidad THEN
			p_error := 'Stock insuficiente para el producto ' || v_producto.nombre;
			RETURN;
		END IF;
	END LOOP;

	INSERT INTO pedidos (
		subtotal, 
		costo_envio, 
		fecha_entrega_estimada, 
		fecha_entrego,
		id_usuario,
		id_direccion,
		id_metodo_de_pago,
		id_estado
	)
	VALUES (
		v_subtotal,
		v_costo_de_envio,
		NOW() + INTERVAL '7 days',
		NULL,
		p_id_usuario,
		p_id_direccion,
		p_id_metodo_de_pago,
		1
	)
	RETURNING id INTO v_id_pedido;

	INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio)
    SELECT
        v_id_pedido,
        c.id_producto,
        c.cantidad,
        p.precio
    FROM carrito c
    INNER JOIN productos p ON p.id = c.id_producto
    WHERE c.id_usuario = p_id_usuario;

	UPDATE productos p
    SET stock = p.stock - c.cantidad
    FROM carrito c
    WHERE c.id_usuario = p_id_usuario
    AND p.id = c.id_producto;

	DELETE FROM carrito
    WHERE id_usuario = p_id_usuario;
END;
$$;

CALL realizar_compra(2, 4, 2, NULL);

SELECT * FROM metodos_de_pago WHERE id_usuario = 2 AND activo = TRUE;

SELECT * FROM carrito;

SELECT 
	SUM(p.precio * c.cantidad) AS subtotal,
	e.costo AS costo_de_envio,
	SUM(p.precio * c.cantidad) + e.costo AS total
FROM carrito c
INNER JOIN usuarios u
ON u.id = c.id_usuario
INNER JOIN productos p
ON p.id = c.id_producto 
INNER JOIN direcciones d
ON d.id_usuario = c.id_usuario
INNER JOIN costos_envio e
ON e.estado LIKE d.estado
WHERE c.id_usuario = 2 AND d.id = 4
GROUP BY u.nombre, d.estado, e.costo;

SELECT 
p.id, 
p.nombre AS nombre, 
m.nombre AS marca, 
p.stock AS stock,
c.cantidad,
p.precio * c.cantidad AS TOTAL
FROM carrito c
INNER JOIN productos p
ON p.id = c.id_producto
INNER JOIN marcas m
ON m.id = p.id_marca
WHERE id_usuario = 2;

SELECT * FROM pedidos;
SELECT * FROM detalle_pedido;


-- ADMIN -- 
-- Pedidos en general
SELECT
	p.id AS id,
	u.nombre AS usuario_nombre,
	u.apellidos AS usuario_apellidos,
	d.calle AS direccion_calle,
	d.numero_exterior AS direccion_numero_exterior,
	d.numero_interior AS direccion_numero_interior,
	d.colonia AS direccion_colonia,
	d.ciudad AS direccion_ciudad,
	d.municipio AS direccion_municipio,
	d.estado AS direccion_estado,
	d.codigo_postal AS direccion_codigo_postal,
	d.pais AS direccion_pais,
	d.especificaciones AS direccion_especificaciones,
	ep.nombre AS estado
FROM pedidos p
INNER JOIN usuarios u
ON u.id = p.id_usuario
INNER JOIN direcciones d
ON d.id = p.id_direccion
INNER JOIN estados_pedido ep
ON ep.id = p.id_estado

-- Pedido en especifico
SELECT
    p.id,
    p.fecha,
    p.subtotal,
    p.costo_envio,
    p.total,
	ep.id estado_id,
    ep.nombre AS estado_nombre,

    u.nombre AS usuario_nombre,
	u.apellidos AS usuario_apellidos,
	
	
    mp.marca AS tarjeta_marca,
    mp.ultimos_digitos AS tarjeta_ultimos_digitos,
	
    d.calle AS direccion_calle,
	d.numero_exterior AS direccion_numero_exterior,
	d.numero_interior AS direccion_numero_interior,
	d.colonia AS direccion_colonia,
	d.ciudad AS direccion_ciudad,
	d.municipio AS direccion_municipio,
	d.estado AS direccion_estado,
	d.codigo_postal AS direccion_codigo_postal,
	d.pais AS direccion_pais,
	d.especificaciones AS direccion_especificaciones
FROM pedidos p
INNER JOIN estados_pedido ep
ON ep.id = p.id_estado
INNER JOIN usuarios u
ON u.id  = p.id_usuario
INNER JOIN metodos_de_pago mp
ON mp.id = p.id_metodo_de_pago
INNER JOIN direcciones d
ON d.id  = p.id_direccion
WHERE p.id = 1;

SELECT
    p.nombre,
    p.imagen_url,
    dp.cantidad,
    dp.precio,
    dp.subtotal
FROM detalle_pedido dp
INNER JOIN productos p ON p.id = dp.id_producto
WHERE dp.id_pedido = 1;

-- Traerse el estado del pedido
SELECT id, nombre FROM estados_pedido;

--Actualizar estado
UPDATE pedidos
SET id_estado = 1
WHERE id = 2;


-- CLIENTE --
-- Pedido en general
SELECT 
    p.id,
    ep.nombre AS estado,
    p.fecha_entrega_estimada,
	p.fecha_entrego AS fecha_entregado,
    p.total,
    array_agg(pr.imagen_url) AS imagenes
FROM pedidos p
INNER JOIN estados_pedido ep ON ep.id = p.id_estado
INNER JOIN detalle_pedido dp ON dp.id_pedido = p.id
INNER JOIN productos pr ON pr.id = dp.id_producto
WHERE p.id_usuario = 2
GROUP BY p.id, ep.nombre, p.fecha_entrega_estimada, p.total
ORDER BY p.fecha DESC;

-- Pedido en especifico
SELECT
    p.id,
    p.fecha,
    p.subtotal,
    p.costo_envio,
    p.total,
    p.fecha_entrega_estimada,
	p.fecha_entrego AS fecha_entregado,
    ep.nombre AS estado,

    mp.marca AS tarjeta_marca,
    mp.ultimos_digitos AS tarjeta_ultimos_digitos,

    d.calle AS direccion_calle,
    d.numero_exterior AS direccion_numero_exterior,
    d.numero_interior AS direccion_numero_interior,
    d.colonia AS direccion_colonia,
	d.municipio AS direccion_municipio,
	d.estado AS direccion_estado,
    d.codigo_postal AS direccion_codigo_postal,
	d.pais AS direccion_pais,
	d.especificaciones AS direccion_especificaciones
FROM pedidos p
INNER JOIN estados_pedido ep
ON ep.id = p.id_estado
INNER JOIN metodos_de_pago mp
ON mp.id = p.id_metodo_de_pago
INNER JOIN direcciones d
ON d.id  = p.id_direccion
WHERE p.id = 1 AND p.id_usuario = 2;

SELECT
	p.id,
    p.nombre,
    p.imagen_url,
    m.nombre AS marca,
    dp.cantidad,
    dp.precio,
    dp.subtotal
FROM detalle_pedido dp
INNER JOIN productos p
ON p.id = dp.id_producto
INNER JOIN marcas m
ON m.id  = p.id_marca
WHERE dp.id_pedido = 1;