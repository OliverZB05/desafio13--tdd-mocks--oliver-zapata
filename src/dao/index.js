import mongoProductsDao from './dbManagers/products.dao.js'
//Import del dao de manejo de datos con archivos

const MongoProductsDao = new mongoProductsDao();
//Crear las instancia de manejo de datos con archivos

export const PRODUCTSDAO = MongoProductsDao;
