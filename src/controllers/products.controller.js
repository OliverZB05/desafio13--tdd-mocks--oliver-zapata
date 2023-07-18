import Factory from "../dao/factory.js";
const Products = Factory.Products;

import { productModel } from "../dao/mongo/models/products.model.js";
import { generateProduct } from "../utils.js";

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

    //======== { TDD de get_Products } ========
    let PastTests = 0;
    let TotalTests = 2;


    /* 1. Verificar que el método devuelve correctamente los productos filtrados
    por categoría y disponibilidad cuando se especifican en la consulta */
    if(sort !== undefined || sort !== null){
        console.log('Test 1: Correcto');
        PastTests++;
    }else{
        console.log('Test 1: Incorrecto');
    }

    // 2. Verificar que el método devuelve correctamente los productos ordenados
    // por precio cuando se especifica en la consulta
    let isSortedCorrectly = true;
    for(let i = 0; i < productsResult.length - 1; i++){
        if(sort === 'asc' && productsResult[i].price > productsResult[i + 1].price){
            isSortedCorrectly = false;
            break;
        }
        if(sort === 'desc' && productsResult[i].price < productsResult[i + 1].price){
            isSortedCorrectly = false;
            break;
        }
    }
    if(isSortedCorrectly){
        console.log('Test 2: Correcto');
        PastTests++;
    }else{
        console.log('Test 2: Incorrecto');
    }



    if(PastTests === TotalTests) console.log('Pruebas pasadas exitosamente')
    console.log(`Se pasaron ${PastTests} tests de un total de ${TotalTests} en el método get_Products`);
    console.log(" ");
    console.log(" ");
    //======== { TDD de get_Products } ========


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

        //======== { TDD de getID_Products } ========
        let PastTests = 0;
        let TotalTests = 1;

        // 1. Vefifica que devuelva el producto correcto según su id
        if(productsResult._id.toString() === pid.toString()) {
            console.log('Test 1: Correcto');
            PastTests++;
        } else {
            console.log('Test 1: Incorrecto');
        }
        

        if(PastTests === TotalTests) console.log('Pruebas pasadas exitosamente')
        console.log(`Se pasaron ${PastTests} tests de un total de ${TotalTests} en el método getID_Products`);
        console.log(" ");
        console.log(" ");
        //======== { TDD de getID_Products } ========
    }
    catch (error){
        res.status(500).send({ status: "error", error});
    }
}; 
//======== { getID_Products / productos por su ID } ========

//======== { post_Products / crear productos } ========
const post_Products = async (req, res) => {
    const { title, description, price, thumbnail, stock, category } = req.body;

    //======== { TDD de post_Products / parte 1 } ========
    let PastTests = 0;
    let TotalTests = 2;

    // 1. Verificar que se reciba un error en caso de que falten campos requeridos por especificar
    if(!title || !description || !price || !thumbnail || !stock || !category){
        let missingProperties = [];
        if(!title) missingProperties.push('title');
        if(!description) missingProperties.push('description');
        if(!price) missingProperties.push('price');
        if(!thumbnail) missingProperties.push('thumbnail');
        if(!stock) missingProperties.push('stock');
        if(!category) missingProperties.push('category');
    
        console.log(`Test 1: Incorrecto. Faltan las siguientes propiedades: ${missingProperties.join(', ')}`);
        return res.status(400).send({ status: "error", error: `Faltan las siguientes propiedades: ${missingProperties.join(', ')}`})
    }else{
        PastTests++;
        console.log('Test 1: Correcto');
    }
    
    //======== { TDD de post_Products / parte 1 } ========

    let response;

    try{
        //======== { TDD de post_Products / parte 2 } ========
        // 2. Verificar si el producto no existe
        const existingProduct = await productModel.findOne({ title, description });
        if (existingProduct) {
            console.log('Test 2: Incorrecto');
            res.status(400).send({ status: "error", error: `El producto con título "${title}" y descripción "${description}" ya existe en la base de datos.` });
        } else {
            PastTests++;
            console.log('Test 2: Correcto');
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

            response = {...productDto};
            delete response.title;
            delete response.category;

            res.send({status: "success", payload: response});
        }

        if(PastTests === TotalTests) console.log('Pruebas pasadas exitosamente')
        console.log(`Se pasaron ${PastTests} tests de un total de ${TotalTests} en el método post_Products`);
        console.log(" ");
        console.log(" ");
        //======== { TDD de post_Products / parte 2 } ========
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

//======== { updateProductStock / actualizar el stock del producto } ========
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
//======== { updateProductStock / actualizar el stock del producto } ========

//======== { mockingproducts / crear productos con mocks } ========
let productsCreated = 0;

const mockingproducts = async (req, res) => {
    if (productsCreated >= 50) {
        return res.status(400).send({ status: "error", message: "Ya se han creado 50 productos" });
    }
    try {
        for (let i = 0; i < 50; i++) {
            const product = generateProduct();
            await products.post_Products(product);
            productsCreated++;
        }
        res.send({ status: "success", message: "Se han creado 50 productos con éxito" });
    } catch (error) {
        res.status(500).send({ status: "error", error });
        console.error(error);
    }
};
//======== { mockingproducts / crear productos con mocks } ========

//======== { deleteMockingProducts / borrar solo los productos creados por mocks } ========
const deleteMockingProducts = async (req, res) => {
    try {
        await products.deleteMockingProducts({ isMockingProduct: true });
        res.send({ status: "success", message: "Se han eliminado los productos creados por el método mockingproducts" });
    } catch (error) {
        res.status(500).send({ status: "error", error });
        console.error(error);
    }
};
//======== { deleteMockingProducts / borrar solo los productos creados por mocks } ========

export { get_Products, getID_Products, post_Products, put_Products, delete_Products, mockingproducts, deleteMockingProducts };