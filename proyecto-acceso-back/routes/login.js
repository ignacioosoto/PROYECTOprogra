const router = require("express").Router();
const { jsonResponse } = require("../lib/jsonResponse");
const User = require("../esquema/user");
const { json } = require("express");
const getUserInfo = require("../lib/getUserInfo");


//definimos la ruta de signup
router.post("/", async (req, res) => {
    const { username, password } = req.body;

    //por si se manda la solicitud de singout sin ningun campo
    if (!!!username || !!!password) {
        return res.status(400).json(
            jsonResponse(400, {
                error: "Fields are required",
            })
        )
    }

    const user = await User.findOne({ username });

    if (user) {
        const correctPassword = await user.comparePassword(password, user.password);

        if (correctPassword) {

            //autenticar usuaruio 
            const accessToken = user.createAccessToken();
            const refreshToken = await user.createRefreshToken();

            res.status(200).json(jsonResponse(200, { user: getUserInfo(user), accessToken, refreshToken }))
        } else {
            res.status(400).json(
                jsonResponse(400, {
                    error: "User or password incorrect",
                })
            )

        }

    } else {
        res.status(400).json(
            jsonResponse(400, {
                error: "User not found",
            })
        )

    }

});

module.exports = router;
