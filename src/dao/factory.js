import config from "../config/config.js";

let Carts;
let Products;
const persistence = config.persistence;

switch(persistence) {
    case 'MONGO':
        console.log('Trabajando con BDD');
        const mongoose = await import("mongoose");
        await mongoose.connect(config.mongoUrl);
        const { default: CartsMongo } = await import('./mongo/carts.mongo.js');
        const { default: ProductsMongo } = await import('./mongo/products.mongo.js');
        Carts = CartsMongo;
        Products = ProductsMongo;
        break;
    case 'MEMORY':
        console.log('Trabajando con MEMORY');
        const { default: CartsMemory } = await import('./memory/carts.memory.js');
        const { default: ProductsMemory } = await import('./memory/products.memory.js');
        Carts = CartsMemory;
        Products = ProductsMemory;
        break;
}

export default {
    Carts,
    Products
}