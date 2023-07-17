import mongoose from 'mongoose';

export default class Products {
    constructor() {
        this.data = [];
    }

    get_Products = async (filter, options) => {
        return this.data;
    }

    getID_Products = async (pid) => {
        const objectId = new mongoose.Types.ObjectId(pid);
        return this.data.filter(c => c._id.equals(objectId));
    }

    post_Products = async (prod) => {
        prod._id = new mongoose.Types.ObjectId();
        console.log(prod);
        this.data.push(prod);
        return prod;
    }

    put_Products = async (pid, prod) => {
        const objectId = new mongoose.Types.ObjectId(pid);
        const index = this.data.findIndex(c => c._id.equals(objectId));
        this.data[index] = { ...this.data[index], ...prod };
        return this.data[index];
    }
    
    
    delete_Products = async (pid) => {
        const objectId = new mongoose.Types.ObjectId(pid);
        const index = this.data.findIndex(c => c._id.equals(objectId));
        this.data.splice(index, 1);
        return { id: pid };
    }    
    
    updateProductStock = async (productId, newStock) => {
        // Buscar el producto en el arreglo de productos
        const product = this.data.find(p => p._id.equals(productId));
        if (!product) throw new Error("Product not found");
        // Actualizar el stock del producto
        product.stock = newStock;
    }
    
}