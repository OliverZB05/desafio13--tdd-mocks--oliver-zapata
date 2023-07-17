import Factory from "../dao/factory.js";
const Products = Factory.Products;

import { productModel } from "../dao/mongo/models/products.model.js";

const products = new Products();
import ProductDto from '../dao/DTOs/config.dto.js';

//======== { get_Products / productos con paginación } ========
const get_Products = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Número de página actual
        const limit = parseInt(req.query.limit) || 3; // Número de documentos por página
        const skip = (page - 1) * limit; // Número de documentos a omitir

        // Agregar parámetros de consulta adicionales
        const category = req.query.category;
        const availability = req.query.availability;
        const sort = req.query.sort;

        // Construir objeto de filtro
        let filter = {};
        if (category) {
            filter.category = category;
        }
        if (availability) {
            filter.stock = availability === 'available' ? { $gt: 0 } : { $eq: 0 };
        }

        // Construir objeto de opciones
        let options = { skip, limit };
        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        // Obtener productos filtrados y ordenados
        const productsResult = await products.get_Products(filter, options);
        
        // Calcular información de paginación
        const totalProducts = await productModel.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;

        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;

        const prevLink = hasPrevPage ? `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${prevPage}&limit=${limit}` : null;
        const nextLink = hasNextPage ? `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${nextPage}&limit=${limit}` : null;

        res.send({
            status: "success",
            payload: productsResult,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        });
    }
    catch (error){
        res.status(500).send({ status: "error", error});
    }
}
//======== { get_Products / productos con paginación } ========

//======== { getID_Products / productos por su ID } ========
const getID_Products = async (req, res) => {
    const { pid } = req.params; 

    try {
        const productsResult = await products.getID_Products(pid);
        res.send({ status: "success", payload: productsResult });
    }
    catch (error){
        res.status(500).send({ status: "error", error});
    }
};
//======== { getID_Products / productos por su ID } ========

//======== { post_Products / crear productos } ========
const post_Products = async (req, res) => {
    const { title, description, price, thumbnail, stock, category } = req.body;

    if(!title || !description || !price || !thumbnail || !stock || !category){
        return res.status(400).send({ status: "error", error: "incomplete values"})
    }

    try{
        const existingProduct = await productModel.findOne({ title, description });
        if (existingProduct) {
            res.status(400).send({ status: "error", error: `El producto con título "${title}" y descripción "${description}" ya existe en la base de datos.` });
        } else {
            const productDto = new ProductDto({
                title,
                description,
                price,
                thumbnail,
                stock,
                category
            });

            const dbProduct = {...productDto};
            delete dbProduct["title/category"];

            const productsResult = await products.post_Products(dbProduct);

            const response = {...productDto};
            delete response.title;
            delete response.category;

            res.send({status: "success", payload: response});
        }
    }
    catch (error){
        res.status(500).send({ status: "error", error});
    }
};
//======== { post_Products / crear productos } ========

//======== { put_Products / actualizar productos } ========
const put_Products = async (req, res) => {
    const { title, description, price, thumbnail, stock, category } = req.body;
    const { pid } = req.params; 

    if(!title || !description || !price || !thumbnail || !stock || !category){
        return res.status(400).send({ status: "error", error: "incomplete values"})
    }

    try{
        const existingProduct = await productModel.findOne({ _id: { $ne: pid }, title, description });
        if (existingProduct) {
            res.status(400).send({ status: "error", error: `El producto con título "${title}" y descripción "${description}" ya existe en la base de datos.` });
        } else {
            const productDto = new ProductDto({
                title,
                description,
                price,
                thumbnail,
                stock,
                category
            });

            const dbProduct = { ...productDto, _id: pid };
            delete dbProduct["title/category"];

            const productsResult = await products.put_Products(pid, dbProduct);

            const response = {...productDto};
            delete response.title;
            delete response.category;

            res.send({status: "success", payload: response})
        }
    }
    catch (error){
        res.status(500).send({ status: "error", error});
    }
};

//======== { put_Products / actualizar productos } ========

//======== { delete_Products / borrar productos } ========
const delete_Products = async (req, res) => { 

    const { pid } = req.params; 

    try {
        const productsResult = await products.delete_Products(pid);
        res.send({ status: "success", payload: productsResult });
    }
    catch (error){
        res.status(500).send({ status: "error", error});
    }
};
//======== { delete_Products / borrar productos } ========

const updateProductStock = async (req, res) => {
    const { pid } = req.params;
    const { newStock } = req.body;
    try {
        // Actualizar el stock del producto
        await products.updateProductStock(pid, newStock);
        res.send({ status: "success" });
    } catch (error) {
        res.status(500).send({ status: "error", error });
    }
};


export { get_Products, getID_Products, post_Products, put_Products, delete_Products };