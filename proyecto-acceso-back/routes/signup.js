// Definimos la ruta de signup
const router = require("express").Router();
const { jsonResponse } = require("../lib/jsonResponse");
const User = require("../esquema/user")

//definimos la ruta de signup
router.post("/", async (req, res) => {
    const { username, name, password } = req.body;

    //por si se manda la solicitud de singout sin ningun campo
    if (!!!username || !!!name || !!!password) {
        return res.status(400).json(
            jsonResponse(400, {
                error: "Fields are required",
            })
        )
    }

    try {

        const user = new User();
        const exists = await user.usernameExist(username);

        if (exists) {
            return res.status(400).json(
                jsonResponse(400, {
                    error: "Username already exists",
                })
            );
        }

        const newUser = new User({ username, name, password });


        newUser.save()

        //crear usuaruio en la base de datos
        res.status(200).json(jsonResponse(200, { message: "User created successfully" }))


    } catch (error) {
        res.status(500).json(
            jsonResponse(500, {
                error: "Error creating user"
            })
        )

    }
});

module.exports = router;
