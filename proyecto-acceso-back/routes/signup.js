const router = require("express").Router();
const { jsonResponse } = require("../lib/jsonResponse");
const User = require("../esquema/user")
<<<<<<< HEAD:proyecto-acceso-back/routes/singnup.js
=======

>>>>>>> c9ab5c2242b417b915c6283d9a46ae2af3d8a04f:proyecto-acceso-back/routes/signup.js

//definimos la ruta de signup
router.post("/", (req, res) => {
    const { username, name, password } = req.body;

    //por si se manda la solicitud de singout sin ningun campo
    if (!!!username || !!!name || !!!password) {
        return res.status(400).json(
            jsonResponse(400, {
                error: "Fields are required",
            })
        )
    }

<<<<<<< HEAD:proyecto-acceso-back/routes/singnup.js

    const user = new User({ username, name, password });

    user.save();
=======
    const user = new User({ username, name, password });

    user.save()
>>>>>>> c9ab5c2242b417b915c6283d9a46ae2af3d8a04f:proyecto-acceso-back/routes/signup.js

    //crear usuaruio en la base de datos
    res.status(200).json(jsonResponse(200, { message: "User created successfully" }))


    //res.send("signout");
});

module.exports = router;
