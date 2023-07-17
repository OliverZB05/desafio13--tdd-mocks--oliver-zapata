import { Router } from 'express';
import userModel from '../../dao/dbManagers/models/users.model.js';
import passport from 'passport';
import { createHash } from '../../utils.js';

const router = Router();

//========= Register =========
router.post('/register', (req, res, next) => {
passport.authenticate('register', (err, data, info) => {
if (err) return next(err);
if (!data) return res.send({ status: 'error', message: info.message });
res.cookie('jwt', data.token, { httpOnly: true });

res.send({ status: 'success', message: 'User registered', token: data.token });
})(req, res, next);
});

//========= Register =========

//========= Login =========
router.post('/login', (req, res, next) => {
passport.authenticate('login', (err, data, info) => {
if (err) return next(err);
if (!data) return res.send({ status: 'error', message: info.message });
res.cookie('jwt', data.token, { httpOnly: true });

res.send({ status: 'success', message: 'Login success', token: data.token });
})(req, res, next);
});

//========= Login =========

//========= Github =========

router.get('/github', passport.authenticate(
'github', { scope: ['user:email'] }
), async (req, res) => {
res.send({ status: "success", message: "User registered" })
});

router.get('/github-callback', passport.authenticate(
'github', { failureRedirect: '/login' }
), async (req, res) => {
res.cookie('jwt', req.user.token, { httpOnly: true });
res.redirect('/products');
});


//========= Github =========

//========= Reset =========
router.post('/reset', async (req, res) => {
try {
const { email, password } = req.body;

if (!email || !password) return res.status(400).send({ status: 'error', error: 'Incomplete values' });

const user = await userModel.findOne({ email });

if (!user) return res.status(400).send({ status: 'error', error: 'Este correo no coincide con ningún usuario registrado' });

user.password = createHash(password);

await userModel.updateOne({ email }, user);

res.send({ status: 'success', message: 'Password reset' })
} catch (error) {
res.status(500).send({ status: 'error', error: error.message });
}
})
//========= Reset =========


router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
res.send({ status: 'success', user: req.user });
});


//========= Logout =========
const logout = (req, res) => {
    // Limpiando cookie de JWT
    res.clearCookie('jwt');

    //Destruir sesión
    req.session.destroy(err => {
        if (err) return res.status(500).send({ status: 'error', error: 'Logout fail' });
        res.redirect('/')
    })
};

router.get('/logout', logout);

//========= Logout =========

export { router as default, logout };



//#############----{ CONCEPTOS }----#############


// ➤ Explicación de lo que pasa en sessions.router.js

/* en el archivo sessions.router.js, se está utilizando Passport para autenticar
y manejar las solicitudes de registro, inicio de sesión, restablecimiento 
de contraseña y cierre de sesión de los usuarios. Las funciones
passport.authenticate(...) se encargan de llamar a las estrategias
correspondientes y manejar el resultado de la autenticación */




// ➤ Diferencias entre las rutas /github y la ruta /github-callback

/* La ruta /github y la ruta /github-callback son utilizadas para autenticar al usuario 
utilizando su cuenta de GitHub.

La ruta /github utiliza la función passport.authenticate('github', ...) para redirigir
al usuario a la página de inicio de sesión de GitHub. En esta página, el usuario debe
ingresar sus credenciales de GitHub y autorizar el acceso a su cuenta. Una vez que
el usuario autoriza el acceso, es redirigido a la ruta /github-callback.

La ruta /github-callback utiliza la función passport.authenticate('github', ...) para
completar el proceso de autenticación. Esta función verifica si el usuario autorizó
correctamente el acceso a su cuenta de GitHub y, si es así, crea un token JWT para
el usuario y lo almacena en una cookie. Finalmente, el usuario es redirigido a la
página de productos.

En resumen, la ruta /github se utiliza para redirigir al usuario a la página de inicio 
de sesión de GitHub, mientras que la ruta /github-callback se utiliza para completar el
proceso de autenticación una vez que el usuario autoriza el acceso a su cuenta de GitHub. */

