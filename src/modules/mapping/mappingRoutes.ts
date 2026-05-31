//Definimos la ruta/simulacion

import { Router } from 'express';
import { getMappingSimulation } from './mappingController';

const mappingRouter = Router();

mappingRouter.get('/simulation', getMappingSimulation);

export default mappingRouter;