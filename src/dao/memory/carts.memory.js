import mongoose from 'mongoose';

export default class Carts {
    constructor() {
        this.data = [];
    }

    create = async (cart) => {
        cart._id = new mongoose.Types.ObjectId();
        this.data.push(cart);
        return cart;
    }

    getId = async (id) => {
        const objectId = new mongoose.Types.ObjectId(id);
        return this.data.find(c => c._id.equals(objectId));
    }

    erase = async (id) => {
        const objectId = new mongoose.Types.ObjectId(id);
        const index = this.data.findIndex(c => c._id.equals(objectId));
        if (index !== -1) {
            this.data.splice(index, 1);
        }
        return { id };
    }

    getAll = async (ids) => {
        const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
        const carts = this.data.filter(c => objectIds.some(objectId => c._id.equals(objectId)));
        carts.forEach(cart => {
            cart.products || (cart.products = []);
        });
        return carts;
    }

    addProductToCart = async (cartId, productId, quantity) => {
        const cartObjectId = new mongoose.Types.ObjectId(cartId);
        const productObjectId = new mongoose.Types.ObjectId(productId);
        const cart = this.data.find(c => c._id.equals(cartObjectId));
        if (!cart) throw new Error("Cart not found");

        // Obtener el producto y verificar el stock
        const product = await productRepository.findById(productId);
        if (!product) throw new Error("Product not found");
        if (quantity > product.stock) throw new Error("Insufficient stock");

        cart.products || (cart.products = []);
        let index = cart.products.findIndex(p => {
            if (!p.product) throw new Error("Product property is missing");
            return p.product.equals(productObjectId);
        });
        let finalQuantity = quantity;
        if (index !== -1) {
            // Verificar que la cantidad total no exceda el stock
            if (cart.products[index].quantity + quantity > product.stock) throw new Error("Insufficient stock");
            cart.products[index].quantity += quantity;
            finalQuantity = cart.products[index].quantity;
        } else {
            // Verificar que la cantidad solicitada no exceda el stock
            if (quantity > product.stock) throw new Error("Insufficient stock");
            cart.products.push({ product: productObjectId, quantity });
        }
        return { id: productId, quantity: finalQuantity };
    }

    updateProductToCart = async (cartId, productId, quantity) => {
        const cartObjectId = new mongoose.Types.ObjectId(cartId);
        const productObjectId = new mongoose.Types.ObjectId(productId);
        const cart = this.data.find(c => c._id.equals(cartObjectId));
        if (!cart) throw new Error("Cart not found");

        // Obtener el producto y verificar el stock
        const product = await productRepository.findById(productId);
        if (!product) throw new Error("Product not found");
        if (quantity > product.stock) throw new Error("Insufficient stock");

        cart.products || (cart.products = []);
        let index = cart.products.findIndex(p => p.product.equals(productObjectId));
        let finalQuantity = quantity;
        if (index !== -1) {
            // Verificar que la cantidad total no exceda el stock
            if (quantity > product.stock) throw new Error("Insufficient stock");
            cart.products[index].quantity = quantity;
            finalQuantity = cart.products[index].quantity;
        } else {
            // Verificar que la cantidad solicitada no exceda el stock
            if (quantity > product.stock) throw new Error("Insufficient stock");
            cart.products.push({ product: productObjectId, quantity });
        }
        return { id: productId, quantity: finalQuantity };
    }


    updateCart = async (cartId, sort, page, limit) => {
        const cartObjectId = new mongoose.Types.ObjectId(cartId);
        const cartIndex = this.data.findIndex(c => c._id.equals(cartObjectId));
        if (cartIndex === -1) throw new Error("Cart not found");
        const cart = this.data[cartIndex];
        if (sort === 'asc') {
            cart.products.sort((a, b) => a.quantity - b.quantity);
        } else if (sort === 'desc') {
            cart.products.sort((a, b) => b.quantity - a.quantity);
        }
        let skip = ((page = parseInt(page) || 1) - 1) * (limit = parseInt(limit) || 3);
        const products = cart.products.map(p => ({ id: p.product.toString(), quantity: p.quantity }));
        var payload = products.slice(skip, skip + limit),
            totalProducts = products.length,
            totalPages = Math.ceil(totalProducts / limit),
            hasPrevPage = page > 1,
            hasNextPage = page < totalPages;
        return {
            status: "success", payload, totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page, hasPrevPage, hasNextPage
        };
    }

    deleteProdsOneToCart = async (cartId, productId, quantity) => {
        const cartObjectId = new mongoose.Types.ObjectId(cartId);
        const productObjectId = new mongoose.Types.ObjectId(productId);
        const index = this.data.findIndex(c => c._id.equals(cartObjectId));
        if (index === -1) throw new Error("Cart not found");
        let prodIndex = this.data[index].products.findIndex(p => p.product && p.product.toString() === productObjectId.toString());
        if (prodIndex === -1) throw new Error("Product not found in cart");
        this.data[index].products[prodIndex].quantity -= quantity;
        let finalQuantity = this.data[index].products[prodIndex].quantity;
        if (this.data[index].products[prodIndex].quantity <= 0) {
            this.data[index].products.splice(prodIndex, 1);
            finalQuantity = 0;
        }
        return finalQuantity;
    }

    deleteProdsToCart=async(cartId)=>{
        const objectId=new mongoose.Types.ObjectId(cartId);
        const index=this.data.findIndex(c=>c._id.equals(objectId));
        if(index===-1)throw new Error("Cart not found");
        this.data[index].products=[];
    }
}



//#############----{ CONCEPTOS }----#############


// ➤ ¿Que son las funciones equals y some?

/* equals es un método de los objetos ObjectId de Mongoose que se utiliza para comparar 
dos objetos ObjectId y determinar si representan el mismo valor. Este método toma como
argumento otro objeto ObjectId y devuelve true si ambos objetos representan el mismo
valor, o false en caso contrario.

some es un método de los arrays de JavaScript que se utiliza para determinar si al menos
un elemento del array cumple con una condición especificada. Este método toma como argumento
una función de callback que se ejecuta para cada elemento del array. Si la función de callback
devuelve true para al menos un elemento del array, el método some devuelve true. De lo contrario,
devuelve false.

En resumen, equals es un método de los objetos ObjectId de Mongoose que se utiliza para comparar
dos objetos ObjectId, mientras que some es un método de los arrays de JavaScript que se utiliza 
para determinar si al menos un elemento del array cumple con una condición especificada. */