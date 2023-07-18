import { Router } from 'express';
import sessionsRouter, { logout } from '../api/sessions.router.js';


const router = Router();

//Acceso público y privado
const publicAccess = (req, res, next) => {
    next();
}

const privateAccess = (req, res, next) => {
    if(!req.session.user) return res.redirect('/login');
    next();
}

router.get('/register', publicAccess, (req, res) => {
    res.render('register');
});

router.get('/reset', publicAccess, (req, res) => {
    res.render('reset');
});

router.get('/login', publicAccess, (req, res) => {
    res.render('login');
});

router.get('/', publicAccess, (req, res) => {
    res.render('login');
});


router.get('/chat', (req, res, next) => {
    let PastTests = 0;
    let TotalTests = 1;

    //======={ TDD }=======

    // 1. Identificar que si el usuario de inicio sesión o no
    if(!req.session.viewedProducts) { //viewedProducts detecta si el usuario a pasado antes por la vista de productos
        console.log('Test 1: Incorrecto, el usuario no inicio sesión');
        return res.redirect('/login');
    }
    if(req.session.user.role && req.session.viewedProducts){
        console.log(`Test 1: Correcto, ha iniciado sesión el usuario con el rol ${req.session.user.role}`);
        PastTests++;
    }

    if(PastTests === TotalTests) console.log('Pruebas pasadas exitosamente');
    console.log(`Se pasaron ${PastTests} tests de un total de ${TotalTests} en la vista chat`);
    console.log(" ");
    console.log(" ");

    //======={ TDD }=======

    next();
}, (req, res) => {
    res.render("chat", { role: req.session.user.role });
});

export default router;