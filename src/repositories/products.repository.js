import { productModel } from "../dao/mongo/models/products.model.js";

export default class ProductRepository {
    async find(filter, options) {
        const products = await productModel.find(filter, null, options);
        return products;
    }

    async findOne(filter) {
        const product = await productModel.findOne(filter);
        return product;
    }

    async create(product) {
        const result = await productModel.create(product);
        return result;
    }

    async updateOne(filter, update) {
        const result = await productModel.updateOne(filter, update);
        return result;
    }

    async deleteOne(filter) {
        const result = await productModel.deleteOne(filter);
        return result;
    }

    async findById(id) {
        const product = await productModel.findById(id);
        return product;
    }
}