import express, { Application, Request, Response } from "express";
import { ok } from "./shared/responses/apiResponses";
// Importaciones de rutas existentes
import farmRoutes from "./modules/farms/routs/farmRoutes";
import fieldRoutes from "./modules/fields/routes/fieldRoutes";
//modulo de cultivos
import cropProfileRoutes from "./modules/crops/routes/cropRoutes";
//nueva importacion del modulo de vegetacion y analisis satelital
import vegetationRoutes from "./modules/vegetation/routes/vegetationRoutes";
//importacion de analisis
import { zoneAnalysisRouter } from "./modules/analysis/routes/zoneAnalysisRoutes";
import reportRoutes from "./modules/reports/routes/reportRoutes";
//importacion de riesgos
import riskRouter from "./modules/risk/routes/riskRoutes";
import fieldNotebookRoutes from "./modules/field-notebook/routes/fieldNotebookRoutes";
const app: Application = express();
//*modulo de alerts
import alertRoutes from "./modules/alerts/routes/alertRoutes";
//*modulos de recommendations
import recommendationsRoutes from "./modules/recommendations/routes/recommendationRoutes";
//modulo dashboard

import dashboardRoutes from "./modules/dashboard/routes/dashboardRoutes";
// Middlewares globales
app.use(express.json());

// Endpoint base de verificación de salud del sistema
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json(ok({ status: "UP" }, "Backend service is healthy"));
});

// Registro de rutas operativas de AgroVision
app.use("/api/farms", farmRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/crops", cropProfileRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/field-notebook", fieldNotebookRoutes);
//nuevo modulo de riesgos
app.use("/api/risk", riskRouter);

//vinculacion del nuevo modulo de capas espectrales
app.use("/api/vegetation", vegetationRoutes);

//vinculacion del modulo de analisis
app.use("/api/analysis", zoneAnalysisRouter);

//vinculacion del modulo dashboard
app.use("/api/dashboard", dashboardRoutes)

export default app;
