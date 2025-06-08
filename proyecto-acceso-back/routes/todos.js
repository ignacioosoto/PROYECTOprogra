const router = require("express").Router();

//definimos la ruta de to d
router.get("/", (req, res) => {
    res.send("to dos");
});

module.exports = router;
