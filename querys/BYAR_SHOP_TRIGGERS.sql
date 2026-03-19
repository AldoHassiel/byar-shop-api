CREATE OR REPLACE FUNCTION gestionar_contador_productos()
RETURNS TRIGGER AS $$
DECLARE
	id_categoria_vieja INT;
	id_categoria_nueva INT;
	id_subcategoria_vieja INT;
	id_subcategoria_nueva INT;
	id_marca_vieja INT;
	id_marca_nueva INT;
BEGIN
	IF TG_OP = 'INSERT' THEN
		IF NEW.activo = TRUE THEN
			SELECT id_categoria INTO id_categoria_nueva
			FROM subcategorias
			WHERE id = NEW.id_subcategoria;

			UPDATE subcategorias
			SET cant_producto = cant_producto + 1
			WHERE id = NEW.id_subcategoria;

			UPDATE categorias
			SET cant_producto = cant_producto + 1
			WHERE id = id_categoria_nueva;

			UPDATE marcas
			SET cant_producto = cant_producto + 1
			WHERE id = NEW.id_marca;
		END IF;

	ELSIF TG_OP = 'UPDATE' THEN
		id_subcategoria_vieja = OLD.id_subcategoria;
		id_subcategoria_nueva = NEW.id_subcategoria;
		id_marca_vieja = OLD.id_marca;
		id_marca_nueva = NEW.id_marca;

		SELECT id_categoria INTO id_categoria_vieja
		FROM subcategorias
		WHERE id = id_subcategoria_vieja;

		SELECT id_categoria INTO id_categoria_nueva
		FROM subcategorias
		WHERE id = id_subcategoria_nueva;

		-- Cuando se desactiva un producto
		IF OLD.activo = TRUE AND NEW.activo = FALSE THEN
			UPDATE categorias
			SET cant_producto = cant_producto - 1
			WHERE id = id_categoria_vieja;

			UPDATE subcategorias
			SET cant_producto = cant_producto - 1
			WHERE id = id_subcategoria_vieja;

			UPDATE marcas
			SET cant_producto = cant_producto - 1
			WHERE id = id_marca_vieja;

		-- Cuando se activa un producto
		ELSIF OLD.activo = FALSE AND NEW.activo = TRUE THEN
			UPDATE categorias
			SET cant_producto = cant_producto + 1
			WHERE id = id_categoria_nueva;

			UPDATE subcategorias
			SET cant_producto = cant_producto + 1
			WHERE id = id_subcategoria_nueva;

			UPDATE marcas
			SET cant_producto = cant_producto + 1
			WHERE id = id_marca_nueva;

		-- Cuando se cambia de subcategoria
		ELSIF OLD.activo = TRUE AND NEW.activo = TRUE
			AND id_subcategoria_vieja <> id_subcategoria_nueva
		THEN
			UPDATE categorias
			SET cant_producto = cant_producto - 1
			WHERE id = id_categoria_vieja;

			UPDATE subcategorias
			SET cant_producto = cant_producto - 1
			WHERE id = id_subcategoria_vieja;

			UPDATE categorias
			SET cant_producto = cant_producto + 1
			WHERE id = id_categoria_nueva;

			UPDATE subcategorias
			SET cant_producto = cant_producto + 1
			WHERE id = id_subcategoria_nueva;

		END IF;

		-- Cuando se cambia de marca
		IF OLD.activo = TRUE AND NEW.activo = TRUE
			AND id_marca_vieja <> id_marca_nueva
		THEN
			UPDATE marcas
			SET cant_producto = cant_producto - 1
			WHERE id = id_marca_vieja;

			UPDATE marcas
			SET cant_producto = cant_producto + 1
			WHERE id = id_marca_nueva;
		END IF;

	ELSIF TG_OP = 'DELETE' THEN
		IF OLD.activo = TRUE THEN
			SELECT id_categoria INTO id_categoria_vieja
			FROM subcategorias
			WHERE id = OLD.id_subcategoria;

			UPDATE categorias
			SET cant_producto = cant_producto - 1
			WHERE id = id_categoria_vieja;

			UPDATE subcategorias
			SET cant_producto = cant_producto - 1
			WHERE id = OLD.id_subcategoria;

			UPDATE marcas
			SET cant_producto = cant_producto - 1
			WHERE id = OLD.id_marca;
		END IF;
	END IF;

	IF TG_OP = 'DELETE' THEN
		RETURN OLD;
	ELSE
		RETURN NEW;
	END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_contador_producto
	AFTER INSERT OR UPDATE OR DELETE
	ON productos
	FOR EACH ROW
	EXECUTE FUNCTION gestionar_contador_productos();
