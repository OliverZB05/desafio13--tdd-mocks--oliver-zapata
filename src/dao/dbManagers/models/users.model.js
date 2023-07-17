import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const userCollection = 'users';

//========={ Esquema de users }=========
const userSchema = new mongoose.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    age: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        default: "user"
    },

    carts: {
        type: [
            {
                cart: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'carts'
                }
            }
        ],
        ref: 'carts'
    }
});
//========={ Esquema de users }=========

userSchema.plugin(mongoosePaginate);


userSchema.pre('find', function () {
    this.populate('carts.cart');
});

const userModel = mongoose.model(userCollection, userSchema);
export default userModel;

//#############----{ CONCEPTOS }----#############


// ➤ Explicación de pre, plugin y populate

/* `pre` es un método de los esquemas de Mongoose que se utiliza para definir
funciones middleware que se ejecutan antes de ciertas operaciones en la
base de datos. 

Este método toma como primer argumento el nombre
de la operación a la que se quiere asociar el middleware
y como segundo argumento una función que se ejecutará antes de
la operación especificada.

`populate` es un método de las consultas de Mongoose que se 
utiliza para rellenar automáticamente las referencias a otros 
documentos en la base de datos. Este método toma como argumento 
el nombre del campo que contiene la referencia y, opcionalmente, un 
objeto con opciones adicionales. Cuando se ejecuta una consulta con `populate`,
Mongoose reemplaza automáticamente el valor del campo especificado con el documento 
referenciado.

`plugin` es un método de los esquemas de Mongoose que se utiliza para agregar 
funcionalidad adicional a los modelos. Este método toma como argumento una función 
que define el comportamiento del plugin y, opcionalmente, un objeto con opciones 
adicionales. Cuando se llama al método `plugin`, la función del plugin se ejecuta y 
puede modificar el comportamiento del esquema y del modelo asociado.

En tu código, estás utilizando estos métodos para definir un middleware que se ejecuta
antes de las operaciones `find`, para rellenar automáticamente las referencias a los 
carritos de compras en el campo `carts`, y para agregar la funcionalidad de paginación al 
modelo de usuario utilizando el plugin `mongoose-paginate-v2`.

- Estás utilizando el método `pre` para definir un middleware que se ejecuta antes de las
operaciones `find`. Dentro de este middleware, estás utilizando el método `populate` para
rellenar automáticamente las referencias a los carritos de compras en el campo `carts`.

- Estás utilizando el método `plugin` para agregar la funcionalidad de paginación al modelo 
de usuario utilizando el plugin `mongoose-paginate-v2`. Esto te permite utilizar métodos adicionales,
como `paginate`, para paginar los resultados de las consultas al modelo de usuario.

En resumen, `pre` es un método que se utiliza para definir funciones middleware que se ejecutan 
antes de ciertas operaciones en la base de datos, `populate` es un método que se utiliza para 
rellenar automáticamente las referencias a otros documentos en la base de datos, y `plugin` es un 
método que se utiliza para agregar funcionalidad adicional a los modelos. */

