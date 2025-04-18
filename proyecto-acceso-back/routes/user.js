const router = require("express").Router();

//definimos la ruta de users
router.get("/", (req, res) => {
    res.send("user");
});

module.exports = router;
