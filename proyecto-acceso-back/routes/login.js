const router = require("express").Router();
const { jsonResponse } = require("../lib/jsonResponse");


//definimos la ruta de signup
router.post("/", (req, res) => {
    const { username, password } = req.body;

    //por si se manda la solicitud de singout sin ningun campo
    if (!!!username || !!!password) {
        return res.status(400).json(
            jsonResponse(400, {
                error: "Fields are required",
            })
        )
    }

    //autenticar usuaruio 
    const accessToken = "access_token";
    const refreshToken = "refresh_token";
    const user = {
        id: "1",
        name: "Jhon Doe",
        username: "XXXXXXX",
    }
    res.status(200).json(jsonResponse(200, { user, accessToken, refreshToken }))

});

module.exports = router;
