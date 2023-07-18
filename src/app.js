//========={ Dependencias }=========
import express from 'express';
import exphbs from 'express-handlebars';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import initializePassport from './config/passport.config.js';
import passport from 'passport';
import flash from 'connect-flash';
import bodyParser from 'body-parser';
//========={ Dependencias }=========

// Importar el archivo config.js
import config from './config/config.js';

// Conectar a la base de datos MongoDB
mongoose.connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//========={ Dirname }=========
import {__dirname} from './utils.js';
//========={ Dirname }=========

//========={ Routers }=========
import productsRouter from './routes/api/products.router.js';
import cartsRouter from './routes/api/carts.router.js';
import viewsProductRouter from './routes/web/views.products.js';
import sessionsRouter from './routes/api/sessions.router.js';
import viewsRouter from './routes/web/views.router.js';
//========={ Routers }=========

import { Server } from "socket.io";
import { getProducts } from './routes/web/views.products.js';
import { getCart } from './routes/web/views.products.js';

const app = express();

app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(flash());

const hbs = exphbs.create({
helpers: {
debug: function (value) {
console.log("Current Context");
console.log("====================");
console.log(this);

if (value) {
console.log("Value");
console.log("====================");
console.log(value);
}
},
},
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.set("view engine", "handlebars");
app.use(express.static(`${__dirname}/rendered/public`));  // Aquí se especifica el nuevo directorio del js de las vistas
app.set('views', `${__dirname}/rendered/views`); // Aquí se especifica el nuevo directorio de vistas

app.use(session({
    secret: 'Coder39760',
    resave: true,
    saveUninitialized: true
}))

//========={ Inicialización de passport }=========
initializePassport();

app.use(session({
    secret: 'your secret here',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//========={ Inicialización de passport }=========
function checkRole(role) {
    return (req, res, next) => {
        if (req.isAuthenticated()) {
            if (req.user.role === role) {
                return next();
            } else {
                res.status(401).json({ message: 'Solo los administradores pueden usar los métodos de productos' });
            }
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    }
}


//========={ Usando de routers }=========
app.use("/", viewsProductRouter);
app.use('/api/products', passport.authenticate('jwt', { session: false }), checkRole('admin'), productsRouter);
app.use('/api/carts', cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);
//========={ Usando de routers }========


//========={ Usando socket.io }========
const server = app.listen(8080,()=>console.log("Listening on 8080"));
const io = new Server(server);

app.on('cartUpdated', async cartId => {
const productsData = await getProducts();
io.emit('products', productsData.products);

const cartData = await getCart(cartId);
io.emit('cart', cartData.products);
});


//======={ CHAT }=======
const messages = [];

io.on("connection", (socket) => {
    console.log("New client connected");

    // Leer mensajes del evento:
    socket.on("message", (data) => {
    messages.push(data);
    io.emit("messageLogs", messages);
    });
    // Leer mensajes luego de autenticarse.
    socket.on("auth", (data) => {
    socket.emit("messageLogs", messages);
    socket.broadcast.emit("newUser", data);
    });
});
//======={ CHAT }=======


app.set('socketio', io);
io.sockets.setMaxListeners(20);
//========={ Usando socket.io }========


//#############----{ CONCEPTOS }----#############


// ➤ Funcionamiento de checkRole

/* checkRole es una función que se utiliza para verificar si el usuario
tiene un rol específico. Esta función toma como argumento un role y
devuelve una función middleware que se puede utilizar en las rutas 
de Express.

La función middleware devuelta por checkRole toma como argumentos req,
res y next. Dentro de esta función, se verifica si el usuario ha
iniciado sesión utilizando req.isAuthenticated(). Si el usuario ha
iniciado sesión, se verifica si su rol coincide con el role especificado.
Si el rol del usuario coincide con el role especificado, se llama a la 
función next() para permitir que la solicitud continúe. Si el rol del usuario
no coincide con el role especificado, se envía una respuesta con un código
de estado 401 y un mensaje de error indicando que el usuario no está autorizado.

En resumen, checkRole es una función que se utiliza para verificar si el usuario
tiene un rol específico. Esta función devuelve una función middleware que se 
puede utilizar en las rutas de Express para restringir el acceso a usuarios con
un rol específico. */




/*  ➤ Explicación de la línea: app.use('/api/products', passport.authenticate('jwt', 
{ session: false }), checkRole('admin'), productsRouter); */

/* La línea app.use('/api/products', passport.authenticate('jwt', { session: false }), 
checkRole('admin'), productsRouter); se utiliza para montar el router productsRouter 
en la ruta /api/products y restringir el acceso a esta ruta solo a usuarios autenticados
con un rol de admin.

La función passport.authenticate('jwt', { session: false }) se utiliza como middleware para
autenticar al usuario utilizando un token JWT. Esta función verifica si el token JWT proporcionado
en la solicitud es válido y, si es así, recupera la información del usuario y la almacena 
en req.user. Si el token JWT no es válido o no se proporciona, la función envía una respuesta
con un código de estado 401 y un mensaje de error indicando que el usuario no está autenticado.

La función checkRole('admin') se utiliza como middleware para verificar si el usuario tiene un rol 
de admin. Esta función verifica si el usuario ha iniciado sesión y si su rol coincide con el rol 
especificado (admin). Si el usuario no ha iniciado sesión o si su rol no coincide con el rol 
especificado, la función envía una respuesta con un código de estado 401 y un mensaje de error 
indicando que el usuario no está autorizado.

En resumen, la línea app.use('/api/products', passport.authenticate('jwt', { session: false }), 
checkRole('admin'), productsRouter); se utiliza para montar el router productsRouter en la ruta
/api/products y restringir el acceso a esta ruta solo a usuarios autenticados con un rol de admin.
Las funciones passport.authenticate('jwt', { session: false }) y checkRole('admin') se utilizan 
como middleware para autenticar al usuario y verificar su rol antes de permitirle acceder a la 
ruta /api/products. */




// ➤ Explicación de la configuración de socket.io

/* En tu código, estás utilizando Socket.IO para habilitar la comunicación en tiempo real 
entre el servidor y los clientes.

Primero, estás creando un servidor HTTP utilizando app.listen y pasándolo como argumento
al constructor de Server para crear una instancia de Socket.IO. Esto permite que Socket.IO
escuche conexiones en el mismo puerto que el servidor HTTP.

Luego, estás utilizando el método on de la instancia de Socket.IO para escuchar eventos. En tu caso,
estás escuchando dos eventos: connection y cartUpdated.

El evento connection se dispara cuando un nuevo cliente se conecta al servidor. 

Dentro del manejador de este evento, estás utilizando el método on del objeto socket 
para escuchar eventos específicos del cliente. En tu caso, estás escuchando dos eventos: 
message y auth.

El evento message se dispara cuando el cliente envía un mensaje al servidor. 
Dentro del manejador de este evento, estás almacenando el mensaje en un array
y utilizando el método emit de la instancia de Socket.IO para enviar el array 
de mensajes a todos los clientes conectados.

El evento auth se dispara cuando el cliente se autentica. Dentro del manejador
de este evento, estás utilizando el método emit del objeto socket para enviar 
el array de mensajes solo al cliente que se autenticó. También estás utilizando 
el método broadcast.emit del objeto socket para enviar un mensaje a todos los demás
clientes indicando que un nuevo usuario se ha unido al chat.

El evento cartUpdated se dispara cuando el carrito de compras es actualizado. 
Dentro del manejador de este evento, estás recuperando la información de los 
productos y del carrito de compras y utilizando el método emit de la instancia 
de Socket.IO para enviar esta información a todos los clientes conectados.

En resumen, estás utilizando Socket.IO para habilitar la comunicación en tiempo
real entre el servidor y los clientes. Estás escuchando eventos específicos y 
utilizando los métodos on y emit para recibir y enviar información entre el 
servidor y los clientes. */