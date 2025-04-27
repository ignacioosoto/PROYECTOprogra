const router = require("express").Router();
const { jsonResponse } = require("../lib/jsonResponse");
const User = require("../esquema/user")

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

    const user = new User({ username, name, password });

    user.save()

    //crear usuaruio en la base de datos
    res.status(200).json(jsonResponse(200, { message: "User created successfully" }))


    //res.send("signout");
});

module.exports = router;
