const mongoose = require("mongoose");
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

module.exports = mongoose.model("User", userSchema);