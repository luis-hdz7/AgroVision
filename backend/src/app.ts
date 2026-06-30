import express, { Application, Request, Response } from "express";
import { ok } from "./shared/responses/apiResponses";
// Importaciones de rutas existentes
import farmRoutes from "./modules/farms/routs/farmRoutes"
import fieldRoutes from "./modules/fields/routes/fieldRoutes";
//modulo de cultivos
import cropRoutes from "./modules/crops/routes/cropRoutes";
//nueva importacion del modulo de vegetacion y analisis satelital
import vegetationRoutes from "./modules/vegetation/routes/vegetationRoutes";
const app: Application = express();

// Middlewares globales
app.use(express.json());

// Endpoint base de verificación de salud del sistema
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json(ok({ status: "UP" }, "Backend service is healthy"));
});

// Registro de rutas operativas de AgroVision
app.use("/api/farms", farmRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/crops", cropRoutes);

//vinculacion del nuevo modulo de capas espectrales
app.use("/api/vegetation", vegetationRoutes);

export default app;