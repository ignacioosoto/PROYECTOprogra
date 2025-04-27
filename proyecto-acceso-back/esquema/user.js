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

//comprobacion de que el usuario ingresado en signup no tiene vinculado ningun registro anterior
userSchema.methods.usernameExist = async function (username) {
    const result = await mongoose.model("User").findOne({ username })
    return !!result > 0
}

userSchema.methods.comparePassword = async function (password, hash) {
    const same = await bcrypt.compare(password, hash);
    return same;
}

module.exports = mongoose.model("User", userSchema);