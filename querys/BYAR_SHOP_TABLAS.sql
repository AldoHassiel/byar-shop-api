CREATE TABLE marcas(
	id SERIAL PRIMARY KEY NOT NULL,
	nombre VARCHAR(100) NOT NULL,
	descripcion VARCHAR(255),
	cant_producto INT DEFAULT 0,
	activo BOOLEAN DEFAULT TRUE,
	fecha TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_marcas_nombre_activo
    ON marcas(nombre) WHERE activo = TRUE;


CREATE TABLE categorias(
	id SERIAL PRIMARY KEY NOT NULL,
	nombre VARCHAR(100) NOT NULL,
	descripcion VARCHAR(255),
	cant_producto INT DEFAULT 0,
	activo BOOLEAN DEFAULT TRUE,
	fecha TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_categorias_nombre_activo
    ON categorias(nombre) WHERE activo = TRUE;


CREATE TABLE subcategorias(
	id SERIAL PRIMARY KEY NOT NULL,
	nombre VARCHAR(100) NOT NULL,
	descripcion VARCHAR(255),
	cant_producto INT DEFAULT 0,
	activo BOOLEAN DEFAULT TRUE,
	fecha TIMESTAMPTZ DEFAULT NOW(),

	id_categoria INT NOT NULL,

	FOREIGN KEY (id_categoria) REFERENCES categorias(id)
);
CREATE UNIQUE INDEX idx_subcategorias_nombre_activo
    ON subcategorias(nombre) WHERE activo = TRUE;


CREATE TABLE productos(
	id SERIAL PRIMARY KEY NOT NULL,
	nombre VARCHAR(100) NOT NULL,
	descripcion VARCHAR(255),
	precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
	stock INT NOT NULL CHECK(stock >= 0),
	imagen_url TEXT,
	activo BOOLEAN DEFAULT TRUE,
	fecha TIMESTAMPTZ DEFAULT NOW(),
	
	id_subcategoria INT NOT NULL,
	id_marca INT NOT NULL,
	
	FOREIGN KEY (id_subcategoria) REFERENCES subcategorias(id),
	FOREIGN KEY (id_marca) REFERENCES marcas(id)
);
CREATE UNIQUE INDEX idx_productos_nombre_activo
    ON productos(nombre) WHERE activo = TRUE;

CREATE TABLE usuarios(
	id SERIAL PRIMARY KEY NOT NULL,
	nombre VARCHAR(100) NOT NULL,
	apellidos VARCHAR(100),
	telefono VARCHAR(20),
	correo VARCHAR(255) NOT NULL,
	pwd TEXT NOT NULL,
	es_admin BOOLEAN NOT NULL DEFAULT FALSE,
	activo BOOLEAN DEFAULT TRUE,
	fecha TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_usuarios_correo_activo
    ON usuarios(correo) WHERE activo = TRUE;


CREATE TABLE direcciones(
	id SERIAL PRIMARY KEY NOT NULL,
	calle VARCHAR(150) NOT NULL,
	numero_exterior VARCHAR(20) NOT NULL,
	numero_interior VARCHAR(20),
	colonia VARCHAR(100) NOT NULL,
	ciudad VARCHAR(100) NOT NULL,
	municipio VARCHAR(100) NOT NULL,
	estado VARCHAR(100) NOT NULL,
	codigo_postal VARCHAR(10) NOT NULL,
	pais VARCHAR(100) DEFAULT 'México',
	especificaciones VARCHAR(255),
	activo BOOLEAN DEFAULT TRUE,
	fecha TIMESTAMPTZ DEFAULT NOW(),
	es_predeterminada BOOLEAN DEFAULT FALSE,
	
	id_usuario INT NOT NULL,

	FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE metodos_de_pago(
	id SERIAL PRIMARY KEY NOT NULL,
	nombre_titular VARCHAR(255) NOT NULL,
	numero_tarjeta VARCHAR(50) NOT NULL,
	ultimos_digitos VARCHAR(4) NOT NULL,
	mes_vencimiento VARCHAR(2) NOT NULL,
	ano_vencimiento VARCHAR(4) NOT NULL,
	cvv VARCHAR(5) NOT NULL,
	marca VARCHAR(50),
	es_predeterminada BOOLEAN DEFAULT FALSE,
	activo BOOLEAN DEFAULT TRUE,
	fecha TIMESTAMPTZ DEFAULT NOW(),
	
	id_usuario INT NOT NULL,

	FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE mis_favoritos(
	fecha TIMESTAMPTZ DEFAULT NOW(),
	
	id_usuario INT NOT NULL,
	id_producto INT NOT NULL,

	PRIMARY KEY (id_usuario, id_producto),
	
	FOREIGN KEY (id_producto) REFERENCES productos(id),
	FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE carrito(
	id SERIAL PRIMARY KEY NOT NULL,
	cantidad INT NOT NULL DEFAULT 1 CHECK(cantidad > 0),
	fecha TIMESTAMPTZ DEFAULT NOW(),
	
	id_usuario INT NOT NULL,
	id_producto INT NOT NULL,

	FOREIGN KEY (id_producto) REFERENCES productos(id),
	FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
	
	UNIQUE (id_usuario, id_producto)
);

CREATE TABLE estados_pedido(
	id SERIAL PRIMARY KEY NOT NULL,
	nombre VARCHAR(50) NOT NULL
);

CREATE TABLE costos_envio(
    id SERIAL PRIMARY KEY NOT NULL,
    estado VARCHAR(100) NOT NULL,
    costo NUMERIC(10,2) NOT NULL
);

CREATE TABLE pedidos(
	id SERIAL PRIMARY KEY NOT NULL,
	subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK(subtotal >= 0),
	costo_envio NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK(costo_envio >= 0),
	total NUMERIC(10,2) GENERATED ALWAYS AS (subtotal + costo_envio) STORED,
	fecha_entrega_estimada DATE,
	fecha_entrego TIMESTAMPTZ,
	fecha TIMESTAMPTZ DEFAULT NOW(), 
	
	id_usuario INT NOT NULL,
	id_direccion INT NOT NULL,
	id_metodo_de_pago INT NOT NULL,
	id_estado INT NOT NULL,

	FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
	FOREIGN KEY (id_direccion) REFERENCES direcciones(id),
	FOREIGN KEY (id_metodo_de_pago) REFERENCES metodos_de_pago(id),
	FOREIGN KEY (id_estado) REFERENCES estados_pedido(id)
);

CREATE TABLE detalle_pedido(
	id SERIAL PRIMARY KEY NOT NULL,
	cantidad INT NOT NULL NOT NULL CHECK(cantidad > 0),
	precio NUMERIC(10, 2) NOT NULL CHECK(precio > 0),
	subtotal NUMERIC(10, 2) GENERATED ALWAYS AS (cantidad * precio) STORED,

	id_pedido INT NOT NULL,
	id_producto INT NOT NULL,

	FOREIGN KEY (id_pedido) REFERENCES pedidos(id),
	FOREIGN KEY (id_producto) REFERENCES productos(id)
);

CREATE TABLE negocio(
	id SERIAL PRIMARY KEY NOT NULL,
	nombre VARCHAR(50) NOT NULL,
	descripcion VARCHAR(500),
	sobre_de VARCHAR(500),
	imagen_sobre_de_url TEXT,
	instagram VARCHAR(50),
	direccion VARCHAR(255),
	dias_laborales VARCHAR(255),
	hora_de_apertura VARCHAR(20),
	hora_de_cierre VARCHAR(20),
	
	hero_titulo VARCHAR(150), 
	hero_descripcion VARCHAR(400),
	hero_imagen_url TEXT
);