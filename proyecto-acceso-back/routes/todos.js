const router = require("express").Router();

//definimos la ruta de to do
router.get("/", (req, res) => {
    res.send("to dos");
});

module.exports = router;
