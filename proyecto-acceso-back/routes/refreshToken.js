const router = require("express").Router();

//definimos la ruta de refresh tokens
router.get("/", (req, res) => {
    res.send("refresh tokens");
});

module.exports = router;
