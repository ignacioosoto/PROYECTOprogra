const router = require("express").Router();

//definimos la ruta de signout
router.get("/", (req, res) => {
    res.send("signout");
});

module.exports = router;
