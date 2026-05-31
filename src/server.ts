import app from "./app";
import mappingRouter from "./modules/mapping/mappingRoutes";

app.use("/api/mapping", mappingRouter);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});