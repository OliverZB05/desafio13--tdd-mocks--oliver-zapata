import passport from 'passport';

import Factory from "../dao/factory.js";
const Carts = Factory.Carts;
const Products = Factory.Products;

const cartInstance = new Carts();
const productInstance = new Products();

import TicketService from '../service/ticket.service.js';
const ticketServiceInstance = new TicketService();

//======== { getAll_Carts / mostrar todos los carritos } ========
const getAll_Carts = async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send({ status: "error", error: "Unauthorized" });
        }
        req.user = user;

        if (!Array.isArray(req.user.carts)) {
            throw new Error("User object does not have a valid carts property");
        }
        
        try {
            // Obtenga solo los carritos asociados con el usuario actual
            const cartIds = req.user.carts.map(c => c.cart);
            /* const carts = await getAll(cartIds); */
            const carts = await cartInstance.getAll(cartIds);

            if (carts.some(cart => !Array.isArray(cart.products))) {
                throw new Error("Some cart objects do not have a valid products property");
            }            

            // Transforma la respuesta
            const transformedCarts = carts.map(cart => {
                cart.products = cart.products.map(p => ({
                    id: p.product,
                    quantity: p.quantity
                }));
                return cart;
            });
            

            res.send({ status: 'success', payload: transformedCarts });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    })(req, res, next);
};
//======== { getAll_Carts / mostrar todos los carritos } ========

//======== { getID_Carts / mostrar por ID los carritos } ========
const getID_Carts = async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send({ status: "error", error: "Unauthorized" });
        }
        req.user = user;
        const { cid } = req.params;
        try {
            // Compruebe si el carrito pertenece al usuario actual.
            const cartIds = req.user.carts.map(c => c.cart.toString());
            if (!cartIds.includes(cid)) {
                return res.status(404).send({ error: 'Cart not found' });
            }

            // Consigue el carrito
            const cart = await cartInstance.getId(cid);
            if (!cart) {
                return res.status(404).send({ error: 'Cart not found' });
            }

            // Transforma la respuesta
            const transformedCart = cart.products.map(p => ({
                id: p.product,
                quantity: p.quantity
            }));

            res.send({ status: "success", payload: [cart] });
        } catch (error) {
            res.status(500).send({ status: "error", error });
        }
    })(req, res, next);
};
//======== { getID_Carts / mostrar por ID los carritos } =======

//======== { post_Carts / crear los carritos } =======
const post_Carts = async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send({ status: "error", error: "Unauthorized" });
        }
        req.user = user;
        const { cart } = req.body;
        try {
            // Crea el carrito
            const result = await cartInstance.create({ cart });

            // Asociar el carrito con el usuario actual
            req.user.carts.push({ cart: result._id });
            await req.user.save();

            res.send({ status: "success", payload: result });
        } catch (error) {
            res.status(500).send({ status: "error", error });
        }
    })(req, res, next);
};
//======== { post_Carts / crear los carritos } =======

//======== { postProds_Carts / pasar productos a los carritos } =======
const postProds_Carts = async (req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const result = await cartInstance.addProductToCart(cartId, prodId, quantity);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.message });
    }
};
//======== { postProds_Carts / pasar productos a los carritos } =======

