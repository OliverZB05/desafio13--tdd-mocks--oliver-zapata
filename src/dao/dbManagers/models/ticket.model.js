import mongoose from 'mongoose';
import userModel from "./users.model.js"

const ticketsCollection = 'tickets';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        default: function() {
            // Generar un código único
            const timestamp = new Date().getTime().toString();
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            return `${timestamp}-${random}`;
        }
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: Number,
    purchaser: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
});

ticketSchema.pre('save', async function(next) {
    try {
        // Obtener la información del usuario asociado
        const user = await userModel.findById(this.user);
        if (user) {
            this.purchaser = user.email; // Asegúrate de que el modelo de usuario tenga un campo de correo electrónico
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Modificar cómo se representan los documentos de Ticket cuando se convierten a JSON
ticketSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        delete ret.user; // Eliminar el campo user del objeto resultante
        return ret;
    }
});

const ticketModel = mongoose.model(ticketsCollection, ticketSchema);

export default ticketModel;




//#############----{ CONCEPTOS }----#############


// ➤ ¿como funciona detalladamente la lógica del campo code?

/* El campo code del esquema ticketSchema es un campo de tipo String que tiene la propiedad unique 
establecida en true, lo que significa que cada documento en la colección debe tener un valor único
para este campo. Además, el campo code tiene una función como valor predeterminado que se utiliza 
para generar un código único cada vez que se crea un nuevo documento.

La función predeterminada del campo code utiliza la fecha y hora actual y un número aleatorio
para generar un código único. Primero, obtiene la fecha y hora actual en milisegundos utilizando
el método getTime del objeto Date y lo convierte en una cadena de caracteres. Luego, genera un 
número aleatorio entre 0 y 999 utilizando la función Math.random y lo convierte en una cadena de 
caracteres con un ancho fijo de 3 caracteres utilizando el método padStart. Finalmente, concatena 
la fecha y hora y el número aleatorio utilizando un guión como separador para generar el código único. */




// ➤ ¿que es el .set y el transform que se toman en cuenta allí? 

/* 
El método set del esquema de Mongoose se utiliza para establecer opciones de esquema. 
En tu caso, estás utilizando este método para establecer la opción toJSON, que se utiliza
para modificar cómo se representan los documentos cuando se convierten a JSON.

La opción toJSON toma como valor un objeto con varias propiedades. En tu caso, estás 
estableciendo la propiedad transform, que toma como valor una función que se ejecuta 
cada vez que un documento se convierte a JSON.

La función transform toma como argumentos tres parámetros: doc, ret y options. 
El parámetro doc es el documento original de Mongoose, el parámetro ret es el objeto 
plano que se convertirá a JSON y el parámetro options son las opciones de esquema.

Dentro de la función transform, estás eliminando el campo user del objeto ret utilizando
el operador delete. Esto hace que el campo user no aparezca en el objeto resultante 
cuando un documento se convierte a JSON.

En resumen, estás utilizando el método set del esquema para establecer la opción toJSON,
que se utiliza para modificar cómo se representan los documentos cuando se convierten a 
JSON. Estás estableciendo la propiedad transform de esta opción con una función que elimina 
el campo user del objeto resultante. */

