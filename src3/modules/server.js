import express from 'express';
import mappingRouter from './routes/enrutador.js';
const app = express();
const PORT = 3000;
app.use(express.json());
app.use('/api/mapping', mappingRouter);
app.listen(PORT, () => {
    console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`✓ Endpoint: GET http://localhost:${PORT}/api/mapping/simulation`);
});
