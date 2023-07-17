import passport from 'passport';
import { Router } from 'express';
import { getAll_Carts, getID_Carts, post_Carts, postProds_Carts, put_Carts, putProds_Carts, deleteProdsOne_Carts, delete_Carts, deleteProds_Carts, purchase_Cart } from '../../controllers/carts.controller.js';

const router = Router();

//======== { Métodos GET } ========
router.get('/getAll', getAll_Carts);
router.get('/:cid', getID_Carts);
//======== { Métodos GET } ========

//======== { Métodos POST } ========
router.post('/', post_Carts);

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Error: El usuario no ha iniciado sesión' });
}

const isUser = (req, res, next) => {
    if (req.user.role === 'user') {  
        return next();
    }
    res.status(403).json({ message: 'Error: Debes tener el rol user para pasar productos al carrito' });
}

router.post('/:cid/product/:pid', passport.authenticate('jwt', { session: false }), isLoggedIn, isUser, postProds_Carts);
router.post('/:cid/purchase', purchase_Cart);
//======== { Métodos POST } ========

//======== { Métodos PUT } ========
router.put('/:cid', put_Carts);
router.put('/:cid/product/:pid', putProds_Carts);
//======== { Métodos PUT } ========

//======== { Métodos DELETE } ========
router.delete('/:cid/product/:pid', deleteProdsOne_Carts);
router.delete('/deleteCart/:cid', delete_Carts);
router.delete('/:cid', deleteProds_Carts);
//======== { Métodos DELETE } ========

export default router;