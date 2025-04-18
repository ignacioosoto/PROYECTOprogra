const router = require("express").Router();

//definimos la ruta de signup
router.get("/", (req, res) => {
    res.send("signup");
});

module.exports = router;
