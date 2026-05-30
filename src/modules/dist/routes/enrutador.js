//Definimos la ruta/simulacion
import { Router } from 'express';
import { getMappingSimulation } from '../mapping/controllers/mapping.controller/controller.js';
const mappingRouter = Router();
mappingRouter.get('/simulation', getMappingSimulation);
export default mappingRouter;
//# sourceMappingURL=enrutador.js.map