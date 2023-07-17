import {Router} from 'express';
import { productModel } from "../../dao/mongo/models/products.model.js";
import { cartsModel } from "../../dao/mongo/models/carts.model.js";
import passport from 'passport';

const router = Router();

// Función para obtener productos con paginación
async function getProducts(page = 1, limit = 3) {
    const skip = (page - 1) * limit;
    const products = await productModel.find().skip(skip).limit(limit);
    const productsArray = products.map(product => product.toObject());
    const totalProducts = await productModel.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    return {
    products: productsArray,
    page,
    totalPages,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null
    };
}

// Ruta para obtener productos con autenticación JWT
router.get('/products', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;

    const data = await getProducts(page, limit);
    if (req.user) {
    data.user = req.user.toObject();
    data.user.name = `${data.user.first_name} ${data.user.last_name}`;
    } else {
    data.user = null;
    }
    res.render("products", data);
});

// Función para obtener el carrito de compras con paginación
async function getCart(cartId, page = 1, limit = 3) {
    const skip = (page - 1) * limit;
    const cart = await cartsModel.findById(cartId).populate('products.product');
    if (!cart) {
    throw new Error('Cart not found');
    }

    const products = cart.products.map(p => ({
    id: p.product.id,
    title: p.product.title,
    price: p.product.price,
    quantity: p.quantity
    }));
    const paginatedProducts = products.slice(skip, skip + limit);
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);

    return {
    products: paginatedProducts,
    page,
    totalPages,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null
    };
}

// Ruta para obtener el carrito de compras
router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;

    try {
        const data = await getCart(cartId, page, limit);
        res.render("cart", data);
        } catch (error) {
        res.status(404).send({ error: error.message });
        }
});

export default router;
export {getProducts};
export {getCart};



//#############----{ CONCEPTOS }----#############


// ➤ Explicación de la paginación

/* En el archivo views.products.js, estás implementando la paginación para las rutas /products
y /carts/:cid utilizando las funciones getProducts y getCart, respectivamente.

La función getProducts toma como argumentos page y limit, que representan la página actual y el
número de productos por página, respectivamente. Dentro de esta función, estás utilizando el 
método skip y el método limit del modelo de producto para obtener solo los productos correspondientes
a la página actual. También estás calculando el número total de páginas utilizando el método 
countDocuments del modelo de producto y el valor de limit. Finalmente, estás devolviendo un 
objeto con la información de los productos, la página actual, el número total de páginas y las
páginas anterior y siguiente.

La función getCart toma como argumentos cartId, page y limit, que representan el ID del carrito de
compras, la página actual y el número de productos por página, respectivamente. Dentro de esta 
función, estás buscando el carrito de compras en la base de datos utilizando el método findById
del modelo de carrito y el valor de cartId. Luego, estás extrayendo los productos del carrito y
utilizando los métodos slice y length para obtener solo los productos correspondientes a la
página actual y calcular el número total de páginas. Finalmente, estás devolviendo un objeto
con la información de los productos, la página actual, el número total de páginas y las páginas
anterior y siguiente.

En resumen, en el archivo views.products.js, estás implementando la paginación para las rutas 
/products y /carts/:cid utilizando las funciones getProducts y getCart, respectivamente. Estas 
funciones toman como argumentos la página actual y el número de productos por página y devuelven
un objeto con la información de los productos correspondientes a la página actual. */