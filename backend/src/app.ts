import express, { Application, Request, Response } from "express";
import { ok } from "./shared/responses/apiResponses";
// Importaciones de rutas existentes
import farmRoutes from "./modules/farms/routs/farmRoutes"
import fieldRoutes from "./modules/fields/routes/fieldRoutes";
// Nueva importación del módulo de cultivos
import cropRoutes from "./modules/crops/routes/cropRoutes";

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

// Vinculación oficial del nuevo endpoint prescriptivo
app.use("/api/crops", cropRoutes);

export default app;