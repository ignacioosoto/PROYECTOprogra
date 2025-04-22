<<<<<<< HEAD
const mongoose = require("mongoose");
=======
const Mongoose = require("mongoose");
>>>>>>> c9ab5c2242b417b915c6283d9a46ae2af3d8a04f
const bcrypt = require("bcrypt");

//ingresar un nuevo usuario conectado con la base de datos

const userSchema = new mongoose.Schema({
    id: { type: Object },
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    name: { type: String, require: true },
})


//encriptado de la clave password
userSchema.pre("save", function (next) {
    if (this.isModified("password") || this.isNew) {
        const document = this;
        bcrypt.hash(document.password, 10, (err, hash) => {
            if (err) {
                next(err);
            } else {
                document.password = hash;
                next();
            }
        })
    } else {
        next();
    }
})

<<<<<<< HEAD
module.exports = mongoose.model("User", userSchema);
=======
module.exports = Mongoose.model("User", userSchema);
>>>>>>> c9ab5c2242b417b915c6283d9a46ae2af3d8a04f
