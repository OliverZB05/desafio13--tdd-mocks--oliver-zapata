import { cartsModel } from "../dao/mongo/models/carts.model.js";

export default class CartRepository {
    
    async create (cart) {
        const result = await cartsModel.create(cart);
        return result;
    }

    async findOne(filter) {
        const cart = await cartsModel.findOne(filter).lean();
        return cart;
    }

    async deleteOne(filter) {
        const result = await cartsModel.deleteOne(filter);
        return result;
    }

    async find(filter) {
        const carts = await cartsModel.find(filter).lean();
        return carts;
    }

    async findById(id) {
        const cart = await cartsModel.findById(id);
        return cart;
    }

    async findByIdPage(id) {
        const query = cartsModel.findById(id).exec();
        return query;
    }

    async save(cart) {
        await cart.save();
    }
}



//#############----{ CONCEPTOS }----#############


// ➤ Explicación de exec()

/* exec es un método de Mongoose que se utiliza para ejecutar una consulta
y devolver un objeto Promise. Este método se utiliza después de construir
una consulta utilizando los métodos de consulta de Mongoose, como find, 
findOne, findById, entre otros.

En tu código, estás utilizando el método exec en la función findByIdPage
para ejecutar una consulta que busca un carrito de compras en la base de 
datos utilizando su ID. Primero, estás utilizando el método findById del 
modelo de carrito para construir una consulta que busca un carrito de compras
con el ID especificado. Luego, estás utilizando el método exec para ejecutar la
consulta y devolver un objeto Promise que se resuelve con el resultado de la consulta.

En resumen, exec es un método de Mongoose que se utiliza para ejecutar una consulta
y devolver un objeto Promise. En tu código, estás utilizando este método en la función
findByIdPage para ejecutar una consulta que busca un carrito de compras en la base de 
datos utilizando su ID. */