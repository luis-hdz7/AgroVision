import {Router} from "express"


const router = Router();

router.get("/", (req, res) => {
    res.json({
        message: "Farms module active" //mensaje para confirmar que el modulo esta activo
    });
});

export default router;

