const router = require("express").Router();

//definimos la ruta de login
router.get("/", (req, res) => {
    res.send("login");
});

module.exports = router;
