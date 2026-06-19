import express from "express";
import cors from "cors";
import farmRoutes from "./modules/farms/routs/farmRoutes"
import fieldRoutes from "./modules/fields/routes/fieldRoutes"

const app = express();

//middleware base
app.use(cors());
app.use(express.json());

//rutas modulares

app.use("/api/farm", farmRoutes);
app.use("/api/fields", fieldRoutes);


//ruta de prueba
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString()
    });
});

export default app;