//======== { put_Carts / actualizar los carritos } =======
const put_Carts = async (req, res) => {
    const cartId = req.params.cid;
    const sort = req.query.sort;

    try {
        const result = await cartInstance.updateCart(cartId, sort, req.query.page, req.query.limit);
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
//======== { put_Carts / actualizar los carritos } =======

//======== { putProds_Carts / actualizar los productos de los carritos } =======
const putProds_Carts = async (req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const result = await cartInstance.updateProductToCart(cartId, prodId, quantity);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
//======== { putProds_Carts / actualizar los productos de los carritos } =======

//======== { deleteProdsOne_Carts / borrar un solo producto del carrito según su ID } =======
const deleteProdsOne_Carts = async (req, res) => {

    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
    const remainingQuantity = await cartInstance.deleteProdsOneToCart(cartId, prodId, quantity);
    res.send({ status: 'success', payload: { id: prodId, quantity: remainingQuantity } });
    }
    catch (error) {
    res.status(500).send({ error: error.message });
    }
};
//======== { deleteProdsOne_Carts / borrar un solo producto del carrito según su ID } =======

//======== { delete_Carts / eliminar un carrito } =======
const delete_Carts = async (req, res) => {
    const { cid } = req.params; 

    try {
        const result = await cartInstance.erase(cid);
        res.send({ status: "success", payload: result });
    }
    catch (error){
        res.status(500).send({ status: "error", error});
    }
};
//======== { delete_Carts / eliminar un carrito } =======

//======== { deleteProds_Carts / borrar todos los productos de un carrito } =======
const deleteProds_Carts = async (req, res) => {
    const cartId = req.params.cid;

    try {
    const result = await cartInstance.deleteProdsToCart(cartId);

    // Enviar respuesta al cliente
    res.send({ status: 'success', payload: { products: [] } });
    } catch (error) {
    res.status(500).send({ error: error.message });
    }
};
//======== { deleteProds_Carts / borrar todos los productos de un carrito } =======

const purchase_Cart = async (req, res, next) => {
    passport.authenticate('jwt', { session: !1 }, async (err, user, info) => {
        if (err) { return next(err) }
        if (!user) { return res.status(401).send({ status: "error", error: "Unauthorized" }) }
        req.user = user;
        const { cid } = req.params;
        try {
            // Obtener el carrito con el id especificado
            const cartIds = req.user.carts.map(c => c.cart.toString());
            if (!cartIds.includes(cid)) { return res.status(404).send({ error: 'Cart not found' }) }
            const cart = await cartInstance.getId(cid);
            if (!cart) { return res.status(404).send({ error: 'Cart not found' }) }

            // Verificar el stock de los productos en el carrito
            let productsToPurchase = [];
            let productsOutOfStock = [];

            if (Array.isArray(cart.products)) {
                for (let product of cart.products) {
                    // Obtener la información del producto
                    const productInfo = await productInstance.getID_Products(product.id);
                
                    // Verificar si hay suficiente stock para el producto
                    if (product.quantity <= productInfo.stock) {
                        // Hay suficiente stock, restar la cantidad del stock del producto
                        await productInstance.updateProductStock(product.id, productInfo.stock - product.quantity);
                
                        // Agregar el producto a productsToPurchase
                        productsToPurchase.push(product);
                    } else {
                        // No hay suficiente stock, agregar el id del producto a productsOutOfStock
                        productsOutOfStock.push(product.id);
                    }
                }
            }

            // Calcular el monto total de la compra
            let totalAmount = 0;
            for (let product of productsToPurchase) {
                totalAmount += product.price * product.quantity;
            }

            // Generar un ticket con los datos de la compra
            const ticket = await ticketServiceInstance.createTicket({
                amount: totalAmount,
                purchase_datetime: new Date(),
                purchaser: req.user.email,
                user: req.user._id,
                products: productsToPurchase
            });

            // Devolver una respuesta con el ticket y los productos que no pudieron procesarse
            res.send({
                status: 'success',
                payload: {
                    ticket,
                    productsOutOfStock
                }
            });

            // Actualizar el carrito para que solo contenga los productos que no pudieron comprarse
            // Aquí debes actualizar el carrito para que solo contenga los productos en productsOutOfStock
        } catch (error) {
            res.status(500).send({ error: error.message })
        }
    })(req, res, next)
}





export { getAll_Carts, getID_Carts, post_Carts, postProds_Carts, put_Carts, putProds_Carts, deleteProdsOne_Carts, delete_Carts, deleteProds_Carts, purchase_Cart };