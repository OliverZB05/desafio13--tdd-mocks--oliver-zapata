import { Router } from 'express';
import { get_Products, getID_Products, post_Products, put_Products, delete_Products } from '../../controllers/products.controller.js';

const router = Router();

//======== { Métodos GET } ========
router.get('/', get_Products);
router.get('/:pid', getID_Products);
//======== { Métodos GET } ========

//======== { Otros métodos } ========
router.post('/', post_Products);
router.put('/:pid', put_Products);
router.delete('/:pid', delete_Products);
//======== { Otros métodos } ========

export default router;
