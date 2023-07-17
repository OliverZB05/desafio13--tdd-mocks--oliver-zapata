import CartRepository from '../../repositories/carts.repository.js';
import ProductRepository from '../../repositories/products.repository.js';

const cartRepository = new CartRepository();
const productRepository = new ProductRepository(); 

export default class Carts {
    create = async (cart) => {
        const result = await cartRepository.create(cart);
        return result;
    }

    getId = async (id) => {
        const cart = await cartRepository.findOne({ _id: id });
        return cart;
    }

    erase = async (id) => {
        const result = await cartRepository.deleteOne({ _id: id });
        return result;
    }

    getAll = async (ids) => {
        const carts = await cartRepository.find({ _id: { $in: ids } });
        return carts;
    }

    addProductToCart = async (cartId, productId, quantity) => {
        const cart = await cartRepository.findById(cartId);
        if (!cart) throw new Error("Cart not found");
    
        // Obtener el producto y verificar el stock
        const product = await productRepository.findById(productId);
        if (!product) throw new Error("Product not found");
        if (quantity > product.stock) throw new Error("Insufficient stock");
    
        cart.products || (cart.products = []);
        let index = cart.products.findIndex(p => p.product.equals(productId));
        let finalQuantity = quantity;
        if (index !== -1) {
            // Verificar que la cantidad total no exceda el stock
            if (cart.products[index].quantity + quantity > product.stock) throw new Error("Insufficient stock");
            cart.products[index].quantity += quantity;
            finalQuantity = cart.products[index].quantity;
        } else {
            // Verificar que la cantidad solicitada no exceda el stock
            if (quantity > product.stock) throw new Error("Insufficient stock");
            cart.products.push({ product: productId, quantity });
        }
        await cart.save();
        return { id: productId, quantity: finalQuantity };
    }


    updateProductToCart = async (cartId, productId, quantity) => {
        const cart = await cartRepository.findById(cartId);
        if (!cart) throw new Error("Cart not found");
    
        // Obtener el producto y verificar el stock
        const product = await productRepository.findById(productId);
        if (!product) throw new Error("Product not found");
        if (quantity > product.stock) throw new Error("Insufficient stock");
    
        cart.products || (cart.products = []);
        let index = cart.products.findIndex(p => p.product.equals(productId));
        let finalQuantity = quantity;
        if (index !== -1) {
            // Verificar que la cantidad total no exceda el stock
            if (quantity > product.stock) throw new Error("Insufficient stock");
            cart.products[index].quantity = quantity;
            finalQuantity = cart.products[index].quantity;
        } else {
            // Verificar que la cantidad solicitada no exceda el stock
            if (quantity > product.stock) throw new Error("Insufficient stock");
            cart.products.push({ product: productId, quantity });
        }
        await cart.save();
        return { id: productId, quantity: finalQuantity };
    }
    
    
    updateProductToCart = async (cartId, productId, quantity) => {
        const cart = await cartRepository.findById(cartId);
        if (!cart) throw new Error("Cart not found");
        if (!productId) throw new Error("Product not found");
        cart.products || (cart.products = []);
        let index = cart.products.findIndex(p => p.product.equals(productId));
        let finalQuantity = quantity;
        if (index !== -1) {
            cart.products[index].quantity += quantity;
            finalQuantity = cart.products[index].quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        await cart.save();
        return { id: productId, quantity: finalQuantity };
    }

    updateCart = async (cartId, sort, page, limit) => {
        const cart = await cartRepository.findByIdPage(cartId);
        console.log(cart);
        cart.populate("products.product");
        if (!cart) throw new Error("Cart not found");
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
        const cart = await cartRepository.findById(cartId);
        if (!cart) throw new Error("Cart not found");
        cart.products || (cart.products = []);
        let index = cart.products.findIndex(p => p.product.equals(productId));
        let finalQuantity = 0;
        if (index === -1) throw new Error("Product not found in cart");
        cart.products[index].quantity -= quantity;
        finalQuantity = cart.products[index].quantity;
        if (cart.products[index].quantity <= 0) {
            cart.products.splice(index, 1);
            finalQuantity = 0;
        }
        await cart.save();
        return finalQuantity;
    }

    deleteProdsToCart = async(cartId)=>{
    const cart=await cartRepository.findById(cartId);
    if(!cart)throw new Error("Cart not found");
    cart.products=[];
    await cart.save();
}
}