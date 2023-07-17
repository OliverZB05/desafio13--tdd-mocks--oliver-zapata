import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;


//#############----{ CONCEPTOS }----#############


// ➤ Explicación de dirname y dileURLToPath

/* dirname y fileURLToPath son dos funciones del módulo path y url de Node.js, respectivamente.

fileURLToPath es una función que convierte una URL de archivo en una ruta de archivo.
Esta función toma como argumento una URL de archivo y devuelve la ruta de archivo
correspondiente.

dirname es una función que devuelve el nombre del directorio de una ruta de archivo.
Esta función toma como argumento una ruta de archivo y devuelve el nombre del directorio
que contiene el archivo.

En tu código, estás utilizando estas funciones para obtener el nombre del directorio
del archivo actual. Primero, estás utilizando fileURLToPath para convertir
import.meta.url en una ruta de archivo y almacenarla en la variable __filename.
Luego, estás utilizando dirname para obtener el nombre del directorio que contiene
el archivo y almacenarlo en la variable __dirname. Finalmente, estás exportando la
variable __dirname para que pueda ser utilizada en otros archivos.

En resumen, fileURLToPath es una función que convierte una URL de archivo en una ruta de archivo,
mientras que dirname es una función que devuelve el nombre del directorio de una ruta de archivo
. En tu código, estás utilizando estas funciones para obtener el nombre del directorio del archivo actual. */




// ➤ ¿Como se usa dirname en app.js?

/* `__dirname` es una variable que contiene el nombre del directorio del archivo actual. 
En tu caso, estás utilizando `__dirname` para construir rutas de archivo que apuntan a 
los directorios `public` y `views` dentro del directorio `rendered`.

- En la línea `app.use(express.static(`${__dirname}/rendered/public`));`, estás 
utilizando `__dirname` para construir una ruta de archivo que apunta al directorio 
`public` dentro del directorio `rendered`. Esta ruta se pasa como argumento a la 
función `express.static`, que se encarga de servir los archivos estáticos (como 
imágenes, CSS y JavaScript) desde el directorio especificado.

- En la línea `app.set('views', `${__dirname}/rendered/views`);`, estás utilizando
`__dirname` para construir una ruta de archivo que apunta al directorio `views` 
dentro del directorio `rendered`. Esta ruta se pasa como segundo argumento a la 
función `app.set`, que se encarga de configurar la ubicación de las vistas 
(archivos de plantilla) utilizadas por Express para renderizar las páginas.

En resumen, estás utilizando `__dirname` para construir rutas de archivo 
que apuntan a los directorios `public` y `views` dentro del directorio 
`rendered`. Estas rutas se utilizan para configurar la ubicación de los 
archivos estáticos y las vistas utilizadas por Express. La variable `__dirname` 
contiene el nombre del directorio del archivo actual, por lo que al concatenarla 
con la ruta relativa a los directorios `public` y `views`, obtienes la ruta 
completa a esos directorios. */