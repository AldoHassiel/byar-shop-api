# Byar Shop API
Este es el repositorio oficial de la API de la tienda en linea Byar Shop.

## Capas
Esta API se encuentra organizado por las siguientes capas:
### Rutas
Las rutas se encargan unicamente de definir un endpoint con su respectivo controlador.
### Controladores
Los controladores son los encargados manejar la petición.
### Servicios
Los servicios son los encargados de validar los datos antes de consulutar la base de datos.
### Repositorios
Los repositorios se encargan de comunicarse con la base de datos.

## Pasos para contribuir
1. **Clonar el repositorio:** Pues eso, descargalo. ¿Cómo quieres contribuir si no tienes descargado el repositorio? ;-; 
2. **Crea una rama:** Crea una rama con la siguiente estructura: *"nombre/funcionalidad"*
3. **Crea el repositorio:** Si es un nuevo endpoint, crea su archivo siguiendo la nomenclatura y basandote del otro. Si se va añadir un nuevo método, solo agregalo como una propiedad mas.
4. **Crea el servicio:** Lo mismo que en el paso anterior. Añade la validación.
5. **Crea el controlador:** Crea la funcion del controlador como un nueva función y asegurate de exportarlo. Un controlador **SIEMPRE** debe de retornar un objeto JSON con: 
  - **Estado:** Un booleano para indicar si todo fue correcto o todo mal.
  - **Mensaje:** Un string corto que describa la operación que se hizo y su estado. Normalmente se utilizará para cuando haya errores. Un ejemplo puede ser "Se añadió un nuevo producto exitosamente"
  - **Datos:** Es un arreglo que contiene toda la info obtenida de la petición. NOTA: Aunque solo se regrese un objeto, se deberá enviar como un arreglo. Si la operación no necesita regresar nada, datos tendría que establecerse como null.
6. **Crea la ruta:** Crea un nuevo router, define los endpoints y vinculalos con un controlador.
7. **Vincula la ruta en la API:** Abre *app.js*, importa el router y haz que lo utilice meidnate *app.use(tu_router)*.
